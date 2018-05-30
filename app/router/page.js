module.exports = app => {
  const { controller, router } = app;


  // 管理员页面渲染
  // router.get("/app(/.+)?", "app.index");

  // 管理员页面渲染
  // router.get("/admin(/.+)?", "admin.index");

  router.get('/j8I4G45DwH.txt',"admin.weixinConnect")

  // 网站首页直接转向管理员页面
  router.get("(/.+)?", "admin.index");
};
