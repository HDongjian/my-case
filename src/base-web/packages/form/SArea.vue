<template>
  <div :class="cpClassName">
    <el-cascader v-if="!cpIsDetail" @change="change" v-model="privateValue" :disabled='cpDisabled' :style="cpStyles" :props="cpProps" :placeholder="cpPlaceholder" :options="areaOptions" :show-all-levels="false" clearable></el-cascader>
    <div v-else>{{setDetailValue||areaOptionsMaps[detailValue] || detailValue}}</div>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SArea',
  mixins: [mixins],
  data () {
    return {
      props: {
        expandTrigger: 'click',
        multiple: false,
        checkStrictly: false,
        emitPath: true,
        lazy: false,
        value: 'value',
        label: 'label',
        children: 'children'
      },
      privateValue: [],
      detailValue: '',
      areaOptions: [],
      areaOptionsMaps: {}
    }
  },
  watch: {
    value () {
      this.setPrivate()
    }
  },
  computed: {
    cpProps () {
      if (this.options.props && this.lib.isObject(this.options.props)) {
        return { ...this.props, ...this.options.props }
      }
      return this.props
    },
    setDetailValue () {
      if (!this.options.isCode) return this.areaOptionsMaps[this.detailValue]
      if (!this.$lib.isString(this.detailValue)) return this.detailValue
      let areaCodes = this.$lib.stringSplitBy(this.detailValue, [6, 9, 12, 14])
      areaCodes = areaCodes.map(item => {
        return this.areaOptionsMaps[item] || ''
      })
      areaCodes.filter(item => !!item)
      return areaCodes.join('')
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      if (this.cpProps.lazy) return
      if (!this.lib.isFunction(this.cpProps.lazyLoad)) return
      this.areaOptions = await this.cpProps.lazyLoad()
      this.areaOptionsMaps = this.getListMap(this.areaOptions)
      this.setPrivate()
    },
    change (value) {
      if (!this.lib.isFunction(this.options.change)) return
      for (const item of this.areaOptions) {
        if (item.key === value) {
          this.options.change({ ...item, fullName: item.value }, this.mykey)
          return
        }
      }
    },
    setPrivate () {
      if (this.$lib.isArray(this.value)) {
        this.privateValue = this.value
        this.detailValue = this.value[this.value.length - 1]
      }
      if (this.$lib.isString(this.value)) {
        this.detailValue = this.value
      }
    },
    getListMap (arrs = []) {
      const { label, value, children } = this.cpProps
      let result = {}
      for (const item of arrs) {
        result[item[value]] = item[label]
        if (item[children] && item[children].length) {
          result = { ...this.getListMap(item[children]), ...result }
        }
      }
      return result
    }
  }
}
</script>
