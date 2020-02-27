<template lang="pug">
form.form-send-tokens(@submit.prevent.default="validateAndSend")
  p {{ balance }} ATOM
  fieldset
    label To Address
    input#to-address(type="text" v-model="sendTo" placeholder="cosmos1address")
  fieldset
    label ATOM Amount
    input(type="text" v-model="sendAmount" placeholder="Number of ATOM" )
  fieldset
    dc-btn(type="submit") Send ATOM
</template>

<script>
import tx from "../scripts/tx";
import { mapGetters } from "vuex";
import DcBtn from "@/components/DcBtn";
export default {
  name: "form-send-tokens",
  components: {
    DcBtn
  },
  computed: {
    ...mapGetters(["user", "userSignedIn", "settings"]),
    fromAddress() {
      return this.settings.data.wallet.address;
    },
    sendAmountUatom() {
      return (this.sendAmount * 1000000).toString();
    }
  },
  data: () => ({
    sendTo: "",
    sendAmount: 0
  }),
  methods: {
    async validateAndSend() {
      this.sendTx();
    },
    async sendTx() {
      let queuedTxSend = await tx.sendTx(
        this.fromAddress,
        "send",
        "",
        "Sent by dither.chat",
        this.sendTo,
        this.sendAmountUatom
      );
      this.$store.commit("addQueuedTxSends", queuedTxSend);

      this.sendTo = "";
      this.sendAmount = 0;
    }
  },
  mounted() {
    this.$el.querySelector("#to-address").focus();
  },
  props: ["balance"]
};
</script>

<style scoped lang="stylus">
fieldset
  padding 1rem 0
  border none
fieldset:not(:last-child)
  border-bottom 1px solid var(--bc)
label
  display block

input[type="text"]
input[type="number"]
input[type="email"]
input[type="password"]
input[type="submit"]
  border 1px solid var(--bc-input)
  height 2rem
  padding 0 0.5rem

input[type="text"]
input[type="number"]
input[type="email"]
input[type="password"]
  max-width 40rem
  width 100%
</style>
