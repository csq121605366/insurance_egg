import Vue from "vue";
import Router from "vue-router";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
const _import = require("./_import_" + process.env.NODE_ENV);

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router);

/* Layout */
import Layout from "@/views/layout/Layout";

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: "/login",
    component: _import("login/index"),
    hidden: true
  },
  { path: "/404", component: _import("404"), hidden: true },

  {
    path: "/",
    component: Layout,
    redirect: "/home",
    hidden: true
  },
  {
    path: "/home",
    component: Layout,
    children: [
      {
        path: "",
        name: "home",
        meta: { title: "首页", icon: "example" },
        component: _import("home/index")
      }
    ]
  },
  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Example", icon: "example" },
    children: [
      {
        path: "table",
        name: "Table",
        component: _import("table/index"),
        meta: { title: "Table", icon: "table" }
      },
      {
        path: "tree",
        name: "Tree",
        component: _import("tree/index"),
        meta: { title: "Tree", icon: "tree" }
      }
    ]
  },
  {
    path: "/form",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Form",
        component: _import("form/index"),
        meta: { title: "Form", icon: "form" }
      }
    ]
  },
  {
    path: "/upload",
    component: Layout,
    children: [
      {
        path: "",
        name: "Upload",
        component: _import("upload/index"),
        meta: { title: "上传素材", icon: "form" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "",
        name: "User",
        component: _import("info/userInfo"),
        meta: { title: "用户管理", icon: "form" }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
  
});
