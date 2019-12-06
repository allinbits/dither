import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "../components/PageHome.vue")
    },
    {
      path: "/messages",
      name: "messages",
      component: () =>
        import(
          /* webpackChunkName: "messages" */ "../components/PageMessages.vue"
        )
    },
    {
      path: "/notifications",
      name: "notifications",
      component: () =>
        import(
          /* webpackChunkName: "notifications" */ "../components/PageNotifications.vue"
        )
    },
    {
      path: "/memos/new",
      name: "memos-new",
      component: () =>
        import(
          /* webpackChunkName: "memos-new" */ "../components/PageMemosNew.vue"
        )
    },
    {
      path: "/search",
      name: "search",
      component: () =>
        import(/* webpackChunkName: "search" */ "../components/PageSearch.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import(
          /* webpackChunkName: "messages" */ "../components/PageSettings.vue"
        )
    }
  ]
});
