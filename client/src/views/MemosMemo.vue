<template lang="pug">
.page-memos-memo
  app-header(:page-title="this.pageTitle")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="arrow-left")
    template(v-if="!userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")
  template(v-if="memo")
    card-memo(:memo="memo")
    .section-timeline
      | Likes:
      .card-like(v-for="like in memoLikes")
        | {{ like.address }}
    section-default(v-if="userSignedIn")
      form-send-memo(type="comment" :parent-address="memo.id" :channel="this.memo.channel")
    infinite-feed(:memos="comments" :queued="queuedComments" type="comment")
  template(v-else)
    card-loading
  app-footer
</template>

<script>
import { pickBy } from "lodash";

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
    ...mapGetters(["memos", "queuedMemos", "userSignedIn", "memoLikes"]),
    pageTitle() {
      let value = "Memo in #";
      if (this.memo && this.memo.channel) {
        return value + this.memo.channel;
      } else {
        return value + "general";
      }
    },
    memo() {
      let value = {};
      if (this.memos) {
        value = this.memos[this.$route.params.memo];
        if (value) {
          value.timeline = pickBy(
            this.memos,
            m => m.parent === this.$route.params.memo && m.type === "repost"
          );
        }
      }
      return value;
    },
    comments() {
      if (this.memos) {
        return pickBy(
          this.memos,
          m => m.parent === this.$route.params.memo && m.type === "comment"
        );
      }
      return {};
    },
    queuedComments() {
      if (this.queuedMemos) {
        return pickBy(
          this.queuedMemos,
          m => m.parent === this.$route.params.memo && m.type === "comment"
        );
      }
      return {};
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchById", this.$route.params.memo);
    this.$store.dispatch("memos/fetchAndAdd", {
      orderBy: ["height", "desc"],
      where: [["parent", "==", this.$route.params.memo]]
    });

    this.$store.dispatch("memoLikes/fetchAndAdd", {
      memoId: this.$route.params.memo
    });
    console.log("this.memoLikes", this.memoLikes);
  }
};
</script>

<style scoped lang="stylus"></style>
