<template lang="pug">
form.form-send-tokens(@submit.prevent.default="validateAndSend")
  .form-group(:class="{ 'form-group--error': $v.sendTo.$error }")
    label To Address
    input#to-address(type="text" v-model="sendTo" placeholder="cosmos1address")
    .error(v-if="!$v.sendTo.required") Field is required
    .error(v-if="!$v.sendTo.minLength")
      | Name must have at least {{$v.sendTo.$params.minLength.min}} letters.
  .form-group(:class="{ 'form-group--error': $v.sendAmount.$error }")
    label ATOM Amount
    input(type="number" v-model="sendAmount" placeholder="Number of ATOM" step="0.000001")
    .error(v-if="!$v.sendAmount.between")
      | Must be between {{$v.sendAmount.$params.between.min}} and {{$v.sendAmount.$params.between.max}}
  .form-group
    dc-btn(type="submit") Send ATOM
</template>

<script>
import { between, minLength, required } from "vuelidate/lib/validators";
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
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.sendTx();
      }
    },
    async sendTx() {
      let queuedTxSend = await tx.sendTx({
        from: this.fromAddress,
        to: this.sendTo,
        amount: this.sendAmountUatom,
        memo: JSON.stringify({
          type: "send",
          body: "Sent by dither.chat"
        })
      });
      this.$store.commit("addQueuedTxSends", queuedTxSend);

      this.sendTo = "";
      this.sendAmount = 0;
      this.$v.$reset();
    }
  },
  mounted() {
    this.$el.querySelector("#to-address").focus();
  },
  props: ["balance"],
  validations: {
    sendTo: {
      required,
      minLength: minLength(45)
    },
    sendAmount: {
      between(value) {
        return between(0.000001, this.$props.balance)(value);
      }
    }
  }
};
</script>

<style scoped lang="stylus">
form
  .error
    font-size 0.75rem
    color var(--danger)
    display none

  .form-group
    padding 1rem 0
    border none

    &.form-group--error
      .error
        display block

    &:not(:last-child)
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
