const blockchain = {
  state: {
    chainId: "cosmoshub-3",
    lcd: "https://lcd.nylira.net",
    toAddress: "cosmos1lfq5rmxmlp8eean0cvr5lk49zglcm5aqyz7mgq",
    defaultGas: "100000"
  },
  getters: {
    blockchain: state => {
      return state.blockchain;
    },
    chainId: state => {
      return state.blockchain.chainId;
    }
  },
  mutations: {},
  actions: {}
};

export default blockchain;
