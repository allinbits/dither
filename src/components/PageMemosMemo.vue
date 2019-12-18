<template lang="pug">
.page-memos-memo
  app-header(page-title="Memo Info")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="arrow-left")

  template(v-if="memo")

    // the memo
    card-memo(:memo="memo")

    // comment form
    section-default
      form-memo(type="comment" :parent-address="memo.id")

    // queued comments
    template(v-if="Object.keys(queuedComments).length > 0")
      card-memo(v-for="memo in queuedComments" :memo="memo" :key="memo.id")

    // comments
    card-memo(v-for="memo in comments" :memo="memo" :key="memo.id")

  card-loading(v-else)

  app-footer
</template>

<script>
import { pickBy, orderBy } from "lodash";

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
    memo() {
      if (this.memos) {
        return this.memos[this.$route.params.memo];
      } else {
        return {};
      }
    },
    comments() {
      if (this.memos) {
        let comments = pickBy(
          this.memos,
          m => m.parent === this.$route.params.memo && m.type === "comment"
        );
        comments = orderBy(comments, ["height"], ["desc"]);
        return comments;
      } else {
        return {};
      }
    },
    queuedComments() {
      if (this.queuedMemos) {
        let comments = pickBy(
          this.queuedMemos,
          m => m.parent === this.$route.params.memo && m.type === "comment"
        );
        comments = orderBy(comments, ["height"], ["desc"]);
        return comments;
      } else {
        return {};
      }
    },
    ...mapGetters(["memos", "queuedMemos"])
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
