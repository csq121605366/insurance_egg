// url格式转化
const queryString = require("querystring");
const sha1 = require("sha1");
const getRawBody = require("raw-body");
const BaseController = require("./base");
// 微信认证
const wechatOAuth = require("../extend/oauth");
// 工具函数
const Util = require("../extend/common");
// 回复策略
const reply = require("../extend/reply");

class Weixin extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.urlValidate = {
      url: {
        type: "url",
        required: true,
        allowEmpty: false,
        format: this.config.regexp.url
      }
    };
  }

  /**
   * 微信端监听处理
   * 1. 获取access_token
   * 2. 验证请求类型
   * 3. 解析请求参数
   */
  async hear() {
    const { token } = this.config.myconfig.wechat;
    const { signature, nonce, timestamp, echostr } = this.ctx.query;
    let str = [token, timestamp, nonce].sort().join("");
    let sha = sha1(str);
    if (this.ctx.method === "GET") {
      if (sha === signature) {
        /**
         * 开发者通过检验signature对请求进行校验（下面有校验方式）。
         * 若确认此次GET请求来自微信服务器
         * 请原样返回echostr参数内容，则接入生效，
         * 成为开发者成功，否则接入失败。
         */
        this.ctx.body = echostr;
        return;
      }
    } else if (this.ctx.method === "POST") {
      if (sha !== signature) {
        throw new Error("签名不正确");
      }
    }
    // 解析请求参数
    let data;
    await getRawBody(this.ctx.req, {
      length: this.ctx.length,
      limit: "1mb",
      encoding: this.ctx.charset
    })
      .then(string => {
        data = string;
      })
      .catch(err => {
        throw new Error("raw-body解析错误");
      });
    // 解析xml
    let content;
    let util = new Util();
    await util
      .parseXML(data)
      .then(res => {
        content = res;
      })
      .catch(err => {
        throw new Error("util.parseXML方法错误");
      });
    // 格式化信息
    let message = util.formatMessage(content.xml);
    // 根据信息制定回复策略
    let replyMsg = await reply(message);
    // 将消息封装在xml中
    let xml = util.template(replyMsg, message);
    this.ctx.status = 200;
    this.ctx.type = "application/xml";
    // 返回给微信服务器
    this.ctx.body = xml;
  }

  /**
   * https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
   * 微信签名认证 微信中网页获取签名使用
   */
  async signature() {
    let url = decodeURIComponent(this.ctx.query.url);
    this.ctx.validate(this.urlValidate, { url });
    console.log(this.getSignatureAsync);
    let params = await this.getSignatureAsync(url);
    this.success(params);
  }

  /**
   * 同步获取签名
   * @param {*} url
   */
  async getSignatureAsync(url) {
    let data = await this.service.weixin.fetchToken();
    let token = data.data;
    // 获取ticket
    let ticketData = await this.service.weixin.fetchToken("ticket");
    let ticket = ticketData.data;
    // 签名
    let params = this.service.weixin.sign(ticket, url);
    params.appId = this.config.myconfig.wechat.appID;
    return params;
  }

  /**
   * 微信获取oauth 用来获取用户资料 然后跳转到自己的网页
   * 需要获取url(要跳转的地址)
   */
  async oauth() {
    let params = queryString.parse(this.ctx.querystring);
    console.log("params", params);
    let code = params.code;
    let user = await this.service.weixin.getUserByCode(code);
    // 信息获取成功后 需要判断用户是否注册 如果没有注册 就到注册页面
    // 如果注册了 就到首页
    this.success(user);
  }
  /**
   * 获取用户信息流程 用户点击 /api/weixin/redirect页面链接
   * 然后处理信息 处理完了跳转到 获权地址
   * 微信跳转处理 目的是处理参数
   */
  async redirect() {
    let target = this.config.myconfig.wechat.oauthUrl;
    let scope = "snsapi_userinfo";
    let { visit, id } = this.ctx.query;
    let params = `${visit}_${id}`;
    let url = this.service.weixin.getAuthorizeURL(scope, target, params);
    this.ctx.redirect(url);
  }

  /**
   * 获取用户列表
   * @param {*} token
   * @param {*} next_openid (不填写 默认从头开始拉去)
   */
  async user_fetch() {
    this.ctx.validate({ next_openid: { type: "id", required: false } });
    let { next_openid } = this.ctx.request.body;
    let data = await this.service.weixin.handle("fetchUserList", next_openid);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }
  /**
   * 获取用户基本信息（包括UnionID机制）
   * @param {*} openid
   * @param {*} lang 返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语
   */
  async user_info() {
    this.ctx.validate({ openid: "string" });
    let { openid } = this.ctx.request.body;
    let data = await this.service.weixin.handle("getUserInfo", openid);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 批量获取用户基本信息
   * @param {*} token
   * @param {*} openid_list
   */
  async user_batch_list() {
    this.ctx.validate({ openid_list: "string" });
    let { openid_list } = this.ctx.request.body;
    openid_list =
      typeof openid_list == "string" ? JSON.parse(openid_list) : openid_list;
    if (!Array.isArray(openid_list)) return this.error("参数格式不正确");
    let data = await this.service.weixin.handle("batchUserInfo", openid_list);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 获取黑名单列表
   * @param {*} token
   * @param {*} begin_openid (不填写 默认从头开始拉去)
   */
  async user_blacklist() {
    this.ctx.validate({ begin_openid: { type: "id", required: false } });
    let data = await this.service.weixin.handle(
      "getBlackList",
      this.ctx.request.body.begin_openid
    );
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 拉黑用户
   * @param {*} token
   * @param {*} openid_list (不填写 默认从头开始拉去)
   */
  async user_batch_blacklist() {
    this.ctx.validate({
      begin_openid: { type: "id", required: false },
      unbatch: { type: "string", required: false }
    });
    let { openid_list, unbatch } = this.ctx.request.body;
    openid_list =
      typeof openid_list == "string" ? JSON.parse(openid_list) : openid_list;
    if (!Array.isArray(openid_list)) return this.error("参数格式不正确");
    let data = await this.service.weixin.handle(
      "batchBlackUsers",
      openid_list,
      unbatch
    );
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 新增标签
   * @param {*} name 要新增的标签名称
   */
  async tags_create() {
    this.ctx.validate({ name: "string" });
    let { name } = this.ctx.request.body;
    let data = await this.service.weixin.handle("createTag", name);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }
  /**
   * 获取公众号已创建的标签
   */
  async tags_fetch() {
    let data = await this.service.weixin.handle("fetchTags");
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }
  /**
   * 编辑标签
   * @param {*} id
   * @param {*} name
   */
  async tags_update() {
    this.ctx.validate({ id: "id", name: "string" });
    let { id, name } = this.ctx.request.body;
    let data = await this.service.weixin.handle("updateTag", id | 0, name);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success();
  }
  /**
   * 删除标签
   * 当某个标签下的粉丝超过10w时，后台不可直接删除标签，
   * @param {*} id
   */
  async tags_del() {
    this.ctx.validate({ id: "id" });
    let { id } = this.ctx.request.body;
    let data = await this.service.weixin.handle("delTag", id);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }
  /**
   * 获取标签下粉丝列表
   * @param {*} id 标签id
   * @param {*} next_openid 第一个拉取的openid，不填写默认从头开始
   */
  async tags_user() {
    this.ctx.validate({
      id: "id",
      next_openid: { type: "id", required: false }
    });
    let { id, next_openid } = this.ctx.request.body;
    let data = await this.service.weixin.handle(
      "fetchTagUsers",
      id,
      next_openid
    );
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 批量为用户打标签和删除标签
   * @param {*} openid_list 粉丝列表
   * @param {*} id tag的标识符
   * @param {*} unTag true代表删除 不填或者false代表增加
   */
  async tags_batch() {
    this.ctx.validate({
      openid_list: { type: "string" },
      id: "id",
      unTag: { type: "string", required: false }
    });
    let { openid_list, id } = this.ctx.request.body;
    openid_list =
      typeof openid_list == "string" ? JSON.parse(openid_list) : openid_list;
    if (!Array.isArray(openid_list)) return this.error("参数格式不正确");
    let data = await this.service.weixin.handle(
      "batchTag",
      openid_list,
      id,
      this.ctx.request.body.unTag
    );
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 获取用户身上的标签列表
   * @param {*} openid 用户id
   */
  async tags_list() {
    this.ctx.validate({ openid: "string" });
    let { openid } = this.ctx.request.body;
    let data = await this.service.weixin.handle("getTagList", openid);
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 上传素材
   * @param {*} type 素材类型
   * @param {*} material 素材地址
   * @param {*} permanent 是否为永久素材，如果存在permanent则为永久素材否则相反
   */
  async uploadMaterial() {
    let data = this.ctx.getFileStream();

    this.success();
  }

  /**
   * 自定义菜单创建接口
   * @param {*} menu
   */
  async createMenu(token) {
    let data = await this.service.weixin.handle("createMenu");
    if (data.errcode && data.errcode != 0) return this.error(data.errmsg);
    this.success(data);
  }

  /**
   * 测试接口
   * @param {} ctx
   * @param {*} next
   */
  async test(ctx, next) {
    // const api = require("../doc/weixinApi");
    // const _ = require("lodash");
    // let data = [];
    // _.forEach(api, (value, item) => {
    //   let group = item;
    //   _.forEach(value.children, (a, b) => {
    //     data.push({
    //       name: a.name,
    //       key: group + "_" + b,
    //       group,
    //       path: a.path,
    //       amount: a.amount
    //     });
    //   });
    // });
    // await this.ctx.model.Weixinport.insertMany(data);

    // let data = this.service.weixin.test();

    // const fs = require('fs');
    // const _ = require('lodash');
    // let data = JSON.parse(fs.readFileSync('app/doc/pca.json'));
    // let ins = [];
    // let i1 = 1;
    // _.forEach(data, function (val, key) {
    //   let tmp1 = {};
    //   tmp1.name = key;
    //   tmp1.pcaid = i1++;
    //   tmp1.children = [];
    //   if (val) {
    //     let i2 = 1;
    //     _.forEach(val, (a, b) => {
    //       let tmp2 = {};
    //       tmp2.name = b;
    //       tmp2.pcaid = i1 + '-' + i2++;
    //       tmp2.children = []
    //       if (b) {
    //         let i3 = 1;
    //         _.forEach(a, (x, y) => {
    //           let tmp3 = {};
    //           tmp3.name = y;
    //           tmp3.pcaid = i1 + '-' + i2 + '-' + i3++;
    //           tmp3.children = [];
    //           if (x) {
    //             let i4 = 1;
    //             _.forEach(x, (j, k) => {
    //               let tmp4 = {};
    //               tmp4.name = j;
    //               tmp4.pcaid = i1 + '-' + i2 + '-' + i3 + '-' + i4++;
    //               tmp3.children.push(tmp4)
    //             })
    //           }
    //           tmp2.children.push(tmp3);
    //         })
    //       }
    //       tmp1.children.push(tmp2);
    //     })
    //   }
    //   ins.push(tmp1);
    // })

    // await this.ctx.model.Pca.insertMany(ins);
    ///////////////////////////////////////////////////////////setion///////////////////////////////////////////////////////////////////
    // const fs = require('fs');
    // const _ = require('lodash');
    // let data = JSON.parse(fs.readFileSync('app/doc/setion.json'));
    // await this.ctx.model.Setion.insertMany(data);

    // let Schema = this.app.mongoose.Schema;

    // let newtitle = new this.ctx.model.Title({
    //   name: '我是新title3',
    // })

    // let res = await newtitle.save((err, doc) => {
    //   let newuser = new this.ctx.model.User({
    //     openid: 333333,
    //     title: newtitle._id
    //   })
    //   newuser.save()
    // })
    // var city = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾", "香港", "澳门"];
    // const fs = require('fs');
    // const _ = require('lodash');
    // let i = this.ctx.request.body.index;
    // let data = JSON.parse(fs.readFileSync(`app/doc/hospital/location${i}.json`));
    // let res = {
    //   city: city[i],
    //   children: []
    // };
    // _.forEach(data, (val, item) => {
    //   res.children.push({
    //     trade: val.trade,
    //     grade: val.grade,
    //     location: val.location,
    //     label: val.label,
    //     sid: val.sid
    //   })
    // })
    // // console.log(this.ctx.model)
    // let res = await this.ctx.model.Hospital.aggregate([
    //   { $project: { city: 1 } }
    // ]).exec()

 

    this.success();

  }
}

module.exports = Weixin;
