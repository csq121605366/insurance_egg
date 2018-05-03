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
    title: String, //问题标题
    illness_name: String, //疾病名称
    // type: {
    //   type: String,
    //   enum: ['1', '2', '3'],
    //   default: '1'
    // }, //回复人类型 1用户 2医生 3经理人
    department: Object, //关联科室
    images: Array, //问题相关图片
    operation: {
      type: String,
      enum: ["0", "1", "2"], //是否手术 0保密 1否 2已手术
      default: "0"
    },
    answer: [
      {
        user_id: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        name: String,
        phone: String,
        role: String,
        hospital: Object,
        department: Array,
        title: String,
        gender: String,
        avatar: Object,
        avatarUrl: String,
        content: String,
        images: Array,
        type: {
          type: String,
          enum: ["1", "2"],
          default: "1"
        }, //该回答是医生回答 还是患者补充提问
        created: Date
      }
    ], //问题关联内容
    answer_count: {
      type: Number,
      default: 0
    },
    content: String,
    like: Number, //喜欢
    unlike: Number, //不喜欢
    created: Date,
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

  QaSchema.index(
    {
      title: "text",
      illness_name: "text",
      content: "text"
    },
    {
      weights: {
        title: 10,
        illness_name: 9,
        content: 1
      }
    }
  );

  return mongoose.model("Qa", QaSchema);
};
