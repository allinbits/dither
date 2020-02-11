<template lang="pug">
.section-default: slot
</template>

<script>
export default {
  name: "section-default"
};
</script>

<style scoped lang="stylus">
.section-default
  border-bottom 1px solid var(--bc)
  width 100%
  padding 1rem
</style>
