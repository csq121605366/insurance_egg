const BaseController = require("./base");
const fs = require("fs");
const path = require('path');
class Admin extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.reg = this.config.regexp;
    this.AdminTransfer = {
      username: {
        type: "string",
        required: true,
        allowEmpty: false
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
    // 页面
    const { ctx } = this;
    await ctx.renderClient("app.js", { hello: 'dsafds' });
  }

  async weixinConnect() {
    this.ctx.type = 'text/plain; charset=utf-8';
    this.ctx.body = fs.createReadStream(path.join(this.app.baseDir, 'j8I4G45DwH.txt'));
  }

  async getToken() {
    const { ctx, service } = this;
    let myconfig = this.app.config.myconfig;
    // 验证参数
    ctx.validate(this.AdminTransfer);
    const { username, password } = ctx.request.body;
    // 使用admin基础服务获取用户信息
    let find = await this.ctx.model.Admin.find({
      $or: [{ username }, { phone: username }]
    }).exec();
    find = find[0];
    // 帐号不存在就返回错误
    if (!find) return this.error("账号未找到");
    // 每次登录调用数据库方法增加一次登录次数
    find.incLoginAttempts();
    // 如果用户被锁就返回错误
    if (find.isLocked) {
      let time = ((new Date(find.lockUntil).getTime() - Date.now()) / 1000) | 0;
      return this.error(`尝试登录次数太多账号已被锁,解锁时间还有${time}秒`);
    }
    // 管理员状态检测
    if (find.status != "2") return this.error("帐号状态有误,请联系最高管理员");
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
    let _id = this.ctx.state.user._id;
    let find = await this.ctx.model.Admin.findOne({ _id })
      .select("-_id -__v -password -loginAttempts -lockUntil")
      .exec();
    if (!find) return this.error("未找到");
    return this.success(find);
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
    find.password = newPassword;
    try {
      await find.save();
      return this.success();
    } catch (e) {
      return this.error();
    }
  }

  //绑定手机
  async bindPhone() {
    this.ctx.validate({
      phone: { type: "string", format: this.reg.phone },
      code: "string"
    });
    let { _id } = this.ctx.state.user;
    let { phone, code } = this.ctx.request.body;
    // 查找是否有绑定该手机号的
    let one = await this.ctx.model.Admin.findOne({ phone }).exec();
    if (one) return this.error("该手机已绑定");
    //找到要绑定的帐号
    let find = await this.ctx.model.Admin.findOne({ _id }).exec();
    // 检验验证码是否正确
    let validate = await this.service.sms.validate(phone, 71356, code);
    if (!validate) return this.error("验证码不正确");
    //绑定手机号
    find.phone = phone;
    await find.save();
    this.success("绑定成功");
  }
  //解绑手机
  async unbindPhone() {
    this.ctx.validate({
      phone: { type: "string", format: this.reg.phone },
      code: "string"
    });
    let { _id } = this.ctx.state.user;
    let { phone, code } = this.ctx.request.body;
    //找到要绑定的帐号
    let find = await this.ctx.model.Admin.findOne({ _id }).exec();
    if (find.phone != phone) return this.error("不是该账户绑定的手机号");
    // 检验验证码是否正确
    let validate = await this.service.sms.validate(phone, 71545, code);
    if (!validate) return this.error("验证码不正确");
    //绑定手机号
    find.phone = "";
    await find.save();
    this.success("解绑成功");
  }

  // async uploadByStream() {
  //   const { ctx } = this;
  //   return this.success(ctx.state.user);
  //   // 上传当前文件本身用于测试
  //   const fileStream = fs.createReadStream(__filename);
  //   // httpbin.org 不支持 stream 模式，使用本地 stream 接口代替
  //   const url = `${ctx.protocol}://${ctx.host}/stream`;
  //   const result = await ctx.curl(url, {
  //     // 必须指定 method，支持 POST，PUT
  //     method: "POST",
  //     // 以 stream 模式提交
  //     stream: fileStream
  //   });
  //   ctx.status = result.status;
  //   ctx.set(result.headers);
  //   this.success(200, "请求成功", result);
  //   // 响应最终会是类似以下的结果：
  //   // {"streamSize":574}
  // }

  //获取用户列表
  async geUserList() {
    this.ctx.validate({
      role: "string",
      status: "string",
      currentPage: {
        type: "number",
        required: false
      },
      limit: "number"
    });
    let { role, status, currentPage, limit } = Object.assign(
      {},
      { currentPage: 1 },
      this.ctx.request.body
    );
    try {
      let selectParam = {
        name: 1,
        phone: 1,
        avatarUrl: 1,
        avatar: 1,
        gender: 1,
        hospital: 1,
        friend: 1,
        agency: 1,
        title: 1,
        department: 1,
        description: 1,
        certificate: 1,
        meta: 1,
        audit_create: 1,
        audit_end: 1,
        status: 1
      };
      let find = await this.ctx.model.User.find({ role: role, status: status })
        .skip(((currentPage - 1) * limit) | 0)
        .limit(limit | 0)
        .select(selectParam)
        .exec();
      let amount = await this.ctx.model.User.find({
        role: role,
        status: status
      })
        .count()
        .exec();
      this.success({ list: find, amount, currentPage: currentPage | 0 });
    } catch (e) {
      this.ctx.throw(500, "服务器错误");
    }
  }

  //审核用户
  async auditUser() {
    this.ctx.validate({
      user_id: "string",
      status: { type: "enum", values: ["2", "3"] }
    });
    let { role } = this.ctx.state.user;
    let { user_id, status } = this.ctx.request.body;
    if (role != "2" && role != "9") return this.error("只有管理员可以审核!");
    // 将已锁定和未激活的用户激活
    let find = await this.ctx.model.User.findOne({
      _id: user_id,
      status: "1"
    }).exec();
    if (!find) return this.error("未找到该用户,或该用户已被删除");
    // 激活用户账户
    find.status = status;
    find.audit_end = new Date();
    try {
      await find.save();
      return this.success();
    } catch (e) {
      ctx.throw(500, "服务器错误");
    }
  }

  async userListByDepartment() {
    this.ctx.validate({ key: "number" });
    let { key } = this.ctx.request.body;
    // 角色搜索
    let selectParam = {
      _id: 1,
      name: 1,
      role: 1
    };
    let find = await this.ctx.model.User.aggregate()
      .match({
        $or: [
          { role: "1", status: { $in: ["1", "2"] } },
          { role: { $in: ["2", "3"] }, status: "2" }
        ],
        "department.key": key
      })
      .project(selectParam)
      .group({
        _id: { role: "$role" },
        item: { $addToSet: { name: "$name", user_id: "$_id" } }
      })
      .sort({ "_id.role": -1 })
      .exec();
    this.success(find);
  }

  async userDetailByDepartment() {
    this.ctx.validate({ user_id: "string" });
    let { user_id } = this.ctx.request.body;
    let selectParam = `-sms_code -session_key -password -openid`;
    let find = await this.ctx.model.User.findOne({ _id: user_id })
      .select(selectParam)
      .exec();
    this.success(find);
  }
}

module.exports = Admin;
