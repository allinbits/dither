<template lang="pug">
.page
  page-header(page-title="Memo Info")
  card-memo(:memo="memo")
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
    memo() {
      return this.memos.find(memo => memo.txhash == this.$route.params.memo);
    },
    ...mapGetters(["memos"])
  }
};
</script>

<style scoped lang="stylus"></style>
