<template>
  <div :class="cpClassName">
    <el-upload class="uploader-box" :headers="upload.headers" v-if="!cpIsDetail" :disabled="cpDisabled" :style="cpStyles" :show-file-list="false" :action="upload.action" :data="upload.data" :file-list="fileList"
      :accept="cpAccept" :on-remove="onRemove" :drag="options.drag" :on-success="onSuccess" :before-upload="beforeUpload">
      <slot>
        <template v-if="!cpDisabled">
          <div v-if="options.drag">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处<em>点击上传</em></div>
          </div>
          <div class="add-icon" v-else><i class="el-icon-plus"></i></div>
        </template>
      </slot>
    </el-upload>
    <file-list :isDetail="cpIsDetail||cpDisabled" @remove="fileRemove" :fileList="cpFileList"></file-list>
  </div>
</template>

<script>
import FileList from '../custom/FileList'
import mixins from '../../mixins/package'
export default {
  name: 'SUploader',
  mixins: [mixins],
  components: { FileList },
  data () {
    return {
      typeMap: {
        image: 'image/*',
        video: 'video/*',
        audio: 'audio/*',
        pdf: 'application/pdf',
        file: '*'
      },
      upload: {
        headers: {},
        action: '',
        data: {}
      },
      fileList: [],
      defaultLimit: 4,
      imgUrlList: [],
      initialIndex: 0
    }
  },
  created () {
    this.getPrivateValue()
  },
  computed: {
    cpFileList () {
      return this.fileList
    },
    cpLimit () {
      return this.options.limit || this.defaultLimit
    },
    cpAccept () {
      const { accept, type } = this.options
      return accept || (type ? (this.typeMap[type] || '*') : '*')
    }
  },
  watch: {
    value () {
      this.getPrivateValue()
    }
  },
  methods: {
    getPrivateValue () {
      this.privateValue = this.value
      this.setFileList()
    },
    showImage (i) {
      this.imgUrlList = this.fileList.map(item => {
        return item.url
      })
      this.initialIndex = i
    },
    beforeUpload (file) {
      if (this.fileList.length >= this.cpLimit) {
        this.$message.info(`只能上传${this.cpLimit}张以内图片`)
        return false
      } else {
        return true
      }
    },
    onRemove (file, fileList) {
      this.fileList = [...fileList]
      this.setPrivateValue()
    },
    fileRemove ({ row, index }) {
      this.fileList.splice(index, 1)
      this.setPrivateValue()
    },
    async onSuccess (res, file) {
      if (res.code !== 200) return
      this.fileList.push({ name: file.name, url: res.data, data: res.data })
      this.setPrivateValue()
    },
    setPrivateValue () {
      const result = []
      this.privateValue = ''
      for (const file of this.fileList) {
        result.push(file.data + '|' + file.name)
      }
      this.privateValue = result.join(',')
    },
    async setFileList () {
      this.fileList = []
      if (!this.privateValue) return
      const imgs = this.privateValue.split(',')
      for (const img of imgs) {
        const imgs = img.split('|')
        this.fileList.push({ name: imgs[1] || imgs[0], url: imgs[0], data: imgs[0] })
      }
    }
  }

}
</script>

<style lang='scss'>
.s-uploader {
  .el-upload-dragger{
    height: 100px;
    width: 220px;
    .el-icon-upload{
      font-size: 50px;
      margin:10px 0 0;
    }
  }
  .uploader-box {
    width: auto!important;
    display: inline-block;
    vertical-align: top;
    margin-right: 10px;
  }
  .add-icon {
    height: 100px;
    width: 100px;
    border: 1px solid #DCDFE6;
    line-height: 100px;
    text-align: center;
    border-radius: 6px;
    i{
      font-size: 25px;
      color:#DCDFE6;
    }
  }
  .file-list {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
