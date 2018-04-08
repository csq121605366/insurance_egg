const fs = require("fs");
const path = require("path");
// 签名算法
const util = require("../extend/common");
const _ = require("lodash");
// app/service/user.js
const BaseService = require("./base");
const request = require("request-promise");

class WeixinService extends BaseService {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 从本地数据库拉取微信接口信息
   */
  async pullWeixinPort() {
    let res;
    try {
      res = await this.ctx.model.Weixinport.find();
    } catch (err) {
      throw new Error("数据库连接发生错误");
    }
    return res;
  }

  // 通过上面拉去接口的key去获取相应path
  getApi(key) {
    let apis = this.app.weixinPort;
    let res = _.find(apis, i => i.key === key);
    if (!res) throw new Error("未找到接口");
    return res;
  }

  test() {
    return this.getApi("common_getAccessToken");
  }

  /**
   * 向微信请求接口
   */
  async request(options) {
    delete options.api;
    options = Object.assign({}, options, { json: true });
    try {
      const response = await request(options);
      return response;
    } catch (error) {
      await sendToWormhole(options.formData.media);
      console.error(error);
    }
    // if (options.stream) {
    //   options = Object.assign({}, options, {
    //     dataType: "json"
    //   });
    // } else {
    //   options = Object.assign({}, options, {
    //     dataType: "json",
    //     contentType: "json"
    //   });
    // }
    // // 删除api
    // delete options.api;
    // console.log(options);
    // try {
    //   const response = await this.ctx.curl(options.url, options);
    //   return response.data;
    // } catch (e) {
    //   console.log(e);
    //   if (options.stream) {
    //     await sendToWormhole(options.stream);
    //   }
    //   throw new Error("向微信发送请求失败!");
    // }
  }
  /**
   * 获取token
   */
  async fetchToken(name = "access_token") {
    // 获取token
    let data = await this.getToken(name);
    // 测试token是否可用
    if (!this.isVaild(data)) {
      console.log(
        "============================更新返回============================"
      );
      // 如果不可用就更新token
      data = await this.updateToken(name);
      await this.saveToken(data, name);
      // 返回更新了的token
      return data.access_token;
    } else {
      console.log(
        "============================正常返回============================"
      );
      // 返回数据库查到的token
      return data.data;
    }
  }
  /**
   * 更新Token
   */
  async updateToken(name) {
    let url;
    if (name == "access_token") {
      url =
        this.getApi("common_getAccessToken").path +
        "&appid=" +
        this.config.myconfig.wechat.appID +
        "&secret=" +
        this.config.myconfig.wechat.appSecret;
    } else if (name == "ticket") {
      let find = await this.getToken("access_token");
      url =
        this.getApi("ticket_get").path +
        "&access_token=" +
        find.data +
        "&type=jsapi";
    }
    const data = await this.request({ url });
    data.expires_in = Date.now() + (data.expires_in - 20) * 1000;
    return data;
  }

