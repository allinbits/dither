<template lang="pug">
.card-loading
  .inner Loading&hellip;
</template>

<script>
export default {
  name: "card-loading"
};
</script>

<style scoped lang="stylus">
.card-loading
  padding 1rem
.inner
  background var(--bc)
  line-height 3rem
  text-align center
  border-radius 0.5rem
</style>
