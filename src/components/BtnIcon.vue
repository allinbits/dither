<template lang="pug">
router-link.btn-icon(v-if="type == 'link'" :class="cssClass" :to="to")
  img(:src="imgSrc")
  .value(v-if="value") {{ value }}
a.btn-icon(v-else-if="type == 'anchor'" :class="cssClass" :href="href")
  img(:src="imgSrc")
  .value(v-if="value") {{ value }}
.btn-icon(v-else :class="cssClass")
  img(:src="imgSrc")
  .value(v-if="value") {{ value }}
</template>

<script>
export default {
  name: "btn-icon",
  computed: {
    cssClass() {
      if (this.size) {
        return `btn-icon--size-${this.size}`;
      }
      return `btn-icon--size-default`;
    },
    imgSrc() {
      return require("../assets/feather/" + this.icon + ".svg");
    }
  },
  props: ["type", "icon", "to", "href", "size", "value"]
};
</script>

<style scoped lang="stylus">
.btn-icon
  display block
  color var(--link)
  display flex
  align-items center
  justify-content center
  cursor pointer
  img
    opacity 0.5

  .value
    font-size 0.75rem
    color var(--dim)
    margin-left 0.25rem


.btn-icon--size-default
  width 3rem
  height 3rem
  img
    width 1.5rem
    height 1.5rem

.btn-icon--size-small
  width 2rem
  height 2rem
  &:hover
    background var(--hover-fg)
  img
    width 1rem
    height 1rem
</style>
