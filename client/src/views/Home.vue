<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-slot:btn-left v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-slot:btn-right v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-slot:btn-right v-else)
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")
  dc-card-memo(v-for="memo in timelineStream" :memo="memo" @like="actionLike($event)" @repost="actionRepost($event)")
  .btn-load-more(style="btnStyle")
    dc-btn(size="large" @click.native="fetchAndAddMemos" icon="refresh-cw") Show more
  app-footer
</template>

<style lang="stylus" scoped>
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>

<script>
import { cloneDeep, find } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardMessage from "@/components/CardMessage";
import InfiniteFeed from "@/components/InfiniteFeed";
import AppHeader from "@/components/AppHeader";
import CardMemo from "@/components/CardMemo";
import DcCardMemo from "@/components/DcCardMemo";
import io from "socket.io-client";
import axios from "axios";
import DcBtn from "@/components/DcBtn";
import tx from "../scripts/tx";

const API = `http://${process.env.VUE_APP_API}`;

export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardMessage,
    InfiniteFeed,
    CardMemo,
    DcCardMemo,
    DcBtn
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn", "queuedMemos"]),
    timelineQueuedMemos() {
      return Object.values(this.queuedMemos).map(tx => {
        return {
          txhash: tx.id,
          created_at: tx.timestamp,
          type: tx.memo.type,
          body: tx.memo.body,
          parent: tx.memo.parent,
          from_address: tx.address
        }
      })
    },
    timelineStream() {
      let timeline = cloneDeep(this.timeline);
      this.timelineQueuedMemos.forEach(tx => {
        const parent = find(timeline, ["txhash", tx.parent]);
        if (tx.type === "post") {
          const postExists = find(timeline, ["txhash", tx.txhash])
          if (!postExists) {
            timeline = [tx, ...timeline];
          }
        }
        if (tx.type === "like" && parent.like_count) {
          parent.like_count++;
        }
        if (tx.type === "repost" && parent.like_count) {
          parent.repost_count++;
        }
      })
      this.stream.forEach(tx => {
        const parent = find(timeline, ["txhash", tx.parent]);
        const follows = this.following.includes(tx.from_address);
        const isPost = tx.type === "post" && follows;
        const isNew = parent && tx.received_at > parent.received_at
        if (isPost) {
          timeline = [tx, ...timeline];
        }
        if (tx.type === "like" && isNew && parent.like_count) {
          parent.like_count++;
        }
        if (tx.type === "repost" && isNew && parent.repost_count) {
          parent.repost_count++;
        }
        if (tx.type === "comment" && isNew && parent.comment_count) {
          parent.comment_count++;
        }
      });
      return timeline;
    }
  },
  data: function() {
    return {
      timeline: [],
      address: null,
      socket: null,
      following: [],
      stream: [],
      settings: null
    };
  },
  methods: {
    async fetchAndAddMemos() {
      this.timeline = [...this.timeline, ...(await this.fetchMemos())];
    },
    async fetchMemos() {
      const last = this.timeline[this.timeline.length - 1];
      const after = last && `after=${last.created_at}`;
      const from_address = this.address && `from_address=${this.address}`;
      const url = `${API}/timeline?${from_address}&${after}`;
      const memos = (await axios.get(url)).data
      return memos.map(m => {
        return {
          ...m,
          received_at: (new Date).getTime()
        }
      });
    },
    async fetchFollowing() {
      const from_address = this.address && `from_address=${this.address}`;
      const url = `${API}/following?${from_address}`;
      return (await axios.get(url)).data;
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
      this.authCheck()
      const queuedMemo = await tx.sendTx({
        from: this.settings.wallet.address,
        memo: JSON.stringify({
          type: "like",
          parent: memo.txhash,
        }),
      });
      this.$store.dispatch("addToMemoQueue", queuedMemo);
    },
    async actionRepost(memo) {
      this.authCheck()
      const queuedMemo = await tx.sendTx({
        from: this.settings.wallet.address,
        memo: JSON.stringify({
          type: "repost",
          parent: memo.txhash,
        }),
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
      this.$store.dispatch("rmFromMemoQueue", tx.txhash)
      const transaction = {
        ...tx,
        received_at: (new Date).getTime(),
      }
      this.stream = [...this.stream, transaction];
    });
    this.address = this.settings && this.settings.wallet.address;
    this.following = await this.fetchFollowing();
    this.fetchAndAddMemos();
  },
  destroyed() {
    this.socket.close();
  }
};
</script>
