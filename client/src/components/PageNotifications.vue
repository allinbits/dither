<template lang="pug">
.page-notifications
  app-header(page-title="Notifications")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import CardWip from "./CardWip";
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
