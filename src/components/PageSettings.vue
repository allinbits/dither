<template lang="pug">
.page
  page-header(page-title="Settings")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import CardWip from "./CardWip";
export default {
  name: "page-settings",
  components: {
    AppFooter,
    CardWip,
    PageHeader
  }
};
</script>

<style scoped lang="stylus"></style>
