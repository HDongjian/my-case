<template>
  <div class="file-list">
    <div class="file-list-item" @click.stop="showFileList(i)" v-for="(item,i) in dealFileList" :key="i">
      <img v-if="$lib.isPictureLink(item.url)" :src="item.url" :alt="item.name || item.url">
      <video v-else-if="$lib.isVedioLink(item.url)" :src="item.url"></video>
      <i v-else-if="$lib.isAudioLink(item.url)" class="el-icon-bell"></i>
      <i v-else class="el-icon-link"></i>
      <div :title="item.name||item.url" class="file-name">{{item.name||item.url}}</div>
      <div v-if="!isDetail" class="action-shadow" @click.stop="remove(item,i)"><i class="el-icon-delete"></i></div>
    </div>
    <div v-if="isDetail&&dealFileList.length===0">暂无内容</div>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    fileList: { type: Array, default () { return [] } },
    isDetail: { type: Boolean, default: true }
  },
  data () {
    return {
      imgUrlList: [],
      initialIndex: 0,
      mediaUrl: '',
      mediaType: '',
      dealFileList: []
    }
  },
  watch: {
    fileList: {
      handler () {
        this.dealFileList = this.fileList
      },
      deep: true
    }
  },
  created () {
    this.dealFileList = this.fileList
  },
  methods: {
    remove (item, i) {
      this.$emit('remove', { row: item, index: i })
    },
    showFileList (i) {
      if (!this.isDetail) return
      try {
        this.$fp.show(this.dealFileList, i)
      } catch (error) {
        this.lib.customConsole(error.message)
      }
    }
  }
}
</script>

<style lang='scss'>
.file-list {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  .file-list-item {
    display: inline-block;
    height: 100px;
    width: 100px;
    line-height: 100px;
    text-align: center;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    vertical-align: top;
    background-color: #c0c4cc;

    &:hover {
      .action-shadow {
        display: block;
      }
    }
    > img,
    > video {
      height: 100%;
      width: 100%;
    }
    > i {
      font-size: 25px;
      color: #fff;
    }
    .file-name {
      position: absolute;
      padding: 4px;
      border-radius: 0 0 6px 6px;
      width: 100%;
      font-size: 12px;
      background-color: #dcdfe6;
      left: 0;
      bottom: 0;
      color: #000;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .action-shadow {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 6px;
      overflow: hidden;
      text-align: center;
      line-height: 100px;
      i {
        font-size: 25px;
        color: #f56c6c;
      }
    }
  }
}
</style>
