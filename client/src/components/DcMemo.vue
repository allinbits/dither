<template lang="pug">
  .card-memo-post__main
    .container-avatar
      avatar-account(:address="memo.address")
    .container-text
      .meta
        .sender
          .displayname {{memo.displayName}}
          .address @{{shortAddress(memo.address)}}
        .time {{timeAgo(memo.timestamp)}}
      .memo-body.dont-break-out {{memo.memo.body}}
      .actions
        btn-icon(size="small" icon="message-circle")
        btn-icon.btn-repost(size="small" icon="repeat")
        btn-icon.btn-like(size="small" icon="heart")

</template>

<script>
import AvatarAccount from "@/components/AvatarAccount";
import BtnIcon from "@/components/BtnIcon";
import h from "../scripts/helpers";
import { formatDistanceStrict } from "date-fns";

export default {
  props: ["memo"],
  components: {
    AvatarAccount,
    BtnIcon
  },
  methods: {
    shortAddress(address) {
      return h.truncAddress(address);
    },
    timeAgo(time) {
      let value = "";
      if (time) {
        value = formatDistanceStrict(new Date(time), new Date());
        const [num, str] = value.split(" ")
        return `${num}${str.slice(0,1)}`;
      }
      return "";
    }
  }
};
</script>

<style scoped lang="stylus">
.card-memo-post__timeline
  display flex
  align-items center

  height 1.5rem
  padding 0.5rem 0.5rem 0

  font-size 0.875rem
  color var(--dim)

  .icon
    flex 0 0 4rem
    margin-right 0.5rem
    display flex
    justify-content flex-end
    img
      width 0.75rem
      height 0.75rem

  .reposters
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    min-width 0

  .reposter
    display inline
    color var(--txt)
    padding-right 0.2rem
    &:not(:last-child):after
      content ','
    &:hover
      text-decoration underline

.card-memo-post__main
  border-bottom 1px solid var(--bc)
  display flex
  color var(--txt)
  cursor pointer

  position relative

  &:hover
    background var(--hover-bg)

.container-avatar
  padding 0.5rem

.container-text
  padding 0.5rem 0.5rem 0.5rem 0
  display flex
  flex-flow column nowrap
  flex 1

.avatar
  display flex
  align-items center
  justify-content center

.meta
  display flex
  align-items center
  margin-bottom 0.125rem

  .sender
    margin-right 0.2rem

    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    min-width 0

    .displayname, .address
      display inline

    .displayname
      font-weight bold
      color var(--txt)
      margin-right 0.2rem
      &:hover
        text-decoration underline

    .address
      color var(--dim)

  .time
    color var(--dim)
    white-space nowrap

  .block
    color var(--faint)

.body
  line-height 1.25
  margin-bottom 0.25rem

.actions
  display flex
  justify-content space-between
  width 100%
  max-width 15rem
</style>
