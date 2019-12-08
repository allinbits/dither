<template lang="pug">
.page
  page-header(page-title="Search")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'profile' }" icon="user")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import CardWip from "./CardWip";
export default {
  name: "page-search",
  components: {
    AppFooter,
    CardWip,
    PageHeader
  }
};
</script>

<style scoped lang="stylus"></style>
