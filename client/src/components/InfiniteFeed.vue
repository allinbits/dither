<template lang="pug">
.infinite-feed
  template(v-if="Object.keys(queued).length > 0")
    card-memo(v-for="memo in queued" :memo="memo" :key="memo.id")

  template(v-if="Object.keys(memos).length > 0")
    card-memo(v-for="memo in memos" :memo="memo" :key="memo.id")
    // btn-load-more

  card-loading(v-else)
</template>

<script>
import BtnLoadMore from "./BtnLoadMore";
import CardLoading from "./CardLoading";
import CardMemo from "./CardMemo";
export default {
  name: "infinite-feed",
  components: {
    BtnLoadMore,
    CardLoading,
    CardMemo
  },
  props: ["memos", "queued"]
};
</script>

<style scoped lang="stylus"></style>
