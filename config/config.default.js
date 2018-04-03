const path = require('path');
const fs = require('fs');
module.exports = app => {
  const exports = {};

  exports.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico'))
  };


  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      basedir: path.join(app.baseDir, 'app/view')
    }
  };

  // cookie加密密钥
  Object.assign(exports, {
    security: {
      csrf: {
        enable: false,
        ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      },
    },
    // 限制body大小
    bodyParser: {
      jsonLimit: '1mb',
      formLimit: '1mb',
    },
    view: {
      cache: false
    },
    logger: {
      level: 'WARN',
      consoleLevel: 'DEBUG', // ERROR  WARN  INFO DEBUG NONE
      dir: path.join(app.baseDir, 'logs')
    },
    middleware: [
      'access',
      'gzip',
      'errorHandler'
    ],
    gzip: { threshold: 1024 },
    static: {
      prefix: '/public/',
      dir: path.join(app.baseDir, 'public')
    },
    keys: 'insurance_cookie_secret',
    key: 'insurance_cookie', // 承载 Session 的 Cookie 键值对名字
    maxAge: 86400000, // Session 的最大有效时间
  });


  // mongoose
  exports.mongoose = {
    client: {
      url: 'mongodb://insurance_admin:csqcsq1214@47.52.63.21:27017/insurance',
      options: {},
    },
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
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },
    json(err, ctx) {
      // json hander
      ctx.body = { message: 'error' };
      ctx.status = 500;
    }
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
      timeout: 3000,
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
      maxFreeSockets: 256,
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
      maxFreeSockets: 256,
    },
  };


  exports.myconfig = {
    tokenSecret: 'insurance:token', // token的加密密钥
    wechat: {
      refreshTime: { hour: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23] }, // 每天定时更新access_token
      appID: 'wxdb0b987716f5cc54',
      appSecret: '40eb0adc05b563a5bbbad3c44b5d0276',
      token: 'weixin'
    },
    email: {
      accountUser: '121605366@qq.com', // 发送邮件的qq
      accountPass: 'ilepztuozospbhfa', // 第三方授权密码，不是qq邮箱密码，在发送邮箱里面设置
      service: 'qq',
      host: 'smtp.qq.email',
      port: 465,
      secure: true,
      interval: 3 * 60 * 1000
    },
    dbconfig: {
      USER_ROLE_TYPE: ['user', 'doctor', 'agent'], // 用户角色列表 默认选择第一个角色
      SALT_STRENGTH: 10, // 密码加密强度
      MAX_LOGIN_ATTEMPTS: 15, // 尝试登录次数
      // LOCK_TIME: 2 * 60 * 60 * 1000
      LOCK_TIME: 10 * 1000 // 锁定时间
    },
    qiniu: {
      AK: '你的七牛 AK',
      SK: '你的七牛 SK',
      bucket: '你的七牛 bucket',
      qiniuURL: 'bucket 对应的测试地址'
    }
  };

  return exports;
};
