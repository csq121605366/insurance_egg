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
export function userListByDetail(data) {
  return request({
    url: "admin/user/listbydetail",
    method: "post",
    data
  });
}



// 审核用户
export function userAudit(data) {
  return request({
    url: "admin/user/audit",
    method: "post",
    data
  });
}

// 主科室
export function departmentMain(data) {
  return request({
    url: 'app/department/main',
    method: 'get',
    data
  })
}

// 副科室
export function departmentVice(params) {
  return request({
    url: 'app/department/vice',
    method: 'get',
    params
  })
}

//用户列表
export function userList(data) {
  return request({
    url: 'admin/user/list',
    method: 'post',
    data
  })
}

//用户详情
export function userDetail(data) {
  return request({
    url: 'admin/user/detail',
    method: 'post',
    data
  })
}