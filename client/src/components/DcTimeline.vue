<template lang="pug">
  div
    dc-card-memo(v-for="memo in timelineStream" :memo="memo" @like="actionLike($event)" @repost="actionRepost($event)")
    .btn-load-more(style="btnStyle")
      dc-btn(size="large" @click.native="fetchAndAddMemos" icon="refresh-cw") Show more
</template>

<style lang="stylus" scoped>
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>

<script>
import DcCardMemo from "@/components/DcCardMemo";
import DcBtn from "@/components/DcBtn";
import { mapGetters } from "vuex";
import io from "socket.io-client";
import axios from "axios";
import tx from "../scripts/tx";
import { cloneDeep, sortBy, find } from "lodash";

const API = `http://${process.env.VUE_APP_API}`;

export default {
  components: {
    DcCardMemo,
    DcBtn
  },
  props: {
    endpoint: {
      type: String
    },
    following: {
      type: Array
    }
  },
  data: function() {
    return {
      timeline: [],
      address: null,
      socket: null,
      stream: [],
      settings: null
    };
  },
  computed: {
    ...mapGetters(["queuedMemos", "userSignedIn"]),
    queue() {
      const memos = Object.values(this.queuedMemos).map(tx => {
        return {
          txhash: tx.id,
          created_at: tx.timestamp,
          type: tx.memo.type,
          body: tx.memo.body,
          parent: tx.memo.parent,
          from_address: tx.address,
          received_at: new Date().getTime(),
          like_count: "0",
          repost_count: "0",
          like_self: null,
          repost_self: null,
          status: "queued"
        };
      });
      return sortBy(memos, ["created_at"]);
    },
    timelineStream() {
      let timeline = cloneDeep(this.timeline);
      const events = [...this.queue, ...this.stream];
      events.forEach(tx => {
        const parent = find(timeline, ["txhash", tx.parent]);
        const follows = this.following.includes(tx.from_address);
        const isPost = tx.type === "post" && follows;
        const isNew = parent && tx.received_at > parent.received_at;
        if (isPost) {
          timeline = [tx, ...timeline];
        }
        if (tx.type === "like" && isNew) {
          parent.like_count++;
          if (tx.from_address === this.address) {
            parent.like_self = tx.txhash;
          }
        }
        if (tx.type === "repost" && isNew) {
          parent.repost_count++;
          if (tx.from_address === this.address) {
            parent.repost_self = tx.txhash;
          }
        }
        if (tx.type === "comment" && isNew) {
          parent.comment_count++;
        }
      });
      return timeline;
    }
  },
  methods: {
    async fetchAndAddMemos() {
      this.timeline = [...this.timeline, ...(await this.fetchMemos())];
    },
    async fetchMemos() {
      const last = this.timeline[this.timeline.length - 1];
      const after = last && `after=${last.created_at}`;
      const url = `${API}/${this.endpoint}?from_address=${this.address}&${after}`;
      const memos = (await axios.get(url)).data;
      return memos.map(m => {
        return {
          ...m,
          received_at: new Date().getTime()
        };
      });
    },
    authCheck() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
        return;
      }
      if (!this.settings.uatom || this.settings.uatom === 0) {
        this.$router.push({ name: "wallet" });
        return;
      }
    },
    async actionLike(memo) {
      this.authCheck();
      const queuedMemo = await tx.sendTx({
        from: this.settings.wallet.address,
        memo: JSON.stringify({
          type: "like",
          parent: memo.txhash
        })
      });
      this.$store.dispatch("addToMemoQueue", queuedMemo);
    },
    async actionRepost(memo) {
      this.authCheck();
      const queuedMemo = await tx.sendTx({
        from: this.settings.wallet.address,
        memo: JSON.stringify({
          type: "repost",
          parent: memo.txhash
        })
      });
      this.$store.dispatch("addToMemoQueue", queuedMemo);
    }
  },
  async created() {
    try {
      this.settings = await this.$store.dispatch("fetchSettings");
    } catch {
      console.log("Failed to fetch user settings.");
    }
    this.socket = io(`${API}`);
    this.socket.on("newtx", tx => {
      this.$store.dispatch("rmFromMemoQueue", tx.txhash);
      const transaction = {
        ...tx,
        received_at: new Date().getTime()
      };
      console.log(transaction);
      this.stream = [transaction, ...this.stream];
    });
    this.address = this.settings && this.settings.wallet.address;
    this.fetchAndAddMemos();
  },
  destroyed() {
    this.socket.close();
  }
};
</script>