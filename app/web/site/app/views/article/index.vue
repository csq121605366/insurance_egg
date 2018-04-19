<template>
  <div class="article">
    <c-header fixed title="文章"></c-header>
    <quill-editor class="article_editor" v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
      <div id="toolbar" slot="toolbar">
        <!-- Add a bold button -->
        <button class="ql ql-bold">Bold</button>
        <button class="ql ql-italic">Italic</button>
        <button class="ql ql-list" value="ordered"></button>
        <button class="ql ql-list" value="bullet"></button>
        <select class="ql ql-header">
          <option value="1">标题1</option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option value="2">标题2</option>
          <option value="3">标题3</option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <button class="ql ql-script" value="sub"></button>
        <button class="ql ql-script" value="super"></button>

        <button class="ql ql-image" value="super"></button>
        <button id="custom-button" class="ql ql-video" @click="customButtonClick"></button>
      </div>
    </quill-editor>
  </div>
</template>

<script>
import cHeader from "@@/components/header";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

import { jssdk } from "@@/api/app";
export default {
  components: {
    cHeader,
    quillEditor
  },
  mounted() {
    let self = this;
    console.log("wx:::::", wx);
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
      editorOption: {
        debug: "info",
        placeholder: "开始顺畅的写文章",
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
      content: ""
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
      this.editor.insertEmbed(10, 'image', 'https://avatars2.githubusercontent.com/u/6886061?v=4');
    },
    customButtonClick() {
     
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
    }
  }
};
</script>

<style lang="scss">
.article {
  height: 100%;
  overflow: hidden;
  padding-top: 70px;
  &_editor {
    height: 100%;
  }
}
</style>
