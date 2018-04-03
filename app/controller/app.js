
const BaseController = require('./base');
class AppController extends BaseController {
  async index() {
    const { ctx } = this;
    // render 实现是服务端渲染 vue 组件
    await ctx.render('app/main.js', { message: 'egg vue server side render' });
  }
}

module.exports = AppController;