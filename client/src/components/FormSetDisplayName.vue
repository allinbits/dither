<template lang="pug">
form.form-set-display-name(@submit.prevent.default="validateAndSend" v-if="walletExists")
  .form-group(:class="{ 'form-group--error': $v.displayName.$error }")
    label Display Name
    input#display-name(type="text" v-model="displayName" placeholder="Anonymous")
    .error(v-if="!$v.displayName.required") Display name is required
    .error(v-if="!$v.displayName.minLength || !$v.displayName.maxLength")
      | Display names must be between {{$v.displayName.$params.minLength.min }} and {{$v.displayName.$params.maxLength.max }} characters
  .form-group
    dc-btn(type="submit") Set Display Name
form.form-set-display-name(v-else)
  .form-group.form-group--error
    label Display Name
    input(type="text" v-model="displayName" disabled placeholder="Anonymous")
    .error You must #[router-link(:to="{ name: 'wallet' }") create a wallet] and add tokens before you can set a display name
</template>

<script>
import { minLength, maxLength, required } from "vuelidate/lib/validators";
import tx from "../scripts/tx";
import { mapGetters } from "vuex";
import DcBtn from "@/components/DcBtn";
export default {
  name: "form-set-display-name",
  components: {
    DcBtn
  },
  computed: {
    ...mapGetters(["user", "userSignedIn", "settings"]),
    walletExists() {
      return (
        this.settings &&
        this.settings.data &&
        this.settings.data.wallet &&
        this.settings.data.wallet.address &&
        this.settings.data.uatom
      );
    },
    fromAddress() {
      return this.settings.data.wallet.address;
    }
  },
  data: () => ({
    displayName: ""
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
        memo: JSON.stringify({
          type: "set-displayname",
          body: this.displayName
        })
      });
      this.$store.commit("addQueuedTxSends", queuedTxSend);
      this.$v.$reset();
    }
  },
  validations: {
    displayName: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(50)
    }
  },
  watch: {
    "settings.displayname"() {
      console.log("this.settings.displayname", this.settings.displayname);
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
