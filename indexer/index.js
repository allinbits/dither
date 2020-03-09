const isJson = require('is-json')

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
    console.log(event.block.header.height);
    state.block = event.block;
    getTxs(event.block.header.height);
  }
};

async function getTxs(height) {
  let url = `${state.lcd}/txs?tx.height=${height - 1}`;
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

      // enforce recipient is Dither
      let msgRecipient = tx.tx.value.msg[0].value.to_address

      // enforce minimum cost of transaction
      let msgCost = tx.tx.value.msg[0].value.amount[0].amount

      if (msgRecipient === "cosmos1lfq5rmxmlp8eean0cvr5lk49zglcm5aqyz7mgq"
          && msgCost === "2000") {
        console.log("valid memo", tx);
        writeToFirebase(tx);
      } else {
        console.log('msg cost too low || recipient not Dither', msgCost)
      }
    }
  });
}

const increment = admin.firestore.FieldValue.increment(1);

function writeToFirebase(tx) {
  let txBody = {
    height: parseInt(tx.height),
    timestamp: tx.timestamp,
    address: getSender(tx),
    tx: tx,
    comments: 0,
    reposts: 0,
    likes: 0
  };
  let parsedMemo = destructureMemo(tx.tx.value.memo);
  txBody = { ...txBody, ...parsedMemo };

  // create a memo
  db.collection("memos")
    .doc(tx.txhash)
    .set(txBody);

  // increment memos count by one
  db.collection("accounts")
    .doc(txBody.address)
    .set({ memos: increment }, { merge: true });

  if (parsedMemo.type === "comment") {
    db.collection("memos")
      .doc(parsedMemo.parent)
      .set({ comments: increment }, { merge: true });
  }
  if (parsedMemo.type === "repost") {
    db.collection("memos")
      .doc(parsedMemo.parent)
      .set({ reposts: increment }, { merge: true });
  }
  if (parsedMemo.type === "like") {
    db.collection("memos")
      .doc(parsedMemo.parent)
      .set({ likes: increment }, { merge: true });
  }
  if (parsedMemo.type === "follow") {
    console.log(txBody.address, 'follows', parsedMemo.parent)
    db.collection("accounts").doc(txBody.address).update({
      following: admin.firestore.FieldValue.arrayUnion(parsedMemo.parent)
    })
    db.collection("accounts").doc(parsedMemo.parent).update({
      following: admin.firestore.FieldValue.arrayUnion(txBody.address)
    })
  }
  if (parsedMemo.type === "unfollow") {
    console.log(txBody.address, 'unfollows', parsedMemo.parent)
    db.collection("accounts").doc(txBody.address).update({
      following: admin.firestore.FieldValue.arrayRemove(parsedMemo.parent)
    })
    db.collection("accounts").doc(parsedMemo.parent).update({
      followers: admin.firestore.FieldValue.arrayUnion(txBody.address)
    })
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
    type: memo.type
  }
  if (memo.parent) {
    data.parent = memo.parent
  }
  return data
}
