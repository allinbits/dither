import { signTx, createBroadcastTx } from "@tendermint/sig";
import store from "../store/index.js";

function defaultTx(from, to, amount, memo, gas) {
  return {
    fee: {
      amount: [{ amount: "0", denom: "" }],
      gas: gas
    },
    memo: memo,
    msg: [
      {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: from,
          to_address: to,
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

//params: {
//  from: "cosmos1addr",
//  to: "cosmos1addr",
//  amount: "0.01",
//  memo: "{ type: 'like', parent: 'cosmos1addr' }"
//}
async function sendTx(params) {
  // get account information
  let account = await fetch(
    `${store.state.blockchain.lcd}/auth/accounts/${params.from}`
  );
  let accountJson = await account.json();
  // console.log("account info", accountJson.result);

  // if this tx doesn't send tokens, send one uatom to this address
  if (!params.amount) {
    params.to = store.state.blockchain.toAddress;
    params.amount = "2000";
  }

  let tx = defaultTx(
    params.from,
    params.to,
    params.amount,
    params.memo,
    store.state.blockchain.defaultGas
  );

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
    address: params.from,
    privateKey: Uint8Array.from(store.state.settings.data.wallet.privateKey),
    publicKey: Uint8Array.from(store.state.settings.data.wallet.publicKey)
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

  // console.log("tx params", params);

  if (params.amount === "2000") {
    let queuedMemo = {
      id: txResponseJson.txhash,
      address: params.from,
      height: 0,
      memo: JSON.parse(tx.memo),
      parent: JSON.parse(params.memo).parent,
      response: txResponseJson,
      timestamp: new Date().toISOString(),
      tx: txBroadcast,
      type: JSON.parse(params.memo).type,
      reposts: 0,
      likes: 0,
      comments: 0
    };
    return queuedMemo;
  } else {
    let queuedTxSend = {
      id: txResponseJson.txhash,
      address: params.from,
      height: 0,
      memo: tx.memo,
      response: txResponseJson,
      timestamp: new Date().toISOString(),
      tx: txBroadcast
    };
    return queuedTxSend;
  }
}

export default { sendTx };
