
module.exports = app => {
  const { router, controller } = app;
  console.log(controller);
  // token验证中间件
  const tokenSecret = app.config.myconfig.tokenSecret;
  const tokenAuth = app.middleware.token({ secret: tokenSecret });

  // 公共接口

  /**
   * 管理员路由
   */
  router.get('admin', '/admin(/.+)?', 'admin.index'); // 首页


  router.post('admin', '/api/admin/login', controller.admin.login);
  router.post('admin', '/api/admin/register', controller.admin.login);
  router.post('admin', '/api/admin/upload', tokenAuth, controller.admin.uploadByStream);

  // 用户


  // 单页面渲染
  router.get('spa', '/app(/.+)?', 'app.index');
};
