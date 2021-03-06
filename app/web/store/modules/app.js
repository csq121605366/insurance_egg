import Cookies from "js-cookie";
import { qiniuTicket } from "@/api/app.js";
const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get("sidebarStatus")
    },
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
      name: {
        reg: /^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/,
        info: "姓名格式不正确"
      }, //姓名正则
      code: { reg: /^[0-9]{4,6}$/, info: "验证码格式不正确" },
      idcard: {
        reg: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
        info: "身份证格式不正确"
      }, //18位身份证
      url: {
        reg: /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
        info: "网址格式不正确"
      } // url验证
    },
    qiniuTicket: "",
    statusList: { "1": "待审核", "2": "已审核" },
    sortList: { "1": "日志", "2": "手术记录", "3": "科普文章" },
    genderList: { "0": "未知", "1": "男性", "2": "女性" }, //0代表未知 1代表男性 2代表女性
    adminRoleList: {
      "0": "保留",
      "1": "普通管理员",
      "2": "管理员",
      "9": "超级管理员"
    }, //管理员角色信息列表0保留  1普通管理员 2管理员 9超级管理员
    roleList: { "1": "用户", "2": "医生", "3": "经理人" },
    operationList: { "0": "保密", "1": "未手术", "2": "已手术" } //0保密 1否 2已手术
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set("sidebarStatus", 1);
      } else {
        Cookies.set("sidebarStatus", 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    SET_QINIUTICKET: (state, qiniuTicket) => {
      state.qiniuTicket = qiniuTicket;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit("TOGGLE_SIDEBAR");
    },
    GetQiniuTicket: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        qiniuTicket(data)
          .then(res => {
            commit("SET_QINIUTICKET", res.data);
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
      });
    }
  }
};

export default app;
