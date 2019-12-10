<template lang="pug">
.section-wallet
  template(v-if="settings && settings.data && settings.data.wallet")
    section-default
      | {{ settings.data.wallet.address }}
      btn-large(@click.native="sendTx") Send tx
      btn-large(@click.native="deleteWallet") Delete wallet
  template(v-else)
    section-default
      btn-large(@click.native="createWallet") Create wallet
</template>

<script>
import * as bip39 from "bip39";
import {
  createWalletFromMnemonic,
  signTx,
  createBroadcastTx
} from "@tendermint/sig";
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
    },
    async sendTx() {
      let walletData = this.settings.data.wallet;
      let sender = walletData.address;
      let receiver = "cosmos1lfq5rmxmlp8eean0cvr5lk49zglcm5aqyz7mgq";

      let tx = {
        fee: {
          amount: [{ amount: "0", denom: "" }],
          gas: "30000"
        },
        memo: "This is a message from DepthChat.",
        msg: [
          {
            type: "cosmos-sdk/MsgSend",
            value: {
              from_address: sender,
              to_address: receiver,
              amount: [
                {
                  denom: "uatom",
                  amount: "1"
                }
              ]
            }
          }
        ]
      };

      // set up the account details
      let account = await fetch(
        `${this.blockchain.lcd}/auth/accounts/${sender}`
      );
      let accountJson = await account.json();
      console.log("account info", accountJson);
      let signMeta = {
        account_number: accountJson.value.account_number,
        chain_id: this.blockchain.chainId,
        sequence: accountJson.value.sequence
      };

      let wallet = {
        address: sender,
        privateKey: Uint8Array.from(walletData.privateKey),
        publicKey: Uint8Array.from(walletData.publicKey)
      };

      // prepare the transaction for sending
      const txSigned = signTx(tx, signMeta, wallet);
      const txBroadcast = createBroadcastTx(txSigned, "sync");

      // send tx and await results
      let txResponse = await fetch(`${this.blockchain.lcd}/txs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(txBroadcast)
      });
      let txResponseJson = await txResponse.json();
      console.log(txResponseJson);
    }
  },
  mounted() {}
};
</script>

<style scoped lang="stylus"></style>
