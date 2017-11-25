<template>
   <edit-panel title="一些 demo">

     <!-- +++++++++++++++++++++++++++++++++++++++++++ -->
     
    <p>文件上传 - 参考：<a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">element</a></p>
    <el-upload
      :multiple="false"
      class="upload-demo"
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

     <!-- +++++++++++++++++++++++++++++++++++++++++++ -->
     <div class="hr"></div>
     <p>富文本 - 参考：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">quill-editor</a></p>
     <quill-editor v-model="content"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)">
      </quill-editor>
      <div class="hr"></div>
      <p>弹出窗口 - 参考：<a href="http://element.eleme.io/#/zh-CN/component/dialog" target="_blank">element</a></p>
      <el-dialog title="DIALOG" :visible.sync="dialogVisible">
        <h1>SUCCESS DIALOG</h1>
      </el-dialog>
      <el-button size="small" type="primary" @click="dialogVisible = true">打开窗口</el-button>


       <!-- +++++++++++++++++++++++++++++++++++++++++++ -->
      <div class="hr"></div>
      <p>确认窗口 - 参考：<a href="http://element.eleme.io/#/zh-CN/component/message-box" target="_blank">element</a></p>
      <el-button size="small" type="primary" @click="open">打开窗口</el-button>

       <!-- +++++++++++++++++++++++++++++++++++++++++++ -->
      <div class="hr"></div>
      <p>Toast - 参考：<a href="http://element.eleme.io/#/zh-CN/component/message-box" target="_blank">element</a></p>
      <el-button size="small" type="primary" @click="openNoty">打开窗口</el-button>
  </edit-panel>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      // 文件上传
      fileList: [],
      // 富文本编辑器
      content: '<h2>I am Example</h2>',
      editorOption: {
        // some quill options
      },
      dialogVisible: false,
    };
  },
  methods: {
    // 文件上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
    },

    // 富文本
    onEditorBlur(editor) {
      console.log('editor blur!', editor);
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor);
    },
    onEditorReady(editor) {
      console.log('editor ready!', editor);
    },
    onEditorChange({ editor, html, text }) {
      console.log('editor change!', editor, html, text);
      this.content = html;
    },

    // 弹框
    open() {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$message({
            type: 'info',
            message: `action: ${action}`,
          });
        },
      });
    },
    openNoty() {
      const h = this.$createElement;
      this.$notify({
        title: '标题名称',
        message: h('i', { style: 'color: teal' },
        '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'),
      });
    },
  },
  // get the current quill instace object.
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
  },
};
</script>

<style scoped lang="scss">
.hr{
  margin-bottom: 60px;
  padding-bottom: 60px;
  border-bottom: 1px solid #000;
  width: 100%;
}
</style>
