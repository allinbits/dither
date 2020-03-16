<template lang="pug">
.avatar-channel
  img.avatar-channel__bmp(v-if="avatarIsImage" :src="avatarBmp")
  img.avatar-channel__svg(v-else :src="avatarSvg")
</template>

<script>
export default {
  name: "avatar-channel",
  computed: {
    avatarIsImage() {
      if (this.avatar) {
        return this.avatar.split(".").length > 1;
      }
      return false;
    },
    avatarBmp() {
      return require(`../assets/channels/${this.avatar}`);
    },
    avatarSvg() {
      if (this.avatar) {
        return require(`../assets/feather/${this.avatar}.svg`);
      } else {
        return require(`../assets/feather/hash.svg`);
      }
    }
  },
  props: ["avatar", "size"]
};
</script>

<style scoped lang="stylus">

.avatar-channel
  display flex
  align-items center
  justify-content center
  width 4rem

  img
    flex 1
    width 100%

.avatar-channel__svg
  padding 0.75rem
  background rgb(245,245,245)
</style>
