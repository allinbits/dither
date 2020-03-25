<template lang="pug">
.page-accounts-account
  app-header(:page-title="displayName")
    btn-icon(slot="btn-left" icon="arrow-left" @click.native="back")
  .page-header
    .cover
    .avatar: avatar-account(:address="this.$route.params.address" size="96")

    .account-displayname {{ displayName }}
    a.account-address(:href="`https://www.mintscan.io/account/${this.$route.params.address}`" rel="noopener noreferrer" target="_blank") @{{ shortAddress }}

    .account-stats
      // router-link.account-stat(:to="{ name: 'following' }")
        | #[strong {{ following }}] following
      // router-link.account-stat(:to="{ name: 'followers' }")
        | #[strong {{ followers }}] followers
      .account-stat
        | #[strong {{ following }}] following
      .account-stat
        | #[strong {{ followers }}] followers

    account-actions(:account="account")

    // .account-stat {{ account.memos }} memos
  div(v-for="i in postVisibleCount")
    card-memo(v-if="posts[i-1]" :memo="posts[i-1]")
  .btn-load-more(v-if="posts.length > postVisibleCount")
    dc-btn(size="large" icon="refresh-cw" @click.native="postsFetchAndDisplay") Load more
  app-footer
</template>

<script>
import { orderBy, pickBy } from "lodash";

import { mapGetters } from "vuex";
import h from "../scripts/helpers.js";

import AccountActions from "@/components/AccountActions";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import CardLoading from "@/components/CardLoading";
import AvatarAccount from "@/components/AvatarAccount";
import InfiniteFeed from "@/components/InfiniteFeed";
import DcBtn from "@/components/DcBtn";
import CardMemo from "@/components/CardMemo";

export default {
  name: "page-accounts-account",
  components: {
    AccountActions,
    AppHeader,
    AppFooter,
    BtnIcon,
    BtnLoadMore,
    CardLoading,
    AvatarAccount,
    InfiniteFeed,
    DcBtn,
    CardMemo
  },
  computed: {
    ...mapGetters(["memos", "queuedMemos", "accounts"]),
    displayName() {
      return h.getDisplayName(this.accounts, this.$route.params.address);
    },
    shortAddress() {
      return h.truncAddress(this.$route.params.address);
    },
    account() {
      if (this.accounts[this.$route.params.address]) {
        return this.accounts[this.$route.params.address];
      } else {
        return {
          id: this.$route.params.address,
          memos: 0
        };
      }
    },
    following() {
      if (this.account.following) {
        return this.account.following.length;
      }
      return 0;
    },
    followers() {
      if (this.account.followers) {
        return this.account.followers.length;
      }
      return 0;
    },
    posts() {
      if (this.memos) {
        let value = pickBy(
          this.memos,
          m =>
            m.type === "post" &&
            m.address === this.$route.params.address
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    },
    queuedPosts() {
      if (this.queuedMemos) {
        let value = pickBy(
          this.queuedMemos,
          m =>
            m.type !== "like" &&
            m.type !== "comment" &&
            m.address === this.$route.params.address
        );
        value = orderBy(value, m => parseInt(m.height), "desc");
        return value;
      }
      return [];
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    postsFetchAndDisplay() {
      this.postVisibleCount += this.postVisibleStep
      this.postsFetch()
    },
    postsFetch() {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: this.postVisibleCount + this.postVisibleStep,
        orderBy: ["timestamp", "desc"],
        where: [
          ["address", "==", this.$route.params.address],
          ["type", "==", "post"]
        ]
      });
    }
  },
  mounted() {
    this.postsFetch()
    this.$store.dispatch("accounts/fetchById", this.$route.params.address);
    this.$store.dispatch("accounts/fetchAndAdd", {
      limit: 50
    });
  },
  data: function() {
    return {
      postVisibleStep: 10,
      postVisibleCount: 10,
    }
  }
};
</script>

<style scoped lang="stylus">
.page-header
  text-align center
  padding-bottom 1.5rem

  .cover
    background var(--txt)
    height 5rem

  .avatar
    margin -3rem auto 0
    margin-bottom 0.75rem

  .account-displayname
    font-size 1.75rem
    font-weight bold
    display block
    color var(--txt)
  .account-address
    color var(--dim)
    &:hover
      text-decoration underline

  .account-stats
    display flex
    justify-content center

  .account-stat
    padding 0 1rem
    color var(--txt)
    &:hover
      text-decoration underline

  .account-actions
    margin-top 0.5rem

.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>
