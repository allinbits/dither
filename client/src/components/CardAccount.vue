<template lang="pug">
.card-account
  router-link.avatar(:to="{ name: 'account', params: { address: account.id } }")
    avatar-account(:address="account.id" size="48")
  router-link.text(:to="{ name: 'account', params: { address: account.id } }")
    .title
      .displayname {{ displayName}}
      .address @{{ shortAddress(account.id) }}
    .subtitle {{ followingCount }} following / {{ followersCount }} followers
  account-actions(@click.self="navToAccount" v-if="actionsVisible" :account="account")
</template>

<script>
import { mapGetters } from "vuex";
import h from "../scripts/helpers.js";
import tx from "../scripts/tx.js";
import AccountActions from "@/components/AccountActions";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import AvatarAccount from "@/components/AvatarAccount";
export default {
  name: "page-accounts-index",
  metaInfo: { title: "Community" },
  components: {
    AccountActions,
    BtnIcon,
    BtnLoadMore,
    AvatarAccount
  },
  computed: {
    ...mapGetters(["following", "userSignedIn", "settings", "accounts"]),
    displayName() {
      return h.getDisplayName(this.accounts, this.account.id);
    },
    currentUserIsFollowing() {
      if (this.following) {
        return this.following.includes(this.account.id);
      }
      return false;
    },
    followingCount() {
      if (this.account.following) {
        return this.account.following.length;
      }
      return 0;
    },
    followersCount() {
      if (this.account.followers) {
        return this.account.followers.length;
      }
      return 0;
    },
    fromAddress() {
      return this.settings.wallet.address;
    },
    actionsVisible() {
      if (this.settings && this.settings.wallet) {
        return this.account.id !== this.settings.wallet.address;
      }
      if (this.userSignedIn) {
        return true;
      }
      return false;
    }
  },
  methods: {
    follow() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
        return;
      }
      if (!this.settings.uatom || this.settings.uatom === 0) {
        this.$router.push({ name: "wallet" });
        return;
      }
      this.$store.commit("addFollow", this.account.id);
      tx.sendTx({
        from: this.fromAddress,
        memo: JSON.stringify({
          type: "follow",
          parent: this.account.id
        })
      });
    },
    unfollow() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
        return;
      }
      if (!this.settings.uatom || this.settings.uatom === 0) {
        this.$router.push({ name: "wallet" });
        return;
      }
      this.$store.commit("rmFollow", this.account.id);
      tx.sendTx({
        from: this.fromAddress,
        memo: JSON.stringify({
          type: "unfollow",
          parent: this.account.id
        })
      });
    },
    navToAccount() {
      this.$router.push({
        name: "account",
        params: { address: this.account.id }
      });
    },
    shortAddress(address) {
      return h.truncAddress(address);
    }
  },
  props: ["account"]
};
</script>

<style scoped lang="stylus">
.card-account
  border-bottom 1px solid var(--bc)
  display flex

  .avatar
    padding 0.5rem
  .text
    flex 1
    padding 0.5rem 0.5rem 0.5rem 0
    color var(--txt)
  .title
    display flex
    .displayname
      font-weight bold
      margin-right 0.5rem
    .address
      color var(--dim)
  .subtitle
    font-size 0.875rem
    color var(--dim)
  .account-actions
    display flex
    align-items center
    padding 0 0.5rem
  .action
    cursor pointer
    font-size 0.875rem
    line-height 1.5rem
    color var(--txt)

    padding 0 0.5rem
    border 1px solid var(--bc)

    &.action--unfollow
      background hsl(0,100%,97%)
      color hsl(0,100%,30%)
</style>
