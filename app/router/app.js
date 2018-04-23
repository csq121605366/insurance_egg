module.exports = app => {
  const { router, controller } = app;

  router.post("/api/app/login", "app.getToken"); // 用户登录和注册

  router.get("/api/app/getuserinfo", app.jwt, "app.getuserinfo"); //获取用户信息
  router.post("/api/app/updatebaseInfo", app.jwt, "app.updatebaseInfo"); //用户授权获取基本信息

  router.get("/api/app/canupdate", app.jwt, "app.canUpdate"); // 用户信息完善更新
  router.post("/api/app/update", app.jwt, "app.update"); // 用户信息完善更新

  router.get("/api/app/titlelist", "app.titleList"); // 获取城市列表
  // last_id: 0, limit: 10,key:''
  router.post("/api/app/hospital", "app.searchHospital"); // 搜索医院
  router.get("/api/app/getcitys", "app.getCitys"); // 获取城市列表
  router.get("/api/app/gethospitals", "app.getHospitals"); // 获取医院列表
  router.get("/api/app/maindepartments", "app.mainDepartments"); // 获取主科室列表
  router.get("/api/app/vicedepartments", "app.viceDepartments"); // 获取次科室列表

  //目前不用
  router.post("/api/app/wxuserinfo", "app.wxGetUserInfo"); // getUserInfo信息解密

  //创建文章
  router.post("/api/app/article/create", app.jwt, "article.createAndUpdate");
  //获取单个文章内容 article_id(文章id)
  router.post("/api/app/article/getdetail", app.jwt, "article.getDetail");
  //获取新建文章的资源列表 article_id(文章id)
  router.post(
    "/api/app/article/getArticleAssets",
    app.jwt,
    "article.getArticleAssets"
  );
  //增加主文 article_id(文章id)
  router.post("/api/app/article/addcontent", app.jwt, "article.addContent");
  //发表 article_id(文章id)
  router.post("/api/app/article/publish", app.jwt, "article.publish");

  //查找文章列表 article_ids=>_id  数组 表示可以查很多也可以查单个
  router.post("/api/app/article/list", app.jwt, "article.list");
  
};
