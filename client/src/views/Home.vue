<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")

  infinite-feed(v-if="posts" :memos="posts" :queued="queuedPosts")
  card-loading(v-else)

  app-footer
</template>

<script>
import { Firebase } from "../store/firebase.js";

import { orderBy, pickBy } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardLoading from "@/components/CardLoading";
import InfiniteFeed from "@/components/InfiniteFeed";
import AppHeader from "@/components/AppHeader";
export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    InfiniteFeed
  },
  computed: {
    posts() {
      let value = [];

      if (this.memos) {
        // remove likes and comments
        value = pickBy(
          this.memos,
          m => m.type !== "like" && m.type !== "comment"
        );
        value = orderBy(value, m => parseInt(m.height), "desc");

        // filter by users following
        value = value.filter(v => {
          return this.following.includes(v.address);
        });

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
    ...mapGetters([
      "memos",
      "userSignedIn",
      "queuedMemos",
      "blockchain",
      "following"
    ])
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user is logged in", user);
      }
    });
  }
};
</script>

<style scoped lang="stylus"></style>
