import request from "@/utils/request";

export function qiniuTicket(data) {
  return request({
    url: "/qiniu/ticket",
    method: "post",
    data
  });
}

//获取文章中的资源列表
export function getArticleAssets(data) {
  return request({
    url: "app/article/getArticleAssets",
    headers: {
      Authorization: data.Authorization
    },
    method: "post",
    data
  });
}

//获取文章中的资源列表
export function addContent(data) {
  return request({
    url: "app/article/addcontent",
    headers: {
      Authorization: data.Authorization
    },
    method: "post",
    data
  });
}


// 获取医生列表
export function userList(data) {
  return request({
    url: "admin/user/list",
    method: "post",
    data
  });
}



// 审核用户
export function userAudit() {
  return request({
    url: "admin/user/audit",
    method: "get"
  });
}
