const memos = {
  firestorePath: "memos",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "memos",
  statePropName: "data",
  namespaced: true, // automatically added
  sync: {
    orderBy: ["timestamp", "desc"]
  },

  // this object is your store module (will be added as '/memos')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {},
  mutations: {},
  actions: {}
};

export default memos;
