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
  txs.txs.forEach(tx => {
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
  let txId = tx.txhash
  let txData = {
    height: parseInt(tx.height),
    timestamp: tx.timestamp,
    address: getSender(tx),
    tx: tx,
    comments: 0,
    reposts: 0
  };
  txData = { ...txData, ...destructureMemo(tx.tx.value.memo) };

  // create a memo
  db.collection("memos")
    .doc(txId)
    .set(txData);

  // increment memos count by one
  db.collection("accounts")
    .doc(txData.address)
    .set({ memos: increment }, { merge: true });

  if (txData.type === "comment") {
    db.collection("memos")
      .doc(txData.parent)
      .set({ comments: increment }, { merge: true });
  }

  if (txData.type === "repost") {
    // add repost to memo
    db.collection("memos").doc(txData.parent)
      .collection("reposts").doc(txId).set(txData)

    // increment repost count
    db.collection("memos").doc(txData.parent)
      .set({ reposts: increment }, { merge: true });

    // add like to account
    db.collection("accounts").doc(txData.address)
      .collection("reposts").doc(txId).set(txData)

    notifyAccount(txId, txData)
  }

  if (txData.type === "like") {
    // add like to memo
    db.collection("memos").doc(txData.parent)
      .collection("likes").doc(txId).set(txData)

    // increment like count
    db.collection("memos").doc(txData.parent)
      .set({ likes: increment }, { merge: true });

    // add like to account
    db.collection("accounts").doc(txData.address)
      .collection("likes").doc(txId).set(txData)

    notifyAccount(txId, txData)
  }

  if (txData.type === "follow") {
    // add followed account to user account
    db.collection("accounts").doc(txData.address).update({
      following: admin.firestore.FieldValue.arrayUnion(txData.parent)
    })

    // add user account to followed's account
    db.collection("accounts").doc(txData.parent).update({
      followers: admin.firestore.FieldValue.arrayUnion(txData.address)
    })

    notifyAccountFollow(txId, txData)
  }

  if (txData.type === "unfollow") {
    console.log(txData.address, 'unfollows', txData.parent)
    db.collection("accounts").doc(txData.address).update({
      following: admin.firestore.FieldValue.arrayRemove(txData.parent)
    })
    db.collection("accounts").doc(txData.parent).update({
      followers: admin.firestore.FieldValue.arrayRemove(txData.address)
    })
  }

  if (txData.type === "set-displayname") {
    db.collection("accounts")
      .doc(txData.address)
      .set({ displayname: txData.memo.body }, { merge: true });
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

// notify account about memo interaction
function notifyAccount(txId, txData) {
  let parentMemoRef = db.collection("memos").doc(txData.parent)
  parentMemoRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        let parentMemo = doc.data()
        let txDataNotification = JSON.parse(JSON.stringify(txData))
        txDataNotification.read = false
        db.collection("accounts").doc(parentMemo.address)
          .collection("notifications").doc(txId).set(txDataNotification)
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
}

// notify account about follow
function notifyAccountFollow(txId, txData) {
  let txDataNotification = JSON.parse(JSON.stringify(txData))
  txDataNotification.read = false
  db.collection("accounts").doc(txData.parent)
    .collection("notifications").doc(txId).set(txDataNotification)
}
