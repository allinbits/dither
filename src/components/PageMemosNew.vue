<template lang="pug">
.page-memos-new
  page-header(page-title="New Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="send" @click.native="publishMemo")
  section-default
    form(v-if="settings && settings.data && settings.data.wallet" @submit.prevent.default="publishMemo")
      textarea(v-model="memoBody" placeholder="Write your memo here...")
      .characters-remaining Characters remaining: {{ charactersRemaining }}
      input(type="submit" value="Publish")
    template(v-else)
      | You can't send memos without an ATOM balance.
      router-link(:to="{ name: 'profile' }") Create a wallet
  app-footer
</template>

<script>
import { signTx, createBroadcastTx } from "@tendermint/sig";

import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import PageHeader from "./PageHeader";
import BtnIcon from "./BtnIcon";
import BtnLarge from "./BtnLarge";
import CardWip from "./CardWip";
import SectionDefault from "./SectionDefault";
export default {
  name: "page-settings",
  components: {
    AppFooter,
    BtnIcon,
    BtnLarge,
    CardWip,
    PageHeader,
    SectionDefault
  },
  computed: {
    charactersRemaining() {
      return 140 - this.memoBody.length;
    },
    ...mapGetters(["settings", "blockchain"])
  },
  data: () => ({
    memoBody: ""
  }),
  methods: {
    async publishMemo() {
      let walletData = this.settings.data.wallet;
      let from_address = walletData.address;
      let to_address = this.blockchain.to_address;

      let tx = {
        fee: {
          amount: [{ amount: "0", denom: "" }],
          gas: "30000"
        },
        memo: this.memoBody,
        msg: [
          {
            type: "cosmos-sdk/MsgSend",
            value: {
              from_address: from_address,
              to_address: to_address,
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
        `${this.blockchain.lcd}/auth/accounts/${from_address}`
      );
      let accountJson = await account.json();
      console.log("account info", accountJson);
      let signMeta = {
        account_number: accountJson.value.account_number,
        chain_id: this.blockchain.chainId,
        sequence: accountJson.value.sequence
      };

      let wallet = {
        address: from_address,
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
  }
};
</script>

<style scoped lang="stylus">
textarea
  width 100%
  border 1px solid var(--txt)

.characters-remaining
  font-size 0.75rem
  margin-bottom 1rem
  color var(--dim)

input[type=submit]
  border 1px solid var(--bc)
  line-height 2rem
  padding 0 1rem
  display block
  border none
</style>
