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
    title: String,//问题标题
    illness_name: String,//疾病名称
    type: {
      type: Number,
      enum: ['1', '2','3'],
      default: '1'
    }, //回复人类型 1用户 2医生 3经理人
    department: {
      label: String,
      key: String
    }, //关联科室
    images: Array, //问题相关图片
    operation: {
      type: String,
      enum: ["0", "1", "2"],//是否手术 0保密 1否 2已手术
      default: "0"
    },
    qa_id: [
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
  QaSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Qa", QaSchema);
};
