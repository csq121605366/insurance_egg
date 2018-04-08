'use strict';

// had enabled by egg
// exports.static = true;

exports.vuessr = {
  enable: true,
  package: 'egg-view-vue-ssr'
};

exports.static = true;

// 验证插件
exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

// exports.bcrypt = {
//   enable: true,
//   package: 'egg-bcrypt'
// }

// exports.cors = {
//   enable: true,
//   package: 'egg-cors',
// }

// exports.graphql = {
//   enable: true,
//   package: 'egg-graphql',
// };

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
}

// exports.passport = {
//   enable: true,
//   package: 'egg-passport',
// };