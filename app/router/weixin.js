module.exports = app => {
  const { router, controller } = app;

  // 微信接受消息
  router.all("/api/weixin/hear", "weixin.hear");
  // 微信jssdk签名认证  参数url
  router.get("/api/weixin/signature", "weixin.signature");
  // 微信跳转app页面接口 用于添加跳转数据
  router.get("/api/weixin/redirect", "weixin.redirect");
  // 跳转后获权地址 然后跳转到用户首页
  router.get("/api/weixin/oauth", "weixin.oauth");

  //用户
  //[next_openid]
  router.post("/api/weixin/user", "weixin.user_fetch");
  //openid
  router.post("/api/weixin/user/info", "weixin.user_info");
  //opendidlist
  router.post("/api/weixin/user/list", "weixin.user_batch_list");
  // [begin_openid] 
  router.post("/api/weixin/user/blacklist", "weixin.user_blacklist");
  // openid_list [unbatch]
  router.post("/api/weixin/user/blacklist/batch", "weixin.user_batch_blacklist");

  //标签
  //name
  router.post("/api/weixin/tags/create", "weixin.tags_create");
  router.post("/api/weixin/tags/fetch", "weixin.tags_fetch");
  //id name
  router.post("/api/weixin/tags/update", "weixin.tags_update");
  //id
  router.post("/api/weixin/tags/del", "weixin.tags_del");
  //id [next_openid]
  router.post("/api/weixin/tags/user", "weixin.tags_user");
  //openid_list id [unTag]
  router.post("/api/weixin/tags/batch", "weixin.tags_batch");
  // openid
  router.post("/api/weixin/tags/list", "weixin.tags_list");
  
  //菜单


  // 素材
  router.post("/api/weixin/material/upload", "weixin.uploadMaterial");
  


  // 测试接口
  router.all("/api/weixin/test", "weixin.test");
};
