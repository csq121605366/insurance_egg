module.exports = app => {
  const { router, controller } = app;

  // 管理员接口
  router.post("/api/admin/token", "admin.getToken"); // 获取token
  router.get("/api/admin", app.jwt, "admin.getUserinfo"); // 获取用户信息
  router.post("/api/admin", app.jwt, "admin.createUser"); // 创建用户
  router.put("/api/admin/password", app.jwt, "admin.resetPassword"); //登录前重置密码
  router.put("/api/admin/password/logintype", "admin.resetPassword"); // 登录后重置密码

  router.post("/api/admin/upload", app.jwt, controller.admin.uploadByStream);
};
