/**
 * 问答表
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const QaSchema = new mongoose.Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }, //提问问题用户
    type: {
      type: Number,
      enum: [0, 1],
      default: 0
    }, //条目类型 0问题  1回答
    a_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Qa"
      }
    ], //问题关联的回答id
    content: String,
    like: Number, //喜欢
    unlike: Number, //不喜欢
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
  QaSchema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Qa", QaSchema);
};
