<template lang="pug">
.page
  .app-header Discovery
  .memo-container(v-for="i in latestMemos")
    .memo-avatar-container
      // .memo-avatar {{ avatar(i.timestamp) }}
      .memo-avatar 
    .memo-text
      .meta {{ i.height }}
      .memo {{ i.memo }}
</template>

<script>
import identicon from "identicon.js";
import { mapGetters } from "vuex";
export default {
  name: "page-index",
  computed: {
    latestMemos() {
      return this.memos.slice(0, 10);
    },
    ...mapGetters(["memos"])
  },
  methods: {
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
  data: () => ({
    msg: "hi"
  })
};
</script>

<style scoped lang="stylus">
.page
  padding-top 3rem

.app-header
  line-height 3rem
  background #fff
  position fixed
  top 0
  left 0
  width 100%
  border-bottom 1px solid var(--bc)

  text-align center
.memo-container
  border-top 1px solid var(--bc)
  display flex
.memo-avatar-container
  padding 0.5rem
.memo-avatar
  width 3rem
  height 3rem
  background #ccc
  border-radius 0.25rem
.meta
  font-size 0.75rem
  color var(--dim)
.memo
  padding 0.5rem 0
</style>
