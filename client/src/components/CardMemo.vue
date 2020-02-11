<template lang="pug">
.card-memo
  card-memo-repost(v-if="memo.type === 'repost'" :memo="memo")
  card-memo-post(v-else :memo="memo")
</template>

<script>
import CardMemoPost from "./CardMemoPost";
import CardMemoRepost from "./CardMemoRepost";
export default {
  name: "card-memo",
  components: {
    CardMemoPost,
    CardMemoRepost
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus"></style>
