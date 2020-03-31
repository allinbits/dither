<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-slot:btn-left v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-slot:btn-right v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-slot:btn-right v-else)
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")
  infinite-feed(v-if="posts" :memos="posts" :queued="queuedPosts" :following="following")
  card-message(v-else)

  app-footer
</template>

<script>
import { pickBy } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardMessage from "@/components/CardMessage";
import InfiniteFeed from "@/components/InfiniteFeed";
import AppHeader from "@/components/AppHeader";
import CardMemo from "@/components/CardMemo"
export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardMessage,
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
  methods: {
    memosOpenDBChannel(following) {
      following.forEach(async f => {
        try {
          await this.$store.dispatch(`memos/openDBChannel`, {
            where: [
              ["address", "==", f]
            ]
          })
        } catch {
          console.warn("Channel is already open.")
        }
      })
    },
  },
  async created() {
    const following = await this.$store.dispatch("fetchFollowingList")
    this.memosOpenDBChannel(following)
  },
};
</script>