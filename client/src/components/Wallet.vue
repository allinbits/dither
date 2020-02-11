<template lang="pug">
.wallet
  section-default.wallet-active(v-if="settings && settings.data && settings.data.wallet")
    p(v-if="tokens") You need ATOM tokens to post messages on Dither. You currently have enough!
    p(v-else) You need ATOM tokens to post messages on Dither, but you don't have any! You can get some by messaging #[a(:href="tweetUrl" target="_blank" rel="noopener noreferrer") @VirgoUDV on Twitter].

    p
      .break-address This is your wallet address:
      .break-address {{ settings.data.wallet.address }}

    p You have {{ tokens }} ATOM

    p: a.delete-wallet(@click="deleteWallet") Delete wallet

  section-default.wallet-inactive(v-else)
    p Dither is an open source, uncensorable chat app that runs on the Cosmos Hub. To post messages, you need to have ATOM tokens. Create an ATOM wallet now:
    dc-btn(@click.native="createWallet") Create new wallet
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
import { Firebase } from "../store/firebase.js";

import { mapGetters } from "vuex";
import DcBtn from "./DcBtn";
import BtnLarge from "./BtnLarge";
import SectionDefault from "./SectionDefault";
export default {
  name: "wallet",
  components: {
    DcBtn,
    SectionDefault
  },
  computed: {
    ...mapGetters(["user", "settings", "blockchain"]),
    tokens() {
      let atoms = this.settings.data.uatom;
      if (atoms) {
        return atoms / 1000000;
      } else {
        return 0;
      }
    },
    tweetUrl() {
      if (
        this.settings &&
        this.settings.data &&
        this.settings.data.wallet &&
        this.settings.data.wallet.address
      ) {
        let address = this.settings.data.wallet.address;
        return (
          "https://twitter.com/intent/tweet?via=VirgoUDV&text=I%20want%20to%20try%20out%20https%3A//dither.chat.%20Please%20send%20ATOM%20to%20" +
          address +
          "&hashtags=dither"
        );
      } else {
        return "https://twitter.com/VirgoUDV";
      }
    }
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
  },
  watch: {
    async "settings.data.wallet"() {
      let response = await fetch(
        `${this.blockchain.lcd}/bank/balances/${this.settings.data.wallet.address}`
      );
      let balance = await response.json();
      let amount = balance.result[0].amount;
      console.log("balance amount", amount);
      this.$store.dispatch("settings/set", { uatom: amount });
    }
  }
};
</script>

<style scoped lang="stylus">
p
  margin-bottom 1.5rem
a.delete-wallet
  color #f00
</style>
