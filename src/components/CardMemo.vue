<template lang="pug">
.card-memo
  corner-spinner(v-if="memo.height === 0")
  .container-avatar(@click.self="actionView($event)")
    router-link.avatar(
      :to="{ name: 'account', params: {address: memo.address}}")
      img-avatar(:address="memo.address")
  .container-text
    .meta(@click.self="actionView($event)")
      router-link.sender(:to="{ name: 'account', params: {address: memo.address}}")
        | {{ shortAddress }}
      router-link.time(:to="{ name: 'memo', params: { memo: this.memo.id } }")
        | {{ timeAgo(memo.timestamp) }}
    .body.dont-break-out(@click.self="actionView($event)")
      | {{ memo.memo }}
    .actions(@click.self="actionView($event)")
      btn-icon(
        slot="btn-left" size="small" icon="message-circle"
        @click.native.stop="actionReply($event)")
      btn-icon(
        slot="btn-left" size="small" icon="repeat"
        @click.native.stop="actionRelay($event)")
      btn-icon(
        slot="btn-left" size="small" icon="heart"
        @click.native.stop="actionLike($event)")
      btn-icon(
        slot="btn-left" size="small" icon="share"
        @click.native.stop="actionShare($event)")
</template>

<script>
import { formatDistance, subDays } from "date-fns";

import h from "../scripts/helpers";
import { mapGetters } from "vuex";
import BtnIcon from "./BtnIcon";
import CornerSpinner from "./CornerSpinner";
import ImgAvatar from "./ImgAvatar";
export default {
  name: "card-memo",
  components: {
    BtnIcon,
    CornerSpinner,
    ImgAvatar
  },
  computed: {
    ...mapGetters(["userSignedIn"]),
    shortAddress() {
      return h.truncAddress(this.memo.address);
    }
  },
  methods: {
    timeAgo(date) {
      return formatDistance(new Date(date), new Date());
    },
    actionView() {
      this.$router.push({ name: "memo", params: { memo: this.memo.id } });
    },
    actionReply() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
      }
      alert("WIP: reply");
    },
    actionRelay() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
      }
      alert("WIP: relay");
    },
    actionLike() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
      }
      alert("WIP: like");
    },
    actionShare() {
      alert("WIP: share");
    }
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.card-memo
  border-top 1px solid var(--bc)
  display flex
  color var(--txt)
  cursor pointer

  position relative

  &:hover
    background var(--hover-bg)

.container-avatar
  padding 0.5rem

.avatar
  display flex
  align-items center
  justify-content center

.meta
  display flex
  align-items center
  margin-bottom 0.125rem
  > div
    margin-right 0.25rem

  .sender
    font-weight bold
    color var(--txt)
    margin-right 0.5rem
    &:hover
      text-decoration underline
  .time
    color var(--dim)
  .block
    color var(--faint)

.container-text
  padding 0.5rem 0.5rem 0.5rem 0
  width 100%

.body
  line-height 1.25
  margin-bottom 0.25rem

.actions
  display flex
  justify-content space-between
  width 100%
  max-width 20rem
</style>
