
/**
 * 手机验证码
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const config = app.config.myconfig.sms;
  const SmsSchema = new mongoose.Schema({
    phone: String,//手机号
    sms_code: String, //验证码
    type: Number, //验证码类型 在service.base中已经设置范围
    created: {
      type: Date,
      default: new Date()
    }
  });
  return mongoose.model("Sms", SmsSchema);
};
