const BaseController = require("./base");
class AppController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }

  // async index() {
  //   // 后台管理员页面
  //   const { ctx } = this;
  //   await ctx.renderClient("app/app.js");
  // }

  /**
   * 登录
   */
  async getToken() {
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
      // if (find.status == '3') return this.error("您的帐号审核未通过");
      //如果用户已经完善信息(不是游客)并且已经激活(已审核) 未完善的用户不发放token
      if (find.role != "0" && find.status == "2") {
        //更新session_key
        find.session_key = session_key;
        // 保存
        try {
          await find.save();
        } catch (e) {
          ctx.throw(403);
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
        ctx.throw(403);
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
      .select(
        `name role nickName status phone 
      hospital certificate department agency 
      friend title description treatment_info
      idcard gender avatarUrl avatar`
      )
      .exec();
    //查询医院
    if (user) return this.success(user);
    else this.error("未找到您的信息");
  }
  //经理人获取潜在客户
  async getFriend() {
    this.ctx.validate({
      friend_id: "string"
    });
    let { friend_id } = this.ctx.request.body;
    let { _id } = this.ctx.state.user;
    let finder = await this.ctx.model.User.findOne({ _id });
    if (!finder) this.ctx.throw(404, "未找到");
    if (finder.role != "3") this.ctx.throw(400, "没有权限");
    if (!finder.friend || !finder.friend.length)
      this.ctx.throw(404, "没有找到潜在客户");
    let res = finder.friend.find(item => item._id == friend_id);
    if (!res) return this.error("未找到");
    this.success(res);
  }

  async getAgency() {
    let { _id } = this.ctx.state.user;
    let finder = await this.ctx.model.User.findOne({ _id });
    if (!finder) this.ctx.throw(404, "未找到");
    if (finder.role != "3") this.ctx.throw(400, "没有权限");
    if (!finder.friend || !finder.friend.length)
      this.ctx.throw(404, "没有找到潜在客户");
    this.success(finder.agency);
  }

  async canUpdate() {
    let oInfo = this.ctx.state.user;
    //判断用户是否可以更新内
    let find = await this.ctx.model.User.findOne({ _id: oInfo._id }).exec();
    if (!find) return this.error("未找到帐号");
    // 如果role角色不为0表示非游客 账号状态1未激活
    if (find.role != "0" && find.status == "1")
      return this.error("账号审核中...");
    else return this.success();
  }

  async updateLocaltion() {
    this.ctx.validate({ localtion: { type: "object", required: false } });
    let { _id } = this.ctx.state.user;
    let { localtion } = this.ctx.request.body;
    await this.ctx.model.User.update(
      { _id },
      { $addToSet: { localtion } }
    ).exec();
    this.success();
  }

  async update() {
    let reg = this.config.regexp;
    this.ctx.validate(
      {
        name: { type: "string", format: reg.name, required: true },
        role: {
          type: "enum",
          values: ["0", "1", "2", "3", "9"],
          required: true
        },
        phone: { type: "string", format: reg.phone, required: true },
        code: { type: "string", required: true },
        idcard: { type: "string", format: reg.idcard, required: true },
        gender: { type: "enum", values: ["0", "1", "2"], required: true },
        avatar: { type: "object", required: false }
      },
      this.ctx.request.body
    );
    // 获取参数
    let info = this.ctx.request.body;
    let oInfo = this.ctx.state.user;
    let { role } = this.ctx.request.body;
    // 找到用户
    let find = await this.ctx.model.User.findOne({ _id: oInfo._id }).exec();
    if (!find) return this.error("未找到帐号");
    // 如果role角色不为0表示非游客 账号状态1未激活
    if ((find.role == "2" || find.role == "3") && find.status == "1")
      return this.error("账号审核中...");
    // 检验验证码
    let canBind = await this.service.sms.validate(info.phone, 71356, info.code);
    if (!canBind) return this.error("验证码不正确或者已失效");
    // 转移头像资源地址
    if (info.avatar && info.avatar.key) {
      await this.service.qiniu
        .removeImage([info.avatar])
        .then(res => {
          info.avatar = res[0];
        })
        .catch(() => {
          ctx.throw(403, "头像设置失败");
        });
    }
    // 二次验证(分角色)
    if (role == "1") {
      //普通用户 关注科室1-3个
      this.ctx.validate({
        department: {
          type: "array",
          required: true,
          max: 3,
          min: 1
        },
        treatment_info: { type: "object", required: false }
      });
      //治疗信息
      if (info.treatment_info) {
        //转移治疗信息的图片
        await this.service.qiniu
          .removeImage(info.treatment_info.treatment_images)
          .then(res => {
            info.treatment_info.treatment_images = res;
          })
          .catch(() => {
            ctx.throw(403, "就诊资料上传失败");
          });
      }
      // 存储信息
      Object.assign(find, {
        treatment_info: info.treatment_info,
        department: info.department,
        status: "2" //用户不需要审核
      });
    } else if (role == "2") {
      //医生 一个科室一个医院 还需要绑定手机号
      this.ctx.validate({
        hospital: { type: "object", required: true },
        title: { type: "string" },
        certificate: { type: "array" },
        department: {
          type: "array",
          required: true,
          max: 1,
          min: 1
        },
        description: {
          type: "string",
          max: 200,
          min: 10,
          required: true
        }
      });
      if (info.certificate.length) {
        //转移治疗信息的图片
        await this.service.qiniu
          .removeImage(info.certificate)
          .then(res => {
            info.certificate = res;
          })
          .catch(() => {
            ctx.throw(403, "就诊资料上传失败");
          });
      }
      // 存储信息
      Object.assign(find, {
        title: info.title,
        hospital: info.hospital,
        department: info.department,
        certificate: info.certificate,
        description: info.description
      });
    } else if (role == "3") {
      //经理人 1-3个科室和医生
      this.ctx.validate({
        department: {
          type: "array",
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
        friend: {
          type: "array",
          itemType: "object",
          required: false
        }
      });
      // 存储信息
      Object.assign(find, {
        agency: info.agency,
        friend: info.friend,
        department: info.department
      });
    }
    // 存储信息
    Object.assign(find, {
      name: info.name,
      role: info.role,
      phone: info.phone,
      idcard: info.idcard,
      gender: info.gender,
      avatar: info.avatar,
      status: "1",
      audit_create: new Date()
    });
    await find.save();
    let token = await this.service.actionsToken.userToken(find);
    this.success({ token });
  }

  //获取职称列表
  async titleList() {
    try {
      let titles = await this.ctx.model.Title.find()
        .select("label")
        .exec();
      this.success(titles);
    } catch (e) {
      // statements
      this.error();
    }
  }

  //获取城市列表
  async getCitys() {
    try {
      let citys = await this.ctx.model.Hospital.find()
        .select("_id city")
        .exec();
      this.success(citys);
    } catch (e) {
      this.error("查找城市出错");
    }
  }
  //根据城市返回医院列表
  async getHospitals() {
    let { _id } = this.ctx.query;
    try {
      let hospitals = await this.ctx.model.Hospital.findOne({ _id }).select(
        "children.label children._id"
      );
      this.success(hospitals.children);
    } catch (e) {
      this.error();
    }
  }

  //搜索医院
  async searchHospital() {
    let res = await this.service.hospital.search(this.ctx.request.body);
    this.success(res);
  }

  // 获取科室人员列表
  async userListBydepartment() {
    let { role, status, _id } = this.ctx.state.user;
    let finder = await this.ctx.model.User.findOne({ _id });
    let department = [];
    finder.department.forEach(element => {
      department.push(element.key);
    });
    let res = { user: [], doctor: [], agent: [] };
    // 角色搜索
    let selectParam = {
      _id: 1,
      name: 1,
      role: 1,
      status: 1,
      hospital: 1,
      title: 1,
      department: 1,
      description: 1,
      gender: 1,
      avatar: 1,
      avatarUrl: 1
    };
    if (role == "1") {
      res = await this.ctx.model.User.aggregate()
        .project(selectParam)
        .match({
          status: "2",
          role: { $in: ["2", "3"] },
          "department.key": { $in: department }
        })
        .unwind("department")
        .match({
          "department.key": { $in: department }
        })
        .exec();
    } else {
      let res1 = await this.ctx.model.User.aggregate()
        .project(selectParam)
        .match({
          role: "1"
        })
        .unwind("department")
        .match({
          _id: { $ne: this.app.mongoose.Types.ObjectId(_id) },
          "department.key": { $in: department }
        })
        .exec();
      let res2 = await this.ctx.model.User.aggregate()
        .project(selectParam)
        .match({
          status: "2", //医生和代理商需要激活
          role: { $in: ["2", "3"] }
        })
        .unwind("department")
        .match({
          _id: { $ne: this.app.mongoose.Types.ObjectId(_id) },
          "department.key": { $in: department }
        })
        .exec();
      res = [...res1, ...res2];
    }
    this.success(res);
  }
  /**
   * 获取用户详细信息
   */
  async userDetail() {
    this.ctx.validate({
      user_id: "string"
    });
    let { user_id } = this.ctx.request.body;
    let find = await this.ctx.model.User.findOne({ _id: user_id }).select(
      `name phone hospital department role title description gender avatarUrl avatar`
    );
    //文章筛选 已审核 公开和仅科室查看
    let article = await this.ctx.model.Article.find({
      user_id,
      status: "2",
      type: { $in: ["1", "2"] }
    })
      .select(
        "title pre_content illness_time illness_name status author department"
      )
      .exec();
    let res = { userinfo: find, article };
    if (find) return this.success(res);
    return this.error("未找到");
  }

  //混合搜索 医生 问题 资讯
  async search() {
    this.ctx.validate({
      key: "string",
      last_id: {
        type: "string",
        required: false,
        allowEmpty: true
      },
      limit: {
        type: "number",
        required: false
      }
    });
    let param = this.ctx.request.body;
    let user = this.ctx.state.user;
    let opts = Object.assign({}, { last_id: 0, limit: 10, key: "" }, param);
    let res = "";
    let oFindParam = {};
    let findParam = {};
    let type = "";
    let last_id = "";
    // 下拉加载
    if (opts.last_id) oFindParam._id = { $gt: opts.last_id };
    let finder = await this.ctx.model.User.findOne({ _id: user._id });
    let finder_department = [];
    finder.department.forEach(element => {
      finder_department.push(element.key);
    });
    //首先搜索问题
    findParam = Object.assign({}, oFindParam, {
      "department.key": { $in: finder_department }, //只能搜索跟自己相关的问题
      $or: [
        { title: new RegExp(param.key, "ig") },
        { illness_name: new RegExp(param.key, "ig") }
      ]
    });
    res = await this.ctx.model.Qa.find(findParam)
      .select("title illness_name department content answer meta")
      .limit(opts.limit ? opts.limit | 0 : 10)
      .exec();
    type = "qa";
    if (!res.length) {
      //没有的话再搜索资讯
      findParam = Object.assign({}, oFindParam, {
        $or: [
          { "department.key": { $in: finder_department }, type: "2" }, //只能搜索跟自己相关的资讯
          { type: "1" } //或者文章是公开的
        ],
        $or: [
          { title: new RegExp(param.key, "ig") },
          { illness_name: new RegExp(param.key, "ig") }
        ] //根据索引搜索关键词
      });
      res = await this.ctx.model.Article.find(findParam)
        .populate({ path: "user_id", select: "name avatar" })
        .select(
          "title author illness_name department pre_content illness_time illness_name images meta"
        )
        .limit(opts.limit ? opts.limit | 0 : 10)
        .exec();
      type = "article";
    }
    if (!res.length) {
      //没有的话再搜索医生
      findParam = Object.assign({}, oFindParam, {
        status: "2",
        role: { $in: ["2"] }, //只能搜索医生和经理人
        "department.key": { $in: finder_department }, //只能搜索跟自己相关的科室
        $or: [
          { name: new RegExp(param.key, "ig") },
          { "department.label": new RegExp(param.key, "ig") },
          { "hospital.label": new RegExp(param.key, "ig") }
        ] //根据索引搜索关键词
      });
      res = await this.ctx.model.User.find(findParam)
        .select(
          "name avatar avatarUrl hospital title department description meta"
        )
        .limit(opts.limit ? opts.limit | 0 : 10)
        .exec();
      type = "user";
    }
    if (!res.length) type = "";
    if (res.length) {
      last_id = res[res.length - 1]["_id"];
    } else {
      last_id = "";
    }
    // res = await this.ctx.model.Hospital.find(findParam).select('city label').limit(opts.limit ? opts.limit | 0 : 10).exec();
    this.success({ list: res, type, last_id });
  }

  //医生发送手机
  // async doctorSendSms() {
  //   let reg = this.config.regexp;
  //   this.ctx.validate({
  //     phone: { type: "string", format: reg.phone }
  //   });
  //   let { phone } = this.ctx.request.body;
  //   let user = await this.ctx.model.User.findOne({ phone }).exec();
  //   if (user) return this.error("该手机已注册");
  //   let find = await this.ctx.model.Sms.find({ phone }).exec();
  //   let last = find[find.length - 1];
  //   if (last && new Date(last.created).getTime() + 60 * 1000 > Date.now())
  //     return this.error("验证码已发送,60s后可重发");
  //   let res = await this.service.sms.sendPhoneCode(phone, 71356);
  //   if (!res) return this.error("发送失败,请重新发送");
  //   else return this.success("验证码发送成功");
  // }

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
