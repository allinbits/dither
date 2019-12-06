import Vue from "vue";
import Vuex from "vuex";

import { vuexfireMutations, firestoreAction } from "vuexfire";
import { db } from "./db";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    memos: state => {
      return state.memos;
    }
  },
  state: {
    memos: []
  },
  mutations: vuexfireMutations,
  actions: {
    bindMemos: firestoreAction(({ bindFirestoreRef }) => {
      // return the promise returned by `bindFirestoreRef`
      return bindFirestoreRef(
        "memos",
        db
          .collection("memos")
          .orderBy("height", "desc")
          .limit(6)
      );
    }),
    unbindMemos: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("memos");
    })
  }
});
