module.exports = app => {
  const { router, controller } = app;

  router.post("/api/app/login", "app.login"); // 用户注册
  

};
