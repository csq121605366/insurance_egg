const path = require("path");
const fs = require("fs");
module.exports = app => {
  const exports = {};
  exports.version = "v1";

  exports.siteFile = {
    "/favicon.ico": fs.readFileSync(
      path.join(app.baseDir, "app/web/asset/images/favicon.ico")
    )
  };

  exports.vuessr = {
    layout: path.join(app.baseDir, "app/web/view/layout.html"),
    renderOptions: {
      basedir: path.join(app.baseDir, "app/view")
    }
  };

  // cookie加密密钥
  Object.assign(exports, {
    security: {
      csrf: {
        enable: false
      }
    },
    // 限制body大小
    bodyParser: {
      jsonLimit: "1mb",
      formLimit: "1mb"
    },
    view: {
      cache: false
    },
    logger: {
      level: "WARN",
      consoleLevel: "DEBUG", // ERROR  WARN  INFO DEBUG NONE
      dir: path.join(app.baseDir, "logs")
    },
    middleware: ["access", "gzip", "errorHandler"],
    gzip: { threshold: 1024 },
    static: {
      prefix: "/public/",
      dir: path.join(app.baseDir, "public")
    },
    keys: "insurance_cookie_secret",
    key: "insurance_cookie", // 承载 Session 的 Cookie 键值对名字
    maxAge: 86400000 // Session 的最大有效时间
  });

  // mongoose
  exports.mongoose = {
    client: {
      url: "mongodb://insurance_admin:csqcsq1214@47.52.63.21:27017/insurance",
      options: {}
    }
  };

  exports.onerror = {
    // all(err, ctx) {
    //   // 在此处定义针对所有响应类型的错误处理方法
    //   // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
    //   ctx.body = 'error';
    //   ctx.status = 500;
    // },
    html(err, ctx) {
      // html hander
      ctx.body = "<h3>error</h3>";
      ctx.status = 500;
    },
    json(err, ctx) {
      // json hander
      ctx.body = { message: "error" };
      ctx.status = 500;
    }
  };

  exports.regexp = {
    username: /^[a-zA-Z0-9_-]{4,16}$/, //用户名正则，4到16位（字母，数字，下划线，减号）
    password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/, //6-21字母和数字组成，不能是纯数字或纯英文
    email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/, //Email正则
    phone: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/, //手机号正则
    name: /^[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*$/, //姓名正则
    idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, //18位身份证
    url: /^(\w+:\/\/)?\w+(\.\w+)+.*$/, // url验证
    money: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/ //金额
  };

  exports.httpclient = {
    // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
    // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
    // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
    enableDNSCache: false,
    // 对同一个域名进行 DNS 查询的最小间隔时间
    dnsCacheLookupInterval: 10000,
    // DNS 同时缓存的最大域名数量，默认 1000
    dnsCacheMaxLength: 1000,

    request: {
      // 默认 request 超时时间
      timeout: 3000
    },

    httpAgent: {
      // 默认开启 http KeepAlive 功能
      keepAlive: true,
      // 空闲的 KeepAlive socket 最长可以存活 4 秒
      freeSocketKeepAliveTimeout: 4000,
      // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
      timeout: 30000,
      // 允许创建的最大 socket 数
      maxSockets: Number.MAX_SAFE_INTEGER,
      // 最大空闲 socket 数
      maxFreeSockets: 256
    },

    httpsAgent: {
      // 默认开启 https KeepAlive 功能
      keepAlive: true,
      // 空闲的 KeepAlive socket 最长可以存活 4 秒
      freeSocketKeepAliveTimeout: 4000,
      // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
      timeout: 30000,
      // 允许创建的最大 socket 数
      maxSockets: Number.MAX_SAFE_INTEGER,
      // 最大空闲 socket 数
      maxFreeSockets: 256
    }
  };

  exports.jwt = {
    secret: "insurance:token", // token的加密密钥
    exp: 6 * 24 * 60 * 60 //存在时间 单位位秒
    // match: '/jwt',
  };

  exports.myconfig = {
    sms: {
      SMS_KEY: "15670f04b6400d13e1cb85bbf27b5f77", //聚合数据的短信key
      SMS_TYPE: [71545,71356, 71357, 71358], //聚合数据的短信类型 登录71358 找回密码71357 注册71356  71545解绑手机
      SMS_URL: 'http://v.juhe.cn/sms/send', //聚合数据接口地址
      SMS_EXPIRES: 1 * 60 * 60 * 1000, //验证码存活时间
    },
    SITE_ROOT_URL: "http://localhost:7001", //"http://csq.weixin.caishangqing.com"
    wechat: {
      refreshTime: { hour: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] }, // 每天定时更新access_token
      appID: "wxdb0b987716f5cc54",
      appSecret: "40eb0adc05b563a5bbbad3c44b5d0276",
      token: "weixin",
      oauthUrl: "http://csq.weixin.caishangqing.com/api/weixin/oauth"
    },
    wx: {
      appID: "wxb2ee3d2535d48e17",
      appSecret: "adf056cf199b8546191ebfc5170a2880",
      token: "weixin"
    },
    email: {
      accountUser: "121605366@qq.com", // 发送邮件的qq
      accountPass: "ilepztuozospbhfa", // 第三方授权密码，不是qq邮箱密码，在发送邮箱里面设置
      service: "qq",
      host: "smtp.qq.email",
      port: 465,
      secure: true,
      interval: 3 * 60 * 1000
    },
    dbconfig: {
      ADMIN_ROLE_TYPE: ["0", "1", "2", "9"], //后台管理员角色 0保留  1普通管理员 "2"管理员 "9"超级管理员
      ADMIN_ROLE_STATUS: ["0", "1", "2", "3"], // 管理员账号状态 "0"保留 "1"未激活 "2"激活 "3"锁定 "9"已删除
      USER_ROLE_TYPE: ["0", "1", "2", "3", "4"], // 用户角色列表 "0":游客 "1":普通用户 "2":医生 "3":经理人 "9":前台页面管理员
      USER_ROLE_STATUS: ["0", "1", "2", "3", "9"], // 用户账号状态 "0"保留 "1"未激活 "2"已激活 3已锁定 "9"已删除
      SALT_STRENGTH: 10, // 密码加密强度
      MAX_LOGIN_ATTEMPTS: 15, // 尝试登录次数
      LOCK_TIME: 10 * 1000 // 锁定时间
    },
    qiniu: {
      AK: "-xVS5bXcDRB6C6nqDeWSoPtjGLA4P9NPItgYaoiq",
      SK: "k4B_UnooJE6reuiRNVlwcwnW8xvcGML3xmzkHFAr",
      permanent_bucket: "weixin-permanent",
      temporary_bucket: "weixin-temporary",
      insurance_bucket: "insurance",
      permanent_url: "p6syms5zu.bkt.clouddn.com",
      temporary_url: "p6syg4m80.bkt.clouddn.com",
      insurance_url: "p6ueajy31.bkt.clouddn.com"
    }
  };

  return exports;
};
