<template lang="pug">
.page-settings
  app-header(page-title="Settings")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" @click.native="signOut" icon="log-out")
  section-default.section
    .section-title Welcome, {{ user.displayName }}!
    .subtitle(v-for="provider in user.providerData")
      | logged in via {{ provider.providerId }}
    // .subtitle
      | user id is {{ user.uid }}
  wallet
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import BtnLarge from "./BtnLarge";
import CardWip from "./CardWip";
import AppHeader from "./AppHeader";
import Wallet from "./Wallet";
import SectionDefault from "./SectionDefault";
export default {
  name: "page-settings",
  components: {
    AppFooter,
    BtnIcon,
    BtnLarge,
    CardWip,
    AppHeader,
    SectionDefault,
    Wallet
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    signOut() {
      this.$store.commit("signOutUser");
    }
  }
};
</script>

<style scoped lang="stylus">
.section
  .section-title
    font-weight bold
    font-size 1.125rem
  .subtitle
    color var(--dim)
    font-size 0.75rem
</style>
