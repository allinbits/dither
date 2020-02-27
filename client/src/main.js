import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import VueGtag from "vue-gtag";
import VueMeta from "vue-meta";

Vue.use(VueGtag, {
  config: { id: "UA-158201725-1" }
});

Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

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
