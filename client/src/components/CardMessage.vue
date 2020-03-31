<template lang="pug">
.card-message
  .inner
    slot(v-if="$slots.default")
    div(v-else-if="message") {{ body }}
    div(v-else) Page is loading&hellip;
</template>

<script>
export default {
  name: "card-message",
  props: ["message"]
};
</script>

<style scoped lang="stylus">
.card-message
  padding 1rem

.inner
  background var(--bc)
  line-height 3rem
  text-align center
  border-radius 0.5rem
</style>
