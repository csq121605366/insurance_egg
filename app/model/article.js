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
    time: Date, //发表时间
    ip: String, //发表ip
    click: Number,//查看次数
    sort: { type: Schema.Types.ObjectId, ref: "ArticleSort" }, //文章分类
    type: {
      type: Number,
      enum: [0, 1, 2],
    }, //文章展示模式 0私有 1公开 2仅好友查看
    up: {
      type: Number,
      enum: [0, 1],
      default: 0
    }, // 置顶 0表示不置顶 1表示置顶
    support: {
      type: Number,
      enum: [0, 1],
      default: 0
    }, //是否管理员推荐
    comment: [{ type: Schema.Types.ObjectId, ref: "ArticleComment" }], //评论列表
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
    next();
  });
  return mongoose.model("Article", ArticleSchema);
};
