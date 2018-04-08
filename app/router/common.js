module.exports = app => {
  const { router, controller } = app;

  // [permanent]
  router.post("/api/qiniu/ticket", "qiniu.ticket");
};
