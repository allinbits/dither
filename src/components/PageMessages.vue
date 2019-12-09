<template lang="pug">
.page-messages
  page-header(page-title="Messages")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import CardWip from "./CardWip";
export default {
  name: "page-messages",
  components: {
    AppFooter,
    CardWip,
    PageHeader
  }
};
</script>

<style scoped lang="stylus"></style>
