const Controller = require("egg").Controller;
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }
  success(data, message = "请求成功") {
    this.ctx.body = {
      success: true,
      message,
      data: data
    };
  }
  error(message = "请求失败") {
    this.ctx.body = {
      success: false,
      message
    };
  }
  notf(message) {
    message = message || "not found";
    this.ctx.throw(404, message);
  }
}
module.exports = BaseController;
