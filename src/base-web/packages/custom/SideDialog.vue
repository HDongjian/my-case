<template>
  <div :class="modal ? 'side-dialog show' : 'side-dialog'" @click.stop>
    <div ref="header" class="header">
      <slot name="header">
        <span>{{title}}</span><i class="el-icon-close" @click.stop="close()"></i></slot>
    </div>
    <div ref="body" style="calc(100% - 110px)" class="body"><slot></slot></div>
    <div ref="footer"><slot name="footer"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'SideDialog',
  props: {
    modal: { type: Boolean, default: false },
    title: { type: String }
  },
  mounted () {
    this.$nextTick(this.resizeContent)
  },
  watch: {
    modal () {
      this.$nextTick(this.resizeContent)
    }
  },
  methods: {
    close () {
      this.$emit('update:modal', false)
      this.$emit('close')
    },
    resizeContent () {
      const { header, body, footer } = this.$refs
      const headerH = header.clientHeight
      const bottomH = footer.clientHeight
      body.style.height = `calc(100% - ${headerH + bottomH}px)`
    }
  }
}
</script>

<style lang='scss'>
.side-dialog {
  position: absolute;
  top: 0;
  right: -520px;
  bottom: 0;
  width: 500px;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 200;
  box-shadow: 0 7px 21px rgba(0, 0, 0, .25);
  transition: right 400ms;
  &.show {
    right: 0;
  }
  >.header {
    font-size: 16px;
    color: #333;
    height: 52px;
    line-height: 52px;
    box-sizing: border-box;
    position: relative;
    >span {
      padding: 0 15px;
      font-size: 18px;
    }
    >i {
      position: absolute;
      right: 20px;
      top: 18px;
      cursor: pointer;
      color: #999;
    }
  }
  >.body {
    overflow: hidden;
    overflow-y: auto;
  }
}

</style>
