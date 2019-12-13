<template lang="pug">
.wallet
  template(v-if="settings && settings.data && settings.data.wallet")
    dl
      dt Address:
      dd.break-address {{ settings.data.wallet.address }}
      dd.dim
        router-link(
          :to="{ name: 'account', params: { address: settings.data.wallet.address } }")
          | public profile
      // dd.dim
        a(:href="`https://cosmos.bigdipper.live/account/${settings.data.wallet.address}`" target="_blank" rel="noreferrer noopener") details
      dt Tokens:
      dd {{ settings.data.uatom / 1000000 }} ATOM
    a(@click="deleteWallet") Delete wallet
  template(v-else)
    a(@click="createWallet") Create wallet
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
import { Firebase } from "../store/firebase.js";

import { mapGetters } from "vuex";
import BtnLarge from "./BtnLarge";
import SectionDefault from "./SectionDefault";
export default {
  name: "wallet",
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
dd.dim
  color var(--dim)
</style>
