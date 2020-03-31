<template lang="pug">
.page-channels
  app-header(page-title="Dither Channels")
    template(v-slot:btn-left v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-slot:btn-right v-if="!userSignedIn")
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")
  card-channel(v-for="channel in channels" :key="channel.title" :channel="channel")
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
import CardChannel from "@/components/CardChannel";
export default {
  name: "page-channels",
  metaInfo: { title: "Channels" },
  computed: {
    ...mapGetters(["channels", "userSignedIn"])
  },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardChannel
  }
};
</script>

<style scoped lang="stylus"></style>
