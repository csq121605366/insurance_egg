<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue";
import router from "./router";
import store from "./store";
import MintUI from "mint-ui";
import "@@/style/reset.css";
import "mint-ui/lib/style.css";
// import "./utils/permission"; // permission control

document.addEventListener(
  "DOMContentLoaded",
  function() {
    if (window.FastClick) window.FastClick.attach(document.body);
  },
  false
);

Vue.use(MintUI);

Vue.config.productionTip = false;

export default {
  store,
  router
};
</script>

<style>
html,
body {
  background-color: #fafafa;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
}

a {
  color: inherit;
}
</style>

