"use strict";

const BaseService = require("./base");
const qiniu = require("qiniu");
class QiniuService extends BaseService {
  constructor(ctx) {
    super(ctx);
  }

  async createTicket(permanent) {
    let config = this.config.myconfig.qiniu;
    let mac = new qiniu.auth.digest.Mac(config.AK, config.SK);
    let bucket;
    if (permanent) bucket = config.permanent_bucket;
    else bucket = config.temporary_bucket;
    let options = {
      scope: bucket,
      expires: 7200,
      callbackBodyType: "application/json",
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }

  /**
   * 获取图片
   * @param {*} url 图片地址
   * @param {*} key
   * @param {Boolean} type 上传类型 true表示永久  false表示临时(默认)
   */
  async fetchImage(url, key, type = false) {
    const client = new qiniu.rs.Client();
    let config = this.config.myconfig.qiniu;
    let bucket;
    if (type) bucket = config.permanent_bucket;
    else bucket = config.temporary_bucket;
    return new Promise((resolve, reject) => {
      client.fetch(url, bucket, key, (err, ret) => {
        if (err) reject(err);
        else resolve(ret);
      });
    });
  }
}

module.exports = QiniuService;
