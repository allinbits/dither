const settings = {
  firestorePath: "settings/{userId}",
  firestoreRefType: "doc",
  moduleName: "settings",
  statePropName: "data",

  // this object is your store module (will be added as '/settings')
  // you can also add state/getters/mutations/actions
  state: {},
  getters: {},
  mutations: {},
  actions: {}
};

export default settings;
