<template lang="pug">
.avatar-account(v-html="avatar")
</template>

<script>
import identicon from "identicon.js";
import createHash from "create-hash";

export default {
  name: "avatar-account",
  computed: {
    avatar() {
      let data;
      if (this.address) {
        let truncatedSenderAddress = this.address.slice(7, this.address.length);
        let hash = createHash("sha224");
        let hexstring = hash.update(truncatedSenderAddress).digest("hex");
        let options = {
          foreground: [0, 0, 0, 204], // 80% black
          background: [245, 245, 245], // white
          margin: 0.2,
          size: this.size || 64,
          format: "svg" // use SVG instead of PNG
        };
        data = new identicon(hexstring, options).toString();
      } else {
        data = new identicon("0000000000000000").toString();
      }
      return '<img src="data:image/svg+xml;base64,' + data + '">';
    }
  },
  props: ["address", "size"]
};
</script>

<style scoped lang="stylus">
.avatar-account
  display flex
  align-items center
  justify-content center
</style>
