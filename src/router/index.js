import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import PageIndex from "@/components/PageIndex";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Index",
      component: PageIndex
    },
    {
      path: "/hello",
      name: "HelloWorld",
      component: HelloWorld
    }
  ]
});
