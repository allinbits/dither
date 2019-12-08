<template lang="pug">
.page
  page-header(page-title="Memo Info")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
  card-memo(v-if="memo" :memo="memo")
  card-loading(v-else)
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import PageHeader from "./PageHeader";
export default {
  name: "page-memos-memo",
  components: {
    AppFooter,
    BtnIcon,
    CardLoading,
    CardMemo,
    PageHeader
  },
  computed: {
    memo() {
      if (this.memos) {
        return this.memos[this.$route.params.memo];
      } else {
        return {};
      }
    },
    ...mapGetters(["memos"])
  },
  mounted() {
    this.$store.dispatch("memos/fetchById", this.$route.params.memo);
  }
};
</script>

<style scoped lang="stylus"></style>
