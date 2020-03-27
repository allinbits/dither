<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")
  div(v-for="i in postVisibleCount" v-if="memosTimeline.length > 0")
    card-memo(:memo="memosTimeline[i-1]")
  .btn-load-more(v-if="memosTimeline.length > postVisibleCount")
    dc-btn(size="large" icon="refresh-cw" @click.native="postsFetchAndDisplay") Load more
  app-footer
</template>

<script>
import { pickBy } from "lodash";
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
      postVisibleStep: 10,
      postVisibleCount: 10,
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
    }
  },
  methods: {
    postsFetch() {
      this.$store.dispatch("fetchTimeline", this.postVisibleCount + this.postVisibleStep)
    },
    postsFetchAndDisplay() {
      this.postVisibleCount += this.postVisibleStep
      this.postsFetch()
    }
  },
  mounted() {
    this.$store.dispatch("accounts/fetchAndAdd");
    this.postsFetch()
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
