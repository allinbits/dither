<template lang="pug">
.page-header
  btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
  .title {{ pageTitle }}
  btn-icon(type="link" :to="{ name: 'memos-new' }" icon="edit")
</template>

<script>
import BtnIcon from "./BtnIcon";
export default {
  name: "page-header",
  components: {
    BtnIcon
  },
  props: ["page-title"]
};
</script>

<style scoped lang="stylus">
.page-header
  line-height 3rem
  background #fff
  position fixed
  top 0
  left 0
  width 100vw
  border-bottom 1px solid var(--bc)

  display flex
  flex-flow row nowrap

.title
  flex 1
  font-weight bold
  text-align center
</style>
