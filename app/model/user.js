/**
 * 用户信息
 */

const bcrypt = require("bcrypt");

module.exports = app => {
  const config = app.config.myconfig.dbconfig;
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    openid: String, // 微信的id
    username: {
      type: String,
      trim: true
    }, // 用户账号
    name: String, // 姓名
    nickname: String, // 别名
    password: String, // 密码
    role: String, // 角色
    phone: String, // 手机号
    idcard: String, //身份证号
    address: String, // 联系地址
    hospital: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital'
    }, //医生就职医院ref
    setions: [{
      type: Schema.Types.ObjectId,
      ref: "Setion"
    }], // 关联科室 医生只能关联一个科室,患者可以关联最多三个 经理人代理三个科室
    friends: [{
      type: Schema.Types.ObjectId,
      ref: "Setion"
    }], //关联用户 代理人关联医生
    title: {
      type: Schema.Types.ObjectId,
      ref: "Title"
    }, // 职称
    treatment_info: [{
      type: Schema.Types.ObjectId,
      ref: 'Treatment'
    }], //治疗信息
    fields: String, // 擅长领域
    description: String, // 简介
    email: String, //邮箱
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 1
    }, // 用户账号状态 0未激活 1激活 2锁定 3已删除
    gender: {
      type: Number,
      enum: [0, 1, 2] // 0代表女性 1代表男性 2代表未知
    }, // 性别
    avatar: String, // 头像地址
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


  UserSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.createdAt = this.meta.updatedAt = new Date();
    } else {
      this.meta.updatedAt = new Date();
    }
    next();
  });

  return mongoose.model("User", UserSchema);
};
