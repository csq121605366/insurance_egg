'use strict'

const BaseService = require('./base')

class ActionTokenService extends BaseService {
  async apply(user) {
    const { app } = this
    return app.jwt.sign({
      _id: user._id,
      username: user.username,
      role: user.role,
      createTime: Date.now(),
      expires: app.config.jwt.exp
    }, app.config.jwt.secret, { expiresIn: app.config.jwt.exp || Math.floor(Date.now() / 1000) + (60 * 60 * 6) })
  }
}

module.exports = ActionTokenService
