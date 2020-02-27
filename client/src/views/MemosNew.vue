<template lang="pug">
.page-memos-new
  app-header(page-title="New Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="send" @click.native="broadcastTx")
  section-default(v-if="settings && settings.data && settings.data.wallet")
    form-send-memo(type="post")
  section-default(v-else)
    | You can't send memos without any ATOM.
    = ' '
    router-link(:to="{ name: 'wallet' }") Create a wallet &raquo;
  app-footer
</template>

<script>
import { mapGetters } from "vuex";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import FormSendMemo from "@/components/FormSendMemo";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-settings",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    FormSendMemo,
    SectionDefault
  },
  computed: {
    ...mapGetters(["settings"])
  }
};
</script>

<style scoped lang="stylus"></style>
