<template lang="pug">
.page-accounts-account
  app-header(:page-title="address")
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
import { getTxSender, truncAddress } from "../scripts/helpers.js";

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
    address() {
      return truncAddress(this.$route.params.account);
    },
    orderedMemos() {
      let memos = this.memos;
      if (memos) {
        let filteredMemos = Object.values(memos).filter(
          m => m.accountId === this.address
        );
        return orderBy(filteredMemos, m => parseInt(m.height), "desc");
      }
      return [];
    },
    ...mapGetters(["memos", "userSignedIn"])
  },
  methods: {
    loadMore() {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 10,
        orderBy: ["timestamp", "desc"],
        where: [["accountId"], "==", this.$route.params.account]
      });
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 10,
      orderBy: ["timestamp", "desc"],
      where: [["accountId"], "==", this.$route.params.account]
    });
  }
};
</script>

<style scoped lang="stylus"></style>
