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
    }, // 用户账号状态 0保留 1未激活 2已激活 3已锁定(也叫审核未通过) 9已删除
    idcard: String, //身份证号
    language: String, //用户的语言，简体中文为zh_CN
    country: String, // 用户所在国家
    province: String, // 用户所在省份
    city: String, // 用户所在城市
    localtion: [
      {
        type: String, //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于wx.openLocation的坐标
        latitude: String, //纬度
        longitude: String, //经度
        speed: String, //速度
        accuracy: String, //位置的精确度
        altitude: String, //高度
        verticalAccuracy: String, //垂直精度（Android 无法获取，返回 0）
        horizontalAccuracy: String //水平精度
      }
    ], //存储用户使用地址
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital"
    }, //医生就职医院ref
    certificate: [
      {
        type: Schema.Types.ObjectId,
        ref: "Asset"
      }
    ], //医生证书
    department: [
      {
        key: Number,
        label: String
      }
    ], // 关联科室 医生只能关联一个科室,患者可以关联最多三个 经理人关联三个
    agency: [
      {
        setions: {
          type: Schema.Types.ObjectId,
          ref: "Department"
        },
        name: String
      }
    ], //经理人代理最多三个科室
    friends: [
      {
        name: "String",
        gender: {
          type: String,
          enum: ["0", "1", "2"], // 0代表未知 1代表男性 2代表女性
          default: "0"
        },
        phone: String,
        hospital: {
          type: Schema.Types.ObjectId,
          ref: "Hospital"
        }, //医生就职医院ref
        title: {
          type: Schema.Types.ObjectId,
          ref: "Title"
        },
        description: String // 简介
      }
    ], // 代理人的潜在客户
    title: {
      type: Schema.Types.ObjectId,
      ref: "Title"
    }, // 职称
    treatment_info: [
      {
        type: Schema.Types.ObjectId,
        ref: "Treatment"
      }
    ], //治疗信息
    fields: [String], // 擅长领域
    description: String, // 简介
    email: String, //邮箱
    gender: {
      type: String,
      enum: ["0", "1", "2"], // 0代表未知 1代表男性 2代表女性
      default: "0"
    }, // 性别
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
      if (!this.avatarUrl && this.avatarUrl == "") {
        const options = {
          margin: 0.2,
          size: 200
        };
        // 使用hash 生成初始化头像
        let hash = Math.random()
          .toString(16)
          .slice(4);
        let avatar = new Identicon(hash + this.openid, options).toString();
        this.avatarUrl = "data:image/png;base64," + avatar;
      }
      // 创建时间
      this.meta.createdAt = this.meta.updatedAt = new Date();
    } else {
      this.meta.updatedAt = new Date();
    }
    next();
  });

  return mongoose.model("User", UserSchema);
};
