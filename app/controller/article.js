"use strict";

const BaseController = require("./base");

class ArticleController extends BaseController {
  constructor(ctx) {
    super(ctx);
  }
  /**
   * 创建文章
   */
  async createAndUpdate() {
    this.ctx.validate({
      article_id: {
        type: "string",
        allowEmpty: true,
        required: false
      },
      title: "string",
      illness_name: "string",
      illness_time: "string",
      sort: "string",
      type: "string",
      images: {
        type: "array",
        required: false
      },
      videos: {
        type: "array",
        required: false
      },
      content: {
        type: "string",
        allowEmpty: true,
        required: false
      }
    });
    //得到文章内容
    let {
      article_id,
      title,
      illness_name,
      illness_time,
      sort,
      type,
      images,
      videos
    } = this.ctx.request.body;
    //获取用户信息
    let { name, role, _id, status } = this.ctx.state.user;
    //只有医生可以发文章
    if (role != "2" && status != "2") return this.error("没有发表权限");
    if (article_id) {
      /**
       * 更新
       */
      //限制1分钟内只能发一条
      let findArticle = await this.ctx.model.Article.findOne({
        _id: article_id
      }).exec();
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
        //保存文章
        Object.assign(findArticle, {
          title,
          illness_name,
          illness_time,
          sort,
          type,
          images,
          videos
        });
        await findArticle.save();
        return this.success({ article_id: findArticle._id });
      } catch (e) {
        return this.error();
      }
    } else {
      /**
       * 新建
       */
      let find = await this.ctx.model.User.findOne({ _id }).exec();
      //限制1分钟内只能发一条
      let findArticle = await this.ctx.model.Article.find({ user_id: _id })
        .sort({ "meta.updated": 1 })
        .exec();
      // 找到最后一篇文章
      let last = findArticle[findArticle.length - 1];
      // 小于1分钟不可以发表
      if (
        last &&
        new Date(last.meta.updated).getTime() + 60 * 1000 > Date.now()
      )
        return this.error("1分钟内只允许操作一次");
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
        //保存文章
        let newOne = new this.ctx.model.Article({
          user_id: this.app.mongoose.Types.ObjectId(_id),
          author: name,
          title,
          illness_name,
          illness_time,
          department: find.department[0],
          sort,
          type,
          images,
          videos
        });
        let res = await newOne.save();
        return this.success({ article_id: res._id });
      } catch (e) {
        return this.error();
      }
    }
  }

  /**
   * 更改文章主要内容
   */
  async addContent() {
    this.ctx.validate({
      article_id: "string",
      article_content: "string",
      pre_content: "string"
    });
    let { article_id, article_content, pre_content } = this.ctx.request.body;

    try {
      let find = await this.ctx.model.Article.findOne({ _id: article_id });
      if (!find) return this.error("发表失败");
      find.content = article_content;
      find.pre_content = pre_content; //获取预览内容
      find.save();
      this.success({ article_id });
    } catch (e) {
      return this.error();
    }
  }

  /**
   * 文章发表
   */
  async publish() {
    this.ctx.validate({ article_id: "string" });
    let { article_id } = this.ctx.request.body;
    let find = await this.ctx.model.Article.findOne({ _id: article_id });
    if (!find) return this.error("未找到文章");
    if (find.status == "2") return this.error("该文章已发布");
    find.status = "2"; //将文章状态变为已审核状态
    try {
      await find.save();
      return this.success();
    } catch (e) {
      return this.error("发布失败");
    }
  }
  /**
   * 获取文章内容
   */
  async getDetail() {
    this.ctx.validate({ article_id: "string" });
    let {_id} = this.ctx.state.user;
    let user = await this.ctx.model.User.findOne({_id});
    let { article_id } = this.ctx.request.body;
    let find = await this.ctx.model.Article.findOneAndUpdate(
      { _id: article_id },
      {$addToSet:{looked:{user_id:user._id,avatar:user.avatar,name:user.name}}},{
        fields:{
        title: 1,
        user_id: 1,
        illness_name: 1,
        illness_time: 1,
        author: 1,
        looked: 1,
        department: 1,
        status: 1,
        sort: 1,
        type: 1,
        content:1,
        pre_content: 1,
        up: 1,
        support: 1,
        like: 1,
        images: 1,
        videos:1,
        meta: 1
      }
    }).exec();
    if (!find) return this.error("未找到文章");
    return this.success(find);
  }

  /**
   * 实现分页功能
   * @param {*} _id 文章id(如果不提供表示从头开始提供)
   * @param {*} user_id 用户id
   * @param {*} department_key 文章关联科室的key
   * @param {*} limit 文章间隔(默认为10条)
   * @param {*} sort //文章分类(默认为1)0全部 1日志 2手术记录 3科普文章
   * @param {*} type  //文章展示模式 0全部 1公开 2仅好友查看 3私有
   * @param {*} status //文章状态(默认为2) 0全部 1未审核 2已审核 3已删除
   */
  async paging() {
    this.ctx.validate({
      user_id: { type: "string", required: false },
      article_id: { type: "string", required: false, allowEmpty: true },
      department_key: { type: "string", required: false, allowEmpty: true },
      limit: { type: "string", required: false, allowEmpty: true },
      sort: { type: "string", required: false, allowEmpty: true },
      type: { type: "string", required: false, allowEmpty: true },
      status: { type: "string", required: false, allowEmpty: true }
    });
    let reqParam = this.ctx.request.body;
    let { role, status, _id } = this.ctx.state.user;
    // 角色为游客 或者 状态不为激活的其他状态
    if (role == 0 || status != 2) {
      // 游客模式
      let res = await this.service.article.paging(this.ctx.request.body);
      this.success(res);
    } else {
      // 非游客模式
      let res = await this.service.article.paging(this.ctx.request.body);
      this.success(res);
    }
  }

  /**
   * 获取文章所上传的素材
   */
  async getArticleAssets() {
    this.ctx.validate({
      article_id: "string"
    });
    let { article_id } = this.ctx.request.body;
    let find = await this.ctx.model.Article.findOne({ _id: article_id });
    if (!find) return this.error("未找到该文章");
    this.success({
      images: find.images,
      videos: find.videos,
      content: find.content
    });
  }

  // 修改文章
  async update() {}

  //删除文章(可批量删除)
  async delete() {}

  // 审核文章(可批量审核)
  async audit() {}
}

module.exports = ArticleController;
