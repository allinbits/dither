<template lang="pug">
.corner-spinner
  img.spin(src="../assets/feather/loader.svg")
</template>

<script>
export default {
  name: "corner-spinner"
};
</script>

<style scoped lang="stylus">
.corner-spinner
  position absolute
  top 0.75rem
  right 0
  width 1rem
  height 1rem
  background var(--bc)
  display flex
  align-items center
  justify-content center

.corner-spinner img
  width 0.625rem
  height 0.625rem

.spin
  animation spin 2s infinite linear

.pulse
  animation spin 1s infinite steps(8)

@keyframes spin
  0%
    transform rotate(0deg)
  100%
    transform rotate(360deg)
</style>
