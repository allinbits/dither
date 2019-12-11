<template lang="pug">
.page-profile
  app-header(page-title="Profile")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
  section-default.user
    .display-name {{ user.displayName }}
    .uid {{ user.uid }}
  section-default.providers
    .provider(v-for="provider in user.providerData")
      .photo-url:  img(:src="provider.photoURL")
      .text
        .provider-id {{ provider.providerId }}
        .display-name {{ provider.displayName }}
  section-wallet
  section-default
    btn-large(@click.native="signOut") Sign out
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
import SectionWallet from "./SectionWallet";
import SectionDefault from "./SectionDefault";
export default {
  name: "page-profile",
  components: {
    AppFooter,
    BtnIcon,
    BtnLarge,
    CardWip,
    AppHeader,
    SectionDefault,
    SectionWallet
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
.user
  .display-name
    font-weight bold
  .uid
    color var(--dim)
    font-size 0.75rem

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
