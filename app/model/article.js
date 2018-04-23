/**
 * 文章
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ArticleSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User" }, //发表用户id
    title: String, //标题（名称）
    illness_name: String, //疾病类型
    illness_time: String, //手术时间进程
    author: String, //作者
    ip: String, //发表ip
    click: {
      type:Number,

    }, //查看次数
    department: {
      label: String,
      key: String
    }, //科室
    status: {
      type: String,
      enum: ["0", "1", "2", "3"],
      default: "0"
    }, //文章状态 0保存 1未审核 2已审核 3已删除
    sort: {
      type: String,
      enum: ["1", "2", "3"],
      default: "1"
    }, //文章分类 1日志 2手术记录 3科普文章
    type: {
      type: String,
      enum: ["1", "2", "3"],
      default: '1'
    }, //文章展示模式 0保留 1公开 2仅好友查看 3私有
    up: {
      type: String,
      enum: ["1", "2"],
      default: "1"
    }, // 置顶 1表示不置顶 2表示置顶
    support: {
      type: String,
      enum: ["1", "2"],
      default: "1"
    }, //是否管理员推荐 1不推荐 2推荐
    like: String, //喜欢
    unlike: String, //不喜欢
    images: Array, // 文章相关图片
    videos: Array,//视频资源
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
    next();
  });
  return mongoose.model("Article", ArticleSchema);
};
