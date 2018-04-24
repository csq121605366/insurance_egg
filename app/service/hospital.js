// app/service/user.js
const BaseService = require("./base");

class HospitalService extends BaseService {
  constructor(params) {
    super(params);
  }
  /**
   * 实现分页功能
   */
  async search(param) {
    let opts = Object.assign(
      {},
      { last_id: 0, limit: 10, key: '' },
      param
    );
    let res = '';
    let findParam = {};
    let last_id = '';
    if (opts.last_id) findParam._id = { $gt: opts.last_id };
    if (opts.key) findParam.label = { $regex: opts.key };
    res = await this.ctx.model.Hospital.find(findParam).select('city label').limit(opts.limit ? opts.limit | 0 : 10).exec();
    if (res.length) {
      last_id = res[res.length - 1]['_id'];
    } else {
      last_id = ''
    }
    return { list: res, last_id };
  }
}

module.exports = HospitalService;
