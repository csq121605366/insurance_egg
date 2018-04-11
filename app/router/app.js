module.exports = app => {
  const { router, controller } = app;

  router.post("/api/app/login", "app.login"); // 用户注册

  //目前不用
  router.post("/api/app/wxuserinfo", "app.wxGetUserInfo"); // getUserInfo信息解密
  
  


};
