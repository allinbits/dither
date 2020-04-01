<template lang="pug">
.page-wallet
  app-header(page-title="Dither Wallet")
    template(v-slot:btn-left v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-slot:btn-right v-if="userSignedIn")
      btn-icon(type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-slot:btn-right v-else)
      btn-icon(type="link" :to="{ name: 'login' }" icon="log-in")

  section-default(v-if="settings && settings.wallet")
    div(slot="section-title") Your wallet

    div(v-if="tokens")
      p You currently have enough ATOM to interact with Dither.
    div(v-else)
      p You need ATOM tokens to interact with Dither. You can buy ATOM from #[a(href="https://www.coinbase.com/price/cosmos" rel="noopener noreferrer" target="_blank") Coinbase] or #[a(href="https://www.binance.com/en/trade/ATOM_BTC" rel="noopener noreferrer" target="_blank") Binance]. Once purchased, please send ATOM (0.1 is enough) to the address below. Alternatively, you can #[a(:href="tweetUrl" rel="noopener noreferrer" target="_blank") ask the Dither community] to send you some ATOM.

    p
      .break-address This is your wallet address:
      a.break-address(:href="`https://www.mintscan.io/account/${settings.wallet.address}`" rel="noopener noreferrer" target="_blank") {{ settings.wallet.address }}

    p You have #[strong {{ tokens }} ATOM] on block \#{{ blockchains["cosmoshub-3"].header.height }}

    p(v-if="devMode")
      a.delete-wallet(@click="deleteWallet") Delete wallet

  section-default(v-else)
    div(slot="section-title") Create a wallet
    p Dither is an open source, uncensorable chat app that runs on the Cosmos Hub. To post messages, you need to have ATOM tokens. Create an ATOM wallet now:
    dc-btn(@click.native="createWallet") Create new wallet

  section-default(v-if="settings && settings.wallet")
    div(slot="section-title") Send tokens
    form-send-tokens(:balance="tokens")

  app-footer
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";

import { mapGetters } from "vuex";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";
import BtnIcon from "@/components/BtnIcon";
import DcBtn from "@/components/DcBtn";
import FormSendTokens from "@/components/FormSendTokens";
import SectionDefault from "@/components/SectionDefault";
export default {
  name: "page-wallet",
  metaInfo: { title: "Wallet" },
  components: {
    AppFooter,
    AppHeader,
    BtnIcon,
    DcBtn,
    FormSendTokens,
    SectionDefault
  },
  computed: {
    ...mapGetters([
      "user",
      "userSignedIn",
      "settings",
      "blockchain",
      "blockchains",
      "currentChain"
    ]),
    devMode() {
      return process.env.NODE_ENV === "development";
    },
    tokens() {
      let atoms = this.settings.uatom;
      if (atoms) {
        return atoms / 1000000;
      } else {
        return 0;
      }
    },
    tweetUrl() {
      if (
        this.settings &&
        this.settings.wallet &&
        this.settings.wallet.address
      ) {
        let address = this.settings.wallet.address;
        return (
          "https://twitter.com/intent/tweet?via=VirgoUDV&text=I%20want%20to%20try%20out%20https%3A//dither.chat.%20Please%20send%20ATOM%20to%20" +
          address +
          "&hashtags=ditherchat"
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
  async created() {
    this.$store.dispatch("fetchSettings").catch(() => {
      this.$router.push("/login");
    });
    try {
      await this.$store.dispatch("blockchains/openDBChannel");
    } catch {
      console.log("Blockchains channel had already been opened.");
    }
  },
  watch: {
    blockchains: {
      handler: async function() {
        if (this.settings && this.settings.wallet) {
          const response = await fetch(
            `${this.blockchain.lcd}/bank/balances/${this.settings.wallet.address}`
          );
          const balance = await response.json();
          const amount = balance.result[0].amount;
          // console.log("new balance:", amount, "uatom");
          this.$store.dispatch("settings/set", { uatom: amount });
        }
      },
      deep: true
    }
  }
};
</script>
