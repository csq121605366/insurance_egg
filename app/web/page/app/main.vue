<template>
  <div id="app1">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";

import "@/styles/index.scss"; // global css

import router from "./router";
import store from "./store";

import "@/icons"; // icon
import "@/permission"; // permission control
Vue.use(ElementUI, { locale });

Vue.config.productionTip = false;

export default {
  name: "app",
  router,
  store
};
</script>
