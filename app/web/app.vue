<template>
  <div id="app">
      <router-view></router-view>
 </div>
</template>

<script>
import Vue from "vue";
// import { sync } from "vuex-router-sync";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import "./utils/permission"; // permission control

Vue.use(ElementUI);

Vue.config.productionTip = false;

// sync(store, router);
export default {
  store,
  router
};
</script>
