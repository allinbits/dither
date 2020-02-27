<template lang="pug">
.page-messages
  app-header(page-title="Messages")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import CardWip from "@/components/CardWip";
export default {
  name: "page-messages",
  metaInfo: { title: "Messages" },
  components: {
    AppFooter,
    CardWip,
    AppHeader
  }
};
</script>

<style scoped lang="stylus"></style>
