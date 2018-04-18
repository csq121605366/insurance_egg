// app/service/user.js
const BaseService = require("./base");

class ArticleService extends BaseService {
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
  async paging(param) {
    let opts = Object.assign(
      {},
      { article_id: 0, limit: 10, sort: 0, type: 0, status: 0 },
      param
    );
    // 要展示的字段
    let tunlproject = {
      $project: {
        _id: 1,
        title: 1,
        anthor: 1,
        status: 1,
        sort: 1,
        type: 1,
        up: 1,
        support: 1,
        like: 1,
        pre_content: 1,
        meta: 1
      }
    };
    // 限制个数
    let tunllimit = { $limit: opts.limit };
    // 排序方式
    let tunlsort = { $sort: { _id: -1 } };
    if (opts.article_id) {
      let findlast = await this.ctx.model.Article.findOne({
        _id: opts.article_id
      }).exec();
      // 匹配
      let tunlmatch = { $match: { _id: { $gt: findlast["_id"] } } };
      if (opts.sort != 0) tunlmatch.$match.sort = opts.sort;
      if (opts.type != 0) tunlmatch.$match.type = opts.type;
      if (opts.status != 0) tunlmatch.$match.status = opts.status;
      try {
        let res = await this.ctx.model.Article.aggregate([
          tunlmatch,
          tunlproject,
          tunllimit,
          tunlsort
        ]).exec();
        return res;
      } catch (e) {
        throw new Error();
      }
    } else {
      try {
        let tunlmatch = { $match: {} };
        if (opts.sort != 0) tunlmatch.$match.sort = opts.sort | 0;
        if (opts.type != 0) tunlmatch.$match.type = opts.type | 0;
        if (opts.status != 0) tunlmatch.$match.status = opts.status | 0;
        let res = await this.ctx.model.Article.aggregate([
          tunlmatch,
          tunlproject,
          tunllimit,
          tunlsort
        ]).exec();
        return res;
      } catch (e) {
        throw new Error();
      }
    }
  }
}

module.exports = ArticleService;
