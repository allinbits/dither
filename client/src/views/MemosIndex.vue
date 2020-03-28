<template lang="pug">
.page-memos-index
  app-header(page-title="All Messages")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")

  infinite-feed(v-if="memos" :memos="memos" :queued="queuedMemos")
  card-message(v-else)

  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
import CardMessage from "@/components/CardMessage";
import InfiniteFeed from "@/components/InfiniteFeed";
export default {
  name: "page-memos-index",
  metaInfo: { title: "All Messages" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardMessage,
    InfiniteFeed
  },
  computed: {
    ...mapGetters(["memos", "queuedMemos", "userSignedIn"])
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
