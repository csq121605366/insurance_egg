module.exports = app => {
  const { router, controller } = app;

  //
  router.post("/api/qiniu/ticket", "qiniu.ticket");
  // 客户端上传后响应qiniu服务器的操作
  router.post("/api/qiniu/callback", "qiniu.callback");



};
