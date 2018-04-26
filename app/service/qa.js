
const BaseService = require('./base');

class QaService extends BaseService {

  /**
* 实现分页功能
*/
  async search(param) {
    let opts = Object.assign(
      {},
      { last_id: 0, limit: 10, user_id: '', key: ''},
      param
    );
    let res = '';
    let findParam = { type: '1', 'department.key': { $in: param.departmentList } }; //只展示问题 和 本科室的
    if (opts.last_id) findParam._id = { $gt: opts.last_id };
    if (opts.user_id) findParam.user_id = opts.user_id;
    if (opts.key) findParam.title = { $regex: opts.key };
    res = await this.ctx.model.Qa.find(findParam).limit(opts.limit ? opts.limit | 0 : 10).exec();
    return res;
  }
}

module.exports = QaService;