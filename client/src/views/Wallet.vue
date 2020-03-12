<template lang="pug">
.page-wallet
  app-header(page-title="Dither Wallet")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-left" type="link" :to="{ name: 'settings' }" icon="settings")
    template(v-if="userSignedIn")
      btn-icon(slot="btn-right" type="link" :to="{ name: 'memos-new' }" icon="edit")
    template(v-else)
      btn-icon(slot="btn-right" type="link" :to="{ name: 'login' }" icon="log-in")

  section-default(v-if="settings && settings.data && settings.data.wallet")
    div(slot="section-title") Your wallet

    template(v-if="tokens")
      p You currently have enough ATOM to interact with Dither.
    template(v-else)
      p You need ATOM to interact with Dither, but you don't have any. Interaction include creating messages, liking messages, and following accounts. You should send ATOM (0.1 is enough) to your address below.

    p
      .break-address This is your wallet address:
      a.break-address(:href="`https://www.mintscan.io/account/${settings.data.wallet.address}`" rel="noopener noreferrer" target="_blank") {{ settings.data.wallet.address }}

    p You have #[strong {{ tokens }} ATOM] on block \#{{ blockchains["cosmoshub-3"].header.height }}

    p(v-if="devMode")
      a.delete-wallet(@click="deleteWallet") Delete wallet

  section-default(v-else)
    div(slot="section-title") Create a wallet
    p Dither is an open source, uncensorable chat app that runs on the Cosmos Hub. To post messages, you need to have ATOM tokens. Create an ATOM wallet now:
    dc-btn(@click.native="createWallet") Create new wallet

  section-default(v-if="settings && settings.data && settings.data.wallet")
    div(slot="section-title") Send tokens
    form-send-tokens(:balance="tokens")

  app-footer
</template>

<script>
import * as bip39 from "bip39";
import { createWalletFromMnemonic } from "@tendermint/sig";
import { Firebase } from "../store/firebase.js";

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
  mounted() {
    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user signed in");
      } else {
        this.$router.push("/login");
      }
    });
  },
  watch: {
    blockchains: {
      handler: async function() {
        let response = await fetch(
          `${this.blockchain.lcd}/bank/balances/${this.settings.data.wallet.address}`
        );
        let balance = await response.json();
        let amount = balance.result[0].amount;
        // console.log("new balance:", amount, "uatom");
        this.$store.dispatch("settings/set", { uatom: amount });
      },
      deep: true
    }
  }
};
</script>
