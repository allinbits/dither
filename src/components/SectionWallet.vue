<template lang="pug">
.section-wallet
  template(v-if="settings && settings.data && settings.data.wallet")
    section-default
      | {{ settings.data.wallet.address }}
      btn-large(@click.native="sendTx") Send tx
      btn-large(@click.native="createWallet") Delete wallet
  template(v-else)
    section-default
      btn-large(@click.native="createWallet") Create wallet
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
import { Firebase } from "../store/firebase.js";

import { mapGetters } from "vuex";
import BtnLarge from "./BtnLarge";
import SectionDefault from "./SectionDefault";
export default {
  name: "section-wallet",
  components: {
    BtnLarge,
    SectionDefault
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
    deleteWallet() {
      this.$store.dispatch("settings/delete");
    },
    sendTx() {
      console.log("sending transaction");
    }
  },
  mounted() {}
};
</script>

<style scoped lang="stylus"></style>
