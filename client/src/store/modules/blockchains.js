const accounts = {
  firestorePath: "blockchains",
  firestoreRefType: "collection", // or 'doc'
  moduleName: "blockchains",
  statePropName: "data",
  namespaced: true, // automatically added

  // this object is your store module (will be added as '/accounts')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {},
  mutations: {},
  actions: {}
};

export default accounts;
