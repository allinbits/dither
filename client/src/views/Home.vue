<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-slot:btn-left v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-slot:btn-right v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-slot:btn-right v-else)
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")
  ds-card-memo(v-for="memo in timelineStream" :memo="memo")
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
import { pickBy, cloneDeep, find } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardMessage from "@/components/CardMessage";
import InfiniteFeed from "@/components/InfiniteFeed";
import AppHeader from "@/components/AppHeader";
import CardMemo from "@/components/CardMemo";
import DsCardMemo from "@/components/DsCardMemo";
import io from "socket.io-client";
import axios from "axios";
import DcBtn from "@/components/DcBtn";

const domain = `http://138.197.229.7`;

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
    DsCardMemo,
    DcBtn
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn", "queuedMemos"]),
    posts() {
      let value = [];
      if (this.memos) {
        value = pickBy(this.memos, m => !m.channel);
      }
      return value;
    },
    queuedPosts() {
      let value = [];
      if (this.queuedMemos) {
        value = pickBy(this.queuedMemos, m => !m.channel);
      }
      return value;
    },
    timelineStream() {
      let timeline = cloneDeep(this.timeline);
      this.stream.forEach(tx => {
        const parent = find(timeline, ["txhash", tx.parent]);
        const follows = this.following.includes(tx.from_address);
        const isPost = tx.type === "post" && follows;
        if (isPost) {
          timeline = [tx, ...timeline];
        }
        if (tx.type === "like" && parent) {
          parent.like_count++;
        }
        if (tx.type === "repost" && parent) {
          parent.repost_count++;
        }
        if (tx.type === "comment" && parent) {
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
      stream: []
    };
  },
  methods: {
    async fetchAndAddMemos() {
      this.timeline = [...this.timeline, ...(await this.fetchMemos())];
    },
    async fetchMemos() {
      const last = this.timeline[this.timeline.length - 1];
      const after = last && `after=${last.created_at}`;
      const from_address = `from_address=${this.address}`;
      const url = `${domain}/timeline?${from_address}&${after}`;
      return (await axios.get(url)).data;
    },
    async fetchFollowing() {
      const url = `${domain}/following?from_address=${this.address}`;
      return (await axios.get(url)).data;
    }
  },
  async created() {
    const settings = await this.$store.dispatch("fetchSettings");
    this.socket = io(`${domain}`);
    this.socket.on("newtx", tx => {
      this.stream = [...this.stream, tx];
    });
    this.address = settings.wallet.address;
    this.following = await this.fetchFollowing();
    this.fetchAndAddMemos();
  },
  destroyed() {
    this.socket.close();
  }
};
</script>
