<template lang="pug">
.page-memos-index
  app-header(page-title="Search")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'profile' }" icon="user")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import CardWip from "./CardWip";
export default {
  name: "page-search",
  components: {
    AppFooter,
    CardWip,
    AppHeader
  }
};
</script>

<style scoped lang="stylus"></style>
