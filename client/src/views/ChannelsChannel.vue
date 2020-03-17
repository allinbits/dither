<template lang="pug">
.page-channels-channel
  app-header(:page-title="`#${this.$route.params.channel}`")
    btn-icon(slot="btn-left" icon="arrow-left" @click.native="back")
    template(v-if="!userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")
  .page-header
    .page-header__text
      .page-header__title \#{{ channel.title }}
      .page-header__subtitle(v-html="h.linkifyMemo(channel.description)")
    .page-header__avatar: avatar-channel(:avatar="channel.avatar")

  section-default(v-if="userSignedIn && userWhitelisted")
    form-send-memo(type="post" :channel="this.$route.params.channel")

  infinite-feed(:memos="posts" :queued="queuedPosts")

  app-footer
</template>

<script>
import { orderBy, pickBy } from "lodash";
import { mapGetters } from "vuex";
import h from "../scripts/helpers";

import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import AvatarChannel from "@/components/AvatarChannel";
import BtnIcon from "@/components/BtnIcon";
import FormSendMemo from "@/components/FormSendMemo";
import InfiniteFeed from "@/components/InfiniteFeed";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-channels-channel",
  components: {
    AppHeader,
    AppFooter,
    AvatarChannel,
    BtnIcon,
    FormSendMemo,
    InfiniteFeed,
    SectionDefault
  },
  computed: {
    ...mapGetters([
      "memos",
      "queuedMemos",
      "channels",
      "userSignedIn",
      "settings"
    ]),
    userWhitelisted() {
      let whitelist = this.channel.whitelist;
      let walletExists =
        this.settings &&
        this.settings.data &&
        this.settings.data.wallet &&
        this.settings.data.wallet.address &&
        this.settings.data.uatom;
      if (!walletExists) {
        return false;
      }
      if (whitelist.length > 0) {
        // console.log("whitelist exists");
        return whitelist.includes(this.settings.data.wallet.address);
      } else {
        // console.log("whitelist doesnt exist");
        return true;
      }
    },
    avatarUrl() {
      return require(`../assets/channels/${this.channel.avatar}`);
    },
    channel() {
      if (this.channels[this.$route.params.channel]) {
        return this.channels[this.$route.params.channel];
      } else {
        return {
          id: this.$route.params.channel
        };
      }
    },
    posts() {
      let value = [];
      if (this.memos) {
        value = pickBy(
          this.memos,
          m => m.type !== "like" && m.type !== "comment"
        );
        if (this.channel.title !== "all") {
          value = pickBy(value, m => m.channel === this.$route.params.channel);
        }
        value = orderBy(value, m => parseInt(m.height), "desc");
      }
      return value;
    },
    queuedPosts() {
      let value = [];
      if (this.queuedMemos) {
        value = pickBy(
          this.queuedMemos,
          m => m.type !== "like" && m.type !== "comment"
        );
        if (this.channel.title !== "all") {
          value = pickBy(value, m => m.channel === this.$route.params.channel);
        }
        value = orderBy(value, m => parseInt(m.height), "desc");
      }
      return value;
    }
  },
  data: () => ({
    h: h
  }),
  methods: {
    back() {
      this.$router.go(-1);
    }
  },
  mounted() {
    if (this.channel.title === "all") {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 50,
        orderBy: ["timestamp", "desc"]
      });
    } else {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 50,
        orderBy: ["timestamp", "desc"],
        where: [["channel", "==", this.$route.params.channel]]
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.page-header
  display flex
  flex-flow row nowrap
  align-items center
  border-bottom 4px solid var(--bc)

.page-header__avatar
  padding 0.5rem

.page-header__text
  padding 0.5rem
  flex 1

.page-header__title
  font-size 2rem
  font-weight bold

.page-header__subtitle
  font-size 0.875rem
  color var(--dim)
</style>
