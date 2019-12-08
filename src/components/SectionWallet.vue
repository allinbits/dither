<template lang="pug">
.section-wallet
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
import { mapGetters } from "vuex";
export default {
  name: "section-wallet",
  computed: {
    ...mapGetters(["user", "users"])
  },
  mounted() {
    const mnemonic = bip39.generateMnemonic();
    console.log(mnemonic);

    const wallet = createWalletFromMnemonic(mnemonic); // BIP39 mnemonic string
    console.log(wallet);
  }
};
</script>

<style scoped lang="stylus"></style>
