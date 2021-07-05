<template>
  <div :class="cpClassName">
    <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="cpPickerOptions" v-if="!cpIsDetail" @change="change" :disabled='cpDisabled' :editable="false" :type="cpTypes" v-model="privateValue" :style="cpStyles" :placeholder="cpPlaceholder"></el-date-picker>
    <div v-else>{{privateValue?myMoment(privateValue).formate(dateTypeMaps[cpTypes]):''}}</div>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SDateTime',
  mixins: [mixins],
  data () {
    return {
      defaultType: 'date',
      dateTypeMaps: {
        date: 'YYYY-MM-DD',
        daterange: 'YYYY-MM-DD',
        datetimerange: 'YYYY-MM-DD HH:mm:ss',
        datetime: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  },
  methods: {
    change () {
      if (this.lib.isFunction(this.options.change)) {
        this.options.change(this.privateValue)
      }
      const { range } = this.options
      if ((this.cpTypes === 'daterange' || this.cpTypes === 'datetimerange') && this.lib.isArray(range) && range.length === 2) {
        if (this.lib.isArray(this.privateValue) && this.privateValue.length === 2) {
          this.dispatch('s-form', { key: range[0], value: this.lib.dateFormate(this.privateValue[0], this.dateTypeMaps[this.cpTypes]) })
          this.dispatch('s-form', { key: range[1], value: this.lib.dateFormate(this.privateValue[1], this.dateTypeMaps[this.cpTypes]) })
        } else {
          this.dispatch('s-form', { key: range[0], value: '' })
          this.dispatch('s-form', { key: range[1], value: '' })
        }
      }
    }
  },
  computed: {
    cpPickerOptions () {
      const options = {}
      const { max, min } = this.options
      options.disabledDate = (time) => {
        return (max ? time.getTime() > new Date(max).getTime() : false) || (min ? time.getTime() < new Date(min).getTime() : false)
      }
      return options
    },
    cpTypes () {
      return this.options.type || this.defaultType
    }
  }
}
</script>
