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
    .select(`name role nickName status phone 
      hospital certificate department agency 
      friend title treatment_info description 
      gender avatarUrl`)
    .exec();
    if (user) return this.success(user);
    else this.error("未找到您的信息");
  }

  async canUpdate(){
   let oInfo = this.ctx.state.user;
    //判断用户是否可以更新内
    let find = await this.ctx.model.User.findOne({_id:oInfo._id}).exec();
    if(!find) return this.error('未找到帐号');
    // 如果role角色不为0表示非游客 账号状态1未激活
    if (find.role != '0' && find.status == '1') return this.error("账号审核中...");
    else return this.success()
  }

async update() {
  let reg = this.config.regexp;
  this.ctx.validate({
    name: { type: "string", format: reg.name, required: true },
    role: { type: "enum", values: ["0", "1", "2", "3", "9"], required: true },
      // nickName: { type: "string", format: reg.name, required: false },
      phone: { type: "string", format: reg.phone, required: true },
      code: { type: "string", required: true },
      idcard: { type: "string", format: reg.idcard, required: false },
      // country: { type: "string", required: false },
      // province: { type: "string", required: false },
      // city: { type: "string", required: false },

      // hospital: { type: "string", required: true },
      // department: { type: "array", itemType: "string", required: false },
      // friends: { type: "array", itemType: "string", required: false },
      // title: { type: "string", required: false },
      // treatment_info: { type: "array", itemType: "string", required: false },
      // fields: { type: "string", required: false },

      // email: { type: "string", format: reg.email, required: false },
      gender: { type: "enum", values: ["0", "1", "2"], required: true },
      avatar: { type: "object", required: false }
    },this.ctx.request.body);
     // 获取参数
     let info = this.ctx.request.body;
     let oInfo = this.ctx.state.user;
     let { role } = this.ctx.request.body;
    // 找到用户
    let find = await this.ctx.model.User.findOne({_id:oInfo._id}).exec();
    if(!find) return this.error('未找到帐号');
    // 如果role角色不为0表示非游客 账号状态1未激活
    if (find.role != '0' && find.status == '1') return this.error("账号审核中...");
    // 检验验证码
    let canBind = await this.service.sms.validate(info.phone,71356,info.code);
    if(!canBind) return this.error('验证码不正确或者已失效');
    // 转移头像资源地址
    info.avatarUrl='';
    let removeResp = await this.service.qiniu.removeImage([info.avatar]).then(res=>{
      info.avatarUrl = res[0];
    }).catch(()=>{
      throw  new Error('头像设置失败');
    });
    // 二次验证(分角色)
    if (role == '1') {
      //普通用户 关注科室1-3个
      this.ctx.validate({
        department: {
          type: "array",
          required: true,
          max: 3,
          min: 1
        },
        treatment_info: { type: "array", required: false }
      });
    //治疗信息
    info.treatment_info = [];
    if(info.treatment_images.length){
      let treatment_images = [];
      //转移治疗信息的图片
      await this.service.qiniu.removeImage(info.treatment_images).then(res=>{
        treatment_images = res;
      }).catch(()=>{
        throw new Error('就诊资料上传失败');
      });
      //保存治疗信息
      let newTreatInfo = new this.ctx.model.Treatment({
        doctor_name:info.doctor_name,
        illness_name:info.illness_name,
        operation:info.operation,
        treatment_images
      });
      await newTreatInfo.save();
      //将生成的就诊资料_id 存储在治疗信息中
      info.treatment_info.push(newTreatInfo['_id']);
    }
    // 存储信息
    Object.assign(find,{
      name:info.name,
      role:info.role,
      phone:info.phone,
      idcard:info.idcard,
      gender:info.gender,
      avatarUrl:info.avatarUrl?info.avatarUrl:find.avatarUrl,
      department:info.department,
      treatment_info:info.treatment_info,
      audit_create:new Date()
    });
    await find.save();
    this.success('更新成功');
  } else if (role == '2') {
      //医生 一个科室一个医院 还需要绑定手机号
      this.ctx.validate({
        hospital: { type: "object", required: true },
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

      info.hospital_id = info.hospital._id;
      // 存储信息
      Object.assign(find,{
      name:info.name,
      role:info.role,
      phone:info.phone,
      idcard:info.idcard,
      gender:info.gender,
      hospital:info.hospital_id,
      avatarUrl:info.avatarUrl?info.avatarUrl:find.avatarUrl,
      department:info.department,
      description:info.description,
      audit_create:new Date()
    });
    await find.save();
    this.success('更新成功');
    } else if (role == '3') {
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
        friends: {
          type: "array",
          itemType: "object",
          required: false
        }
      });
      // 存储信息
      Object.assign(find,{
      name:info.name,
      role:info.role,
      phone:info.phone,
      idcard:info.idcard,
      gender:info.gender,
      agency:info.agency,
      friends:info.friends,
      department:info.department,
      avatarUrl:info.avatarUrl?info.avatarUrl:find.avatarUrl,
      audit_create:new Date()
    });
      await find.save();
      this.success('更新成功');
    }
  }


  //获取职称列表
  async titleList(){
    try {
      let titles = await this.ctx.model.Title.find().select('name').exec();
      this.success(titles)
    } catch(e) {
      // statements
      console.log(e);
    }
  }

   //获取城市列表
   async getCitys() {
    try {
      let citys = await this.ctx.model.Hospital.find().select('_id city').exec();
      this.success(citys);
    } catch (e) {
      this.error('查找城市出错')
    }
  }
  //根据城市返回医院列表
  async getHospitals() {
    let { _id } = this.ctx.query;
    console.log(_id)
    try {
      let hospitals = await this.ctx.model.Hospital.findOne({ _id }).select('children.label children._id');
      this.success(hospitals.children)
    } catch (e) {
      this.error()
    }
  }

  //获取主科室列表
  async mainDepartments(){
    let list = await this.ctx.model.Department.find().select('label key').exec();
    this.success(list);
  }
  // 获取次科室列表
  async viceDepartments(){
    let {_id} = this.ctx.request.query;
    if(!_id) return this.error('缺少参数');
    let list = await this.ctx.model.Department.findOne({_id}).select('children.label children.key').exec();
    if(list)this.success(list.children);
    else this.error('未找到')
  }


  //搜索医院
  async searchHospital(){
    let res = await this.service.hospital.search(this.ctx.request.body);
    this.success(res)
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
