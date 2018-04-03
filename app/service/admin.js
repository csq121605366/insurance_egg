// app/service/user.js
const BaseService = require('./base');

class AdminService extends BaseService {
  async findbyid(uid) {
    return;
  }
  async findbyusername(username) {
    if (!username) return false;
    return await this.ctx.model.Admin.findOne({ username }).select('_id').exec();
  }
  async updatebyid(uid) {
    return;
  }
}

module.exports = AdminService;