<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")

  //- infinite-feed(v-if="posts" :memos="posts" :queued="queuedPosts" :following="following")
  //- card-loading(v-else)
  div(v-for="memo in memos")
    card-memo(:memo="memo")
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

export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    InfiniteFeed,
    CardMemo
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn", "queuedMemos", "following"]),
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
    }
  },
  mounted() {
    this.$store.dispatch("fetchTimeline")
  }
};
</script>

<style scoped lang="stylus"></style>
