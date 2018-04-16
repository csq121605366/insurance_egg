module.exports = app => {
  const { router, controller } = app;

  router.post("/api/app/login", "app.login"); // 用户登录和注册

  router.get("/api/app/getuserinfo", app.jwt, "app.getuserinfo"); //获取用户信息
  router.post("/api/app/updatebaseInfo", app.jwt, "app.updatebaseInfo"); //用户授权获取基本信息



  router.get("/api/app/titlelist", "app.titleList"); // 获取城市列表
  router.get("/api/app/getcitys", "app.getCitys"); // 获取城市列表
  router.get("/api/app/gethospitals", "app.getHospitals"); // 获取医院列表
  router.get("/api/app/maindepartments", "app.mainDepartments"); // 获取主科室列表
  router.get("/api/app/vicedepartments", "app.viceDepartments"); // 获取次科室列表

  router.post("/api/app/update", app.jwt, "app.update"); // 用户信息完善更新

  //目前不用
  router.post("/api/app/wxuserinfo", "app.wxGetUserInfo"); // getUserInfo信息解密

  //创建文章
  router.post("/api/app/article/create", app.jwt, "article.create");
  //查找文章列表 article_ids=>_id  数组 表示可以查很多也可以查单个
  router.post("/api/app/article/list", app.jwt, "article.getlist");
};
