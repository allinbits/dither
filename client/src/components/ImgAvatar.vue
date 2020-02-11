<template lang="pug">
.img-avatar(v-html="avatar")
</template>

<script>
import identicon from "identicon.js";
import createHash from "create-hash";
import { formatDistance, subDays } from "date-fns";

import h from "../scripts/helpers";
export default {
  name: "img-avatar",
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
        data = new identicon("0000000000000000", options).toString();
      }
      return '<img src="data:image/svg+xml;base64,' + data + '">';
    }
  },
  props: ["address", "size"]
};
</script>

<style scoped lang="stylus">
.img-avatar
  display flex
  align-items center
  justify-content center
</style>
