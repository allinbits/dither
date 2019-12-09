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
import { createWalletFromMnemonic, signTx } from "@tendermint/sig";
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
          gas: "10000"
        },
        memo: "This is a message from DepthChat.",
        msgs: [
          {
            type: "cosmos-sdk/Send",
            value: {
              inputs: [
                {
                  address: sender,
                  coins: [{ amount: "1", denom: "uatom" }]
                }
              ],
              outputs: [
                {
                  address: receiver,
                  coins: [{ amount: "1", denom: "uatom" }]
                }
              ]
            }
          }
        ]
      };
      let signMeta = {
        account_number: "1",
        chain_id: this.blockchain.chainId,
        sequence: "0"
      };
      let wallet = {
        address: sender,
        privateKey: Uint8Array.from(walletData.privateKey),
        publicKey: Uint8Array.from(walletData.publicKey)
      };

      console.log("tx", tx);
      console.log("signMeta", signMeta);
      console.log("wallet", wallet);

      const stdTx = signTx(tx, signMeta, wallet);

      let response = await fetch(this.blockchain.lcd + "/txs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(stdTx)
      });
      let result = await response.json();
      alert(result.message);
    }
  },
  mounted() {}
};
</script>

<style scoped lang="stylus"></style>
