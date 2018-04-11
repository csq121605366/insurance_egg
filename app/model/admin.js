/**
 *
 * 管理员信息
 *
 */
const bcrypt = require("bcrypt");
const Identicon = require("identicon.js");

module.exports = app => {
  const config = app.config.myconfig.dbconfig;

  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminSchema = new Schema({
    username: {
      type: String,
      trim: true,
      require: true
    }, // 用户账号
    password: {
      type: String,
      require: true
    }, // 密码
    email: String, // 邮箱
    role: {
      type: String,
      enum: config.ADMIN_ROLE_TYPE,
      default: config.ADMIN_ROLE_TYPE[1]
    }, //后台管理员角色 0保留  1普通管理员 2管理员 9超级管理员
    status: {
      type: Number,
      enum: config.ADMIN_ROLE_STATUS,
      default: config.ADMIN_ROLE_STATUS[2]
    }, // 用户账号状态 0保留 1未激活 2已激活 3已锁定 9已删除
    email_code: {
      code: String,
      createdAt: Date
    }, // {code:验证码,createdAt:发送时间}
    avatarUrl: String, // 头像地址 或者头像png
    phone: String,
    loginAttempts: {
      type: Number,
      default: config.MAX_LOGIN_ATTEMPTS
    }, // 登录错误试图次数
    lockUntil: {
      type: Number
    }, // 锁定账号的截至时间
    resetPasswordToken: String, // 重置密码token
    resetPasswordTime: Date, // 重置密码时间
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

  // 定义虚拟属性是否锁了
  AdminSchema.virtual("isLocked").get(function() {
    return !!(this.lockUntil && this.lockUntil > new Date().getTime());
  });

  AdminSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(config.SALT_STRENGTH, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) return next(error);
        user.password = hash;
        next();
      });
    });
  });

  AdminSchema.pre("save", function(next) {
    if (this.isNew) {
      if (!this.avatar) {
        const options = {
          margin: 0.2,
          size: 200
        };
        // 使用hash 生成初始化头像
        let hash = Math.random()
          .toString(16)
          .slice(4);
        let avatar = new Identicon(hash + this._id, options).toString();
        this.avatarUrl = "data:image/png;base64," + avatar;
      }
      // 创建时间
      this.meta.createdAt = this.meta.updatedAt = new Date();
    } else {
      this.meta.updatedAt = new Date();
    }
    next();
  });

  AdminSchema.methods = {
    // password要比较的密码, hash数据库里面的密码
    comparePassword(password, hash) {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, async (err, isMatch) => {
          if (err) reject("err");
          if (isMatch) {
            // 如果登录成功重置尝试登录次数为0;
            await this.update(
              {
                $set: {
                  loginAttempts: 1
                },
                $unset: {
                  lockUntil: 1
                }
              },
              function(err, doc) {
                if (!err) resolve(isMatch);
                reject(err);
              }
            );
          } else {
            resolve(isMatch);
          }
        });
      });
    },
    async incLoginAttempts() {
      if (this.lockUntil && this.lockUntil < new Date().getTime()) {
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
      if (
        this.loginAttempts + 1 >= config.MAX_LOGIN_ATTEMPTS &&
        !this.isLocked
      ) {
        updates.$set = {
          lockUntil: new Date().getTime() + config.LOCK_TIME
        };
      }
      return await this.update(updates);
    }
  };
  return mongoose.model("Admin", AdminSchema);
};
