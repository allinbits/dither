<template lang="pug">
.corner-error
  img.spin(src="../assets/feather/white/alert-circle.svg")
</template>

<script>
export default {
  name: "corner-error"
};
</script>

<style scoped lang="stylus">
.corner-error
  position absolute
  top 0.75rem
  right 0
  width 1rem
  height 1rem
  background var(--danger)
  color var(--app)
  display flex
  align-items center
  justify-content center

.corner-error img
  width 0.625rem
  height 0.625rem
</style>
