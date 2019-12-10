<template lang="pug">
.section-wallet
  template(v-if="settings && settings.data && settings.data.wallet")
    section-default
      | {{ settings.data.wallet.address }}
      btn-large(@click.native="deleteWallet") Delete wallet
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
    ...mapGetters(["user", "settings", "blockchain"])
  },
  methods: {
    createWallet() {
      const mnemonic = bip39.generateMnemonic();
      const wallet = createWalletFromMnemonic(mnemonic); // BIP39 mnemonic string
      console.log(wallet);
      this.$store.dispatch("settings/set", {
        mnemonic: mnemonic,
        wallet: {
          address: wallet.address,
          privateKey: Array.from(wallet.privateKey),
          publicKey: Array.from(wallet.publicKey)
        }
      });
    },
    deleteWallet() {
      let yes = confirm(
        "WARNING: Are you sure you want to delete this wallet? If you did not backup your 12-word mnemonic, it means that you will permanently lose any stored tokens."
      );
      if (yes) {
        this.$store.dispatch("settings/delete", "mnemonic");
        this.$store.dispatch("settings/delete", "wallet");
      }
    }
  }
};
</script>

<style scoped lang="stylus"></style>
