module.exports = app => {
  const { router, controller } = app;

  router.post("/api/app/login", "app.login"); // 用户登录和注册

  router.post("/api/app/update", app.jwt, "app.update"); // 用户信息完善更新

  //目前不用
  router.post("/api/app/wxuserinfo", "app.wxGetUserInfo"); // getUserInfo信息解密

  //创建文章
  router.put("/api/app/article/create", app.jwt, "article.create");
  //查找文章列表 article_ids=>_id  数组 表示可以查很多也可以查单个
  router.post("/api/app/article/list", app.jwt, "article.getlist");
};
