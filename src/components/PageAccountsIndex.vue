<template lang="pug">
.page-accounts-index
  app-header(page-title="Contacts")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
  card-wip
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import CardWip from "./CardWip";
export default {
  name: "page-accounts-index",
  components: {
    AppFooter,
    CardWip,
    AppHeader
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn"])
  }
};
</script>

<style scoped lang="stylus"></style>
