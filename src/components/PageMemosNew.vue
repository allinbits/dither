<template lang="pug">
.page
  page-header(page-title="New Memo")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import CardWip from "./CardWip";
export default {
  name: "page-memos-new",
  components: {
    AppFooter,
    CardWip,
    PageHeader
  }
};
</script>

<style scoped lang="stylus"></style>
