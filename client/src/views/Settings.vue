<template lang="pug">
.page-settings
  app-header(page-title="Settings")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" @click.native="signOut" icon="log-out")

  section-default
    div(slot="section-title") User Settings
    form-set-display-name

  section-default
    div(slot="section-title") Notice

    template(v-if="devMode")
      p(v-for="provider in user.providerData")
        | {{ user.displayName}}, you're logged in via {{ provider.providerId }}

    p If you wish to view your balance or send tokens, go to #[router-link(:to="{ name: 'wallet'}") your wallet].
    p Dither is an #[a(href="https://github.com/virgo-project/dither" rel="noopener noreferrer" target="_blank") open source project] built on the #[a(href="https://cosmos.network" rel="noopener noreferrer" target="_blank") Cosmos Hub]. We are funded by #[a(href="https://virgo.org" target="_blank" rel="noopener noreferrer") Virgo].


  section-default
    div(slot="section-title") Legal
    p.warning DISCLAIMER: Dither's burner wallet is designed to hold small amounts (<1) of ATOM tokens. These ATOMs are used as gas to send messages on Dither. Dither's wallet is designed for convenience over security. Any loss of ATOMs will not be covered by either Dither or Virgo.
  app-footer
</template>

<script>
import { Firebase } from "../store/firebase.js";

import { mapGetters } from "vuex";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLarge from "@/components/BtnLarge";
import CardWip from "@/components/CardWip";
import FormSetDisplayName from "@/components/FormSetDisplayName";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-settings",
  metaInfo: { title: "Settings" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLarge,
    CardWip,
    FormSetDisplayName,
    SectionDefault
  },
  computed: {
    ...mapGetters(["user", "userSignedIn"]),
    devMode() {
      return process.env.NODE_ENV === "development";
    }
  },
  methods: {
    signOut() {
      this.$store.commit("signOutUser");
    }
  },
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user signed in");
      } else {
        this.$router.push("/login");
      }
    });
  }
};
</script>

<style lang="stylus" scoped>
p.warning
  font-size 0.875rem
  border 1px solid #c00
  padding 0.5rem
  color #c00
</style>
