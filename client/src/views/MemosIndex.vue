<template lang="pug">
.page-memos-index
  app-header(page-title="Search")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
  card-wip
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
import CardWip from "@/components/CardWip";
export default {
  name: "page-memos-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    CardWip
  },
  computed: {
    ...mapGetters(["memos", "userSignedIn"])
  }
};
</script>

<style scoped lang="stylus"></style>
