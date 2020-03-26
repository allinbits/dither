<template lang="pug">
.page-notifications
  app-header(page-title="Notifications")
  card-wip
  .notifications
    .card-notification {{ notifications }}

  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import CardWip from "@/components/CardWip";
export default {
  name: "page-notifications",
  metaInfo: { title: "Notifications" },
  components: {
    AppFooter,
    CardWip,
    AppHeader
  },
  computed: {
    ...mapGetters(["notifications"])
  },
  mounted() {}
};
</script>

<style scoped lang="stylus"></style>
