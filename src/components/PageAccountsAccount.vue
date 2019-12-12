<template lang="pug">
.page-accounts-account
  app-header(:page-title="address")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="arrow-left")
  template(v-if="Object.keys(memos).length > 0")
    card-memo(v-for="memo in orderedMemos" :memo="memo" :key="memo.id")
    btn-load-more
  card-loading(v-else)
  app-footer
</template>

<script>
import { orderBy } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import BtnLoadMore from "./BtnLoadMore";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import AppHeader from "./AppHeader";
export default {
  name: "page-accounts-account",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardLoading,
    CardMemo
  },
  computed: {
    address() {
      return this.$route.params.account;
    },
    orderedMemos() {
      if (this.memos) {
        return orderBy(this.memos, m => parseInt(m.height), "desc");
      }
      return [];
    },
    ...mapGetters(["memos", "userSignedIn"])
  },
  methods: {
    loadMore() {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 10,
        orderBy: ["timestamp", "desc"]
      });
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchAndAdd", {
      limit: 10,
      orderBy: ["timestamp", "desc"],
      where: [""]
    });
  }
};
</script>

<style scoped lang="stylus"></style>
