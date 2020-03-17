<template lang="pug">
.page-memos-new
  app-header(page-title="New Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="send" @click.native="broadcastTx")
  section-default
    form-send-memo(type="post")
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
  name: "page-memos-new",
  metaInfo: { title: "New Memo" },
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    FormSendMemo,
    SectionDefault
  },
  computed: {
    ...mapGetters(["settings", "userSignedIn"])
  },
  mounted() {
    if (!this.userSignedIn) {
      this.$router.push({ name: "login" });
      return;
    }
    if (!this.settings.data.uatom || this.settings.data.uatom === 0) {
      this.$router.push({ name: "wallet" });
      return;
    }
  }
};
</script>

<style scoped lang="stylus"></style>
