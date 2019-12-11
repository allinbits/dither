<template lang="pug">
.card-memo(@click="actionView($event)")
  .container-avatar
    .avatar(v-html="avatar")
  .container-text
    .meta
      .sender {{ addrShort(getSender(memo.tx)) }}
      .time {{ timeAgo(memo.timestamp) }} ago
    .body.dont-break-out {{ memo.memo }}
    .actions
      btn-icon(slot="btn-left" size="small" icon="message-circle" @click.native.stop="actionReply($event)")
      btn-icon(slot="btn-left" size="small" icon="repeat" @click.native.stop="actionRelay($event)")
      btn-icon(slot="btn-left" size="small" icon="heart" @click.native.stop="actionLike($event)")
      btn-icon(slot="btn-left" size="small" icon="share" @click.native.stop="actionShare($event)")
</template>

<script>
import identicon from "identicon.js";
import createHash from "create-hash";
import { formatDistance, subDays } from "date-fns";

import { mapGetters } from "vuex";
import BtnIcon from "./BtnIcon";
export default {
  name: "card-memo",
  components: {
    BtnIcon
  },
  computed: {
    ...mapGetters(["userSignedIn"]),
    avatar() {
      let options = {
        foreground: [0, 0, 0, 255], // rgba black
        background: [240, 240, 240, 255], // rgba white
        margin: 0.2,
        size: 64,
        format: "svg" // use SVG instead of PNG
      };
      let data;

      let senderAddress = this.getSender(this.memo.tx);
      let truncatedSenderAddress = senderAddress.slice(7, senderAddress.length);

      // create a base64 encoded SVG
      if (senderAddress) {
        let hash = createHash("sha224");
        let hexstring = hash.update(truncatedSenderAddress).digest("hex");
        data = new identicon(hexstring, options).toString();
      } else {
        data = new identicon("0000000000000000", options).toString();
      }
      return '<img src="data:image/svg+xml;base64,' + data + '">';
    }
  },
  methods: {
    getSender(tx) {
      let sender = "Loading...";
      if (tx) {
        let txEventMessage = tx.events.find(e => e.type === "message");
        let txEventMessageAttribute = txEventMessage.attributes.find(
          a => a.key === "sender"
        );
        sender = txEventMessageAttribute.value;
      }
      return sender;
    },
    addrShort(addr) {
      if (addr) {
        let value = addr.slice(7, addr.length);
        return value.slice(value.length - 8, value.length);
      } else {
        return "N/A";
      }
    },
    timeAgo(date) {
      return formatDistance(new Date(date), new Date());
    },
    auth() {
      if (!this.userSignedIn) {
        this.$router.push({ name: "login" });
      }
    },
    actionView() {
      this.$router.push({ name: "memo", params: { memo: this.memo.id } });
    },
    actionReply() {
      if (!this.auth()) return;
      alert("WIP: reply");
    },
    actionRelay() {
      if (!this.auth()) return;
      alert("WIP: relay");
    },
    actionLike() {
      if (!this.auth()) return;
      alert("WIP: like");
    },
    actionShare() {
      alert("WIP: share");
    }
  },
  props: ["memo"]
};
</script>

<style scoped lang="stylus">
.card-memo
  border-top 1px solid var(--bc)
  display flex
  color var(--txt)
  cursor pointer
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
  .sender
    font-weight bold
    color var(--txt)
    margin-right 0.5rem
  .time
    color var(--dim)

.container-text
  padding 0.5rem 0.5rem 0.5rem 0
  width 100%

.body
  margin-bottom 0.25rem

.actions
  display flex
  justify-content space-between
  width 100%
  max-width 20rem
</style>
