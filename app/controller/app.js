
const BaseController = require('./base');
class AppController extends BaseController {
  constructor(ctx) {
    super(ctx);

  }

  /**
   * 登录
   */
  async login() {
    this.ctx.validate({ code: 'string' })
    let { code } = this.ctx.request.body;
    let res = await this.service.app.getSessionKey(code);
    if(!res) return this.error('获取失败');
    

    // const { ctx, service } = this;
    // const { username, password, role } = ctx.request.body;
    // // 验证
    // ctx.validate(this.AdminRegisterTransfer);
    // const find = await service.admin.findbyusername(username);
    // if (find) return this.error("帐号已存在");
    // let user = this.ctx.state.user;
    // if (!user || user.role !== "root") return this.error("您没有权限");
    // const newOne = await ctx.model.Admin.create({ username, password, role });
    // if (!newOne) return this.error("注册失败");
    // this.success({ username: newOne.username }, "注册成功");
  }

}

module.exports = AppController;