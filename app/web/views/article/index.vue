<template>
  <div class="article">
    <wx-header fixed title="文章正文"></wx-header>
    <quill-editor class="article_editor" v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
      <div id="toolbar" slot="toolbar">
        <!-- Add a bold button -->
        <button class="ql ql-bold">Bold</button>
        <button class="ql ql-italic">Italic</button>
        <button class="ql ql-list" value="ordered"></button>
        <button class="ql ql-list" value="bullet"></button>
        <!-- Add subscript and superscript buttons -->
        <button class="ql ql-script" value="sub"></button>
        <button class="ql ql-script" value="super"></button>

        <button class="ql ql-indent" value="-1"></button>
        <button class="ql ql-indent" value="+1"></button>

        <button class="ql ql-image" value="super"></button>
        <button class="ql ql-video"></button>
        <el-button type="text" @click="UploadHandler">完成</el-button>
      </div>
    </quill-editor>
  </div>
</template>

<script>
import wxHeader from "@/components/wxHeader";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import { urlArgs } from "@/utils";
import { jssdk } from "@/api/app";
export default {
  components: {
    wxHeader,
    quillEditor
  },
  mounted() {
    let self = this;
    wx.miniProgram.getEnv(function(res) {
      let url = "http://csq.weixin.caishangqing.com/app/article";
      // let url = "http://localhost:7001/app/article";
      // jssdk({ url }).then(res => {
      //   self.wxConfig(res.data);
      // });
    });
  },
  data() {
    return {
      id: urlArgs()["id"],
      editorOption: {
        debug: false,
        placeholder: "开始分享吧",
        readOnly: true,
        theme: "snow",
        modules: {
          toolbar: {
            container: "#toolbar",
            handlers: {
              image: this.imageUpload,
              video: this.videoUpload
            }
          }
        }
      },
      content: "",
      dialogVisible: true
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    wxConfig(conf) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: conf.appId, // 必填，公众号的唯一标识
        timestamp: conf.timestamp, // 必填，生成签名的时间戳
        nonceStr: conf.nonceStr, // 必填，生成签名的随机串
        signature: conf.signature, // 必填，签名
        jsApiList: ["chooseImage"] // 必填，需要使用的JS接口列表
      });
    },
    onEditorBlur(quill) {
      // console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      // console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      // console.log("editor ready!", quill);
    },
    imageUpload(param) {
      console.log("图片", param);
    },
    videoUpload(param) {
      console.log("视频", this.editor);
      this.editor.insertEmbed(
        10,
        "image",
        "https://avatars2.githubusercontent.com/u/6886061?v=4"
      );
    },
    UploadHandler() {
      // wx.miniProgram.switchTab({ url: "/pages/my/main" });
      // wx.ready(function() {
      //   wx.chooseImage({
      //     count: 1, // 默认9
      //     sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      //     sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      //     success: function(res) {
      //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      //       var tempFilePaths = res.tempFilePaths;
      //       console.log(tempFilePaths);
      //     }
      //   });
      // });
      this.$confirm("确定提交?", "提示", {
        customClass: "wx",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          
          wx.miniProgram.postMessage({ data: this.content });
          wx.miniProgram.navigateBack();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.article {
  overflow: hidden;
  padding-top: 70px;
  &_editor {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 70px;
  }
  .ql-editor .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 2em;
  }
  .ql-editor .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 4em;
  }
  .ql-editor .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 6em;
  }
  .ql-editor .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 8em;
  }
  .ql-editor .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 10em;
  }
  .ql-editor .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 12em;
  }
}
.wx {
  width: 250px;
}
</style>
