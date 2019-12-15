<template lang="pug">
form.form-memo(@submit.prevent.default="sendMemo")
  textarea#memo-body(v-model="memo" placeholder="What's on your mind?")
  .field-note Bytes left: {{ bytesLeft }}
  .field-note.field-note--error(v-if="formHasError") {{ formErrorMsg }}
  dc-btn(type="submit") Publish
</template>

<script>
import { signTx, createBroadcastTx } from "@tendermint/sig";
import { byteLength } from "byte-length";

import { mapGetters } from "vuex";
import DcBtn from "./DcBtn";
export default {
  name: "form-memo",
  components: {
    DcBtn
  },
  computed: {
    ...mapGetters(["settings", "blockchain", "queuedMemos"]),
    bytesLeft() {
      return 512 - byteLength(this.command) - byteLength(this.memo);
    },
    command() {
      switch (this.type) {
        case "comment":
          return `/c ${this.parentAddress} `;
          break;
        case "quote":
          return `/q ${this.parentAddress} `;
          break;
        case "repost":
          return `/r ${this.parentAddress} `;
          break;
        default:
          return "/p ";
      }
    },
    fromAddress() {
      return this.settings.data.wallet.address;
    },
    toAddress() {
      return this.blockchain.toAddress;
    },
    tx() {
      return {
        fee: {
          amount: [{ amount: "0", denom: "" }],
          gas: this.blockchain.defaultGas
        },
        memo: "",
        msg: [
          {
            type: "cosmos-sdk/MsgSend",
            value: {
              from_address: this.fromAddress,
              to_address: this.toAddress,
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
    }
  },
  data: () => ({
    memo: "",
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
    },
    async broadcastTx() {
      let walletData = this.settings.data.wallet;

      // set up the account details
      let account = await fetch(
        `${this.blockchain.lcd}/auth/accounts/${this.fromAddress}`
      );
      let accountJson = await account.json();
      // console.log("account info", accountJson.result);

      let tx = this.tx;
      tx.memo = this.command + this.memo;

      // set the sequence to be the current account sequence plus any queued memos
      let accountSequence = accountJson.result.value.sequence;
      let queuedMemosLength = Object.keys(this.queuedMemos).length;
      let currentSequence =
        parseInt(accountSequence) + parseInt(queuedMemosLength);
      currentSequence = currentSequence.toString();
      // console.log("queuedMemosLength", queuedMemosLength);
      // console.log("accountSequence", accountSequence);
      // console.log("currentSequence", currentSequence);

      let signMeta = {
        account_number: accountJson.result.value.account_number,
        chain_id: this.blockchain.chainId,

        sequence: currentSequence
      };

      let wallet = {
        address: this.fromAddress,
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
        address: this.fromAddress,
        height: 0,
        memo: this.tx.memo,
        timestamp: new Date().toISOString(),
        response: txResponseJson,
        tx: txBroadcast
      };
      this.$store.commit("addQueuedMemo", queuedMemo);
      this.$router.push({ name: "home" });
    }
  },
  mounted() {
    this.$el.querySelector("#memo-body").focus();
  },
  props: ["type", "parent"]
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
