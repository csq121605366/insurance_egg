import request from "@@/utils/request";

export function qiniuTicket(data) {
  return request({
    url: "/qiniu/ticket",
    method: "post",
    data
  });
}

export function jssdk(params) {
  return request({
    url: '/weixin/signature',
    method: "get",
    params
  })
}
