<template lang="pug">
.page
  page-header(page-title="Home")
  template(v-if="Object.keys(allMemos).length > 0")
    card-memo(v-for="memo in allMemos" :memo="memo" :key="memo.id")
    .load-more(@click="loadMore") Load more
  card-loading(v-else)
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import PageHeader from "./PageHeader";
export default {
  name: "page-index",
  components: {
    AppFooter,
    CardLoading,
    CardMemo,
    PageHeader
  },
  computed: {
    ...mapGetters(["allMemos"])
  },
  methods: {
    loadMore() {
      console.log("loading more memos...");

      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 6,
        orderBy: ["timestamp", "desc"]
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.load-more
  border-top 1px solid var(--bc)
  display block
  line-height 3rem
  color var(--link)
  text-align center
  cursor pointer
</style>
