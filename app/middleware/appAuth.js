'use strict';

// app/middleware/auth.js

module.exports = (app) => {
  return async function appAuth(ctx, next) {
    let { role, status } = ctx.state.user;
    if (role == "0" || ((role == "2" || role == "3") && status != "2")) {
      ctx.throw(401, '没有权限');
    } else {
      await next();
    }
  };
};

