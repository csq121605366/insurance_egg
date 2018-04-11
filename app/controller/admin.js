const BaseController = require("./base");
const fs = require("fs");
const FormStream = require("formstream");

class Admin extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.AdminTransfer = {
      username: {
        type: "string",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.username
      },
      password: {
        type: "string",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.password
      }
    };
    this.AdminRegisterTransfer = {
      username: {
        type: "string",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.username
      },
      password: {
        type: "string",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.password
      },
      role: {
        type: "enum",
        required: true,
        values: this.config.myconfig.dbconfig.ADMIN_ROLE_TYPE
      }
    };
    this.AdminResetPswTransfer = {
      oldPassword: {
        type: "password",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.password
      },
      newPassword: {
        type: "password",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.password
      }
    };
  }

  async index() {
    // 后台管理员页面
    const { ctx } = this;
    await ctx.renderClient("admin/app.js", { csrf: ctx.csrf, msg: "你好" });
  }

  async getToken() {
    const { ctx, service } = this;
    let myconfig = this.app.config.myconfig;
    const { username, password } = ctx.request.body;
    // 验证参数
    ctx.validate(this.AdminTransfer);
    // 使用admin基础服务获取用户信息
    const find = await service.admin.findbyusername(username);
    // 帐号不存在就返回错误
    if (!find) return this.error("账号未找到");
    // 管理员状态检测
    if (find.status !== 2) return this.error("帐号状态有误,请联系最高管理员");
    // 每次登录调用数据库方法增加一次登录次数
    find.incLoginAttempts();
    // 如果用户被锁就返回错误
    if (find.isLocked) {
      let time = ((new Date(find.lockUntil).getTime() - Date.now()) / 1000) | 0;
      return this.error(`尝试登录次数太多账号已被锁,解锁时间还有${time}秒`);
    }
    // 比较密码
    let isMatch = await find.comparePassword(password, find.password);
    let max = myconfig.dbconfig.MAX_LOGIN_ATTEMPTS;
    let count = max - find.loginAttempts > 0 ? max - find.loginAttempts : max;
    // 不匹配返回错误
    if (!isMatch) return this.error(`密码不正确,还有${count}次机会尝试`);
    // 得到token
    let token = await service.actionsToken.adminToken(find);
    this.success({ token }, "成功获取token");
  }

  //获取用户详情
  async getUserinfo() {
    const { ctx } = this;
    let _id = this.ctx.state.user._id;
    let find = await this.service.admin.show(_id);
    if (!find) return this.error("未找到");
    return this.success(find._doc);
  }

  //创建用户
  async createUser() {
    const { ctx, service } = this;
    const { username, password, role } = ctx.request.body;
    // 验证
    ctx.validate(this.AdminRegisterTransfer);
    const find = await service.admin.findbyusername(username);
    if (find) return this.error("帐号已存在");
    let user = this.ctx.state.user;
    if (!user || user.role != 9) return this.error("您没有权限");
    let newOne = new ctx.model.Admin({ username, password, role });
    try {
      await newOne.save();
      this.success({ username: newOne.username }, "注册成功");
    } catch (e) {
      return this.error();
    }
  }

  //登录状态更改密码
  async resetPassword() {
    // 检验密码
    this.ctx.validate(this.AdminResetPswTransfer);
    let { oldPassword, newPassword, reNewPassword } = this.ctx.request.body;
    if (newPassword !== reNewPassword) return this.error("两次密码输入不一样!");
    let user = this.ctx.state.user;
    let find = await this.ctx.model.Admin.findOne({ _id: user._id }).exec();
    if (!find) return this.error("未找到用户信息");
    // 比较密码
    let isMatch = await find.comparePassword(oldPassword, find.password);
    // 不正确抛出错误
    if (!isMatch) return this.error(`密码不正确`);
    // 修改密码
    find.password = oldPassword;
    try {
      await find.save();
      return this.success();
    } catch (e) {
      return this.error();
    }
  }

  async resetPasswordLoginType() {
    // 检验密码
    this.ctx.validate(this.AdminResetPswTransfer);
    let { oldPassword, newPassword, reNewPassword } = this.ctx.request.body;
    if (newPassword !== reNewPassword) return this.error("两次密码输入不一样!");
    let user = this.ctx.state.user;
    let find = await this.ctx.model.Admin.findOne({ _id: user._id }).exec();
    if (!find) return this.error("未找到用户信息");
    // 比较密码
    let isMatch = await find.comparePassword(oldPassword, find.password);
    // 不正确抛出错误
    if (!isMatch) return this.error(`密码不正确`);
    // 修改密码
    find.password = oldPassword;
    try {
      await find.save()
      return this.success();
    } catch (e) {
      return this.error();
    }
  }

  //修改管理员信息
  async resetUserinfo() { }

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

  



  async uploadByStream() {
    const { ctx } = this;
    return this.success(ctx.state.user);
    // 上传当前文件本身用于测试
    const fileStream = fs.createReadStream(__filename);
    // httpbin.org 不支持 stream 模式，使用本地 stream 接口代替
    const url = `${ctx.protocol}://${ctx.host}/stream`;
    const result = await ctx.curl(url, {
      // 必须指定 method，支持 POST，PUT
      method: "POST",
      // 以 stream 模式提交
      stream: fileStream
    });
    ctx.status = result.status;
    ctx.set(result.headers);
    this.success(200, "请求成功", result);
    // 响应最终会是类似以下的结果：
    // {"streamSize":574}
  }





}

module.exports = Admin;
