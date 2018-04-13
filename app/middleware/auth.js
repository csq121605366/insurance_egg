'use strict';

// app/middleware/auth.js

module.exports = (app) => {
  return async function auth(ctx, next) {
    if (ctx.state && ctx.state.user.type !== 'admin' && /^\/api\/admin.*$/.test(ctx.url)) {
      await next();
      throw new Error('只有管理员可以登录后台');
    } else {
      await next()
    }
  };
};

