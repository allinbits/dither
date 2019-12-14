<template lang="pug">
.page-memos-new
  app-header(page-title="New Memo")
    btn-icon(slot="btn-left" type="link" :to="{ name: 'home' }" icon="x")
    btn-icon(slot="btn-right" icon="send" @click.native="broadcastTx")
  section-default(v-if="settings && settings.data && settings.data.wallet")
    form(@submit.prevent.default="sendMemo")
      textarea#memo-body(v-model="memoBody" placeholder="Write your memo here...")
      .field-note Bytes left: {{ bytesLeft }}
      .field-note.field-note--error(v-if="formHasError") {{ formErrorMsg }}
      dc-btn(type="submit") Publish
  template(v-else)
    | You can't send memos without an ATOM balance.
    router-link(:to="{ name: 'profile' }") Create a wallet
  app-footer
</template>

<script>
import { signTx, createBroadcastTx } from "@tendermint/sig";
import { byteLength } from "byte-length";

import { mapGetters } from "vuex";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import DcBtn from "./DcBtn";
import BtnIcon from "./BtnIcon";
import BtnLarge from "./BtnLarge";
import CardWip from "./CardWip";
import SectionDefault from "./SectionDefault";
export default {
  name: "page-settings",
  components: {
    AppFooter,
    DcBtn,
    BtnIcon,
    BtnLarge,
    CardWip,
    AppHeader,
    SectionDefault
  },
  computed: {
    bytesLeft() {
      return 512 - byteLength(this.memoBody);
    },
    ...mapGetters(["settings", "blockchain"])
  },
  data: () => ({
    memoBody: "",
    formHasError: false,
    formErrorMsg: ""
  }),
  methods: {
    async sendMemo() {
      if (this.bytesLeft === 512) {
        this.formHasError = true;
        this.formErrorMsg = "Memo needs to have some text";
        return;
      } else if (this.bytesLeft < 0) {
        this.formHasError = true;
        this.formErrorMsg = "Memo is too long";
        return;
      } else {
        this.formHasError = false;
        this.formErrorMessage = "";
      }
      this.broadcastTx();
      this.$router.push({ name: "home" });
    },
    async broadcastTx() {
      let walletData = this.settings.data.wallet;
      let fromAddress = walletData.address;
      let toAddress = this.blockchain.toAddress;

      let tx = {
        fee: {
          amount: [{ amount: "0", denom: "" }],
          gas: this.blockchain.defaultGas
        },
        memo: this.memoBody,
        msg: [
          {
            type: "cosmos-sdk/MsgSend",
            value: {
              from_address: fromAddress,
              to_address: toAddress,
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
        `${this.blockchain.lcd}/auth/accounts/${fromAddress}`
      );
      let accountJson = await account.json();
      // console.log("account info", accountJson.result);

      let signMeta = {
        account_number: accountJson.result.value.account_number,
        chain_id: this.blockchain.chainId,
        sequence: accountJson.result.value.sequence
      };

      let wallet = {
        address: fromAddress,
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

      let queuedMemo = {
        id: txResponseJson.txhash,
        address: fromAddress,
        height: 0,
        memo: this.memoBody,
        timestamp: new Date().toISOString(),
        response: txResponseJson,
        tx: txBroadcast
      };
      this.$store.commit("addQueuedMemo", queuedMemo);
    }
  },
  mounted() {
    this.$el.querySelector("#memo-body").focus();
  }
};
</script>

<style scoped lang="stylus">
form
  width 100%

textarea
  display block
  border 1px solid var(--bc-input)
  height 8rem
  margin-bottom 0.5rem
  box-sizing border-box
  width 100%
  padding 0.5rem

.field-note
  font-size 0.75rem
  margin-bottom 0.5rem
  color var(--dim)
.field-note--error
  color var(--danger)
</style>
