<template>
  <section class="upload">
    <div class="upload-cnt">
        <el-upload
        class="upload-demo"
        ref="upload"
        action="http://localhost:7001/api/weixin/test"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :http-request="upload"
        :limit="2"
        list-type="picture"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
  </section>
</template>

<script>
import * as qiniu from "qiniu-js";
import { qiniuTicket } from "@/api/app.js";
import { guid } from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fileList: []
    };
  },
  computed: {
    ...mapGetters(["qiniuTicket"])
  },
  mounted() {},
  methods: {
    beforeUpload(file) {
      this.file = file;
      let res = true;
      if (!this.qiniuTicket) {
        return this.$store.dispatch("GetQiniuTicket");
      }
    },
    // 自定义上传
    upload() {
      // 生成文件名
      let key = guid(6, 16) + "-" + this.file.name;
      let putExtra = {
        fname: this.file.name,
        params: {},
        mimeType: [] || null
      };
      let config = {
        useCdnDomain: true,
        region: qiniu.region.z0
      };
      let observable = qiniu.upload(
        this.file,
        key,
        this.qiniuTicket,
        putExtra,
        config
      );
      // next、error、complete
      var subscription = observable.subscribe(
        res => {},
        err => {
          this.showProgress = false;
          this.$message.error("上传出错了");
        },
        res => {
          this.showProgress = false;
          this.$message.success("上传成功");
          console.log(res);
        }
      ); // 上传开始
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log("handleRemove", file, fileList);
    },
    handlePreview(file) {
      console.log("handlePreview", file);
    }
  }
};
</script>

<style lang="scss">
.upload {
  &-cnt {
    width: 400px;
    margin: 60px auto;
  }
}
</style>
