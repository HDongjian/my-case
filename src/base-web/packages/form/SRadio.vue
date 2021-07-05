<template>
  <div :class="cpClassName">
    <el-radio-group v-if="!cpIsDetail" @change="change" :style="cpStyles" v-model="privateValue">
      <el-radio v-for="(item,i) in cpOptions" :key="i" :label="item.value">{{item.name}}</el-radio>
    </el-radio-group>
    <div v-else>{{cpOptionsMap[privateValue]}}</div>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SRadio',
  mixins: [mixins]
}
</script>
