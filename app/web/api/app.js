import request from "@/utils/request";

export function qiniuTicket(data) {
  return request({
    url: "/qiniu/ticket",
    method: "post",
    data
  });
}


