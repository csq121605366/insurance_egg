
const Controller = require('egg').Controller;
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }
  success(data, message = '请求成功') {
    this.ctx.body = {
      success: true,
      message,
      data
    };
  }
  error(data, message = '请求失败') {
    this.ctx.body = {
      success: true,
      message,
      data
    };
  }
  notf(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;