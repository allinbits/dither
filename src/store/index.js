import Vue from "vue";
import Vuex from "vuex";
import VuexEasyFirestore from "vuex-easy-firestore";
Vue.use(Vuex);
import router from "../router/index.js";

// import firebase
import { Firebase, initFirebase } from "./firebase.js";

// import vuex-firestore modules
import memos from "./modules/memos.js";
import accounts from "./modules/accounts.js";
import settings from "./modules/settings.js";

// connect vuex-firestore modules to firestore
const easyFirestore = VuexEasyFirestore([memos, settings], {
  logging: true,
  FirebaseDependency: Firebase
});

const storeData = {
  plugins: [easyFirestore],
  getters: {
    accounts: state => {
      return state.accounts.data;
    },
    blockchain: state => {
      return state.blockchain;
    },
    chainId: state => {
      return state.blockchain.chainId;
    },
    memos: state => {
      return state.memos.data;
    },
    user: state => {
      return state.user;
    },
    userSignedIn: state => {
      return state.userSignedIn;
    },
    settings: state => {
      return state.settings;
    }
  },
  state: {
    blockchain: {
      chainId: "cosmoshub-3",
      lcd: "https://lcd.nylira.net",
      toAddress: "cosmos1lfq5rmxmlp8eean0cvr5lk49zglcm5aqyz7mgq",
      defaultGas: "80000"
    },
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
    }
  },
  mutations: {
    signInUser(state, user) {
      state.user = user;
      state.userSignedIn = true;
    },
    signOutUser(state, user) {
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
  // take user to a page stating an error occurred
  // (might be a connection error, or the app is open in another tab)
});

export default store;
