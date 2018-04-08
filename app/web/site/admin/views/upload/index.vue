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
        :limit="1"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
  </section>
</template>

<script>
import qiniu from "qiniu-js";
import { qiniuTicket } from "@/api/app.js";
import { mapGetters } from "vuex";
export default {
  data() {
    console.log(this.qiniuTicket);
    return {
      fileList: []
    };
  },
  computed: {
    ...mapGetters(["qiniuTicket"])
  },
  methods: {
    getqiniuTicket() {
      qiniuTicket().then(res => {
        if (!res.success) this.qiniu.qiniuTicket = res.data;
        else this.$message("请求失败");
      });
    },
    beforeUpload() {
      let res = true;
      if (!this.qiniuTicket) {
        return this.$store.dispatch("GetQiniuTicket");
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log('handleRemove',file, fileList);
    },
    handlePreview(file) {
      console.log('handlePreview',file);
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
