const xml2js = require("xml2js");
const tpl = require("./tpl");
const sha1 = require("sha1");

class Util {
  parseXML(xml) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, { trim: true }, (err, content) => {
        console.log("c", content);
        if (err) reject(err);
        else resolve(content);
      });
    });
  }

  formatMessage(res) {
    let message = {};
    if (typeof res === "object") {
      let keys = Object.keys(res);
      for (let i = 0; i < keys.length; i++) {
        let item = res[keys[i]];
        let key = keys[i];
        if (!(item instanceof Array) || item.length === 0) {
          continue;
        }
        if (item.length === 1) {
          let val = item[0];
          if (typeof val === "object") {
            message[key] = formatMessage(val);
          } else {
            message[key] = (val || "").trim();
          }
        } else {
          message[key] = [];
          for (let j = 0; j < item.length; j++) {
            message[key].push(formatMessage(item[j]));
          }
        }
      }
    }
    return message;
  }

  template(content, message) {
    // content回复内容，message解析后的消息
    let info = {};
    let type = "text";
    content = content || "Empty News";
    if (content && content.type) {
      type = content.type;
    }
    if (Array.isArray(content)) {
      type = "news";
    }
    info = Object.assign(
      {},
      {
        content: content,
        createTime: new Date().getTime(),
        msgType: type,
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName
      }
    );
    return tpl(info);
  }

  /**
   * 创建随机字符串
   */
  createNonce() {
    return Math.random()
      .toString(36)
      .substr(2, 15);
  }

  /**
   * 创建时间戳
   */
  createTimesstamp() {
    return parseInt(new Date().getTime() / 1000) + "";
  }

  /**
   * 签名格式化
   * @param {*} args 参数
   */
  raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort();
    let newArgs = {};
    keys.forEach(key => {
      newArgs[key.toLowerCase()] = args[key];
    });
    let str = "";
    for (let k in newArgs) {
      str += "&" + k + "=" + newArgs[k];
    }
    return str.substr(1);
  }

  /**
   * 加密
   * @param {*} nonce 随机字符串
   * @param {*} ticket 签名
   * @param {*} timestamp 时间戳
   * @param {*} url 地址
   */
  signIt(noncestr, ticket, timestamp, url) {
    let ret = {
      jsapi_ticket: ticket,
      noncestr,
      timestamp,
      url
    };
    let str = this.raw(ret);
    console.log(str);
    let sha = sha1(str);
    return sha;
  }

  /**
   * 签名
   * @param {*} ticket
   * @param {*} url
   */
  sign(ticket, url) {
    let noncestr = this.createNonce();
    let timestamp = this.createTimesstamp();
    let signature = this.signIt(noncestr, ticket, timestamp, url);
    return {
      noncestr,
      timestamp,
      signature
    };
  }
}

module.exports = Util;
