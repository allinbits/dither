<template lang="pug">
.page-memos-memo
  app-header(page-title="Memo Info")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
  template(v-if="memo")
    card-memo(:memo="memo")
    section-default
      form-memo(type="comment" :parent-address="memo.id")
    card-memo(v-for="memo in children" :memo="memo" :key="memo.id")
  card-loading(v-else)
  app-footer
</template>

<script>
import { pickBy } from "lodash";

import { mapGetters } from "vuex";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import FormMemo from "./FormMemo";
import SectionDefault from "./SectionDefault";
export default {
  name: "page-memos-memo",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardLoading,
    CardMemo,
    FormMemo,
    SectionDefault
  },
  computed: {
    ...mapGetters(["memos"]),
    memo() {
      if (this.memos) {
        return this.memos[this.$route.params.memo];
      } else {
        return {};
      }
    },
    children() {
      if (this.memos) {
        let children = pickBy(
          this.memos,
          m => m.parent === this.$route.params.memo
        );
        return children;
      } else {
        return [];
      }
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      orderBy: ["height", "desc"],
      where: [["parent", "==", this.$route.params.memo]]
    });
  }
};
</script>

<style scoped lang="stylus"></style>
