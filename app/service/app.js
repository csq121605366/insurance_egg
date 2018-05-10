// app/service/user.js
const BaseService = require("./base");

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
    let { appID, appSecret } = this.config.myconfig.wx;
    let res;
    try {
      res = await this.ctx.curl(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`,
        {
          method: "GET",
          contentType: "json",
          dataType: "json"
        }
      );
      if (res.status == 200) return res.data;
      else return false;
    } catch (e) {
      throw new Error("获取信息失败");
    }
  }
  async findUserByOpenId(openid) {
    let find;
    try {
      find = await this.ctx.model.User.findOne({
        openid,
        status: { $ne: 9 }
      }).exec();
      return find;
    } catch (e) {
      throw new Error("保存信息失败");
    }
  }
}

module.exports = AppService;
