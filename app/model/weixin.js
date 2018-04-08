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
        default: Date.now()
      },
      updated: {
        type: Date,
        default: Date.now()
      }
    }
  });
  WeixinSchema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = Date.now();
    } else {
      this.meta.updated = Date.now();
    }
    next();
  });
  return mongoose.model("Weixin", WeixinSchema);
};
