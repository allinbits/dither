<template lang="pug">
.btn-large
  .inner: slot Button Label
</template>

<script>
export default {
  name: "btn-large"
};
</script>

<style scoped lang="stylus">

.inner
  border 1px solid var(--bc)
  line-height 3rem
  text-align center
  border-radius 0.5rem
  color var(--link)
</style>
