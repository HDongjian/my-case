<template>
  <div class="copy">
    <el-tooltip effect="dark" class="content-tooltip" :content="tooltip||text" placement="top-start">
      <slot>
        <div>{{text}}</div>
      </slot>
    </el-tooltip>
    <el-tooltip effect="dark" content="复制" placement="top-start">
      <i class="el-icon-copy-document" @click="copyText()"></i>
    </el-tooltip>
  </div>

</template>

<script>
export default {
  name: 'Copy',
  props: {
    text: { type: String },
    tooltip: { type: String }
  },
  methods: {
    copyText () {
      const input = document.createElement('input')
      input.style.cssText = 'display: block;opacity: 0;position: absolute;left: -10000px;top: -10000px;z-index: -1;width: 1px;height: 1px;'
      document.body.appendChild(input)
      input.value = this.text
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('复制成功')
    }
  }
}
</script>

<style lang="scss">
.copy {
  width: 100%;
  .content-tooltip {
    display: inline-block;
    max-width: calc(100% - 30px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: bottom;
    margin-right: 10px;
  }
  > i {
    cursor: pointer;
  }
}
</style>
