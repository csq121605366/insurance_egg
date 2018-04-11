
'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async create() {
    this.ctx.validate({
      title: 'string',
      illness_type: 'string',
      illness_begin: 'string',
      author: { type: 'string', required: false },
      sort: 'string',
      type: 'string',
      content: 'string'
    });
    //获取用户信息
    let { name, role, _id } = this.ctx.state.user;
    //只有医生可以发文章
    if (role !== 2) return this.error('没有发表权限');
    //限制5分钟内只能发一条
    let findArticle = await this.ctx.model.Article.find({ user_id: _id }).sort({ 'meta.updated': 1 }).exec();
    // 找到最后一篇文章
    let last = findArticle[findArticle.length - 1];
    // 小于5分钟不可以发表
    if (last && new Date(last.meta.updated).getTime() + 5 * 60 * 1000 > Date.now()) return this.error('5分钟内只允许发送一次');
    //得到文章内容
    let { title, illness_type, illness_begin, author, sort, type, content, time } = this.ctx.request.body;
    try {
      //保存文章
      let newOne = new this.ctx.model.Article({
        user_id: _id,
        author: author ? author : name,
        title, illness_type, illness_begin, sort, type, content, time
      })
      await newOne.save();
      return this.success('创建成功');
    } catch (e) {
      return this.error()
    }
  }

  // 获取文章
  async getlist() {
    this.ctx.validate({
      article_id: { type: 'string', required: false },
      limit: { type: 'string', required: false },
      sort: { type: 'string', required: false },
      type: { type: 'string', required: false },
      status: { type: 'string', required: false }
    });
    let reqParam = this.ctx.request.body
    let { role, status } = this.ctx.state.user;
    // 角色为游客 或者 状态不为激活的其他状态
    if (role == 0 || status !== 2) {
      // 游客模式
      let res = await this.service.article.paging(this.ctx.request.body);
      this.success(res);
    } else {
      // 非游客模式
      let res = await this.service.article.paging(this.ctx.request.body);
      this.success(res);
    }
  }
  // 获取文章列表
  async getList() {

  }
  // 修改文章
  async update() {

  }

  //删除文章(可批量删除)
  async delete() {

  }

  // 审核文章(可批量审核)
  async audit() {

  }

}

module.exports = ArticleController;
