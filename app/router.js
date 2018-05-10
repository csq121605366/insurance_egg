module.exports = app => {
  // 微信接口
  // require("./router/weixin")(app);
  // 公共接口
  require("./router/common")(app);
  // APP接口
  require("./router/app")(app);
  // 后台管理接口
  require("./router/admin")(app);
  // 页面
  require("./router/page")(app);
};
