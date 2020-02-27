<template lang="pug">
.page-accounts-index
  app-header(page-title="Dither Users")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
  template(v-if="Object.keys(accounts).length > 0")
    router-link.card-account(v-for="account in orderedAccounts" :key="account.id" :to="{ name: 'account', params: { address: account.id } }")
      .avatar: img-avatar(:address="account.id" size="48")
      .text
        .title {{ shortAddress(account.id) }}
        .subtitle {{ account.memos }} memos
    btn-load-more
  card-loading(v-else)
  app-footer
</template>

<script>
import { orderBy } from "lodash";

import { mapGetters } from "vuex";
import h from "../scripts/helpers.js";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import CardLoading from "@/components/CardLoading";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import ImgAvatar from "@/components/ImgAvatar";
export default {
  name: "page-accounts-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    ImgAvatar
  },
  computed: {
    orderedAccounts() {
      if (this.accounts) {
        return orderBy(this.accounts, ["id", "asc"]);
      }
      return [];
    },
    ...mapGetters(["accounts", "userSignedIn"])
  },
  methods: {
    shortAddress(address) {
      return h.truncAddress(address);
    }
  },
  mounted() {
    this.$store.dispatch("accounts/fetchAndAdd", {
      limit: 50
    });
  }
};
</script>

<style scoped lang="stylus">
.card-account
  border-bottom 1px solid var(--bc)
  display flex

  .avatar
    padding 0.5rem
  .text
    padding 0.5rem 0.5rem 0.5rem 0
    color var(--txt)
  .title
    font-weight bold
  .subtitle
    font-size 0.75rem
    color var(--dim)
</style>
