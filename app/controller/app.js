const BaseController = require("./base");
class AppController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 登录
   */
  async login() {
    this.ctx.validate({
      code: "string"
    });
    let { code } = this.ctx.request.body;
    // 去获取session_key
    let res = await this.service.app.getSessionKey(code);
    // 获取失败
    if (!res) return this.error("获取失败");
    let { openid, session_key } = res;
    let find = await this.ctx.model.User.findOne({
      openid
    }).exec();
    // 如果用户已经存在
    if (find) {
      if (find.status == 9) return this.error("该用户已被删除");
      if (find.status == 3) return this.error("该用户已被锁定");
      //如果用户已经完善信息(不是游客)并且已经激活(已审核)
      if (find.role !== 0 && find.status == 2) {
        //更新session_key
        find.session_key = session_key;
        await find.save();
        let token = await this.service.actionsToken.userToken(find);
        this.success({
          token
        });
      } else {
        this.success("登录成功");
      }
    } else {
      let newOne = new this.ctx.model.User({
        openid,
        session_key
      });
      let doc = await newOne.save((err, doc) => {
        if (!err) return this.error("操作失败");
        return this.success("新用户注册成功");
      });
    }
  }

  async wxGetUserInfo() {
    // this.ctx.validate({
    //   code: "string",
    //   encryptedData: "string",
    //   iv: "string"
    // });
    this.error("你来错地方了");
  }
}

module.exports = AppController;
