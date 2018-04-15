const BaseController = require("./base");
class AppController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }

  async index() {
    // 后台管理员页面
    const { ctx } = this;
    await ctx.renderClient("app/app.js", { csrf: ctx.csrf, msg: "你好" });
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
          throw new Error();
        }
      }
    } else {
      let {
        nickName,
        avatarUrl,
        gender,
        city,
        province,
        country,
        language
      } = this.ctx.request.body;
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
        throw new Error();
      }
    }
    let token = await this.service.actionsToken.userToken(find);
    return this.success({
      token
    });
  }

  async updatebaseInfo() {
    let { openid, role } = this.ctx.state.user;
    let {
      nickName,
      avatarUrl,
      gender,
      city,
      province,
      country,
      language
    } = this.ctx.request.body;
    if (role != "0") return this.error("您已经授权过了");
    let find = await this.ctx.model.User.findOne({ openid }).exec();
    if (!find) return this.error("未找到该用户");
    Object.assign(find, {
      nickName,
      name: nickName,
      avatarUrl,
      gender,
      city,
      province,
      country,
      language
    });
    try {
      await find.save();
      let user = await this.ctx.model.User.findOne({ openid })
        .select("name role nickName status phone gender avatarUrl")
        .exec();
      this.success(user);
    } catch (e) {
      this.error("授权失败");
    }
  }

  async getuserinfo() {
    let { openid } = this.ctx.state.user;
    let user = await this.ctx.model.User.findOne({ openid })
      .select("name role nickName status phone gender avatarUrl")
      .exec();
    if (user) return this.success(user);
    else this.error("未找到您的信息");
  }

  async update() {
    let reg = this.config.regexp;
    this.ctx.validate({
      name: { type: "string", format: reg.name, required: false },
      role: { type: "enum", values: ["0", "1", "2", "3", "9"], required: true },
      nickName: { type: "string", format: reg.name, required: false },
      phone: { type: "string", format: reg.phone, required: false },
      idcard: { type: "string", format: reg.idcard, required: false },
      country: { type: "string", required: false },
      province: { type: "string", required: false },
      city: { type: "string", required: false },

      // hospital: { type: "string", required: true },
      // setions: { type: "array", itemType: "string", required: false },
      // friends: { type: "array", itemType: "string", required: false },
      // title: { type: "string", required: false },
      // treatment_info: { type: "array", itemType: "string", required: false },
      // fields: { type: "string", required: false },

      email: { type: "string", format: reg.email, required: false },
      gender: { type: "enum", values: ["0", "1", "2"], required: false },
      avatarUrl: { type: "string", format: reg.url, required: false }
    });
    let { role } = this.ctx.request.body;
    let { status, _id } = this.ctx.state.user;
    console.log("==================", role, status);
    // 如果role角色不为0表示非游客 账号状态1未激活
    if (role != 0 && status == 1) return this.error("账号审核中...");
    // 二次验证(分角色)
    if (role == 1) {
      //普通用户 关注科室1-3个
      this.ctx.validate({
        setions: {
          type: "array",
          itemType: "string",
          required: false,
          max: 3,
          min: 1
        },
        treatment_info: { type: "array", itemType: "object", required: false }
      });
    } else if (role == 2) {
      //医生 一个科室一个医院 还需要绑定手机号
      this.ctx.validate({
        hospital: { type: "string", required: true },
        phone: { type: "string", required: true },
        sms_code: { type: "string", required: true },
        setions: {
          type: "array",
          itemType: "string",
          required: true,
          max: 1,
          min: 1
        },
        fields: {
          type: "array",
          itemType: "string",
          max: 6,
          min: 1,
          required: true
        },
        description: {
          type: "string",
          max: 200,
          min: 10,
          required: true
        }
      });
    } else if (role == 3) {
      //经理人 1-3个科室和医生
      this.ctx.validate({
        setions: {
          type: "array",
          itemType: "string",
          required: false,
          max: 3,
          min: 1
        },
        agency: {
          type: "array",
          itemType: "object",
          require: true,
          max: 3,
          min: 1
        },
        friends: {
          type: "array",
          itemType: "object",
          required: false
        }
      });
    }
    // 获取参数
    let info = this.ctx.request.body;
    let find = this.service.app.findUserByOpenId(_id);

    // 用户角色列表 0:游客 1:普通用户 2:医生 3:经理人 9:前台页面管理员
    // 用户账号状态 0保留 1未激活 2已激活 3已锁定 9已删除
    if (find.role == 0 && find.status == 1) {
      // 用户首次激活
      if (find.role == 1) {
        // 普通用户
      }
    } else {
      // 非首次用户数据更新
    }
  }

  async doctorSendSms() {
    let reg = this.config.regexp;
    this.ctx.validate({
      phone: { type: "string", format: reg.phone }
    });
    let { phone } = this.ctx.request.body;
    let user = await this.ctx.model.User.findOne({ phone }).exec();
    if (user) return this.error("该手机已注册");
    let find = await this.ctx.model.Sms.find({ phone }).exec();
    let last = find[find.length - 1];
    if (last && new Date(last.created).getTime() + 60 * 1000 > Date.now())
      return this.error("验证码已发送,60s后可重发");
    let res = await this.service.sms.sendPhoneCode(phone, 71356);
    if (!res) return this.error("发送失败,请重新发送");
    else return this.success("验证码发送成功");
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
