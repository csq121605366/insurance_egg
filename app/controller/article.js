
'use strict';

const BaseController = require('./base');

class ArticleController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  async create() {
    this.ctx.validate({
      title: 'string',
      illness_name: 'string',
      illness_time: 'string',
      sort: 'string',
      type: 'string',
      images: {
        type: 'array',
        required: false,
      },
      videos: {
        type: 'array',
        required: false,
      },
      content: {
        type: 'string',
        allowEmpty: true,
        required: false
      }
    });
    //获取用户信息
    let { name, role, _id, status } = this.ctx.state.user;
    console.log(role, status)
    //只有医生可以发文章
    // if (role != '2' && status != '2') return this.error('没有发表权限');
    //限制5分钟内只能发一条
    let findArticle = await this.ctx.model.Article.find({ user_id: _id }).sort({ 'meta.updated': 1 }).exec();
    // 找到最后一篇文章
    let last = findArticle[findArticle.length - 1];
    // 小于5分钟不可以发表
    if (last && new Date(last.meta.updated).getTime() + 5 * 60 * 1000 > Date.now()) return this.error('5分钟内只允许发送一次');
    //得到文章内容
    let { title, illness_name, illness_time, sort, type, content, images, videos } = this.ctx.request.body;
    if (images.length) {
      await this.service.qiniu
        .removeImage(images)
        .then(res => {
          images = res;
        })
        .catch(() => {
          throw new Error("资讯图片上传云端失败");
        });
    }
    if (videos.length) {
      await this.service.qiniu
        .removeImage(videos)
        .then(res => {
          videos = res;
        })
        .catch(() => {
          throw new Error("资讯视频上传云端失败");
        });

    }

    try {
      console.log('========', title, illness_name, illness_time, sort, type, content, images, videos)
      //保存文章
      let newOne = new this.ctx.model.Article({
        user_id: _id,
        author: name,
        title, illness_type, illness_time, sort, type, content, images, videos
      })
      console.log(newOne)
      let res = await newOne.save();
      return this.success('创建成功');
    } catch (e) {
      return this.error()
    }
  }

  /**
  * 获取文章
  * @param {*} article_id 文章id(如果不提供表示从头开始提供)
  * @param {*} limit 文章间隔(默认为10条)
  * @param {*} sort //文章分类(默认为1)0全部 1日志 2手术记录 3科普文章
  * @param {*} type  //文章展示模式 0全部 1公开 2仅好友查看 3私有
  * @param {*} status //文章状态(默认为2) 0全部 1未审核 2已审核 3已删除
  */
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
