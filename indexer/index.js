// setup firebase
const admin = require('firebase-admin');
let serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
let db = admin.firestore();

// setup state
const state = {
  rpc: "https://rpc.nylira.net",
  lcd: "https://lcd.nylira.net",
  wss: "wss://rpc.nylira.net:443",
  block: {},
  txs: []
};

// setup websocket
const axios = require("axios");
const { RpcClient } = require("tendermint");
const client = RpcClient(state.wss);

// subscribe to new blocks
client.subscribe({ query: "tm.event = 'NewBlock'" }, event => {
  console.log(event.block.header.height);
  state.block = event.block;
  getTxs(event.block.header.height);
});

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
    let txLogMsgZero = tx.logs.find(l => l.msg_index == 0)
    if (txLogMsgZero.success && validPrefix(tx)) {
      console.log('valid memo', tx)
      writeToFirebase(tx);
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
    likes: 0,
  };
  let parsedMemo = parseMemo(tx.tx.value.memo)
  txBody = {...txBody, ...parsedMemo}

  db.collection("memos")
    .doc(tx.txhash)
    .set(txBody);
  db.collection("accounts")
    .doc(txBody.address)
    .set({ memos: increment }, { merge: true });
  if (parsedMemo.type === "comment") {
    db.collection("memos")
      .doc(parsedMemo.parent).set({ comments: increment }, { merge: true })
  }
  if (parsedMemo.type === "repost") {
    db.collection("memos")
      .doc(parsedMemo.parent).set({ reposts: increment }, { merge: true })
  }
  if (parsedMemo.type === "like") {
    db.collection("memos")
      .doc(parsedMemo.parent).set({ likes: increment }, { merge: true })
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

function validPrefix(tx) {
  let memoPrefix = tx.tx.value.memo.slice(0, 2)
  let validPrefixes = ["/c", "/l", "/p", "/q", "/r"]
  return validPrefixes.find(p => p === memoPrefix)
}

function getMemoBody(fullMemo) {
  let value = fullMemo.split(' ')
  // remove the slash command
  value.shift()
  // remove cosmos address if it exists
  if (value[0].slice(0,6) === 'cosmos') value.shift()
  return value.join(' ')
}

function parseMemo(fullMemo) {
  let memoType = ""
  let memoParent = ""
  let memoPrefix = fullMemo.slice(0, 2)

  switch (memoPrefix) {
    case "/c":
      memoType = 'comment'
      memoParent = fullMemo.split(' ')[1]
      break;
    case "/l":
      memoType = 'like'
      memoParent = fullMemo.split(' ')[1]
      break;
    case "/q":
      memoType = 'quote'
      memoParent = fullMemo.split(' ')[1]
      break;
    case "/r":
      memoType = 'repost'
      memoParent = fullMemo.split(' ')[1]
      break;
    default:
      memoType = 'post'
  }
  return {
    type: memoType,
    memo: fullMemo,
    parent: memoParent
  }
}
