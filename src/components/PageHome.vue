<template lang="pug">
.page
  page-header(page-title="Home")
  card-memo(v-for="memo in memos" :memo="memo" :key="memo.txhash")
  .load-more(@click="loadMore") Load more
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import CardMemo from "./CardMemo";
import PageHeader from "./PageHeader";
export default {
  name: "page-index",
  components: {
    AppFooter,
    CardMemo,
    PageHeader
  },
  computed: {
    ...mapGetters(["memos"])
  },
  methods: {
    loadMore() {
      console.log("loading more memos...");
      this.$store.dispatch("loadMoreMemos");
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
</style>