  /**
   * 微信的access_token 和ticket的获取
   * @param {Object} data
   */
  async getToken(name) {
    if (!name) throw new Error("缺少参数");
    return await this.ctx.model.Weixin.findOne({
      name
    }).exec();
  }
  /**
   *  微信发过来的access_token 和ticket的保存
   * @param {Object} data
   */
  async saveToken(data, name) {
    let find;
    await this.ctx.model.Weixin.findOne({ name })
      .exec()
      .then(doc => {
        find = doc;
      })
      .catch(error => {
        throw new Error(error);
      });
    if (find) {
      find.data = data[name] ? data[name] : data.data;
      find.expires_in = data.expires_in;
    } else {
      find = new WeixinModel({
        name: name,
        body: data[name],
        expires_in: data.expires_in
      });
    }
    await find
      .save()
      .then(doc => {
        return doc;
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  /**
   * 获取权限地址
   * @param {*} args
   */
  getAuthorizeURL(scope = "snsapi_base", target, state) {
    return `${this.getApi("oauth_authorize").path}appid=${
      this.config.myconfig.wechat.appID
    }&redirect_uri=${encodeURIComponent(
      target
    )}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  }

  /**
   *  OAUTH获取用户信息通过code
   * @param {*} code
   */
  async getUserByCode(code) {
    // 根据从微信获取的code去请求用于oauth认证的token
    let data = await this.fetchAuthToken(code);
    let user = await this.getAuthUserInfo(data.access_token, data.openid);
    return user;
  }

  /**
   * oauth认证token用于获取用户数据
   */
  async fetchAuthToken(code) {
    if (!code) throw new Error("缺少code");
    // 组装请求地址
    const url = `${this.getApi("oauth_accessToken").path}appid=${
      this.config.myconfig.wechat.appID
    }&secret=${
      this.config.myconfig.wechat.appSecret
    }&code=${code}&grant_type=authorization_code`;
    const data = await this.request({ url });
    return data;
  }

  async getAuthUserInfo(token, openID, lang = "zh_CN") {
    const url = `${
      this.getApi("oauth_userInfo").path
    }access_token=${token}&openid=${openID}&lang=${lang}`;
    const data = await this.request({ url });
    return data;
  }

  /**
   * @param {*} data 日期
   * @param {*} name
   */
  isVaild(data) {
    // 检测获取的值是否有效 缺值就去更新
    if (!data || !data.data || !data.name || !data.expires_in) return false;
    // 时间比较
    return Date.now() < data.expires_in;
  }

  /**
   * 事件句柄
   * @param {*} operation 操作类型 (下列所有方法名字)
   * @param {*} args 其余参数
   */
  async handle(operation, ...args) {
    let tokenData = await this.fetchToken();
    let options = this[operation](tokenData, ...args);
    let data = await this.request(options);
    return data;
  }

  /**
   * 上传素材
   * @param {*} token token
   * @param {*} type 素材类型
   * @param {*} material 素材地址
   * @param {*} permanent 是否为永久素材，如果存在permanent则为永久素材否则相反
   */
  uploadMaterial(token, type, stream, permanent) {
    // let form = new formstream();
    // form.stream(stream.filename, stream, stream.filename);
    // let form = fs.createReadStream("test.jpg");
    // console.log(form);
    // stream.path = 'test.jpg'
    // return;
    let data;
    let api = permanent
      ? this.getApi("permanent_upload")
      : this.getApi("temporary_upload");
    let url = api.path + "access_token=" + token + "&type=" + type;
    return {
      method: "POST",
      url,
      formData: { media: stream },
      api
    };
    // if (permanent) {
    //   form = Object.assign({}, form, permanent);
    // }
    // if (type === "pic") {
    //   api = this.getApi("permanent_uploadNewsPic");
    //   url = api.path;
    // }
    // if (type === "news") {
    //   api = this.getApi("permanent_uploadNews");
    //   url = api.path;
    //   form = material;
    // } else {
    //   // form.media = fs.createReadStream(material);
    //   form.media = material;
    // }
    // url = url + "access_token=" + token;
    // if (!permanent) {
    //   url += "&type=" + type;
    // } else {
    //   if (type !== "news") {
    //     form.access_token = token;
    //   }
    // }
    if (type === "news") {
      return { method: "POST", url, body: form };
    } else {
      return { method: "POST", url, formData: form };
    }
  }

  /**
   * 获取素材
   * @param {*} token token
   * @param {*} mediaId 媒体id
   * @param {*} type 获取素材类型
   * @param {*} permanent 是否为永久素材，如果存在permanent则为永久素材否则相反
   */
  fetchMaterial(token, mediaId, type, permanent) {
    let form = {};
    let api = permanent
      ? this.getApi("permanent_upload")
      : this.getApi("temporary_upload");
    let url = api.path;
    let fetchUrl = url + "access_token=" + token;
    if (permanent) {
      form.media_id = mediaId;
      form.access_token = token;
    } else {
      if (type === "video") {
        url = url.replace("https://", "http://");
      }
      url += "&media_id=" + mediaId;
    }
    return { method: "POST", url, body: form, api };
  }

  /**
   *  删除永久素材
   * @param {*} token token
   * @param {*} meidaId 媒体id
   */
  deleteMaterial(token, meidaId) {
    let form = {
      media_id: mediaId
    };
    let url =
      this.getApi("permanent_del").path +
      "access_token=" +
      token +
      "&media_id=" +
      meidaId;
    return { method: "POST", url, body: form };
  }

  /**
   * 更新图文内容
   * @param {*} token token
   * @param {*} mediaId 媒体id
   * @param {*} news 新闻内容
   */
  updateMaterial(token, mediaId, news) {
    let form = {
      media_id: mediaId
    };
    from = Object.assign({}, form, news);
    let url =
      this.getApi("permanent_update").path +
      "access_token=" +
      token +
      "&media_id=" +
      mediaId;
    return { method: "GET", url, body: form };
  }

  /**
   *  返回素材总数
   * @param {*} token token
   * @param {*} options 参数
   */
  countMaterial(token, options = { type: "image", offset: 0, count: 10 }) {
    let url = this.getApi("permanent_batch").path + "access_token=" + token;
    return { method: "POST", url, body: options };
  }

  /**
   * 新增标签
   * @param {*} token
   * @param {*} name 要新增的标签名称
   */
  createTag(token, name) {
    let form = { tag: { name } };
    let api = this.getApi("tags_create");
    let url = api.path + "access_token=" + token;
    return { method: "POST", url, body: form, api };
  }

  /**
   * 获取公众号已创建的标签
   * @param {*} token
   */
  fetchTags(token) {
    let api = this.getApi("tags_fetch");
    let url = api.path + "access_token=" + token;
    return { url, api };
  }

  /**
   * 编辑标签
   * @param {*} token
   * @param {*} tagId
   * @param {*} name
   */
  updateTag(token, id, name) {
    let api = this.getApi("tags_update");
    let body = { tag: { id, name } };
    let url = api.path + "access_token=" + token;
    return { method: "POST", url, body, api };
  }

  /**
   * 删除标签
   * 当某个标签下的粉丝超过10w时，后台不可直接删除标签，
   * @param {*} token
   * @param {*} tagId
   */
  delTag(token, id) {
    let body = { tag: { id } };
    let api = this.getApi("tags_del");
    let url = api.path + "access_token=" + token;
    return { method: "POST", url, body, api };
  }

  /**
   * 获取标签下粉丝列表
   * @param {*} token
   * @param {*} tagId 标签id
   * @param {*} next_openid 第一个拉取的openid，不填写默认从头开始
   */
  fetchTagUsers(token, tagId, next_openid = "") {
    let body = {
      tagid: tagId,
      next_openid: next_openid
    };
    let api = this.getApi("tags_fetchUsers");
    let url = api.path + "access_token=" + token;
    return { method: "POST", url: url, body, api };
  }

  /**
   * 批量为用户打标签和删除标签
   * @param {*} token
   * @param {*} openIdList 粉丝列表
   * @param {*} tagId tag的标识符
   * @param {*} unTag true代表删除 不填或者false代表增加
   */
  batchTag(token, openidlist, tagid, unTag) {
    if (!Array.isArray(openidlist)) {
      throw new Error("传入的参数有误");
    }
    let body = {
      openid_list: openidlist,
      tagid: tagid
    };
    let api = unTag
      ? this.getApi("tags_batchUnTag")
      : this.getApi("tags_batchTag");
    let url = api.path;
    url += "access_token=" + token;
    return { method: "POST", url, body, api };
  }

  /**
   * 获取用户身上的标签列表
   * @param {*} token
   * @param {*} openid 用户id
   */
  getTagList(token, openid) {
    let body = { openid };
    let api = this.getApi("tags_getTagList");
    let url = api.path + "access_token=" + token;
    return { method: "POST", url, body, api };
  }

  /**
   * 设置用户备注名
   * @param {*} token
   * @param {*} openid 用户标识
   * @param {*} remark 备注名
   */
  remarkUser(token, openid, remark) {
    let body = {
      openid: openid,
      remark: remark
    };
    let api = this.getApi("user_remark");
    let url = api.path + "access_token=" + token;
    return { method: "POST", url, body, api };
  }

  /**
   * 获取用户基本信息（包括UnionID机制）
   * @param {*} token
   * @param {*} openid
   * @param {*} lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  getUserInfo(token, openid, lang = "zh_CN") {
    let api = this.getApi("user_info");
    let url = api.path + `access_token=${token}&openid=${openid}&lang=${lang}`;
    return { method: "GET", url, api };
  }

  /**
   * 批量获取用户基本信息
   * @param {*} token
   * @param {*} openidlist
   */
  batchUserInfo(token, openidlist, lang = "zh_CN") {
    let body = { user_list: [] };
    openidlist.forEach(function(element, index) {
      body.user_list.push({
        openid: element,
        lang
      });
    }, this);
    let api = this.getApi("user_batchInfo");
    let url = api.path + `access_token=${token}`;
    return { method: "POST", url: url, body, api };
  }

  /**
   * 获取用户列表
   * @param {*} token
   * @param {*} next_openid (不填写 默认从头开始拉去)
   */
  fetchUserList(token, next_openid = "") {
    let api = this.getApi("user_fetchUserList");
    let url = api.path + `access_token=${token}&next_openid=${next_openid}`;
    return { method: "GET", url, api };
  }
  /**
   * 获取黑名单列表
   * @param {*} token
   * @param {*} begin_openid (不填写 默认从头开始拉去)
   */
  getBlackList(token, begin_openid = "") {
    let api = this.getApi("user_getBlackList");
    let url = api.path + `access_token=${token}`;
    return { method: "POST", url, body: { begin_openid }, api };
  }

  /**
   * 拉黑和取消拉黑用户
   * @param {*} token
   * @param {*} openid_list (不填写 默认从头开始拉去)
   * @param {*} unbatch (填写为取消拉黑)
   */
  batchBlackUsers(token, openid_list, unbatch) {
    let api;
    if (unbatch) {
      api = this.getApi("user_batchUnBlackUsers");
    } else {
      api = this.getApi("user_batchBlackUsers");
    }
    let url = api.path + `access_token=${token}`;
    return { method: "POST", url, body: { openid_list }, api };
  }

  /**
   * 自定义菜单创建接口
   * @param {*} token
   * @param {*} menu
   */
  createMenu(token, body) {
    let api = this.getApi("menu_create");
    let url = api.path + "access_token=" + token;
    return { method: "POST", url, body, api };
  }

  /**
   * 自定义菜单查询接口
   * @param {*} token
   */
  getMenu(token) {
    let api = this.getApi("menu_get");
    let url = api.path + "access_token=" + token;
    return { method: "GET", url, api };
  }

  /**
   * 自定义菜单删除接口
   * @param {*} token
   */
  delMenu(token) {
    let api = this.getApi("menu_get");
    let url = api.path + "access_token=" + token;
    return { method: "GET", url, api };
  }

  /**
   * 创建个性化菜单
   * @param {*} token
   * @param {*} button 一级菜单数组，个数应为1~3个
   * @param {*} matchrule 菜单匹配规则
   */
  addConditionMenu(token, button, matchrule) {
    let api = this.getApi("menu_addCondition");
    let url = api.path + "accss_token=" + token;
    return { method: "POST", url, body: { button, matchrule }, api };
  }

  /**
   * 删除个性化菜单
   * @param {*} token
   * @param {*} menuid menuid为菜单id，可以通过自定义菜单查询接口获取。
   */
  delConditionMenu(token, menuid) {
    let api = this.getApi("menu_addCondition");
    let url = api.path + "accss_token=" + token;
    return { method: "POST", url, body: menuid, api };
  }

  /**
   * 测试个性化菜单匹配结果
   * @param {*} token
   * @param {*} user_id user_id可以是粉丝的OpenID，也可以是粉丝的微信号。
   */
  tryCatchMenu(token, user_id) {
    let api = this.getApi("menu_tryCatch");
    let url = api.path + "accss_token=" + token;
    return { method: "POST", url, body: user_id, api };
  }

  /**
   * 获取自定义菜单配置接口
   * @param {*} token
   */
  getCurrentMenuInfo(token) {
    let api = this.getApi("menu_getCurrentMenuInfo");
    let url = api.path + "accss_token=" + token;
    return { method: "GET", url, api };
  }

  /**
   * 签名算法
   * @param {*} ticket 票据
   * @param {*} url 地址
   */
  sign(ticket, url) {
    return new util().sign(ticket, url);
  }
}

module.exports = WeixinService;
