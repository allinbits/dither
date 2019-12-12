<template lang="pug">
.app-header
  .app-header__container
    slot(name="btn-left"): .btn-placeholder
    .title {{ pageTitle }}
    slot(name="btn-right"): .btn-placeholder
</template>

<script>
import BtnIcon from "./BtnIcon";
export default {
  name: "app-header",
  components: {
    BtnIcon
  },
  props: ["page-title"]
};
</script>

<style scoped lang="stylus">
.app-header
  line-height 3rem
  position fixed
  top 0
  left 0
  width 100vw

  z-index var(--z-app-header)
  border-bottom 1px solid var(--bc)
  background #fff

.app-header__container
  max-width 40rem
  margin 0 auto

  display flex
  flex-flow row nowrap
  justify-content space-around

.title
  flex 1
  padding 0 1rem
  font-weight bold
  text-align center
  white-space nowrap
  text-overflow ellipsis
  overflow hidden

.btn-placeholder
  width 3rem
  height 3rem
</style>
