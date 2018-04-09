
/**
 * 就诊信息
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const TreatmentSchema = new mongoose.Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }, //关联病人_id
    doctor_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ], //关联医生
    begin_time: Date, //开始时间
    end_time: Date, //结束时间
    treatment_images: [{
      url: String, //治疗相关上传图片
      hash: String, //图片hash值
      describe: String, //照片描述
    }], // 就诊信息图片数组
    describe: String, //描述
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
  TreatmentSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Treatment", TreatmentSchema);
};
