import Vue from "vue";
import Vuex from "vuex";
import VuexEasyFirestore from "vuex-easy-firestore";
Vue.use(Vuex);
import router from "../router/index.js";

// import firebase
import { Firebase, initFirebase } from "./firebase.js";

// import vuex-firestore modules
import accounts from "./modules/accounts.js";
import blockchains from "./modules/blockchains.js";
import memos from "./modules/memos.js";
import settings from "./modules/settings.js";
import defaultFollowing from "./defaultFollowing.json";

// connect vuex-firestore modules to firestore
const easyFirestore = VuexEasyFirestore(
  [accounts, blockchains, memos, settings],
  {
    logging: true,
    FirebaseDependency: Firebase
  }
);

// import channels
import channels from "../../../channels.json";

const storeData = {
  plugins: [easyFirestore],
  getters: {
    accounts: state => {
      return state.accounts.data;
    },
    blockchain: state => {
      return state.blockchain;
    },
    blockchains: state => {
      return state.blockchains.data;
    },
    chainId: state => {
      return state.blockchain.chainId;
    },
    channels: state => {
      return state.channels;
    },
    defaultAccounts: state => {
      return state.defaultAccounts.data;
    },
    following: state => {
      return state.following;
    },
    memos: state => {
      return state.memos.data;
    },
    settings: state => {
      return state.settings;
    },
    queuedMemos: state => {
      return state.queuedMemos;
    },
    queuedSequence: state => {
      return state.queuedSequence;
    },
    user: state => {
      return state.user;
    },
    userSignedIn: state => {
      return state.userSignedIn;
    }
  },
  state: {
    blockchain: {
      chainId: "cosmoshub-3",
      lcd: "https://lcd.nylira.net",
      toAddress: "cosmos1lfq5rmxmlp8eean0cvr5lk49zglcm5aqyz7mgq",
      defaultGas: "100000",
      height: 0,
      queuedSequence: 0,
      // load the last x days of memos (at 7s per block)
      blockRange: (1 * 24 * 60 * 60) / 7
    },
    channels: channels,
    userSignedIn: false,
    user: {
      displayName: "Loading",
      providerData: [
        {
          photoURL: "Loading",
          displayName: "Loading",
          providerId: "Loading"
        }
      ]
    },
    following: [],
    queuedMemos: {},
    queuedTxSends: {}
  },
  actions: {
    addToMemoQueue({ commit }, memo) {
      commit("addQueuedMemo", memo);
      commit("incrementQueuedSequence");
      // console.log("add to queue:", state.queuedMemos[memo.id]);
    },
    rmFromMemoQueue({ commit, state }, id) {
      if (state.queuedMemos[id]) {
        // console.log("rm from queue:", state.queuedMemos[id]);
        commit("rmQueuedMemo", id);
        commit("decrementQueuedSequence");
      }
    },
    authenticate({ commit }) {
      return new Promise((resolve, reject) => {
        Firebase.auth().onAuthStateChanged(user => {
          if (user) {
            commit("signInUser", user)
            resolve(user)
          } else {
            reject(false)
          }
        })
      })
    },
    fetchSettings({ dispatch }) {
      return new Promise((resolve, reject) => {
        dispatch("authenticate").then(() => {
          dispatch("settings/fetchAndAdd").then(settings => {
            resolve(settings)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },
    fetchFollowingList({ dispatch }) {
      return new Promise((resolve) => {
        dispatch("fetchSettings").then(settings => {
          const address = settings.wallet.address;
          Firebase.firestore().collection("accounts").doc(address).get().then(account => {
            resolve(account.data().following)
          })
        }).catch(() => {
          resolve(defaultFollowing)
        })
      })
    },
    fetchTimeline({ dispatch }) {
      dispatch("fetchFollowingList").then(following => {
        dispatch("memos/fetchAndAdd", {
          limit: 50,
          orderBy: ["timestamp", "desc"],
          where: [
            ["address", "in", following],
            ["type", "==", "post"]
          ]
        });
      })
    }
  },
  mutations: {
    setHeight(state, height) {
      if (height > state.blockchain.height) {
        state.blockchain.height = height;
        // console.log("set blockchain height to", state.blockchain.height);
      }
    },
    setFollowing(state, following) {
      state.following = following;
    },
    addFollow(state, address) {
      state.following.push(address);
    },
    rmFollow(state, address) {
      state.following = state.following.filter(
        followingAddress => followingAddress !== address
      );
    },
    addQueuedMemo(state, memo) {
      Vue.set(state.queuedMemos, memo.id, memo);
    },
    rmQueuedMemo(state, id) {
      Vue.delete(state.queuedMemos, id);
    },
    addQueuedTxSends(state, txSend) {
      Vue.set(state.queuedTxSends, txSend.id, txSend);
      console.log("adding to queue:", state.queuedTxSends[txSend.id]);
    },
    incrementQueuedSequence(state) {
      state.blockchain.queuedSequence += 1;
      // console.log("queuedSequence + 1", state.blockchain.queuedSequence);
    },
    decrementQueuedSequence(state) {
      state.blockchain.queuedSequence -= 1;
      // console.log("queuedSequence - 1", state.blockchain.queuedSequence);
    },
    signInUser(state, user) {
      state.user = user;
      state.userSignedIn = true;
    },
    signOutUser(state) {
      Firebase.auth().signOut();
      state.user = {};
      state.userSignedIn = false;
      router.push({
        name: "login"
      });
    }
  }
};

// init Vuex
const store = new Vuex.Store(storeData);

// init Firebase
initFirebase().catch(error => {
  console.log("there was a firebase error", error);
  // take user to a page stating an error occurred
  // (might be a connection error, or the app is open in another tab)
});

export default store;
