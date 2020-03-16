<template lang="pug">
.page-accounts-index
  app-header(page-title="Dither Community")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
  template(v-if="Object.keys(accounts).length > 0")
    card-account(v-for="account in orderedAccounts" :key="account.id" :id="account.id" :account="account")
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
import CardAccount from "@/components/CardAccount";
import CardLoading from "@/components/CardLoading";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
export default {
  name: "page-accounts-index",
  metaInfo: { title: "Community" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardAccount,
    CardLoading
  },
  computed: {
    ...mapGetters(["accounts", "userSignedIn", "settings"]),
    orderedAccounts() {
      let value = [];
      if (this.accounts) {
        value = orderBy(this.accounts, ["followers", "desc"]);
      }
      return value;
    }
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
