import store from "../index.js";

const memos = {
  firestorePath: "memos",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "memos",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/memos')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {},
  mutations: {},
  actions: {},

  serverChange: {
    addedHook: function(updateStore, doc, id, store) {
      //console.log("added memo", doc);
      store.commit("rmQueuedMemo", id);
      store.commit("setHeight", doc.height);
      updateStore(doc);
    }
  }
};

export default memos;
