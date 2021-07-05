<template>
  <div :class="cpClassName">
    <el-rate v-model="privateValue" :disabled="cpIsDetail" @change="change" :style="cpStyles" :show-text="options.showText===undefined?true:options.showText">
    </el-rate>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SRate',
  mixins: [mixins]
}
</script>
<style lang="scss">
.s-rate {
  .el-radio-group {
    display: none;
  }
}
</style>
