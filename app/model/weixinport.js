/**
 *  功能清单
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const config = app.config.myconfig.dbconfig;
  const WeixinPortSchema = new mongoose.Schema({
    name: String, //名称
    key: String, //调用关键字
    group: String, //所属分类
    roles: {
      type: Array,
      default: [...config.ADMIN_ROLE_TYPE]
    }, //可操作的角色清单
    path: String, //对应微信接口地址
    amount: Number, //每日操作次数上线
    meta: {
      created: {
        type: Date,
        default: new Date()
      },
      updated: {
        type: Date,
        default: new Date()
      }
    }
  });
  WeixinPortSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Weixinport", WeixinPortSchema);
};
