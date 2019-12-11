<template lang="pug">
router-link.dc-btn(v-if="type == 'link'" :class="cssClass" :to="to")
  img.dc-btn__icon(v-if="icon" :src="iconSrc")
  .dc-btn__value: slot
a.dc-btn(v-else-if="type == 'anchor'" :class="cssClass" :href="href")
  img.dc-btn__icon(v-if="icon" :src="iconSrc")
  .dc-btn__value: slot
button.dc-btn(v-else-if="type == 'submit'" :class="cssClass" type="submit")
  img.dc-btn__icon(v-if="icon" :src="iconSrc")
  .dc-btn__value: slot
button.dc-btn(v-else :class="cssClass")
  img.dc-btn__icon(v-if="icon" :src="iconSrc")
  .dc-btn__value: slot
</template>

<script>
export default {
  name: "dc-btn",
  computed: {
    cssClass() {
      if (this.size) {
        return `dc-btn--size-${this.size}`;
      }
      return `dc-btn--size-default`;
    },
    iconSrc() {
      if (this.icon) {
        return require("../assets/feather/" + this.icon + ".svg");
      }
    }
  },
  props: ["type", "icon", "to", "href", "size", "value"]
};
</script>

<style scoped lang="stylus">
.dc-btn
  display block
  display flex
  align-items center
  justify-content center

  background transparent
  padding 0 1rem
  border 1px solid var(--link)
  color var(--link)
  font-weight bold
  height 2rem

  display flex
  align-items center

  cursor pointer

.dc-btn--size-default
  height 2rem
  &:hover
    background var(--hover-fg)
  img
    width 1rem
    height 1rem
</style>
