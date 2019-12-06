import Vue from "vue";
import Vuex from "vuex";
import VuexEasyFirestore from "vuex-easy-firestore";
Vue.use(Vuex);

// import firebase
import { Firebase, initFirebase } from "./firebase.js";
// import firebase modules
import memos from "./modules/memos.js";

// do the magic
const easyFirestore = VuexEasyFirestore([memos], {
  logging: true,
  FirebaseDependency: Firebase
});

// include as PLUGIN in your vuex store
// please note that "myModule" should ONLY be passed via the plugin
const storeData = {
  plugins: [easyFirestore],
  getters: {
    allMemos: state => {
      return state.memos.data;
    }
  }
  // ... your other store data
};

// init Vuex
const store = new Vuex.Store(storeData);

// init Firebase
initFirebase().catch(error => {
  // take user to a page stating an error occurred
  // (might be a connection error, or the app is open in another tab)
});

export default store;
