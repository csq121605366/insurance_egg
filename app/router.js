module.exports = app => {
  const { router, controller } = app;

  // token验证中间件

  // 公共接口


  // 管理员接口
  router.post("admin", "/api/admin/get_token", 'admin.getToken');
  router.post("admin", "/api/admin/get_userinfo", app.jwt, 'admin.getUserinfo');
  router.post("admin", "/api/admin/create", 'admin.create');
  router.post(
    "admin",
    "/api/admin/upload",
    app.jwt,
    controller.admin.uploadByStream
  );

  router.get('admin', "/graphql", 'admin.getUserinfo');
  // graphiql 接口测试
  router.get('graphiql', "gi", 'graphql.gi')

  // 用户接口


  // 管理员页面渲染
  router.get("admin", "/admin(/.+)?", "admin.index");
  // 用户页面渲染
  router.get("spa", "/app(/.+)?", "app.index");
  // 网站首页直接转向管理员页面
  router.get("spa", "/", "admin.index");
};
