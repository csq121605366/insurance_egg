module.exports = app => {
  const { router, controller } = app;

  // const auth = app.middleware.auth(app);


  // 管理员接口
  router.post("/api/admin/token", "admin.getToken"); // 获取token
  router.get("/api/admin", app.jwt,  "admin.getUserinfo"); // 获取用户信息
  router.post("/api/admin", app.jwt, "admin.createUser"); // 创建用户

  router.post("/api/admin/phone/bind", app.jwt, "admin.bindPhone"); // 绑定手机
  router.post("/api/admin/phone/unbind", app.jwt, "admin.unbindPhone"); // 解绑手机


  router.post("/api/admin/password", "admin.resetPassword"); //登录前重置密码
  router.post("/api/admin/password/logintype", app.jwt, "admin.resetPasswordLoginType"); // 登录后重置密码


  // 关于用户
  router.post("/api/admin/audituser", app.jwt, "admin.auditUser"); // 审核用户



  router.post("/api/admin/upload", app.jwt, controller.admin.uploadByStream);
};
