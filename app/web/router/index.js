import Vue from "vue";
import Router from "vue-router";
// console.log("process.env.NODE_ENV", process.env.NODE_ENV);
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
    icon: 'iconfont-'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  {
    path: "/article",
    component: _import("article/index"),
    hidden: true
  },
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
        meta: { title: "首页", icon: "icon-tuandui" },
        component: _import("home/index")
      }
    ]
  },
  {
    path: "/doctor",
    component: Layout,
    redirect: "/doctor/list",
    children: [
      {
        path: "list",
        name: "doctor_list",
        meta: { title: "医生管理", icon: "icon-zuzhi" },
        component: _import("doctor/list"),
        // children: [
        //   {
        //     path: ":id",
        //     hidden: true,
        //     name: "doctor_Detail",
        //     component: _import("doctor/detail")
        //   }
        // ]
      }
    ]
  },
  {
    path: "/agent",
    component: Layout,
    children: [
      {
        path: "list",
        name: "agent_list",
        component: _import("agent/list"),
        meta: { title: "经理人", icon: "icon-zuzhi" },
        // children: [
        //   {
        //     path: ":id",
        //     hidden: true,
        //     name: "agent_Detail",
        //     component: _import("agent/detail")
        //   }
        // ]
      }
    ]
  },
  {
    path: "/fw",
    component: Layout,
    children: [
      {
        path: 'index',
        name: "fw",
        component: _import("framework/index"),
        meta: { title: "组织框架", icon: "icon-zuzhi" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "index",
        name: "User",
        component: _import("info/userInfo"),
        meta: { title: "用户管理", icon: "icon-zuzhi" }
      }
    ]
  },
  { path: "*", redirect: "/404", hidden: true }
];

export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
  base: "/"
});
