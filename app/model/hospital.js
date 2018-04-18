
/**
 * 科室
 */

 module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const HospitalSchema = new mongoose.Schema({
    city: String, //医院城市
    trade: Number,// 未知
    grade: Number,   //医院等级
    location: {
        lid: Number, //location的id
        label: String, //location的名字
      }, //关联地址
    sid: Number,
    label: String,//医院名称
  });

  return mongoose.model("Hospital", HospitalSchema);
};
