/**
 * 文章
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ArticleSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" }, //发表用户id
    title: String, //标题（名称）
    illness_type: String, //疾病类型
    illness_begin: Date, //手术时间开始时间
    author: String, //作者
    ip: String, //发表ip
    click: Number, //查看次数
    status: {
      type: Number,
      enum: [1, 2, 3],
      default: 2
    },//文章状态 0保留 1未审核 2已审核 3已删除
    sort: {
      type: Number,
      enum: [1, 2, 3],
      default: 1
    }, //文章分类 1日志 2手术记录 3科普文章
    type: {
      type: Number,
      enum: [ 1, 2]
    }, //文章展示模式 0保留 1公开 2仅好友查看 3私有
    up: {
      type: Number,
      enum: [1, 2],
      default: 1
    }, // 置顶 1表示不置顶 2表示置顶
    support: {
      type: Number,
      enum: [1, 2],
      default: 1
    }, //是否管理员推荐 1不推荐 2推荐
    like: Number, //喜欢
    unlike: Number, //不喜欢
    images: [
      { type: Schema.Types.ObjectId, ref: "Asset" }
    ], // 文章相关图片
    comment: [{ type: Schema.Types.ObjectId, ref: "ArticleComment" }], //评论列表
    pre_content: String, //预览内容
    content: String, //内容
    meta: {
      created: {
        type: Date,
        default: new Date()
      },
      updated: {
        type: Date,
        default: new Date()
      }
    }
  });
  ArticleSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    // 设置预览内容
    this.pre_content = this.content.trim().substr(0, 160);
    next();
  });
  return mongoose.model("Article", ArticleSchema);
};
