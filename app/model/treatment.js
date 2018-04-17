/**
 * 就诊信息
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const TreatmentSchema = new mongoose.Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }, //关联病人_id
    doctor_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ], //关联医生
    doctor_name:String, //医生姓名
    illness_name:String, //疾病名字
    begin_time: Date, //开始时间
    end_time: Date, //结束时间
    operation: {
      type: String,
      enum: ["1", "2"],
      default: "1"
    }, //是否手术 1否 2已手术
    treatment_images: [String], // 就诊信息图片数组
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
  TreatmentSchema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Treatment", TreatmentSchema);
};
