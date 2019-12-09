<template lang="pug">
.page-home
  page-header(page-title="Home")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'profile' }" icon="user")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'signin' }" icon="log-in")
  template(v-if="Object.keys(memos).length > 0")
    card-memo(v-for="memo in memos" :memo="memo" :key="memo.id")
    .load-more(@click="loadMore") Load more
  card-loading(v-else)
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import PageHeader from "./PageHeader";
export default {
  name: "page-index",
  components: {
    AppFooter,
    BtnIcon,
    CardLoading,
    CardMemo,
    PageHeader
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn"])
  },
  methods: {
    loadMore() {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 6,
        orderBy: ["timestamp", "desc"]
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.load-more
  border-top 1px solid var(--bc)
  display block
  line-height 3rem
  color var(--link)
  text-align center
  cursor pointer
</style>
