<template lang="pug">
.page-home
  app-header(page-title="Home")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")

  infinite-feed(:memos="posts" :queued="queuedPosts")

  app-footer
</template>

<script>
import { orderBy, pickBy } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import BtnLoadMore from "./BtnLoadMore";
import CardLoading from "./CardLoading";
import InfiniteFeed from "./InfiniteFeed";
import AppHeader from "./AppHeader";
export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    InfiniteFeed
  },
  computed: {
    posts() {
      if (this.memos) {
        let value = pickBy(
          this.memos,
          m => m.type !== "like" && m.type !== "comment"
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    },
    queuedPosts() {
      if (this.queuedMemos) {
        let value = pickBy(
          this.queuedMemos,
          m => m.type !== "like" && m.type !== "comment"
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    },
    ...mapGetters(["memos", "userSignedIn", "queuedMemos", "blockchain"])
  }
};
</script>

<style scoped lang="stylus"></style>
