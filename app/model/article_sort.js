// 文章分类

/**
 * 文章分类
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ArticleSortSchema = new mongoose.Schema({
    name: String,//分类名称
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
  ArticleSortSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("ArticleSort", ArticleSortSchema);
};
