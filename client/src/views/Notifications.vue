<template lang="pug">
.page-notifications
  app-header(page-title="Notifications")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import CardWip from "@/components/CardWip";
export default {
  name: "page-notifications",
  components: {
    AppFooter,
    CardWip,
    AppHeader
  }
};
</script>

<style scoped lang="stylus"></style>
