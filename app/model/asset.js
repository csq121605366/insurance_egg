/**
 * 科室
 */

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const AssetSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true,
      enum: ["image", "video", "audio"],
      default:'image'
    },
    key:String, //文件名
    hash: String, //文件hash
    fsize:Number,//文件大小
    name:String,//
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
  AssetSchema.pre("save", function(next) {
    if (this.isNew) {
      this.meta.created = this.meta.updated = new Date();
    } else {
      this.meta.updated = new Date();
    }
    next();
  });

  return mongoose.model("Asset", AssetSchema);
};
