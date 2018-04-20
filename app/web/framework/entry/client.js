import Vue from "vue";
export default function(options) {
  if (options.store) {
    let state = Object.assign(
      {},
      options.store.state,
      window.__INITIAL_STATE__
    );
    options.store.replaceState(state || {});
  } else if (window.__INITIAL_STATE__) {
    options.data = Object.assign(
      window.__INITIAL_STATE__,
      options.data && options.data()
    );
  }
  const app = new Vue(options);
  app.$mount("#app");
}
