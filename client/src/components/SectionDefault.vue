<template lang="pug">
.section-default
  .section-title(v-if="$slots['section-title']"): slot(name="section-title")
  .section-body: slot
</template>

<script>
export default {
  name: "section-default"
};
</script>

<style scoped lang="stylus">
.section-default
  border-bottom 1px solid var(--bc)

.section-default:last-child
  border-bottom 1px solid var(--bc)

.section-title
  font-weight bold
  line-height 2rem
  border-bottom 1px solid var(--bc)
  padding 0 1rem
  background #f6f6f6

.section-body
  padding 1rem
  p:not(:last-child)
    margin-bottom 0.75rem
</style>
