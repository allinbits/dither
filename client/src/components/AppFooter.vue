<template lang="pug">
.app-footer
  .app-footer__container
    btn-icon(type="link" icon="home" :to="{ name: 'home' }")
    btn-icon(type="link" icon="hash" :to="{ name: 'channels' }")
    btn-icon(type="link" icon="users" :to="{ name: 'accounts' }")
    // btn-icon(type="link" icon="bell" :to="{ name: 'notifications' }")
    btn-icon(type="link" icon="dollar-sign" :to="{ name: 'wallet' }")
</template>

<script>
import BtnIcon from "./BtnIcon";
export default {
  name: "app-footer",
  components: {
    BtnIcon
  }
};
</script>

<style scoped lang="stylus">
.app-footer
  line-height 3rem

  position fixed
  bottom 0
  left 0
  width 100vw
  border-top 1px solid var(--bc)

  margin 0 auto
  z-index var(--z-app-header)
  background var(--app-bg)

.app-footer__container
  max-width 40rem
  margin 0 auto

  display flex
  flex-flow row nowrap
  justify-content space-around
</style>
