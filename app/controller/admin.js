const BaseController = require('./base');
const fs = require('fs');
const FormStream = require('formstream');

class Admin extends BaseController {

  async index() {
    // 后台管理员页面
    const { ctx } = this;
    await ctx.renderClient('app/main.js', { message: 'egg vue client side render' });
  }

  async login() {
    console.log(this);
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;
    this.app.logger.debug('debug info');
    const find = await service.admin.findbyusername('caishang1qing');
    console.log(!find);
    if (!find) {
      this.error(467, '未找到');
    } else {
      this.error(467, '未找到');
    }
  }

  async uploadByStream() {
    const ctx = this.ctx;
    // 上传当前文件本身用于测试
    const fileStream = fs.createReadStream(__filename);
    // httpbin.org 不支持 stream 模式，使用本地 stream 接口代替
    const url = `${ctx.protocol}://${ctx.host}/stream`;
    const result = await ctx.curl(url, {
      // 必须指定 method，支持 POST，PUT
      method: 'POST',
      // 以 stream 模式提交
      stream: fileStream,
    });
    console.log('result', result);
    ctx.status = result.status;
    ctx.set(result.headers);
    this.success(200, '请求成功', result);
    // 响应最终会是类似以下的结果：
    // {"streamSize":574}
  }
}

module.exports = Admin;