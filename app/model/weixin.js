/**
 * 微信token保存
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const WeixinSchema = new mongoose.Schema({
    name: String,
    data: String,
    expires_in: Number,
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
  WeixinSchema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Weixin", WeixinSchema);
};
