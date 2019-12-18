<template lang="pug">
.page-home
  app-header(page-title="Home")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")
  template(v-if="Object.keys(queuedMemos).length > 0")
    | {{ queuedMemos }}
    card-memo(v-for="memo in queuedMemos" :memo="memo" :key="memo.id")
  template(v-if="Object.keys(memos).length > 0")
    card-memo(v-for="memo in orderedMemos" :memo="memo" :key="memo.id")
    btn-load-more
  card-loading(v-else)
  app-footer
</template>

<script>
import { orderBy, pickBy } from "lodash";
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import BtnIcon from "./BtnIcon";
import BtnLoadMore from "./BtnLoadMore";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
import AppHeader from "./AppHeader";
export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    CardMemo
  },
  computed: {
    orderedMemos() {
      if (this.memos) {
        let value = pickBy(this.memos, m => !m.parent);
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    },
    ...mapGetters(["memos", "userSignedIn", "queuedMemos", "blockchain"])
  }
};
</script>

<style scoped lang="stylus"></style>
