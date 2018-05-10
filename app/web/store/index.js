import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import getters from "./getters";
// import createLogger from "vuex/dist/logger";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user
  },
  getters,
  // plugins: [createLogger()]
});

export default store;
