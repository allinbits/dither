import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/Home.vue")
    },
    {
      path: "/accounts",
      component: () =>
        import(/* webpackChunkName: "accounts" */ "@/views/Accounts.vue"),
      children: [
        {
          path: "/",
          name: "accounts",
          component: () =>
            import(
              /* webpackChunkName: "accounts-index" */ "@/views/AccountsIndex.vue"
            )
        },
        {
          path: ":address",
          name: "account",
          component: () =>
            import(
              /* webpackChunkName: "account" */ "@/views/AccountsAccount.vue"
            )
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "../views/Login.vue")
    },
    {
      path: "/messages",
      name: "messages",
      component: () =>
        import(/* webpackChunkName: "messages" */ "../views/Messages.vue")
    },
    {
      path: "/memos",
      component: () =>
        import(/* webpackChunkName: "memos" */ "@/views/Memos.vue"),
      children: [
        {
          path: "/",
          name: "memos",
          component: () =>
            import(
              /* webpackChunkName: "memos-index" */ "@/views/MemosIndex.vue"
            )
        },
        {
          path: "new",
          name: "memos-new",
          component: () =>
            import(/* webpackChunkName: "memos-new" */ "@/views/MemosNew.vue")
        },
        {
          path: ":memo",
          name: "memo",
          component: () =>
            import(/* webpackChunkName: "memo" */ "@/views/MemosMemo.vue")
        }
      ]
    },
    {
      path: "/notifications",
      name: "notifications",
      component: () =>
        import(
          /* webpackChunkName: "notifications" */ "../views/Notifications.vue"
        )
    },
    {
      path: "/settings",
      name: "settings",
      component: () =>
        import(/* webpackChunkName: "settings" */ "../views/Settings.vue")
    },
    {
      path: "/wallet",
      name: "wallet",
      component: () =>
        import(/* webpackChunkName: "notifications" */ "../views/Wallet.vue")
    }
  ]
});
