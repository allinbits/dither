<template lang="pug">
.page-accounts-account
  app-header(:page-title="shortAddress")
    btn-icon(slot="btn-left" icon="arrow-left" @click.native="back")
  .page-header
    .cover
    .avatar: img-avatar(:address="this.$route.params.address" size="96")
    .title {{ shortAddress }}
    .subtitle {{ account.memos }} memos

  infinite-feed(:memos="posts" :queued="queuedPosts")
  app-footer
</template>

<script>
import { orderBy, pickBy } from "lodash";

import { mapGetters } from "vuex";
import h from "../scripts/helpers.js";

import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardLoading from "@/components/CardLoading";
import ImgAvatar from "@/components/ImgAvatar";
import InfiniteFeed from "@/components/InfiniteFeed";
export default {
  name: "page-accounts-account",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    ImgAvatar,
    InfiniteFeed
  },
  computed: {
    shortAddress() {
      return h.truncAddress(this.$route.params.address);
    },
    account() {
      if (this.accounts[this.$route.params.address]) {
        return this.accounts[this.$route.params.address];
      } else {
        return {
          id: this.$route.params.address,
          memos: 0
        };
      }
    },
    posts() {
      if (this.memos) {
        let value = pickBy(
          this.memos,
          m =>
            m.type !== "like" &&
            m.type !== "comment" &&
            m.address === this.$route.params.address
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    },
    queuedPosts() {
      if (this.queuedMemos) {
        let value = pickBy(
          this.queuedMemos,
          m =>
            m.type !== "like" &&
            m.type !== "comment" &&
            m.address === this.$route.params.address
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    },
    ...mapGetters(["memos", "queuedMemos", "accounts"])
  },
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 10,
      orderBy: ["timestamp", "desc"],
      where: [["address", "==", this.$route.params.address]]
    });
    this.$store.dispatch("accounts/fetchById", this.$route.params.address);
  }
};
</script>

<style scoped lang="stylus">
.page-header
  text-align center
  padding-bottom 1.5rem
  .cover
    background var(--txt)
    height 5rem
  .avatar
    margin -3rem auto 0
    margin-bottom 0.75rem
  .title
    font-size 1.5rem
    font-weight bold
  .subtitle
    color var(--dim)
</style>
