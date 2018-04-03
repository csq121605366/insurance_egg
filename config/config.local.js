'use strict';
module.exports = () => {
  const config = exports = {};
  config.vuessr = {
    // 本地开发 css 采用 inline 方式, 无需注入 css 链接。
    injectCss: false,
  };
  return config;
};