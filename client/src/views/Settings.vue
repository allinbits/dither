<template lang="pug">
.page-settings
  app-header(page-title="Settings")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" @click.native="signOut" icon="log-out")
  section-default
    div(slot="section-title") Welcome, {{ user.displayName }}!
    p(v-for="provider in user.providerData")
      | You're logged in via {{ provider.providerId }}
    p If you wish to view your balance or send tokens, go to #[router-link(:to="{ name: 'wallet'}") your wallet].
    p There are no settings available yet. Usernames and avatar customization is coming soon. Thanks for your patience!
    p Dither is an #[a(href="https://github.com/virgo-project/dither" rel="noopener noreferrer" target="_blank") open source project] built on the #[a(href="https://cosmos.network" rel="noopener noreferrer" target="_blank") Cosmos Hub]. We are funded by #[a(href="https://virgo.org" target="_blank" rel="noopener noreferrer") Virgo].
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLarge from "@/components/BtnLarge";
import CardWip from "@/components/CardWip";
import AppHeader from "@/components/AppHeader";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-settings",
  metaInfo: { title: "Settings" },
  components: {
    AppFooter,
    BtnIcon,
    BtnLarge,
    CardWip,
    AppHeader,
    SectionDefault
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
