<template lang="pug">
.page-memos-index
  app-header(page-title="All Messages")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")

  infinite-feed(v-if="posts" :memos="posts" :queued="queuedPosts")
  card-loading(v-else)

  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import { orderBy, pickBy } from "lodash";

import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
import CardLoading from "@/components/CardLoading";
import InfiniteFeed from "@/components/InfiniteFeed";
export default {
  name: "page-memos-index",
  metaInfo: { title: "Search" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardLoading,
    InfiniteFeed
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn"]),
    posts() {
      let value = [];

      if (this.memos) {
        // remove likes and comments
        value = pickBy(
          this.memos,
          m =>
            m.type !== "like" &&
            m.type !== "comment" &&
            m.type !== "follow" &&
            m.type !== "unfollow"
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
          m =>
            m.type !== "like" &&
            m.type !== "comment" &&
            m.type !== "follow" &&
            m.type !== "unfollow"
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 100,
      orderBy: ["timestamp", "desc"]
    });
  }
};
</script>

<style scoped lang="stylus"></style>
