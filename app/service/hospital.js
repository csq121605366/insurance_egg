// app/service/user.js
const BaseService = require("./base");

class HospitalService extends BaseService {
  constructor(params) {
    super(params);
  }
  /**
   * 实现分页功能
   * @param {*} _id 文章id(如果不提供表示从头开始提供)
   * @param {*} limit 文章间隔(默认为10条)
   * @param {*} sort //文章分类(默认为1)0全部 1日志 2手术记录 3科普文章
   * @param {*} type  //文章展示模式 0全部 1公开 2仅好友查看 3私有
   * @param {*} status //文章状态(默认为2) 0全部 1未审核 2已审核 3已删除
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
