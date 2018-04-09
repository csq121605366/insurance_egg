module.exports = app => {
  const { router, controller } = app;

  router.post("/api/app/register", "app.register"); // 用户注册

};
