import Vue from "vue";
import Vuex from "vuex";
import VuexEasyFirestore from "vuex-easy-firestore";
Vue.use(Vuex);
import router from "../router/index.js";

// import firebase
import { Firebase, initFirebase } from "./firebase.js";
// import firebase modules
import memos from "./modules/memos.js";
import settings from "./modules/settings.js";

// do the magic
const easyFirestore = VuexEasyFirestore([memos, settings], {
  logging: true,
  FirebaseDependency: Firebase
});

// include as PLUGIN in your vuex store
// please note that "myModule" should ONLY be passed via the plugin
const storeData = {
  plugins: [easyFirestore],
  getters: {
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
        name: "signin"
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
