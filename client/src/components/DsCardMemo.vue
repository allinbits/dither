<template lang="pug">
.card-memo-post
  .card-memo-post__timeline(
    v-if="memo.timeline && Object.keys(memo.timeline).length > 0")
    .icon: img(src="@/assets/feather/repeat.svg")
    //- .reposters
    //-   router-link.reposter(
    //-     v-for="repostMemo in memo.timeline"
    //-     :to="{ name: 'account', params: { address: repostMemo.address }}"
    //-     :key="repostMemo.id")
    //-     | {{ reposterDisplayName(repostMemo.address) }}
    .label reposted
  .card-memo-post__main
    corner-error(v-if="memo.height === 0 && memo.response.code")
    corner-spinner(v-else-if="memo.height === 0")
    .container-avatar(@click.self="navToMemo")
      router-link.avatar(
        :to="{ name: 'account', params: {address: memo.from_address}}")
        avatar-account(:address="memo.from_address")
    .container-text(@click.self="navToMemo")

      .meta(@click.self="navToMemo")
        router-link.sender(:to="{ name: 'account', params: {address: memo.from_address}}")
          .displayname {{ memo.display_name }}
          .address @{{ shortAddress(memo.from_address) }}
        router-link.time(:to="{ name: 'memo', params: { memo: memo.txhash } }")
          | · {{ timeAgo }}

      //- memo-body(:memo="memo")
      div {{memo.body}}

      .actions(@click.self="navToMemo")
        btn-icon(
          slot="btn-left" size="small" icon="message-circle" :value="memo.comment_count"
          @click.native.stop="navToMemo")

        // repost button
        btn-icon.btn-repost.btn-repost--active(
          v-if="false"
          slot="btn-left" size="small" icon="repeat" color="green" :value="memo.repost_count")
        btn-icon.btn-repost(
          v-else
          :class="false"
          slot="btn-left" size="small" icon="repeat" :value="memo.repost_count"
          @click.native.stop="actionRepost")

        // like button
        btn-icon.btn-like.btn-like--active(
          v-if="false"
          slot="btn-left" size="small" icon="heart" color="red" :value="memo.like_count")
        btn-icon.btn-like(
          v-else
          slot="btn-left" size="small" icon="heart" :value="memo.like_count"
          @click.native.stop="actionLike")
</template>

<script>
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag"; // optional
hashtag(linkify);

import h from "../scripts/helpers";
import BtnIcon from "./BtnIcon";
import CornerError from "./CornerError";
import CornerSpinner from "./CornerSpinner";
import AvatarAccount from "./AvatarAccount";
import MemoBody from "./MemoBody";
export default {
  name: "card-memo-post",
  components: {
    BtnIcon,
    CornerError,
    CornerSpinner,
    AvatarAccount,
    MemoBody
  },
  computed: {
    timeAgo() {
      return h.timeAgo(this.memo.created_at);
    },
    displayName() {
      return h.getDisplayName(this.accounts, this.memo.address);
    }
  },
  methods: {
    shortAddress(address) {
      return h.truncAddress(address);
    }
  },
  props: ["memo"]
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
