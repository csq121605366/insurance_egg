module.exports = app => {
	const { router, controller } = app;

   // type:['bind','login','forgot','unbind']其中一个   phone手机号
   router.post("/api/sendcode","common.sendcode");


  //
  router.post("/api/qiniu/ticket", "qiniu.ticket");
  // 客户端上传后响应qiniu服务器的操作
  router.post("/api/qiniu/callback", "qiniu.callback");



};
