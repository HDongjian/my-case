<template>
  <el-dialog top="5%" append-to-body class="file-previewer" width="80%" :visible.sync="visible" :close="close">
    <div class="preview-title" slot="title">
      <h4>{{documentTitle}}：<a :href="activePriview.url">{{activePriview.name||activePriview.url}}</a></h4>
    </div>
    <div class="preview-container">
      <el-carousel ref="carousel" height="650px" :interval="5000" arrow="always" indicator-position="none" :initial-index="initialIndex" :autoplay="false" @change="carouselChange">
        <el-carousel-item v-for="(item,index) in fileList" :key="index">
          <div class="preview-item">
            <img v-if="lib.isPictureLink(item.url)" :src="item.url" :alt="item.name || item.url">
            <video ref="video" v-else-if="lib.isVedioLink(item.url)" :src="item.url" controls></video>
            <audio ref="audio" v-else-if="lib.isAudioLink(item.url)" :src="item.url" controls></audio>
            <a v-else :href="item.url">{{item.name || item.url}}</a>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </el-dialog>
</template>

<script>
import lib from '../../utils/lib'
export default {
  data () {
    return {
      lib,
      visible: false,
      initialIndex: 0,
      fileList: [],
      documentTitle: '',
      activePriview: {}
    }
  },
  methods: {
    show (fileList, index) {
      if (!this.lib.isArray(fileList)) {
        this.lib.customConsole('文件列表不是一个数组')
        return
      }
      this.fileList = fileList
      this.documentTitle = document.title
      this.visible = true
      if (!isNaN(index)) {
        this.initialIndex = index
      }
      if (!this.$refs.carousel) {
        this.activePriview = this.fileList[this.initialIndex]
      }
      this.$refs.carousel.setActiveItem(index)
    },
    carouselChange (index) {
      this.activePriview = this.fileList[index]
    },
    close () {
      try {
        const audios = this.$refs.audio
        const videos = this.$refs.video
        for (const item of [...audios, ...videos]) {
          item.pause()
        }
        this.fileList = []
        this.visible = false
      } catch (error) {
        this.lib.customConsole(error.message)
      }
    }
  }
}
</script>

<style lang="scss">
.file-previewer {
  .preview-title {
    h4 {
      font-size: 18px;
    }
    a {
      color: #409eff;
    }
  }
  .preview-item {
    text-align: center;
    line-height: 680px;
    img {
      height: 100%;
      width: 100%;
    }
    video {
      height: 80%;
      width: 80%;
    }
    a {
      font-size: 30px;
      color: #409eff;
    }
  }
}
</style>
