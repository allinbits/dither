const isJson = require('is-json')
const channels = require("../channels.json")

// setup firebase
const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// setup state
const state = {
  lcd: "https://lcd.nylira.net",
  wss: "wss://rpc.nylira.net:443/websocket",
  block: {},
  txs: []
};

// setup websocket
const WebSocket = require("ws");
const ReconnectingWebSocket = require("reconnecting-websocket");
let ws = new ReconnectingWebSocket(state.wss, [], { WebSocket: WebSocket });
const axios = require("axios");

ws.onopen = function() {
  ws.send(
    JSON.stringify({
      jsonrpc: "2.0",
      method: "subscribe",
      id: "1",
      params: ["tm.event = 'NewBlock'"]
    })
  );
};

ws.onmessage = function(msg) {
  let msgData = JSON.parse(msg.data);
  // console.log(msgData);
  // console.log(msgData.result.data);
  if (msgData.result.data && msgData.result.data.value) {
    let event = msgData.result.data.value;
    // console.log(event);
    setBlockchainHeader(event.block.header)
    state.block = event.block;
    getTxs(event.block.header.height);
  }
};

async function getTxs(height) {
  // let url = `${state.lcd}/txs?tx.height=${height - 1}`;
  let url = `${state.lcd}/txs?tx.height=${height}`;
  let transactions = await axios.get(url);
  processTxs(transactions.data);
  return Promise.resolve();
}

function processTxs(txs) {
  txs.txs.map(tx => {
    // console.log('tx')
    // console.log('tx.logs', tx.logs)
    let txLogMsgZero = tx.logs.find(l => l.msg_index == 0);
    if (txLogMsgZero.success && isJson(tx.tx.value.memo)) {

      // enforce recipient is dither's wallet
      let validTxRecipient = tx.tx.value.msg[0].value.to_address === "cosmos1lfq5rmxmlp8eean0cvr5lk49zglcm5aqyz7mgq"

      // enforce minimum cost of transaction
      let validTxCost = tx.tx.value.msg[0].value.amount[0].amount === "200"

      // enforce whitelist for memos posted in channels
      let validTxSender = true
      let sender = getSender(tx)
      let parsedMemo = destructureMemo(tx.tx.value.memo);
      let channelName = parsedMemo.channel
      if (channelName) {
        let channel = channels[channelName]
        // console.log('memo is part of a channel:', channel)
        validTxSender = channel.whitelist.includes(sender)
        // console.log('is the tx sender within the whitelist?', validTxSender)
        // console.log('whitelist', channel.whitelist, 'sender', sender)
      }

      if (validTxRecipient && validTxCost && validTxSender) {
        console.log("valid memo", tx);
        writeTx(tx);
      } else {
        console.log('msg cost too low || recipient not Dither', msgCost)
      }
    }
  });
}

const increment = admin.firestore.FieldValue.increment(1);

function writeTx(tx) {
  let txBody = {
    height: parseInt(tx.height),
    timestamp: tx.timestamp,
    address: getSender(tx),
    tx: tx,
    comments: 0,
    reposts: 0
  };
  txBody = { ...txBody, ...destructureMemo(tx.tx.value.memo) };

  // create a memo
  db.collection("memos")
    .doc(tx.txhash)
    .set(txBody);

  // increment memos count by one
  db.collection("accounts")
    .doc(txBody.address)
    .set({ memos: increment }, { merge: true });

  if (txBody.type === "comment") {
    db.collection("memos")
      .doc(txBody.parent)
      .set({ comments: increment }, { merge: true });
  }

  if (txBody.type === "repost") {
    db.collection("memos")
      .doc(txBody.parent)
      .set({ reposts: increment }, { merge: true });
  }

  if (txBody.type === "like") {
    // add a like to the memo
    db.collection("memos").doc(txBody.parent)
      .collection("likes").doc(tx.txhash).set(txBody)

    // add a like to the user's account
    db.collection("accounts").doc(txBody.address)
      .collection("likes").doc(tx.txhash).set(txBody)

    // notify memo's author that their memo has been liked
    let parentMemoRef = db.collection("memos").doc(txBody.parent)
    parentMemoRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          let parentMemo = doc.data()
          let txBodyNotification = JSON.parse(JSON.stringify(txBody))
          txBodyNotification.read = false
          db.collection("accounts").doc(parentMemo.address)
            .collection("notifications").doc(tx.txhash).set(txBodyNotification)
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  }

  if (txBody.type === "follow") {
    console.log(txBody.address, 'follows', txBody.parent)
    db.collection("accounts").doc(txBody.address).update({
      following: admin.firestore.FieldValue.arrayUnion(txBody.parent)
    })
    db.collection("accounts").doc(txBody.parent).update({
      followers: admin.firestore.FieldValue.arrayUnion(txBody.address)
    })
  }

  if (txBody.type === "unfollow") {
    console.log(txBody.address, 'unfollows', txBody.parent)
    db.collection("accounts").doc(txBody.address).update({
      following: admin.firestore.FieldValue.arrayRemove(txBody.parent)
    })
    db.collection("accounts").doc(txBody.parent).update({
      followers: admin.firestore.FieldValue.arrayRemove(txBody.address)
    })
  }

  if (txBody.type === "set-displayname") {
    db.collection("accounts")
      .doc(txBody.address)
      .set({ displayname: txBody.memo.body }, { merge: true });
  }

}

// helper functions
function getSender(tx) {
  let sender = "Loading...";
  if (tx) {
    let txEventMessage = tx.events.find(e => e.type === "message");
    let txEventMessageAttribute = txEventMessage.attributes.find(
      a => a.key === "sender"
    );
    sender = txEventMessageAttribute.value;
  }
  return sender;
}

function destructureMemo(memoJson) {
  let memo = JSON.parse(memoJson)
  let data = {
    memo: memo,
    type: memo.type,
  }
  if (memo.channel) {
    data.channel = memo.channel
  }
  if (memo.parent) {
    data.parent = memo.parent
  }
  return data
}

function setBlockchainHeader(header) {
  console.log(header.height);
  db.collection("blockchains")
    .doc("cosmoshub-3")
    .set({ header: header }, { merge: true });
}
