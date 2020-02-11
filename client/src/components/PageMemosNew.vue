<template lang="pug">
.page-memos-new
  app-header(page-title="New Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="send" @click.native="broadcastTx")
  section-default(v-if="settings && settings.data && settings.data.wallet")
    form-memo(type="post")
  section-default(v-else)
    | You can't send memos without any ATOM.
    = ' '
    router-link(:to="{ name: 'settings' }") Create a wallet &raquo;
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import FormMemo from "./FormMemo";
import SectionDefault from "./SectionDefault";
export default {
  name: "page-settings",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    FormMemo,
    SectionDefault
  },
  computed: {
    ...mapGetters(["settings"])
  }
};
</script>

<style scoped lang="stylus"></style>
