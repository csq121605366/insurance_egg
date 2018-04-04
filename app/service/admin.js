// app/service/user.js
const BaseService = require('./base');

class AdminService extends BaseService {
  async create(payload) {
    const { ctx, service } = this
    return ctx.model.User.create(payload)
  }
  async show(_id) {
    if (!_id) return false;
    return await await this.ctx.model.Admin.findOne({ _id }).select('-password -loginAttempts -lockUntil').exec();
  }
  async findbyusername(username) {
    if (!username) return false;
    return await this.ctx.model.Admin.findOne({ username }).exec();
  }

}

module.exports = AdminService;