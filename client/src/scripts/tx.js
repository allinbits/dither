import { signTx, createBroadcastTx } from "@tendermint/sig";
import store from "../store/index.js";
import h from "./helpers";

function defaultTx(defaultGas, fromAddr, memo, toAddr, amount) {
  return {
    fee: {
      amount: [{ amount: "0", denom: "" }],
      gas: defaultGas
    },
    memo: memo,
    msg: [
      {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: fromAddr,
          to_address: toAddr,
          amount: [
            {
              denom: "uatom",
              amount: amount
            }
          ]
        }
      }
    ]
  };
}

async function sendTx(fromAddr, type, parentAddr, memo, toAddr, amount) {
  let txMemo, txToAddr, txAmount;
  let walletData = store.state.settings.data.wallet;

  // set up the account details
  let account = await fetch(
    `${store.state.blockchain.lcd}/auth/accounts/${fromAddr}`
  );
  let accountJson = await account.json();
  // console.log("account info", accountJson.result);

  if (type === "send") {
    txMemo = memo;
    txToAddr = toAddr;
    txAmount = amount;
  } else {
    txMemo = h.getMemoPrefix(type, parentAddr) + memo;
    txToAddr = store.state.blockchain.toAddress;
    txAmount = "1";
  }

  let tx = defaultTx(
    store.state.blockchain.defaultGas,
    fromAddr,
    txMemo,
    txToAddr,
    txAmount
  );
  console.log("tx", tx);

  // set the sequence to be the current account sequence plus any queued memos
  let accountSequence = accountJson.result.value.sequence;
  let queuedMemosLength = Object.keys(store.state.queuedMemos).length;
  let currentSequence = parseInt(accountSequence) + parseInt(queuedMemosLength);
  currentSequence = currentSequence.toString();
  // console.log("queuedMemosLength", queuedMemosLength);
  // console.log("accountSequence", accountSequence);
  // console.log("currentSequence", currentSequence);

  let signMeta = {
    account_number: accountJson.result.value.account_number,
    chain_id: store.state.blockchain.chainId,

    sequence: currentSequence
  };

  let wallet = {
    address: fromAddr,
    privateKey: Uint8Array.from(walletData.privateKey),
    publicKey: Uint8Array.from(walletData.publicKey)
  };

  // prepare the transaction for sending
  const txSigned = signTx(tx, signMeta, wallet);
  const txBroadcast = createBroadcastTx(txSigned, "sync");

  // send tx and await results
  let txResponse = await fetch(`${store.state.blockchain.lcd}/txs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(txBroadcast)
  });
  let txResponseJson = await txResponse.json();

  let queuedMemo = {
    id: txResponseJson.txhash,
    address: fromAddr,
    height: 0,
    memo: tx.memo,
    parent: parentAddr,
    response: txResponseJson,
    timestamp: new Date().toISOString(),
    tx: txBroadcast,
    type: type,
    reposts: 0,
    likes: 0,
    comments: 0
  };
  return queuedMemo;
}

export default { sendTx };
