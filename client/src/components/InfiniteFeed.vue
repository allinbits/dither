<template lang="pug">
.infinite-feed
  template(v-if="Object.keys(queued).length > 0")
    card-memo(v-for="memo in filteredQueued" :memo="memo" :key="memo.id")

  template(v-if="Object.keys(memos).length > 0")
    card-memo(v-for="memo in filteredMemos" :memo="memo" :key="memo.id")
    btn-load-more(:account="account")

  card-loading(v-else)
</template>

<script>
import { orderBy, pickBy } from "lodash";
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
  computed: {
    filteredMemos() {
      let value = [];
      if (this.memos) {
        // only include users following
        if (this.following) {
          value = pickBy(this.memos, m => this.following.includes(m.address));
        }

        value = pickBy(this.memos, m => this.memoTypes.includes(m.type));
        value = orderBy(value, m => parseInt(m.height), "desc");
      }
      return value;
    },
    fiilteredQueued() {
      let value = [];
      if (this.queued) {
        value = pickBy(this.queued, m => this.memoTypes.includes(m.type));
        value = orderBy(value, m => parseInt(m.height), "desc");
      }
      return value;
    }
  },
  data: () => ({
    memoTypes: ["post", "repost"],
    excludedMemoTypes: ["like", "comment", "follow", "unfollow"]
  }),
  props: ["memos", "queued", "account", "following"]
};
</script>

<style scoped lang="stylus"></style>
