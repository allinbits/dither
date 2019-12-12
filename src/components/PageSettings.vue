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
  section-default.section
    .section-title Your wallet
    wallet
  app-footer
</template>

<script>
import { Firebase } from "../store/firebase.js";

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
    font-size 1.25rem
    margin-bottom 0.25rem
  .subtitle
    color var(--dim)

.provider
  border 1px solid var(--bc)
  display flex

  .photo-url
    margin-right 0.5rem
    img
      width 3rem
      height 3rem
      display block
  .text
    flex 1
    display flex
    justify-content center
    flex-flow column nowrap
  .display-name
    color var(--dim)
    font-size 0.75rem
</style>
