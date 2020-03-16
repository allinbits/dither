<template lang="pug">
router-link.card-channel(:to="{ name: 'channel', params: { channel: channel.title } }")
  .avatar: avatar-channel(:avatar="channel.avatar")
  .text
    .title
      .displayname \#{{ channel.title }}
    .subtitle {{ channel.description }}
</template>

<script>
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import AvatarChannel from "@/components/AvatarChannel";
export default {
  name: "card-channel",
  components: {
    AppFooter,
    AppHeader,
    AvatarChannel
  },
  props: ["channel"]
};
</script>

<style scoped lang="stylus">
.card-channel
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
</style>
