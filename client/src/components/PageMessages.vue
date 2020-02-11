<template lang="pug">
.page-messages
  app-header(page-title="Messages")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import CardWip from "./CardWip";
export default {
  name: "page-messages",
  components: {
    AppFooter,
    CardWip,
    AppHeader
  }
};
</script>

<style scoped lang="stylus"></style>
