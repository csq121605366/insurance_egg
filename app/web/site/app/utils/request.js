import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "../store";
import { getToken } from "@/utils/auth";

// 创建axios实例
const service = axios.create({
  baseURL: "/api", // api的base_url
  timeout: 5000, // 请求超时时间
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  }
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    console.log('====', response)
    if (!res.success) {
      Message({
        message: res.message,
        type: "error",
        duration: 5 * 1000
      });
      return Promise.reject("error");
    } else {
      return res;
    }
  },
  error => {
    console.dir('err', error); // for debug
    let res = error.response;
    let status = res.status;
    if (status == 422) {
      Message({
        message: res.data.error,
        type: "error",
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;
