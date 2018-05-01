module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.appAuth();
  router.post("/api/app/login", "app.getToken"); // 用户登录和注册

  router.get("/api/app/getuserinfo", app.jwt, "app.getuserinfo"); //获取用户信息



  router.post("/api/app/updatebaseInfo", app.jwt, auth, "app.updatebaseInfo"); //用户授权获取基本信息

  router.post("/api/app/friend/get", app.jwt, auth, "app.getFriend"); //经理人获取潜在用户
  router.get("/api/app/agency/get", app.jwt, auth, "app.getAgency"); //经理人获取代理医生
  router.get("/api/app/canupdate", app.jwt, "app.canUpdate"); // 用户信息完善更新
  router.post("/api/app/update", app.jwt, "app.update"); // 用户信息完善更新
  router.post("/api/app/updatelocaltion", app.jwt, "app.updateLocaltion"); // 增加用户地址信息

  //获取科室列表
  router.post(
    "/api/app/user/department",
    app.jwt,
    auth,
    "app.userListBydepartment"
  ); // 获取科室成员列表
  //获取用户详细资料
  router.post("/api/app/user/detail", app.jwt, auth, "app.userDetail"); // 获取用户详细信息



  router.get("/api/app/titlelist", "app.titleList"); // 获取职称列表
  // last_id: 0, limit: 10,key:''
  router.post("/api/app/hospital", "app.searchHospital"); // 搜索医院
  router.get("/api/app/getcitys", "app.getCitys"); // 获取城市列表
  router.get("/api/app/gethospitals", "app.getHospitals"); // 获取医院列表
  //department
  router.get("/api/app/department/main", "department.departmentMain"); // 获取主科室列表
  //_id(主科室id)
  router.get("/api/app/department/vice", "department.departmentVice"); // 获取次科室列表

  //目前不用
  router.post("/api/app/wxuserinfo", app.jwt, auth, "app.wxGetUserInfo"); // getUserInfo信息解密


  //创建文章
  router.post(
    "/api/app/article/createandupdate",
    app.jwt,
    auth,
    "article.createAndUpdate"
  );
  //获取单个文章内容 article_id(文章id)
  router.post("/api/app/article/getdetail", app.jwt, "article.getDetail");
  //获取新建文章的资源列表 article_id(文章id)
  router.post(
    "/api/app/article/getArticleAssets",
    app.jwt,
    auth,
    "article.getArticleAssets"
  );
  //增加主文 article_id(文章id)
  router.post(
    "/api/app/article/addcontent",
    app.jwt,
    auth,
    "article.addContent"
  );
  //发表 article_id(文章id)
  router.post("/api/app/article/publish", app.jwt, auth, "article.publish");

  /**
   * 实现分页功能
   * @param {*} _id 文章id(如果不提供表示从头开始提供)
   * @param {*} user_id 用户id
   * @param {*} department_key 文章关联科室的key
   * @param {*} limit 文章间隔(默认为10条)
   * @param {*} sort //文章分类(默认为1)0全部 1日志 2手术记录 3科普文章
   * @param {*} type  //文章展示模式 0全部 1公开 2仅好友查看 3私有
   * @param {*} status //文章状态(默认为2) 0全部 1未审核 2已审核 3已删除
   */
  // 游客进入首页的分页
  router.post("/api/app/article/paging", "article.paging");
  // 用户文章分页
  router.post("/api/app/article/list", app.jwt, "article.list");

  //提问问题
  router.post("/api/app/qa/create", app.jwt, auth, "qa.qaCreate");
  //回答问题
  router.post("/api/app/qa/answer", app.jwt, auth, "qa.qaAnswer");
  //问题列表 user_id相关用户_id limit(限制返回几个) last_id(最后一个_id)
  router.post("/api/app/qa/search", app.jwt, auth, "qa.qaSearch");
  //问题详情
  router.post("/api/app/qa/detail", app.jwt, auth, "qa.qaDetail");
  //热门搜索
  router.post("/api/app/qa/hot", app.jwt, "qa.qaHot");

  //混合搜索
  router.post("/api/app/search", app.jwt, auth, "app.search");
};
