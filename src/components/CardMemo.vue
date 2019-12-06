<template lang="pug">
router-link.memo(:to="{ name: 'memo', params: { memo: memo.txhash } }")
  .container-avatar
    // .avatar {{ avatar(i.timestamp) }}
    .avatar
  .container-text
    .meta
      .sender {{ shortAddr(memo.sender) }}
      .time {{ timeAgo(memo.timestamp) }} ago
    .body {{ memo.memo }}
</template>

<script>
import identicon from "identicon.js";
import { formatDistance, subDays } from "date-fns";
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
export default {
  name: "card-memo",
  components: {
    AppFooter,
    PageHeader
  },
  methods: {
    shortAddr(cosmosAddr) {
      let addrLength = 8;
      let addr = cosmosAddr.slice(7, cosmosAddr.length);
      addr = addr.slice(addr.length - addrLength, addr.length);
      return addr;
    },
    timeAgo(date) {
      return formatDistance(new Date(date), new Date());
    },
    avatar(hash) {
      var options = {
        foreground: [0, 0, 0, 255], // rgba black
        background: [255, 255, 255, 255], // rgba white
        margin: 0.2, // 20% margin
        size: 128, // 420px square
        format: "svg" // use SVG instead of PNG
      };
      // create a base64 encoded SVG
      var data = new identicon(hash, options).toString();
      return data;
    }
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.memo
  border-top 1px solid var(--bc)
  display flex
  color var(--txt)

.container-avatar
  padding 0.5rem

.avatar
  width 4rem
  height 4rem
  background #ccc
  border-radius 0.25rem

.meta
  font-size 0.75rem
  display flex
  align-items center
  .sender
    font-weight bold
    color var(--txt)
    margin-right 0.5rem
  .time
    color var(--dim)

.container-text
  padding 0.5rem 0.5rem 0.5rem 0
</style>
