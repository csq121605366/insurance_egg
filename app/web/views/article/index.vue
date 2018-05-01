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

        <button class="ql ql-image" @click="imagesVisible=true"></button>
        <!-- <button class="ql ql-video" @click="videosVisible=true"></button> -->
        <el-button type="text" @click="UploadHandler">完成</el-button>
      </div>
    </quill-editor>
    <el-dialog class="article_assets" title="图片选择(点击选择)" :visible.sync="imagesVisible">
      <ul v-if="article_images.length" class="article_assets_list">
        <el-row :gutter="18" class="row-bg">
          <el-col v-for="(item,index) in article_images" :key="index" :span="8">
            <div @click="imgSelect(item)" class="article_assets_item">
              <img :src="item.imageURL" alt="">
            </div>
          </el-col>
        </el-row>
      </ul>
      <h3 v-else>没有提交图片素材</h3>
    </el-dialog>
  </div>
</template>

<script>
import wxHeader from "@/components/wxHeader";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { quillEditor } from "vue-quill-editor";
import { urlArgs } from "@/utils";
import { jssdk, getArticleAssets, addContent } from "@/api/app";
export default {
  components: {
    wxHeader,
    quillEditor
  },
  mounted() {
    let self = this;
    wx.miniProgram.getEnv(function(res) {
      let url = "http://csq.weixin.caishangqing.com/app/article";
    });
    let args = urlArgs();
    this.article_id = args["article_id"];
    this.Authorization = args["Authorization"];
    getArticleAssets({
      article_id: this.article_id,
      Authorization: args["Authorization"]
    }).then(res => {
      this.article_images = res.data.images;
      this.content = res.data.content;
    });
  },
  data() {
    return {
      article_id: "",
      Authorization: "",
      article_images: [],
      imagesVisible: false,
      // article_videos: [],
      // videosVisible: false,
      editorOption: {
        debug: false,
        placeholder: "开始分享吧",
        readOnly: true,
        theme: "snow",
        modules: {
          toolbar: {
            container: "#toolbar",
            handlers: {
              image: this.imageUpload
            }
          }
        }
      },
      content: "",
      rich_content: [],
      dialogVisible: true
    };
  },
  computed: {
    editor() {
      let editor = this.$refs.myQuillEditor.quill;
      return editor;
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
      return;
    },
    videoUpload(param) {
      return;
    },
    UploadHandler() {
      this.$confirm("确定提交?", "提示", {
        customClass: "wx",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let pre_content = this.editor.getText(0, 160);
          addContent({
            article_id: this.article_id,
            article_content: this.content,
            pre_content,
            Authorization: this.Authorization
          }).then(res => {
            if (res.success) {
              wx.miniProgram.postMessage({
                data: { article_id: res.data.article_id }
              });
              wx.miniProgram.navigateBack();
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
    },
    imgSelect(item) {
      let index = this.editor.getLength();
      this.editor.insertEmbed(index, "image", item.imageURL);
      this.editor.insertText(index + 1, " ");
      this.imagesVisible = false;
    },
    videoSelect(item) {
      // let start = this.editor.getLength();
      // let ins = this.editor.insertEmbed(index, "image", item.thumbImg.imageURL);
      // this.editor.formatText(index, 1, {
      //   height: 100,
      //   width: 100,
      //   alt: item.videoURL
      // });
      // this.videosVisible = false;
    }
  }
};
</script>

<style lang="scss">
.article {
  overflow: hidden;
  padding-top: 70px;
  &_editor {
    // position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 70px;
    .ql-toolbar {
      position: fixed;
      left: 0;
      top: 70px;
      width: 100%;
      z-index: 999;
      background-color: #fff;
    }
    .ql-container {
      padding-top: 43px;
    }
  }

  &_assets {
    width: 100%;
    padding: 0 20px;
    .el-dialog {
      width: 100%;
    }
    .el-dialog__body {
      padding: 20px 0;
    }
    &_list {
      margin: 0;
      padding: 0;
    }
    &_item {
      text-align: center;
      margin-bottom: 10px;
      img {
        width: 80px;
        height: 80px;
        border-radius: 6px;
      }
    }
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
