/**
 * 用户信息
 */

const bcrypt = require("bcrypt");
const Identicon = require("identicon.js");

module.exports = app => {
  const config = app.config.myconfig.dbconfig;
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    openid: String, // 微信的id
    session_key: String, //用户登录获取的session_key
    phone: String, // 手机号 医生需要绑定手机号 使用手机号登录写文章
    sms_code: String, //手机验证码
    username: {
      type: String,
      trim: true
    }, // 用户账号
    name: String, // 姓名
    nickName: String, // 别名
    password: String, // 密码
    role: {
      type: String,
      enum: config.USER_ROLE_TYPE,
      default: config.USER_ROLE_TYPE[0]
    }, // 用户角色列表 0:游客 1:普通用户 2:医生 3:经理人 9:前台页面管理员
    status: {
      type: String,
      enum: config.USER_ROLE_STATUS,
      enum: config.USER_ROLE_STATUS,
      default: config.USER_ROLE_STATUS[1]
    }, // 用户账号状态 0保留 1未激活 2已激活 3审核未通过 9已删除
    idcard: String, //身份证号
    language: String, //用户的语言，简体中文为zh_CN
    country: String, // 用户所在国家
    province: String, // 用户所在省份
    city: String, // 用户所在城市
    localtion: Array, //存储用户使用地址
    hospital: Object, //医生就职医院
    certificate: Array, //医生证书
    department: Array, // 关联科室 医生只能关联一个科室,患者可以关联最多三个 经理人关联三个
    agency: [
      {
        name: String,
        department: {
          label: String,
          key: String
        }
      }
    ], //代理的医生
    friend: Array, // 代理人的潜在客户
    title: String, // 职称
    treatment_info: {
      doctor_name: String, //医生姓名
      illness_name: String, //疾病名字
      operation: {
        type: String,
        enum: ["0", "1", "2"], //是否手术 0保密 1否 2已手术
        default: "0"
      },
      treatment_images: Array // 就诊信息图片数组
    }, //治疗信息
    description: String, // 简介 擅长领域
    email: String, //邮箱
    gender: {
      type: String,
      enum: ["0", "1", "2"], // 0代表未知 1代表男性 2代表女性
      default: "0"
    }, // 性别
    avatar: Object, //用户头像
    avatarUrl: String, // 头像地址
    audit_create: Date, //审核提交日期
    audit_end: Date, //审核结束日期
    meta: {
      createdAt: {
        type: Date,
        default: new Date()
      },
      updatedAt: {
        type: Date,
        default: new Date()
      }
    }
  });

  UserSchema.pre("save", function(next) {
    if (this.isNew) {
      // 创建时间
      this.meta.createdAt = this.meta.updatedAt = new Date();
    } else {
      this.meta.updatedAt = new Date();
    }
    next();
  });
  UserSchema.pre("save", function(next) {
    if (this.avatar && this.avatar.imageURL) {
      this.avatarUrl = "";
    } else if (!this.avatarUrl) {
      const options = {
        margin: 0.2,
        size: 100
      };
      // 使用hash 生成初始化头像
      let hash = Math.random()
        .toString(16)
        .slice(4);
      let avatar = new Identicon(hash + this.openid, options).toString();
      this.avatarUrl = "data:image/png;base64," + avatar;
    }
    next();
  });

  UserSchema.index(
    {
      name: "text",
      "department.label": "text",
      "hospital.label": "text"
    },
    {
      weights: {
        name: 10,
        "department.label": 9,
        "hospital.label": 8
      }
    }
  );

  return mongoose.model("User", UserSchema);
};
