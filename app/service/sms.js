"use strict";

const BaseService = require("./base");
const queryString = require("querystring");
class SmsService extends BaseService {

  /**
   * 
   * @param {*} phone 手机号
   * @param {*} tpl_id 模版id 登录71358 找回密码71357 注册71356
   */
  async sendPhoneCode(mobile, tpl_id) {
    let smsConf = this.config.myconfig.sms
    let key = smsConf.SMS_KEY;
    let sms_code = Math.random().toString(10).slice(2, 6);
    let tpl_value = '#code#=' + sms_code;
    if (smsConf.SMS_TYPE.indexOf(tpl_id) > -1) {
      let param = {
        key,
        mobile,
        tpl_id,
        tpl_value
      }
      let strparam = queryString.stringify(param)
      try {
        // let res = await this.ctx.curl(`${smsConf.SMS_URL}?${strparam}`);
        // if (res.data.error_code != 0) return false;
        await this.ctx.model.Sms.create({ phone: mobile, type: tpl_id, sms_code });
        return true;
      } catch (e) {
        throw new Error('数据未存入')
      }
    } else {
      throw new Error('模版id不存在')
    }
  }

  /**
   * 
   * @param {*} phone 手机号
   * @param {*} type 模版id 登录71358 找回密码71357 注册71356 解绑手机71545
   */
  async canSendCode(phone, type) {
    let smsConf = this.config.myconfig.sms
    // 查找验证码存储记录
    let find = await this.ctx.model.Sms.find({ phone, type }).exec();
    // 防止重复 找到最新的一条
    let last = find[find.length - 1];
    // 如果存在 并且不超过保质期 表示通过 否则false
    if (!last || new Date(last.created).getTime() + 60*1000 < Date.now()) return true;
    else return false;
  }
  /**
   * 
   * @param {*} phone 手机号
   * @param {*} type 模版id 登录71358 找回密码71357 注册71356 解绑手机71545
   * @param {*} sms_code 验证码
   */
  async validate(phone,type,sms_code){
    let smsConf = this.config.myconfig.sms
    // 查找验证码存储记录
    let find = await this.ctx.model.Sms.find({ phone, type,sms_code }).exec();
    // 防止重复 找到最新的一条
    let last = find[find.length - 1];
    // 如果存在 并且不超过保质期 表示通过 否则false
    if (last && new Date(last.created).getTime() + smsConf.SMS_EXPIRES > Date.now()) return true;
    else return false;
  }

}

module.exports = SmsService;
