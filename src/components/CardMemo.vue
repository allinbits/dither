<template lang="pug">
router-link.card-memo(:to="{ name: 'memo', params: { memo: memo.id } }")
  .container-avatar
    .avatar(v-html="avatar")
  .container-text
    .meta
      .sender {{ addrShort(memo.sender) }}
      .time {{ timeAgo(memo.timestamp) }} ago
    .body {{ memo.memo }}
</template>

<script>
import identicon from "identicon.js";
import createHash from "create-hash";
import { formatDistance, subDays } from "date-fns";
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
export default {
  name: "card-memo",
  components: {
    AppFooter,
    PageHeader
  },
  computed: {
    avatar() {
      let options = {
        foreground: [0, 0, 0, 255], // rgba black
        background: [240, 240, 240, 255], // rgba white
        margin: 0.2,
        size: 64,
        format: "svg" // use SVG instead of PNG
      };
      let data;
      // create a base64 encoded SVG
      if (this.memo.sender) {
        let hash = createHash("sha224");
        let hexstring = hash.update(this.memo.sender).digest("hex");
        data = new identicon(hexstring, options).toString();
      } else {
        data = new identicon("0000000000000000", options).toString();
      }
      return '<img src="data:image/svg+xml;base64,' + data + '">';
    }
  },
  methods: {
    addrShort(addr) {
      let value = addr.slice(7, addr.length);
      return value.slice(value.length - 8, value.length);
    },
    timeAgo(date) {
      return formatDistance(new Date(date), new Date());
    }
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.card-memo
  border-top 1px solid var(--bc)
  display flex
  color var(--txt)

.container-avatar
  padding 0.5rem

.avatar
  width 4rem
  height 4rem
  display flex
  align-items center
  justify-content center

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

.body
  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
</style>
