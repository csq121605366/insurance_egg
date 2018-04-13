import Cookies from "js-cookie";
import { qiniuTicket } from "@@/api/app.js";
const app = {
  state: {
    interval: 60,
    authType: {
      require: { reg: /[\w\W]+/, info: "请输入内容" },
      username: {
        reg: /^[a-zA-Z0-9_-]{4,16}$/,
        info: "4-16位（字母，数字，下划线，减号）"
      },
      password: {
        reg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,21}$/,
        info: "6-21字母和数字组成，不能是纯数字或纯英文"
      },
      email: {
        reg: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
        info: "邮箱格式不正确"
      }, //Email正则
      phone: {
        reg: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
        info: "手机格式不正确"
      }, //手机号正则
      name: { reg: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/, info: "姓名格式不正确" }, //姓名正则
      code: { reg: /^[0-9]{4,6}$/, info: '验证码格式不正确' },
      idcard: {
        reg: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        info: "身份证格式不正确"
      }, //18位身份证
      url: {
        reg: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
        info: "网址格式不正确"
      } // url验证
    },
    qiniuTicket: ""
  },
  mutations: {
    
  },
  actions: {
  }
};

export default app;
