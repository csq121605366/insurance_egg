<template>
  <div class="article">
    <c-header fixed title="文章"></c-header>
    <quill-editor class="article_editor" v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
    </quill-editor>
  </div>
</template>

<script>
import cHeader from "@@/components/header";
// import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    cHeader,
    quillEditor
  },
  beforeMount() {
    //判断是不是小程序环境
    wx.miniProgram.getEnv(function(res) {
      console.log(res.miniprogram);
    });
  },
  mounted() {
    wx.miniProgram.postMessage({ data: "foo" });
  },
  data() {
    return {
      editorOption: {
        debug: "info",
        placeholder: "开始顺畅的写文章",
        readOnly: true,
        theme: "snow"
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
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
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
