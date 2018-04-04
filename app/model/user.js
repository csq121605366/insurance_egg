/**
 * 用户信息
 */

const bcrypt = require('bcrypt');

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
    password: String, // 密码
    role: String, // 角色
    name: String, // 姓名
    nickname: String, // 别名
    title: {
      type: Schema.Types.ObjectId,
      ref: 'Title'
    }, // 职称
    setions: [{ type: Schema.Types.ObjectId, ref: 'Setion' }], // 关联科室 医生只能关联一个科室,患者可以关联最多三个
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }], // 关联擅长领域
    description: String, // 简介
    email: String, // 邮箱
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 1
    }, // 用户账号状态 0未激活 1激活 2锁定 3已删除
    gender: {
      type: Number,
      enum: [0, 1, 2] // 0代表女性 1代表男性 2代表未知
    }, // 性别
    avatarUrl: String, // 头像地址
    phoneNumber: String, // 手机号
    idcard: String,
    address: String, // 联系地址
    country: String, // 国家
    province: String, // 省份
    city: String, // 城市
    loginAttempts: {
      type: Number,
      required: true,
      default: 0
    }, // 登录错误试图次数
    lockUntil: Number, // 锁定账号的截至时间
    resetPasswordToken: String, // 重置密码token
    resetPasswordTime: Date, // 重置密码时间
    meta: {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    }
  });

  // 定义虚拟属性是否锁了
  UserSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
  });

  UserSchema.pre('save', function (next) {
    if (this.isNew) {
      this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
      this.meta.updatedAt = Date.now();
    }
    next();
  });

  UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(config.SALT_STRENGTH, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  });

  UserSchema.methods = {
    comparePassword(password, hash) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, async (err, isMatch) => {
          if (!err && isMatch) {
            // 如果登录成功重置尝试登录次数为0;
            await this.update({
              $set: {
                loginAttempts: 1
              },
              $unset: {
                lockUntil: 1
              }
            });
            resolve();
          } else {
            reject();
          }
        });
      });
    },
    async incLoginAttempts() {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        // 解锁
        return await this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        });
      }
      // 不符合解锁就每次登录增加次数
      const updates = {
        $inc: {
          loginAttempts: 1
        }
      };
      if (this.loginAttempts + 1 >= config.MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = {
          lockUntil: Date.now() + config.LOCK_TIME
        };
      }
      return await this.update(updates);
    }
  };
  return mongoose.model('User', UserSchema);
};
