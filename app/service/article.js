// app/service/user.js
const BaseService = require("./base");

class ArticleService extends BaseService {
  constructor(params) {
    super(params);
  }
  /**
   * 实现分页功能
   * @param {*} _id 文章id(如果不提供表示从头开始提供)
   * @param {*} user_id 用户id
   * @param {*} department_key 文章关联科室的key
   * @param {*} limit 文章间隔(默认为10条)
   * @param {*} sort //文章分类(默认为1) 0全部 1日志 2手术记录 3科普文章
   * @param {*} type  //文章展示模式 0全部 1公开 2仅好友查看 3私有
   * @param {*} status //文章状态(默认为2) 0全部 1未审核 2已审核 3已删除
   */
  async paging(opts) {
    // 要展示的字段
    let tunlproject = {
      $project: {
        _id: 1,
        title: 1,
        user_id: 1,
        illness_name: 1,
        illness_time: 1,
        author: 1,
        click: 1,
        department: 1,
        status: 1,
        sort: 1,
        type: 1,
        up: 1,
        support: 1,
        like: 1,
        pre_content: 1,
        images: 1,
        meta: 1
      }
    };
    // 限制个数
    let tunllimit = { $limit: opts.limit | 0 };
    // 排序方式
    let tunlsort = { $sort: { _id: -1 } };
    if (opts.article_id) {
      // 匹配
      let tunlmatch = { $match: { _id: { $lt: this.app.mongoose.Types.ObjectId(opts.article_id) } } };
      if (opts.department_key)
        tunlmatch.$match["department.key"] =  { $in: opts.department_key };
      if (opts.user_id) tunlmatch.$match.user_id = this.app.mongoose.Types.ObjectId(opts.user_id);
      if (opts.sort) tunlmatch.$match.sort = opts.sort;
      if (opts.type) tunlmatch.$match.type = opts.type;
      tunlmatch.$match.status = { $in: opts.status };
      try {
        let doc = await this.ctx.model.Article.aggregate([
          tunlmatch,
          tunlproject,
          tunllimit,
          tunlsort
        ]).exec();
        let res = await this.ctx.model.User.populate(doc, { path: 'user_id', select: 'name avatar' });
        return res;
      } catch (e) {
        throw new Error();
      }
    } else {
      try {
        let tunlmatch = { $match: {} };
        if (opts.department_key)
          tunlmatch.$match["department.key"] = { $in: opts.department_key };
        if (opts.user_id) tunlmatch.$match.user_id = this.app.mongoose.Types.ObjectId(opts.user_id);
        if (opts.sort) tunlmatch.$match.sort = opts.sort;
        if (opts.type) tunlmatch.$match.type = { $in: opts.type };
        tunlmatch.$match.status = { $in: opts.status };
        let doc = await this.ctx.model.Article.aggregate([
          tunlmatch,
          tunlproject,
          tunllimit,
          tunlsort
        ]).exec();
        let res = await this.ctx.model.User.populate(doc, { path: 'user_id', select: 'name avatar' });
        return res;
      } catch (e) {
        throw new Error();
      }
    }
  }

}

module.exports = ArticleService;
