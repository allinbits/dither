<template lang="pug">
form.form-memo(@submit.prevent.default="validateAndSend")
  textarea#memo-body(v-model="memo" :placeholder="placeholderText")
  .field-note Bytes left: {{ bytesLeft }}
  .field-note.field-note--error(v-if="formHasError") {{ formErrorMsg }}
  dc-btn(type="submit") {{ submitText }}
</template>

<script>
import { byteLength } from "byte-length";

import { mapGetters } from "vuex";
import h from "../scripts/helpers";
import tx from "../scripts/tx";
import DcBtn from "./DcBtn";
export default {
  name: "form-send-memo",
  components: {
    DcBtn
  },
  computed: {
    ...mapGetters(["settings", "blockchain", "queuedMemos"]),
    placeholderText() {
      if (this.type === "comment") {
        return "Leave your comment";
      }
      return "What's on your mind?";
    },
    submitText() {
      if (this.type === "comment") {
        return "Comment";
      }
      return "Post";
    },
    bytesLeft() {
      return (
        512 -
        byteLength(h.getMemoPrefix(this.type, this.parentAddress)) -
        byteLength(this.memo)
      );
    },
    fromAddress() {
      return this.settings.data.wallet.address;
    }
  },
  data: () => ({
    memo: "",
    formHasError: false,
    formErrorMsg: ""
  }),
  methods: {
    async validateAndSend() {
      if (this.bytesLeft === 512) {
        this.formHasError = true;
        this.formErrorMsg = "Memo needs to have some text";
        return;
      } else if (this.bytesLeft < 0) {
        this.formHasError = true;
        this.formErrorMsg = "Memo is too long";
        return;
      } else {
        this.formHasError = false;
        this.formErrorMessage = "";
      }
      this.sendTx();
    },
    async sendTx() {
      let queuedMemo = await tx.sendTx(
        this.fromAddress,
        this.type,
        this.parentAddress,
        this.memo
      );
      this.$store.commit("addQueuedMemo", queuedMemo);

      this.memo = "";

      if (this.type === "post") {
        this.$router.push({ name: "home" });
      }
    }
  },
  mounted() {
    this.$el.querySelector("#memo-body").focus();
  },
  props: ["type", "parent-address"]
};
</script>

<style scoped lang="stylus">
form
  width 100%

textarea
  display block
  border 1px solid var(--bc-input)
  height 6rem
  margin-bottom 0.5rem
  box-sizing border-box
  width 100%
  padding 0.5rem

.field-note
  font-size 0.75rem
  margin-bottom 0.5rem
  color var(--dim)

.field-note--error
  color var(--danger)
</style>
