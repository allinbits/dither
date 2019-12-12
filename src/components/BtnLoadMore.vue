<template lang="pug">
.btn-load-more
  dc-btn(size="large" @click.native="loadMore" icon="refresh-cw") Load more
</template>

<script>
import DcBtn from "./DcBtn";
export default {
  name: "btn-load-more",
  components: {
    DcBtn
  },
  methods: {
    loadMore() {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 10,
        orderBy: ["timestamp", "desc"]
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>
