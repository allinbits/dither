<template lang="pug">
.page-accounts-account
  app-header(:page-title="shortAddress")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="arrow-left")
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
export default {
  name: "page-accounts-account",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    CardMemo
  },
  computed: {
    shortAddress() {
      return h.truncAddress(this.$route.params.account);
    },
    orderedMemos() {
      let memos = this.memos;
      if (memos) {
        let filtered = Object.values(memos).filter(
          m => m.accountId === this.$route.params.account
        );
        return orderBy(filtered, m => parseInt(m.height), "desc");
      }
      return [];
    },
    ...mapGetters(["memos"])
  },
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 10,
      orderBy: ["timestamp", "desc"],
      where: [["accountId", "==", this.$route.params.account]]
    });
  }
};
</script>

<style scoped lang="stylus"></style>
