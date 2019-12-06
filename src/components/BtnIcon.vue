<template lang="pug">
router-link.btn-icon(v-if="type == 'link'" :to="to")
  img(:src="imgSrc")
a.btn-icon(v-else)
  img(:src="imgSrc")
</template>

<script>
export default {
  name: "btn-icon",
  computed: {
    imgSrc() {
      return require("../assets/feather/" + this.icon + ".svg");
    }
  },
  props: ["type", "icon", "to"]
};
</script>

<style scoped lang="stylus">
.btn-icon
  display block
  width 3rem
  height 3rem
  color var(--link)
  display flex
  align-items center
  justify-content center
  cursor pointer
</style>
