"use strict";

const BaseController = require("./base");

class QiniuController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async ticket() {
    let res = await this.service.qiniu.createTicket();
    this.success(res);
  }
  async callback() {
    console.log(this.ctx.request.body)
  }
}

module.exports = QiniuController;
