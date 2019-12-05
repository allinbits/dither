import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";

import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "./db";

Vue.use(Vuex);

export default new Vuex.Store({
  getters,
  state: {
    memos: []
  },
  mutations: vuexfireMutations,
  actions: {
    bindMemos: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef("memos", db.collection("memos"));
    }),
    unbindMemos: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("memos");
    })
  }
});
