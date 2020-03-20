<template lang="pug">
.memo-body.dont-break-out(@click.self="navToMemo" v-html="memoBody")
</template>

<script>
import * as linkify from "linkifyjs";
import h from "../scripts/helpers";
import hashtag from "linkifyjs/plugins/hashtag"; // optional
hashtag(linkify);

export default {
  name: "memo-body",
  computed: {
    memoBody() {
      let text = this.memo.memo;
      // handle JSON based memos
      if (typeof text === "object") {
        if (text.type === "post" && text.body) {
          return h.linkifyMemo(text.body);
        } else if (text.type === "repost" && !text.body) {
          return "";
        }
      }
      // handle historical slash based memos
      if (text) {
        text = text.split(" ");
        text.shift();
        if (this.memo.type === "post") {
          text = text.join(" ");
          return h.linkifyMemo(text);
        }
        if (this.memo.type === "comment") {
          text.shift();
          text = text.join(" ");
          return h.linkifyMemo(text);
        }
      }
      return "";
    }
  },
  methods: {
    navToMemo() {
      this.$router.push({ name: "memo", params: { memo: this.memo.id } });
    }
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.memo-body
  line-height 1.25
  margin-bottom 0.25rem
</style>
