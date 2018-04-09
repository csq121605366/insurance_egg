// 文章分类

/**
 * 文章分类
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ArticleCommentSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" },//评论人
    content: String, //评论内容
    ip: String,//评论时的ip
    comments: [{ type: Schema.Types.ObjectId, ref: "ArticleComment" }], //评论的评论
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
  ArticleCommentSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("ArticleComment", ArticleCommentSchema);
};
