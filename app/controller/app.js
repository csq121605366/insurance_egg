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
    // 查找未删除的用户是否存在 如果已经删除表示要重建
    let find = await this.service.app.findUserByOpenId(openid);
    // 如果用户已经存在
    if (find) {
      if (find.status == 3) return this.error("该用户已被锁定");
      //如果用户已经完善信息(不是游客)并且已经激活(已审核) 未完善的用户不发放token
      if (find.role !== 0 && find.status == 2) {
        //更新session_key
        find.session_key = session_key;
        // 保存
        try {
          await find.save();
        } catch (e) {
          throw new Error()
        }
      }
    } else {
      let { nickName, avatarUrl, gender, city, province, country, language } = this.ctx.request.body;
      find = new this.ctx.model.User({
        name: nickName,
        nickName,
        avatarUrl,
        gender,
        city,
        province,
        country,
        language,
        openid,
        session_key
      });
      try {
        await find.save();
      } catch (e) {
        throw new Error()
      }
    }
    let token = await this.service.actionsToken.userToken(find);
    return this.success({
      token
    });
  }

  //审核用户
  async auditUser() {
    this.ctx.validate({ openid: 'string' });
    let { role } = this.ctx.state.user;
    let { openid } = this.ctx.request.body;
    if (role < 2) return this.error('只有管理员可以审核!');
    // 将已锁定和未激活的用户激活
    let find = await this.ctx.model.User.findOne({ openid, status: { $in: [1, 3] } }).exec();
    if (!find) return this.error('未找到该用户,或该用户已被删除');
    // 激活用户账户
    find.status = 2;
    try {
      await find.save();
      return this.success()
    } catch (e) {
      return this.error();
    }
  }


  async wxGetUserInfo() {
    let { openid, role } = this.ctx.state.user;
    // let find = this.ctx.model.User.findOne({openid});
    //表示还是
    if (role == 0) {

    }
    this.error("你来错地方了");
  }

}

module.exports = AppController;
