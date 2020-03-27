<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")
  div(v-for="post in posts")
    card-memo(:memo="post")
  card-loading(v-if="fetchingInProgress")
  app-footer
</template>

<script>
import { pickBy, orderBy } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardLoading from "@/components/CardLoading";
import InfiniteFeed from "@/components/InfiniteFeed";
import AppHeader from "@/components/AppHeader";
import CardMemo from "@/components/CardMemo";
import DcBtn from "@/components/DcBtn";

export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    InfiniteFeed,
    CardMemo,
    DcBtn
  },
  data: function() {
    return {
      fetchingInProgress: false
    }
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn", "queuedMemos", "following"]),
    memosTimeline() {
      return Object.values(this.memos)
    },
    queuedPosts() {
      let value = [];
      if (this.queuedMemos) {
        value = pickBy(this.queuedMemos, m => !m.channel);
      }
      return value;
    },
    posts() {
      const posts = Object.values(pickBy(this.memos, m => {
        return this.following.includes(m.address)
      }))
      return orderBy(posts, ["timestamp"], ["desc"])
    },
  },
  mounted() {
    this.$store.dispatch("fetchPosts")
    this.fetchingInProgress = true
    this.$store.dispatch("accounts/fetchAndAdd").then(() => {
      this.fetchingInProgress = false
    });
  },
  destroyed() {
    this.$store.dispatch("memos/closeDBChannel")
  }
};
</script>

<style scoped lang="stylus">
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>
