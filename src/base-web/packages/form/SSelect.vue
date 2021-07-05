<template>
  <div :class="cpClassName">
    <el-select clearable v-if="!cpIsDetail" @change="change" :filterable="options.filterable" :multiple="cpMultiple" v-model="privateValue" :disabled='cpDisabled' :style="cpStyles" :placeholder="cpPlaceholder">
      <el-option :disabled="item.disabled" v-for="(item,i) in cpOptions" :key="i" :label="item.name" :value="item.value">
        <span v-if="item.space">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{{item.name}}
      </el-option>
    </el-select>
    <div v-else>
      {{detailValue||cpDetailText}}
      <el-button v-if="options.detailClick" type="text" @click="open">展开</el-button>
    </div>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SSelect',
  mixins: [mixins],
  watch: {
    value () {
      this.privateValue = this.value
    }
  },
  computed: {
    cpMultiple () {
      return this.options.multiple
    },
    detailValue () {
      if (!this.cpIsDetail) return ''
      let data = ''
      if (this.cpMultiple && this.privateValue && this.privateValue.length) {
        data = this.privateValue.map(item => {
          return this.cpOptionsMap[item]
        })
        return data.join(',')
      } else {
        return this.cpOptionsMap[this.privateValue]
      }
    }
  },
  methods: {
    open () {
      this.options.detailClick && this.options.detailClick()
    }
  }
}
</script>
