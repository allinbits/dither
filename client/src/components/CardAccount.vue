<template lang="pug">
router-link.card-account(:to="{ name: 'account', params: { address: account.id } }")
  .avatar: img-avatar(:address="account.id" size="48")
  .text
    .title {{ shortAddress(account.id) }}
    .subtitle {{ following }} following / {{ followers }} followers
</template>

<script>
import h from "../scripts/helpers.js";
import BtnIcon from "@/components/BtnIcon";
import BtnLoadMore from "@/components/BtnLoadMore";
import ImgAvatar from "@/components/ImgAvatar";
export default {
  name: "page-accounts-index",
  metaInfo: { title: "Community" },
  components: {
    BtnIcon,
    BtnLoadMore,
    ImgAvatar
  },
  computed: {
    following() {
      if (this.account.following) {
        return this.account.following.length;
      }
      return 0;
    },
    followers() {
      if (this.account.followers) {
        return this.account.followers.length;
      }
      return 0;
    }
  },
  methods: {
    shortAddress(address) {
      return h.truncAddress(address);
    }
  },
  props: ["account"]
};
</script>

<style scoped lang="stylus">
.card-account
  border-bottom 1px solid var(--bc)
  display flex

  .avatar
    padding 0.5rem
  .text
    padding 0.5rem 0.5rem 0.5rem 0
    color var(--txt)
  .title
    font-weight bold
  .subtitle
    font-size 0.75rem
    color var(--dim)
</style>
