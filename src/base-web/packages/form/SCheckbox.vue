<template>
  <div :class="cpClassName">
    <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox> -->
    <el-checkbox-group checked :disabled='cpDisabled || cpIsDetail' @change="change" :style="cpStyles" v-model="privateValue">
      <el-checkbox v-for="(item,i) in checkBoxOptions" :key="i" :label="item.value">{{item.name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SCheckbox',
  mixins: [mixins],
  data () {
    return {
      checkAll: false,
      isIndeterminate: false
    }
  },
  computed: {
    checkBoxOptions () {
      if (this.cpIsDetail) {
        return this.cpOptions.filter(item => {
          return this.privateValue.includes(item.value)
        })
      } else {
        return this.cpOptions
      }
    }
  },
  methods: {
    checkAllChange (val) {
      this.privateValue = val ? this.checkBoxOptions.map(item => {
        return item.value
      }) : []
      this.isIndeterminate = false
    },
    change (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.checkBoxOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkBoxOptions.length
      if (!this.lib.isFunction(this.options.change)) return
      this.options.change(this.privateValue, this.mykey)
    }
  }
}
</script>
