"use strict";

const BaseController = require("./base");

class QiniuController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async ticket() {
    this.ctx.validate({ permanent: { type: "string", required: false } });
    let { permanent } = this.ctx.request.body;
    let res = await this.service.qiniu.createTicket(permanent);
    this.success(res);
  }
}

module.exports = QiniuController;
