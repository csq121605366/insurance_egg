module.exports = app => {
  const { router, controller } = app;
  console.log(controller);
  // token验证中间件
  const tokenSecret = app.config.myconfig.tokenSecret;
  const tokenAuth = app.middleware.token({ secret: tokenSecret });

  // 公共接口


  // 管理员接口
  router.post("admin", "/api/admin/login", controller.admin.login);
  router.post("admin", "/api/admin/register", controller.admin.login);
  router.post(
    "admin",
    "/api/admin/upload",
    tokenAuth,
    controller.admin.uploadByStream
  );



  // 用户接口


  // 管理员页面渲染
  router.get("admin", "/admin(/.+)?", "admin.index");
  // 用户页面渲染
  router.get("spa", "/app(/.+)?", "app.index");
};
