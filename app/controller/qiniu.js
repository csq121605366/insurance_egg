"use strict";

const BaseController = require("./base");

class QiniuController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async ticket() {
    let qiniuDomain = 'http://'+this.config.myconfig.qiniu.temporary_url;
    let qiniuRegion = this.config.myconfig.qiniu.temporary_region;
    let qiniuTicket = await this.service.qiniu.createTicket();
    this.success({qiniuTicket,qiniuDomain,qiniuRegion});
  }
  async callback() {
    console.log(this.ctx.request.body)
  }
}

module.exports = QiniuController;
