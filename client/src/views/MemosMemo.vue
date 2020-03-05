<template lang="pug">
.page-memos-memo
  app-header(page-title="View Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="arrow-left")
    template(v-if="!userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")
  template(v-if="memo")
    card-memo(:memo="memo")
    section-default(v-if="userSignedIn")
      form-send-memo(type="comment" :parent-address="memo.id")
    infinite-feed(:memos="comments" :queued="queuedComments")
  template(v-else)
    card-loading
  app-footer
</template>

<script>
import { pickBy, orderBy } from "lodash";

import { mapGetters } from "vuex";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import FormSendMemo from "@/components/FormSendMemo";
import CardLoading from "@/components/CardLoading";
import CardMemo from "@/components/CardMemo";
import InfiniteFeed from "@/components/InfiniteFeed";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-memos-memo",
  metaInfo: { title: "View Memo" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardLoading,
    CardMemo,
    FormSendMemo,
    InfiniteFeed,
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
    ...mapGetters(["memos", "queuedMemos", "userSignedIn"])
  },
  mounted() {
    this.$store.dispatch("memos/fetchById", this.$route.params.memo);
    this.$store.dispatch("memos/fetchAndAdd", {
      orderBy: ["height", "desc"],
      where: [["parent", "==", this.$route.params.memo]]
    });
  }
};
</script>

<style scoped lang="stylus"></style>
