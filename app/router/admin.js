module.exports = app => {
  const { router, controller } = app;

  const auth = app.middleware.auth(app);


  // 管理员接口
  router.post("/api/admin/token", "admin.getToken"); // 获取token
  router.get("/api/admin", app.jwt, auth, "admin.getUserinfo"); // 获取用户信息
  router.post("/api/admin", app.jwt, auth, "admin.createUser"); // 创建用户

  router.post("/api/admin/phone/bind", app.jwt, auth, "admin.bindPhone"); // 绑定手机
  router.post("/api/admin/phone/unbind", app.jwt, auth, "admin.unbindPhone"); // 解绑手机


  router.post("/api/admin/password", "admin.resetPassword"); //登录前重置密码
  router.post("/api/admin/password/logintype", app.jwt, auth, "admin.resetPasswordLoginType"); // 登录后重置密码


  // 关于用户
  router.post("/api/admin/user/list", app.jwt, auth, "admin.geUserList"); // 获取用户列表
  router.post("/api/admin/user/audit", app.jwt, auth, "admin.auditUser"); // 审核用户



  router.post("/api/admin/upload", app.jwt, controller.admin.uploadByStream);
};
