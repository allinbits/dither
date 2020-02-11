<template lang="pug">
.btn-large: slot Button Label
</template>

<script>
export default {
  name: "btn-large"
};
</script>

<style scoped lang="stylus">
.btn-large + .btn-large
  margin-top 0.5rem

.btn-large
  border 1px solid var(--link)
  line-height 3rem
  text-align center
  border-radius 0.5rem
  color var(--link)
  cursor pointer
  max-width 286px
  &:hover
    background var(--bc)
</style>
