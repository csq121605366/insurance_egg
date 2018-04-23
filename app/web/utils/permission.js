import router from "../router";
import store from "../store";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { Message } from "element-ui";
import { getToken } from "@/utils/auth"; // 验权

function checkminiProgram() {
  return window.__wxjs_environment === 'miniprogram';
}


let whiteList = ["/login"];
// let wxList = ['/article'];
let wxList = [];
router.beforeEach((to, from, next) => {
  NProgress.start();
  console.log(location)
  if (!checkminiProgram()) {
    if (getToken()) {
      if (to.path === "/login" || wxList.indexOf(to.path) > -1) {
        next({ path: "/" });
      } else {
        if (store.getters.role == "") {
          store
            .dispatch("GetInfo")
            .then(res => {
              // 拉取用户信息
              next();
            })
            .catch(() => {
              store.dispatch("FedLogOut").then(() => {
                Message.error("验证失败,请重新登录");
                next({ path: "/login" });
              });
            });
        } else {
          next();
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next("/login");
      }
    }
  } else {
    next()
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
