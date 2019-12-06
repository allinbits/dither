<template lang="pug">
.page
  page-header(page-title="Home")
  .memo-container(v-for="i in memos")
    .memo-avatar-container
      // .memo-avatar {{ avatar(i.timestamp) }}
      .memo-avatar
    .memo-text
      .meta {{ i.height }}
      .memo {{ i.memo }}
  a.load-more Load more
  app-footer
</template>

<script>
import identicon from "identicon.js";
import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
export default {
  name: "page-index",
  components: {
    AppFooter,
    PageHeader
  },
  computed: {
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
  }
};
</script>

<style scoped lang="stylus">
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

.load-more
  line-height 3rem
  color var(--link)
</style>
