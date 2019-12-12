<template lang="pug">
.page-accounts-index
  app-header(page-title="Contacts")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
  template(v-if="Object.keys(accounts).length > 0")
    .card-account(v-for="account in orderedAccounts" :key="account.id")
      .username {{ account.username }}
      .address {{ account.id }}
    btn-load-more
  card-loading(v-else)
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import CardWip from "./CardWip";
import BtnIcon from "./BtnIcon";
export default {
  name: "page-accounts-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardWip
  },
  computed: {
    ...mapGetters(["accounts", "userSignedIn"])
  }
};
</script>

<style scoped lang="stylus"></style>
