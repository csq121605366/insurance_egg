"use strict";

const BaseService = require("./base");

class ActionTokenService extends BaseService {
  async adminToken(user) {
    const { app } = this;
    return app.jwt.sign(
      {
        _id: user._id,
        role: user.role,
        status: user.status,
        createTime: Date.now(),
        expires: app.config.jwt.exp
      },
      app.config.jwt.secret,
      {
        expiresIn:
          app.config.jwt.exp || Math.floor(Date.now() / 1000) + 60 * 60 * 6
      }
    );
  }
  async userToken(user) {
    const { app } = this;
    return app.jwt.sign(
      {
        _id: user._id,
        openid: user.openid,
        role: uesr.role,
        status: user.status,
        session_key: user.session_key
      },
      app.config.jwt.secret,
      {
        expiresIn:
          app.config.jwt.exp || Math.floor(Date.now() / 1000) + 60 * 60 * 6
      }
    );
  }
}

module.exports = ActionTokenService;
