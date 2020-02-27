<template lang="pug">
.page-wallet
  app-header(page-title="Wallet")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")

  section-default(v-if="settings && settings.data && settings.data.wallet")
    div(slot="section-title") Your wallet
    p(v-if="tokens") You need ATOM tokens to post messages on Dither. You currently have enough!
    p(v-else) You need ATOM tokens to post messages on Dither, but you don't have any! You can get some by messaging #[a(:href="tweetUrl" target="_blank" rel="noopener noreferrer") @VirgoUDV on Twitter].

    p
      .break-address This is your wallet address:
      a.break-address(href="`https://stargazer.certus.one/accounts/${settings.data.wallet.address}`" rel="noopener noreferrer" target="_blank") {{ settings.data.wallet.address }}

    p You have #[strong {{ tokens }} ATOM]

    p(v-if="devMode")
      a.delete-wallet(@click="deleteWallet") Delete wallet

  section-default.wallet-inactive(v-else)
    p Dither is an open source, uncensorable chat app that runs on the Cosmos Hub. To post messages, you need to have ATOM tokens. Create an ATOM wallet now:
    dc-btn(@click.native="createWallet") Create new wallet

  section-default(v-if="settings && settings.data && settings.data.wallet")
    div(slot="section-title") Send tokens
    form
      fieldset
        label To Address
        input(type="text" v-model="sendTo" placeholder="cosmos1address")
      fieldset
        label ATOM Amount
        input(type="number" v-model="sendAmount" placeholder="Number of ATOM")
      fieldset
        input(type="submit" value="Send ATOM")

  app-footer
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
// import tx from "../scripts/tx";

import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
import DcBtn from "@/components/DcBtn";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-wallet",
  components: {
    AppFooter,
    AppHeader,
    BtnIcon,
    DcBtn,
    SectionDefault
  },
  computed: {
    ...mapGetters(["user", "userSignedIn", "settings", "blockchain"]),
    devMode() {
      return process.env.NODE_ENV === "development";
    },
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
  data: () => ({
    sendTo: "",
    sendAmount: 0
  }),
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
    },
    sendTokens() {}
  },
  watch: {
    async "settings.data.wallet"() {
      let response = await fetch(
        `${this.blockchain.lcd}/bank/balances/${this.settings.data.wallet.address}`
      );
      let balance = await response.json();
      let amount = balance.result[0].amount;
      // console.log("balance amount", amount);
      this.$store.dispatch("settings/set", { uatom: amount });
    }
  }
};
</script>

<style scoped lang="stylus">
a.delete-wallet
  color #f00

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
