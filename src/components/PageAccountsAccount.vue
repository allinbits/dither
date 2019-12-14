<template lang="pug">
.page-accounts-account
  app-header(:page-title="shortAddress")
    btn-icon(slot="btn-left" icon="arrow-left" @click.native="back")
  .page-header
    .cover
    .avatar: img-avatar(:address="this.$route.params.address" size="96")
    .title {{ shortAddress }}
    .subtitle {{ account.memos }} memos
  template(v-if="Object.keys(orderedMemos).length > 0")
    card-memo(v-for="memo in orderedMemos" :memo="memo" :key="memo.id")
    btn-load-more
  card-loading(v-else)
  app-footer
</template>

<script>
import { orderBy } from "lodash";

import { mapGetters } from "vuex";
import h from "../scripts/helpers.js";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import BtnLoadMore from "./BtnLoadMore";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import ImgAvatar from "./ImgAvatar";
export default {
  name: "page-accounts-account",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    CardMemo,
    ImgAvatar
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
    orderedMemos() {
      let memos = this.memos;
      if (memos) {
        let filtered = Object.values(memos).filter(
          m => m.address === this.$route.params.address
        );
        return orderBy(filtered, m => parseInt(m.height), "desc");
      }
      return [];
    },
    ...mapGetters(["memos", "accounts"])
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
