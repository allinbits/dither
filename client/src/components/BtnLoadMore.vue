<template lang="pug">
.btn-load-more(style="btnStyle")
  dc-btn(size="large" @click.native="fetchAndAdd" icon="refresh-cw") Load more
</template>

<script>
import DcBtn from "./DcBtn";
export default {
  name: "btn-load-more",
  components: {
    DcBtn
  },
  computed: {
    btnStyle() {
      if (this.active) {
        return "active";
      }
      return "";
    }
  },
  methods: {
    loadMore() {
      this.$store.dispatch("memos/fetchAndAdd", {
        limit: 10,
        orderBy: ["timestamp", "desc"]
      });
    },
    async fetchAndAdd() {
      let fetchResult = await this.loadMore();
      if (fetchResult.done === true) return "all done!";
      return "retrieved 50 docs, call again to fetch the next!";
    }
  },
  props: ["active"]
};
</script>

<style scoped lang="stylus">
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>
