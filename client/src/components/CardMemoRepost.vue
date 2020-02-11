<template lang="pug">
.card-memo-repost
  .card-meta
    .icon: img(src="@/assets/feather/repeat.svg")
    router-link.reposter(:to="{ name: 'account', params: { address: memo.address }}")
      | {{ shortAddress}}
    | reposted
  card-memo-post(:memo="repostedMemo" :key="repostedMemo.id")
</template>

<script>
import { pickBy } from "lodash";
import h from "../scripts/helpers";
import { mapGetters } from "vuex";
import CardMemoPost from "./CardMemoPost";
export default {
  name: "card-memo-repost",
  components: {
    CardMemoPost
  },
  computed: {
    shortAddress() {
      return h.truncAddress(this.memo.address);
    },
    ...mapGetters(["memos"])
  },
  data: () => ({
    repostedMemo: {
      id: "loading",
      address: "cosmos1loading"
    }
  }),
  async mounted() {
    this.repostedMemo = this.memos[this.memo.parent];
    if (!this.repostedMemo) {
      this.repostedMemo = await this.$store.dispatch(
        "memos/fetchById",
        this.memo.parent
      );
    }
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.card-meta
  display flex
  align-items center

  height 1.5rem
  padding 0.5rem 0.5rem 0

  font-size 0.875rem
  color var(--dim)
  .icon
    width 4rem
    margin-right 0.5rem
    display flex
    justify-content flex-end
    img
      width 0.75rem
      height 0.75rem
  .reposter
    margin-right 0.3rem
    color var(--txt)
    &:hover
      text-decoration underline
</style>
