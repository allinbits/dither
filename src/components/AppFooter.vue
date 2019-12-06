<template lang="pug">
.app-footer
  btn-icon(type="link" icon="home" :to="{ name: 'home' }")
  btn-icon(type="link" icon="search" :to="{ name: 'search' }")
  btn-icon(type="link" icon="bell" :to="{ name: 'notifications' }")
  btn-icon(type="link" icon="mail" :to="{ name: 'messages' }")
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
  background #fff
  position fixed
  bottom 0
  left 0
  width 100vw
  border-top 1px solid var(--bc)

  display flex
  flex-flow row nowrap
  justify-content space-around
</style>
