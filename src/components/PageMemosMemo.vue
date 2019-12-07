<template lang="pug">
.page
  page-header(page-title="Memo Info")
  card-memo(v-if="memo" :memo="memo")
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
  name: "page-memos-memo",
  components: {
    AppFooter,
    CardLoading,
    CardMemo,
    PageHeader
  },
  computed: {
    memo() {
      if (this.allMemos) {
        return this.allMemos[this.$route.params.memo];
      } else {
        return {};
      }
    },
    ...mapGetters(["allMemos"])
  },
  mounted() {
    this.$store.dispatch("memos/fetchById", this.$route.params.memo);
  }
};
</script>

<style scoped lang="stylus"></style>
