'use strict';

// app/middleware/auth.js

module.exports = (app) => {
  return async function appAuth(ctx, next) {
    let { _id } = ctx.state.user;
    let find = await ctx.model.User.findOne({ _id });
    if (find.role == "0") {
      ctx.throw(401, '没有权限');
    }else if((find.role == "2" || find.role == "3") && find.status == "3"){
      ctx.throw(403, '审核未通过');
    } else {
      await next();
    }
  };
};

