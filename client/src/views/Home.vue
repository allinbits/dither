<template lang="pug">
.page-home
  app-header(page-title="Dither Alpha")
    template(v-slot:btn-left v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-slot:btn-right v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-slot:btn-right v-else)
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")
  dc-timeline(endpoint="timeline" :following="following")
  app-footer
</template>

<style lang="stylus" scoped>
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>

<script>
import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import DcCardMemo from "@/components/DcCardMemo";
import axios from "axios";
import DcTimeline from "@/components/DcTimeline";
import BtnIcon from "@/components/BtnIcon";

const API = `http://${process.env.VUE_APP_API}`;

export default {
  name: "page-index",
  components: {
    AppHeader,
    AppFooter,
    DcCardMemo,
    DcTimeline,
    BtnIcon
  },
  computed: {
    ...mapGetters(["userSignedIn"])
  },
  data: function() {
    return {
      address: null,
      following: [],
      settings: null,
      API
    };
  },
  methods: {
    async fetchFollowing() {
      const from_address = this.address && `from_address=${this.address}`;
      const url = `${API}/following?${from_address}`;
      return (await axios.get(url)).data;
    }
  },
  async created() {
    try {
      this.settings = await this.$store.dispatch("fetchSettings");
    } catch {
      console.log("Failed to fetch user settings.");
    }
    this.address = this.settings && this.settings.wallet.address;
    this.following = await this.fetchFollowing();
  }
};
</script>
