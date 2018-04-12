import axios from "@/utils/request";


//发送验证码
export function sendCode(data) {
  return axios({
    url: "/sendcode",
    method: "post",
    data
  });
}
//绑定手机
export function bindPhone(data) {
  return axios({
    url: "/admin/phone/bind",
    method: "post",
    data
  });
}

//解绑手机
export function unbindPhone(data) {
  return axios({
    url: "/admin/phone/unbind",
    method: "post",
    data
  });
}

/* 登陆后重置密码 */
export function loginTypePassword(data) {
  return axios({
    url: "/admin/password/logintype",
    method: "post",
    data
  });
}
