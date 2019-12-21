<template lang="pug">
.card-memo
  corner-error(v-if="memo.height === 0 && memo.response.code")
  corner-spinner(v-else-if="memo.height === 0")
  .container-avatar(@click.self="actionView")
    router-link.avatar(
      :to="{ name: 'account', params: {address: memo.address}}")
      img-avatar(:address="memo.address")
  .container-text
    .meta(@click.self="actionView")
      router-link.sender(:to="{ name: 'account', params: {address: memo.address}}")
        | {{ shortAddress }}
      router-link.time(:to="{ name: 'memo', params: { memo: this.memo.id } }")
        | {{ timeAgo(memo.timestamp) }}
    .body.dont-break-out(@click.self="actionView")
      | {{ memoBody }}
    .actions(@click.self="actionView")
      btn-icon(
        slot="btn-left" size="small" icon="message-circle" :value="memoComments"
        @click.native.stop="actionView")

      // repost button
      btn-icon.btn-repost.btn-repost--active(
        v-if="userReposted"
        slot="btn-left" size="small" icon="repeat" color="green" :value="memoReposts")
      btn-icon.btn-repost(
        v-else
        :class="btnRepostCss"
        slot="btn-left" size="small" icon="repeat" :value="memoReposts"
        @click.native.stop="actionRepost")

      // like button
      btn-icon.btn-like.btn-like--active(
        v-if="userLiked"
        slot="btn-left" size="small" icon="heart" color="red" :value="memoLikes")
      btn-icon.btn-like(
        v-else
        slot="btn-left" size="small" icon="heart" :value="memoLikes"
        @click.native.stop="actionLike")

      // share button
      // btn-icon(
        slot="btn-left" size="small" icon="share"
        @click.native.stop="actionShare")
</template>

<script>
import { formatDistance, subDays } from "date-fns";
import { find } from "lodash";

import h from "../scripts/helpers";
import tx from "../scripts/tx";
import { mapGetters } from "vuex";
import BtnIcon from "./BtnIcon";
import CornerError from "./CornerError";
import CornerSpinner from "./CornerSpinner";
import ImgAvatar from "./ImgAvatar";
export default {
  name: "card-memo",
  components: {
    BtnIcon,
    CornerError,
    CornerSpinner,
    ImgAvatar
  },
  computed: {
    ...mapGetters(["memos", "settings", "userSignedIn"]),
    shortAddress() {
      return h.truncAddress(this.memo.address);
    },
    fromAddress() {
      if (this.settings && this.settings.data && this.settings.data.wallet) {
        return this.settings.data.wallet.address;
      }
      return "";
    },
    memoBody() {
      let value = this.memo.memo;
      value = value.split(" ");
      value.shift();
      if (this.memo.type === "post") {
        value = value.join(" ");
        return value;
      }
      if (this.memo.type === "comment") {
        value.shift();
        value = value.join(" ");
        return value;
      }
    },
    memoComments() {
      if (this.memo && this.memo.comments) {
        return this.memo.comments;
      }
      return 0;
    },
    memoReposts() {
      if (this.memo && this.memo.reposts) {
        return this.memo.reposts;
      }
      return 0;
    },
    memoLikes() {
      if (this.memo && this.memo.likes) {
        return this.memo.likes;
      }
      return 0;
    },
    btnLikeCss() {
      if (this.userLiked) return "btn-like--active";
      return "btn-like--default";
    },
    btnRepostCss() {
      if (this.userReposted) return "btn-repost--active";
      return "btn-repost--default";
    },
    userLiked() {
      if (this.memos && this.fromAddress) {
        return find(
          this.memos,
          m =>
            m.parent === this.memo.id &&
            m.address === this.fromAddress &&
            m.type === "like"
        );
      }
      return false;
    },
    userReposted() {
      if (this.memos && this.fromAddress) {
        return find(
          this.memos,
          m =>
            m.parent === this.memo.id &&
            m.address === this.fromAddress &&
            m.type === "repost"
        );
      }
      return false;
    }
  },
  methods: {
    timeAgo(date) {
      return formatDistance(new Date(date), new Date());
    },
    actionView() {
      this.$router.push({ name: "memo", params: { memo: this.memo.id } });
    },
    async actionRepost() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
      }
      let queuedMemo = await tx.sendTx(
        this.fromAddress, // memo from
        "repost", // memo type
        this.memo.id, // memo parent id
        "" // memo body
      );
      this.$store.commit("addQueuedMemo", queuedMemo);
    },
    async actionLike() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
      }
      let queuedMemo = await tx.sendTx(
        this.fromAddress, // memo from
        "like", // memo type
        this.memo.id, // memo parent id
        "" // memo body
      );
      this.$store.commit("addQueuedMemo", queuedMemo);
    },
    actionShare() {
      alert("WIP: share");
    },
    checkForUserInteractions() {
      if (this.memo.likes || this.memo.reposts) {
        // console.log("checking...");
        this.$store.dispatch("memos/fetchAndAdd", {
          where: [
            ["parent", "==", this.memo.id],
            ["address", "==", this.fromAddress]
          ]
        });
      } else {
        // console.log("no interactions, skipping...");
      }
    }
  },
  mounted() {
    this.checkForUserInteractions();
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.card-memo
  border-bottom 1px solid var(--bc)
  display flex
  color var(--txt)
  cursor pointer

  position relative

  &:hover
    background var(--hover-bg)

.container-avatar
  padding 0.5rem

.avatar
  display flex
  align-items center
  justify-content center

.meta
  display flex
  align-items center
  margin-bottom 0.125rem
  > div
    margin-right 0.25rem

  .sender
    font-weight bold
    color var(--txt)
    margin-right 0.5rem
    &:hover
      text-decoration underline
  .time
    color var(--dim)
  .block
    color var(--faint)

.container-text
  padding 0.5rem 0.5rem 0.5rem 0
  width 100%

.body
  line-height 1.25
  margin-bottom 0.25rem

.actions
  display flex
  justify-content space-between
  width 100%
  max-width 15rem
</style>
