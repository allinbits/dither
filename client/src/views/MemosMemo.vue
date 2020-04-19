<template lang="pug">
.page-memos-memo
  app-header(:page-title="this.pageTitle")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="arrow-left")
    template(v-slot:btn-right v-if="!userSignedIn")
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")
  //- dc-card-memo(:memo="memo" @like="actionLike($event)" @repost="actionRepost($event)")
  dc-timeline(endpoint="tx" :following="[address]" v-if="ready" :address="address" :txhash="txhash")
  //- div(v-if="memo")
  //-   card-memo(:memo="memo")
  //-   section-default(flush="true" v-if="Object.keys(accountLikes).length > 0")
  //-     template(v-slot:section-title) Liked by
  //-     .card-likes
  //-       card-account(
  //-         v-for="account in accountLikes"
  //-         :key="account.id"
  //-         :account="account")
  //-   section-default(v-if="userSignedIn")
  //-     template(v-slot:section-title) Leave a comment
  //-     form-send-memo(type="comment" :parent-address="memo.id" :channel="this.memo.channel")
  //-   infinite-feed(:memos="comments" :queued="queuedComments" type="comment")
  //- div(v-else)
  //-   card-message
  app-footer
</template>

<script>
import { pickBy } from "lodash";
import { mapGetters } from "vuex";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import FormSendMemo from "@/components/FormSendMemo";
import CardAccount from "@/components/CardAccount";
import CardMemo from "@/components/CardMemo";
import CardMessage from "@/components/CardMessage";
import InfiniteFeed from "@/components/InfiniteFeed";
import SectionDefault from "@/components/SectionDefault";
import DcCardMemo from "@/components/DcCardMemo";
import axios from "axios";
import DcTimeline from "@/components/DcTimeline";

const API = `http://${process.env.VUE_APP_API}`;

export default {
  name: "page-memos-memo",
  metaInfo: { title: "View Memo" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardAccount,
    CardMemo,
    CardMessage,
    FormSendMemo,
    InfiniteFeed,
    SectionDefault,
    DcCardMemo,
    DcTimeline
  },
  computed: {
    ...mapGetters([
      "memos",
      "queuedMemos",
      "userSignedIn",
      "memoLikes",
      "accounts"
    ]),
    pageTitle() {
      let value = "Memo in #";
      if (this.memo && this.memo.channel) {
        return value + this.memo.channel;
      } else {
        return value + "general";
      }
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
    },
    txhash() {
      return this.$route.params.memo;
    }
  },
  data: () => ({
    accountLikes: {},
    memo: null,
    ready: null
  }),
  methods: {
    actionLike(memo) {
      this.$store.dispatch("memoLike", memo);
    },
    actionRepost(memo) {
      this.$store.dispatch("actionRepost", memo);
    }
  },
  async mounted() {
    const txhash = this.$route.params.memo;
    try {
      this.settings = await this.$store.dispatch("fetchSettings");
    } catch {
      console.log("Failed to fetch user settings.");
    }
    this.address = this.settings && this.settings.wallet.address;
    this.ready = true;
    this.memo = (
      await axios.get(`${API}/tx?txhash=${txhash}&from_address=${this.address}`)
    ).data;
    // // fetch this memo
    // this.$store.dispatch("memos/fetchById", this.$route.params.memo);
    // // fetch children of this memo
    // this.$store.dispatch("memos/fetchAndAdd", {
    //   orderBy: ["height", "desc"],
    //   where: [["parent", "==", this.$route.params.memo]]
    // });
    // // fetch information for memo likes
    // await this.$store.dispatch("memoLikes/fetchAndAdd", {
    //   memoId: this.$route.params.memo
    // });
    // // fetch accounts for memo likes
    // Object.values(this.memoLikes).forEach(async like => {
    //   let account = await this.$store.dispatch(
    //     "accounts/fetchById",
    //     like.address
    //   );
    //   this.accountLikes[account.id] = account;
    // });
  }
};
</script>

<style scoped lang="stylus"></style>
