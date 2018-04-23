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
      { last_id: 0, limit: 10,key:''},
      param
    );
    let res = '';
    let last_id='';
    if(opts.last_id){
      res = await this.ctx.model.Hospital.find({_id:{$gt:opts.last_id},label:{$regex:opts.key}}).select('city label').limit(opts.limit|0).exec();
    } else {
      res = await this.ctx.model.Hospital.find({label:{$regex:opts.key}}).select('city label').limit(opts.limit|0).exec();
    }
    if(res.length){
        last_id = res[res.length-1]['_id'];
      }else {
        last_id=''
      }
    return {list:res,last_id};
  }
}

module.exports = HospitalService;
