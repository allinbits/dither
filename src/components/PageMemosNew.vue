<template lang="pug">
.page
  page-header(page-title="New Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="send" @click.native="sendMemo")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import BtnIcon from "./BtnIcon";
import CardWip from "./CardWip";
export default {
  name: "page-settings",
  components: {
    AppFooter,
    BtnIcon,
    CardWip,
    PageHeader
  },
  methods: {
    sendMemo() {
      alert("Work in progress");
    }
  }
};
</script>

<style scoped lang="stylus"></style>
