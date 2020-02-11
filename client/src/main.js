import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

// sync store and router
import { sync } from "vuex-router-sync";
import store from "./store/index.js";
import router from "./router";
sync(store, router);

Vue.use(VueRouter);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
