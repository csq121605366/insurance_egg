'use strict';

// had enabled by egg
// exports.static = true;

exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr'
};

exports.static = true;

// exports.serviceworker = {
//   enable: true,
//   package: 'egg-serviceworker'
// };
// 验证插件
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

// exports.passport = {
//   enable: true,
//   package: 'egg-passport',
// };