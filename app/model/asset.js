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
      enum: ["image", "video", "audio"]
    },
    url: String, //存储地址
    hash: String, //文件hash
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
