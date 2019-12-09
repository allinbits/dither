<template lang="pug">
.page-notifications
  page-header(page-title="Notifications")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import CardWip from "./CardWip";
export default {
  name: "page-notifications",
  components: {
    AppFooter,
    CardWip,
    PageHeader
  }
};
</script>

<style scoped lang="stylus"></style>
