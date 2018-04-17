
"use strict";

const BaseService = require("./base");
const qiniu = require("qiniu");
const _ = require('lodash');
class QiniuService extends BaseService {
  constructor(ctx) {
    super(ctx);
  }

  async createTicket() {
    let config = this.config.myconfig;
    let mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);
    let bucket = config.qiniu.temporary_bucket;
    let options = {
      scope: bucket,
      expires: 7200,
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }
  /**
   * 注册后将图片数组转移到永久仓库
   * @param {*} filenames 文件数组
   */
  async removeImage(file = []) {
    let config = this.config.myconfig;
    let srcBucket = config.qiniu.temporary_bucket;
    let destBucket = config.qiniu.permanent_bucket;
    let destDomain = config.qiniu.permanent_url;
    let moveOperations = [];
    let res = [];
    _.forEach(file, (item, index) => {
      let mkfilename = this.guid() + /\.[^\.]+$/.exec(item.key)[0];
      let opt = qiniu.rs.copyOp(srcBucket, item.key, destBucket, mkfilename);
      res.push('http://'+destDomain+'/'+mkfilename);
      moveOperations.push(opt);
    });
    let mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);
    var conf = new qiniu.conf.Config();
    var bucketManager = new qiniu.rs.BucketManager(mac, conf);
    let self = this;
    return new Promise((resolve, reject) => {
      bucketManager.batch(moveOperations, async (err, respBody, respInfo)=>{
        if (err) {
          reject(err);
        } else {
          console.log('qiniu',respInfo)
          // 200 is success, 298 is part success
          if (respInfo.statusCode != 200) {
            reject()
          } else {
            await self.ctx.model.Asset.insertMany(file);
            resolve(res);
          }
        }
      });
    })
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
