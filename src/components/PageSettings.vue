<template lang="pug">
.page-settings
  app-header(page-title="Settings")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="save" @click.native="saveSettings")
  card-wip
  app-footer
</template>

<script>
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import BtnIcon from "./BtnIcon";
import CardWip from "./CardWip";
export default {
  name: "page-settings",
  components: {
    AppFooter,
    BtnIcon,
    CardWip,
    AppHeader
  },
  methods: {
    saveSettings() {
      alert("Work in progress");
    }
  }
};
</script>

<style scoped lang="stylus"></style>
