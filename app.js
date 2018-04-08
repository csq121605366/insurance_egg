"use strict";

module.exports = app => {
  app.beforeStart(async () => {
    // 应用会等待这个函数执行完成才启动
    console.log(
      "---------------------------------启动le---------------------------------"
    );
    // 初始化时首先从数据库拉去微信接口信息
    // 也可以通过以下方式来调用 Service
    const ctx = app.createAnonymousContext();
    app.weixinPort = await ctx.service.weixin.pullWeixinPort();
  });
  app.once("server", server => {
    // websocket
  });
  app.on("error", (err, ctx) => {
    // report error
  });
  app.on("request", ctx => {
    // log receive request
  });
  app.on("response", ctx => {
    // ctx.starttime is set by framework
    // const used = Date.now() - ctx.starttime;
    // console.log(`${ctx.method} ${ctx.url} - ${used}ms`);
    // log total cost
  });
};
