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
      return "";
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
  border 1px solid var(--bc-input)
  color var(--txt)
  font-weight bold

  display flex
  align-items center

  cursor pointer

  &:hover
    background var(--hover-fg)

  img
    margin-right 0.5rem
    width 1rem
    height 1rem

.dc-btn--size-default
  height 2rem
  padding 0 1rem

.dc-btn--size-large
  height 3rem
  padding 0 1.5rem
</style>
