<template lang="pug">
.page-header
  slot(name="btn-left"): .btn-placeholder
  .title {{ pageTitle }}
  slot(name="btn-right"): .btn-placeholder
</template>

<script>
import BtnIcon from "./BtnIcon";
export default {
  name: "page-header",
  components: {
    BtnIcon
  },
  props: ["page-title"]
};
</script>

<style scoped lang="stylus">
.page-header
  line-height 3rem
  background #fff
  position fixed
  top 0
  left 0
  width 100vw
  border-bottom 1px solid var(--bc)

  display flex
  flex-flow row nowrap

.title
  flex 1
  font-weight bold
  text-align center

.btn-placeholder
  width 3rem
  height 3rem
</style>
