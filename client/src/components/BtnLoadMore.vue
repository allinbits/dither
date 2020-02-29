<template lang="pug">
.btn-load-more(style="btnStyle")
  dc-btn(size="large" @click.native="loadMore" icon="refresh-cw") Load more
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
  data: () => ({
    limit: 50,
    orderBy: ["timestamp", "desc"]
  }),
  methods: {
    loadMore() {
      if (this.account) {
        this.$store.dispatch("memos/fetchAndAdd", {
          limit: this.limit,
          orderBy: this.orderBy,
          where: [["address", "==", this.account]]
        });
      } else {
        this.$store.dispatch("memos/fetchAndAdd", {
          limit: this.limit,
          orderBy: this.orderBy
        });
      }
    }
  },
  props: ["active", "account"]
};
</script>

<style scoped lang="stylus">
.btn-load-more
  height 5rem
  display flex
  align-items center
  justify-content center
</style>
