<template lang="pug">
.account-actions(v-if="userSignedIn")
  .action.action--unfollow(v-if="currentUserIsFollowing" @click.stop="unfollow") Unfollow
  .action.action--follow(v-else @click.stop="follow") Follow
</template>

<script>
import { mapGetters } from "vuex";
import tx from "../scripts/tx.js";
export default {
  name: "account-actions",
  computed: {
    ...mapGetters(["following", "userSignedIn", "settings"]),
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
    }
  },
  props: ["account"]
};
</script>

<style scoped lang="stylus">
.account-actions
  display flex
  align-items center
  justify-content center
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
