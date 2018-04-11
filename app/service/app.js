// app/service/user.js
const BaseService = require('./base');

class AppService extends BaseService {
  constructor(params) {
    super(params);
   
  }

  /**
   * 用户登录然后去获取session
   * @param {*} code 
   * @param {*} appid 
   * @param {*} appSecret 
   */
  async getSessionKey(code) {
    let {
      appID,
      appSecret
    } = this.config.myconfig.wx;
    let res = await this.ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, {
      method: 'GET',
      contentType: 'json',
      dataType: 'json'
    })
    if (res.status == 200) return res.data;
    else return false;
  }

}

module.exports = AppService;