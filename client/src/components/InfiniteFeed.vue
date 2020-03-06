<template lang="pug">
.infinite-feed
  template(v-if="Object.keys(queued).length > 0")
    card-memo-post(v-for="memo in filteredQueued" :memo="memo" :key="memo.id")

  template(v-if="Object.keys(memos).length > 0")
    card-memo-post(v-for="memo in filteredMemos" :memo="memo" :key="memo.id")
    btn-load-more(:account="account")

  card-loading(v-else)
</template>

<script>
import { orderBy, pickBy, map, uniq } from "lodash";
import BtnLoadMore from "./BtnLoadMore";
import CardLoading from "./CardLoading";
import CardMemoPost from "./CardMemoPost";
export default {
  name: "infinite-feed",
  components: {
    BtnLoadMore,
    CardLoading,
    CardMemoPost
  },
  computed: {
    filteredMemos() {
      let memos = [];
      if (this.memos) {
        memos = this.memos;

        // only include users following
        if (this.following) {
          memos = pickBy(this.memos, m => this.following.includes(m.address));
        }

        memos = pickBy(this.memos, m => this.memoTypes.includes(m.type));
        memos = this.combineMemos(memos);
        memos = orderBy(memos, m => parseInt(m.height), "desc");
      }
      return memos;
    },
    fiilteredQueued() {
      let memos = [];
      if (this.queued) {
        memos = this.queued;
        memos = pickBy(this.memos, m => this.memoTypes.includes(m.type));
        memos = orderBy(memos, m => parseInt(m.height), "desc");
      }
      return memos;
    }
  },
  data: () => ({
    memoTypes: ["post", "repost"],
    excludedMemoTypes: ["like", "comment", "follow", "unfollow"]
  }),
  methods: {
    combineMemos(memos) {
      let reposts = pickBy(memos, memo => memo.type === "repost");
      let posts = pickBy(memos, memo => memo.type === "post");

      let hashesOfRepostedMemos = uniq(map(reposts, memo => memo.parent));
      /*
      console.log(
        "combineMemos() hashesOfRepostedMemos",
        hashesOfRepostedMemos
      );
      */

      let combinedMemos = map(posts, post => {
        if (hashesOfRepostedMemos.includes(post.id)) {
          post.timeline = pickBy(reposts, repost => repost.parent === post.id);
          // console.log(post.id, "has been reposted by", post.timeline);
        }
        return post;
      });

      return combinedMemos;
    }
  },
  props: ["memos", "queued", "account", "following"]
};
</script>

<style scoped lang="stylus"></style>
