<template lang="pug">
.page
  page-header(page-title="Profile")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
  .page-container
    .user
      .display-name {{ user.displayName }}
      .uid {{ user.uid }}
    .providers
      .provider(v-for="provider in user.providerData")
        .photo-url:  img(:src="provider.photoURL")
        .text
          .provider-id {{ provider.providerId }}
          .display-name {{ provider.displayName }}
    section-wallet
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
import PageHeader from "./PageHeader";
import SectionWallet from "./SectionWallet";
export default {
  name: "page-profile",
  components: {
    AppFooter,
    BtnIcon,
    BtnLarge,
    CardWip,
    PageHeader,
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
.page-container
  padding 1rem

.user
  margin-bottom 1rem
  .display-name
    font-weight bold
  .uid
    color var(--dim)
    font-size 0.75rem

.provider
  margin-bottom 1rem
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
