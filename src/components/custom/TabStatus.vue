<template>
  <div class="tab-status">
    <div @click="chooseStatus(item)" :style="`${item.value === privateValue?`box-shadow: 0 2px 12px 0 rgba(${item.color},0.50)`:''};${setStatusStyle(item)}`" class="status-item" v-for="(item,i) in options" :key="i">
      <div class="icon">
        <my-icon :icon-class="item.icon||'setting'"></my-icon>
      </div>
      <div class="s-content">
        <p class="s-label">{{item.label}}</p>
        <p class="s-count">{{count[item.key]||0}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: [Number, String],
    count: { type: Object, required: true },
    options: { type: Array, required: true }
  },
  data () {
    return {
      privateValue: ''
    }
  },
  watch: {
    value () {
      this.privateValue = this.value
    }
  },
  created () {
    this.privateValue = this.value
  },
  methods: {
    chooseStatus (item) {
      this.$emit('update:value', item.value)
      this.$emit('change', item.value)
    },
    setStatusStyle (item) {
      let color = item.color || '204, 102, 255'
      let style = `background-image: linear-gradient(41deg, rgba(${color}, .5) 0%, rgba(${color}, 1) 100%);`
      return style
    }
  }
}
</script>

<style lang='scss'>
.tab-status{
  margin-top: 20px;
  .status-item{
    cursor:pointer;
    background-image: linear-gradient(41deg, #FED478 0%, #FCA943 100%);
    box-shadow: 0 2px 12px 0 rgba(196,196,196,0.50);
    height: 68px;
    min-width: 187px;
    display: inline-block;
    color: #fff;
    overflow:hidden;
    margin-right: 17px;
    padding-right: 10px;
    .icon{
      height: 30px;
      width: 30px;
      display: inline-block;
      margin: 19px 13px 0 19px;
      vertical-align: super;
      .my-icon-setting{
        color: #fff;
        fill: #fff;
      }
    }
    .s-content{
      display: inline-block;
      p{
        margin:0;
      }
      .s-label{
        margin-top: 10px;
      }
      .s-count{
        margin-top: 4px;
      }
    }
  }
}

</style>
