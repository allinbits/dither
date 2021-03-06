<template lang="pug">
.card-notification
  .meta
    router-link.sender(:to="{ name: 'account', params: {address: notification.address}}")
      span.displayname {{ displayName }}
      span.address @{{ shortAddress }}
    span.msg {{ notificationMsg }}
    span.timestamp {{ timeAgo }}
  .card-memo-container(v-if="notTypeFollow && memo.id")
    card-memo(:memo="memo")
</template>

<script>
import { mapGetters } from "vuex";
import CardMemo from "@/components/CardMemo";
import h from "../scripts/helpers.js";
export default {
  name: "card-notification",
  components: {
    CardMemo
  },
  computed: {
    ...mapGetters(["accounts", "memos"]),
    notTypeFollow() {
      return this.notification.memo.type !== "follow";
    },
    notificationMsg() {
      let msg = "";
      if (this.notification.type === "follow") {
        msg = "started following you";
      } else if (this.notification.type === "like") {
        msg = "liked your dither:";
      } else if (this.notification.type === "repost") {
        msg = "reposted your dither:";
      }
      return msg;
    },
    timeAgo() {
      return h.timeAgo(this.notification.timestamp);
    },
    displayName() {
      return h.getDisplayName(this.accounts, this.notification.address);
    },
    shortAddress() {
      return h.truncAddress(this.notification.address);
    }
  },
  data: () => ({
    memo: {}
  }),
  async mounted() {
    if (this.notTypeFollow) {
      this.$store.dispatch("accounts/fetchById", this.notification.address);
      await this.$store.dispatch("memos/fetchById", this.notification.parent);
      this.memo = this.memos[this.notification.parent];
    }
  },
  props: ["notification"]
};
</script>

<style scoped lang="stylus">
.card-notification
  display block
  padding 0.5rem
  border-bottom 1px solid var(--bc)
.meta
  display flex

.sender
  color var(--txt)

.displayname
  font-weight bold
  margin-right 0.2rem
  &:hover
    text-decoration underline

.address
  color var(--dim)
  margin-right 0.2rem
  &:hover
    text-decoration underline

.timestamp
  color var(--dim)
  text-align right
  flex 1

.card-memo-container
  border 1px solid var(--bc)
  border-bottom none
  transform scale(0.9)
</style>
