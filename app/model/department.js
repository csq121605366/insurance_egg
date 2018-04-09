
/**
 * 科室
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const DepartmentSchema = new mongoose.Schema({
    key:Number, //科室关键字
    label: String,//主科室名称
    children:[], //小科室集合
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
  DepartmentSchema.pre("save", function (next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });
  return mongoose.model("Department", DepartmentSchema);
};
