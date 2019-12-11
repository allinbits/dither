<template lang="pug">
.card-memo(@click="actionView($event)")
  .container-avatar
    .avatar(v-html="avatar")
  .container-text
    .meta
      .sender {{ addrShort(getSender(memo.tx)) }}
      .time {{ timeAgo(memo.timestamp) }} ago
    .body {{ memo.memo }}
    .actions
      btn-icon(slot="btn-left" size="small" icon="message-circle" @click.native="actionReply($event)")
      btn-icon(slot="btn-left" size="small" icon="repeat" @click.native="actionRelay($event)")
      btn-icon(slot="btn-left" size="small" icon="heart" @click.native="actionLike($event)")
      btn-icon(slot="btn-left" size="small" icon="share" @click.native="actionShare($event)")
</template>

<script>
import identicon from "identicon.js";
import createHash from "create-hash";
import { formatDistance, subDays } from "date-fns";

import BtnIcon from "./BtnIcon";
export default {
  name: "card-memo",
  components: {
    BtnIcon
  },
  computed: {
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
    actionView(e) {
      this.$router.push({ name: "memo", params: { memo: this.memo.id } });
    },
    actionReply(e) {
      e.stopPropagation();
      alert("WIP: reply");
    },
    actionRelay(e) {
      e.stopPropagation();
      alert("WIP: relay");
    },
    actionLike(e) {
      e.stopPropagation();
      alert("WIP: like");
    },
    actionShare(e) {
      e.stopPropagation();
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

.container-avatar
  padding 0.5rem

.avatar
  display flex
  align-items center
  justify-content center

.meta, .body
  margin-bottom 0.25rem

.meta
  display flex
  align-items center
  margin-bottom 0.25rem
  .sender
    font-weight bold
    color var(--txt)
    margin-right 0.5rem
  .time
    color var(--dim)

.container-text
  padding 0.5rem 0.5rem 0.5rem 0

.body
  line-height 1.25

  /* These are technically the same, but use both */
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;

.actions
  display flex
</style>
