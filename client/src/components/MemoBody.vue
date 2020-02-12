<template lang="pug">
.memo-body.dont-break-out(@click.self="navToMemo" v-html="memoBody")
</template>

<script>
import * as linkify from "linkifyjs";
import linkifyHtml from "linkifyjs/html";
import hashtag from "linkifyjs/plugins/hashtag"; // optional
hashtag(linkify);

export default {
  name: "memo-body",
  computed: {
    memoBody() {
      let text = this.memo.memo;
      if (text) {
        text = text.split(" ");
        text.shift();
        if (this.memo.type === "post") {
          text = text.join(" ");
          return this.linkifyMemo(text);
        }
        if (this.memo.type === "comment") {
          text.shift();
          text = text.join(" ");
          return this.linkifyMemo(text);
        }
      }
      return "";
    }
  },
  methods: {
    linkifyMemo(text) {
      return linkifyHtml(text, {
        formatHref: (href, type) => {
          if (type === "hashtag") {
            href = "https://dither.chat/hashtag/" + href.substring(1);
          }
          return href;
        },
        ignoreTags: ["script", "style"]
      });
    },
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
