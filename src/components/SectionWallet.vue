<template lang="pug">
.section-wallet
  | {{ settings.data.wallet.address }}
  btn-large(@click.native="createWallet") Create wallet
  btn-large(@click.native="sendTx") Send tx
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
import { Firebase } from "../store/firebase.js";

import { mapGetters } from "vuex";
import BtnLarge from "./BtnLarge";
export default {
  name: "section-wallet",
  components: {
    BtnLarge
  },
  computed: {
    ...mapGetters(["user", "settings"])
  },
  methods: {
    createWallet() {
      const mnemonic = bip39.generateMnemonic();
      const wallet = createWalletFromMnemonic(mnemonic); // BIP39 mnemonic string
      this.$store.dispatch("settings/set", {
        mnemonic: mnemonic,
        wallet: {
          address: wallet.address,
          privateKey: Firebase.firestore.Blob.fromUint8Array(wallet.privateKey),
          publicKey: Firebase.firestore.Blob.fromUint8Array(wallet.publicKey)
        }
      });
    },
    sendTx() {
      console.log("sending transaction");
    }
  },
  mounted() {}
};
</script>

<style scoped lang="stylus"></style>
