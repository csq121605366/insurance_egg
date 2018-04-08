import axios from "@/utils/request";

export function get_auth(data) {
  return axios({
    url: "/getauth",
    method: "post",
    data
  });
}

export function login(data) {
  return axios({
    url: "/user/login",
    method: "post",
    data
  });
}

export function register(data) {
  return axios({
    url: "/user/register",
    method: "post",
    data
  });
}

export function getuser(data) {
  return axios({
    url: "/user/getuser",
    method: "post",
    data
  });
}

export function logout() {
  return axios({
    url: "/logout",
    method: "post"
  });
}

export function rolelist(data) {
  return axios({
    url: "/user/rolelist",
    method: "post",
    data
  });
}

export function userList(data) {
  return axios({
    url: "/user/userlist",
    method: "post",
    data
  });
}

export function userDelete(params) {
  return axios({
    url: "/user/delete",
    method: "get",
    params
  });
}

export function sendEmail(data) {
  return axios({
    url: "/email/send",
    method: "post",
    data
  });
}

export function bindEmail(data) {
  return axios({
    url: "/email/bind",
    method: "post",
    data
  });
}

/* 解绑邮箱 */
export function unbindEmail(data) {
  return axios({
    url: "/email/update",
    method: "post",
    data
  });
}

export function sendPhone(data) {
  return axios({
    url: "/phone/send",
    method: "post",
    data
  });
}

/* 登陆前重置密码 */
export function resetPassword(data) {
  return axios({
    url: "/password",
    method: "put",
    data
  });
}

/* 登陆后重置密码 */
export function loginTypePassword(data) {
  return axios({
    url: "/admin/password/logintype",
    method: "put",
    data
  });
}
