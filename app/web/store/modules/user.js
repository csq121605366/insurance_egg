import { login, getInfo } from "@/api/login";
import { loginTypePassword } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    role: "",
    phone: ""
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLE: (state, role) => {
      state.role = role;
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            const data = response.data;
            setToken(data.token);
            commit("SET_TOKEN", data.token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const data = response.data;
            commit("SET_ROLE", data.role);
            commit("SET_NAME", data.username);
            commit("SET_AVATAR", data.avatarUrl);
            commit('SET_PHONE', data.phone)
            resolve(response);
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    LoginResetPassword({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        loginTypePassword(data)
          .then(response => {
            if (response.success) {
              resolve(response.message);
            } else {
              reject(response.message);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_TOKEN", "");
            commit("SET_ROLE", "");
            removeToken();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
