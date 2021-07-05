import lib from '../utils/lib'
import { dispatchData, dispatch } from '../utils/package'
export default {
  data () {
    return {
      lib,
      defaultStyles: {
        width: '100%'
      },
      defaultMaxLength: 100,
      defaultRows: 2,
      privateValue: null,
      errorFlag: false,
      privateClicking: false,
      errorType: '',
      trigger: {
        SInput: 'blur'
      },
      cpOptions: [],
      myParent: '',
      cpIsDetail: false
    }
  },
  props: {
    parent: { type: String },
    size: { type: String, default: 'medium' },
    mykey: { type: String },
    data: Object,
    options: Object,
    ruleType: String,
    disabled: Boolean,
    isDetail: { type: Boolean, default: false },
    labelWidth: { type: String, default: 'auto' },
    value: [String, Number, Array, Date, Object, Boolean]
  },
  computed: {
    cpDetailText () {
      if (!this.privateValue && this.privateValue !== 0) {
        return this.options.emptyText || '暂无内容'
      } else {
        return this.privateValue
      }
    },
    cpClassName () {
      const className = this.lib.stringToLowerLine(this.$options._componentTag)
      return [className, this.options.class ? this.options.class : '']
    },
    cpLabelWidth () {
      if (this.options.labelWidth) {
        return this.options.labelWidth
      }
      if (!this.options.label) return
      if (this.labelWidth === 'lauto') {
        const ll = this.options.label.length
        return 40 + (ll - 1) * 12 + 'px'
      }
      if (this.labelWidth === 'sauto') {
        const ll = this.options.label.length > 4 ? this.options.label.length : 4
        return 40 + (ll - 1) * 12 + 'px'
      }
      if (this.labelWidth === 'vauto') {
        const ll = this.options.label.length
        return 40 + (ll - 1) * 12 + 'px'
      }
      return ''
    },
    cpDisabled () {
      if (this.options.disabled !== undefined) {
        return this.options.disabled
      }
      if (this.disabled !== undefined) {
        return this.disabled
      }
      return false
    },
    cpPlaceholder () {
      const action = this.trigger[this.options.name] === 'blur' ? '填写' : '选择'
      if (this.cpDisabled) {
        return this.options.placeholder || ''
      } else {
        return this.options.placeholder || `请${action + this.options.label}`
      }
    },
    cpStyles () {
      return this.options.styles || this.defaultStyles
    },
    cpOptionsMap () {
      const cpOptionsMap = {}
      for (const item of this.cpOptions) {
        cpOptionsMap[item.value] = item.name
      }
      return cpOptionsMap
    }
  },
  watch: {
    privateValue (val) {
      this.dispatch('s-form', { key: this.options.key, value: val })
    },
    value () {
      this.privateValue = this.value
    },
    isDetail () {
      this.setDetail()
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    setTimeout(() => {
      this.setLabelStyle()
    }, 100)
  },
  methods: {
    initData () {
      this.privateValue = this.value
      this.setCpOptions()
      this.getParent()
      this.setDetail()
    },
    setDetail () {
      if (this.isDetail) {
        this.cpIsDetail = true
      }
      if (this.options.isDetail) {
        this.cpIsDetail = this.myEval(this.options.isDetail)
      }
      if (!this.isDetail && !this.options.isDetail) { this.cpIsDetail = false }
    },
    getParent () {
      if (!this.parent) {
        this.myParent = this.$parent
      }
      this.myParent = this.dispatchData(this.parent)
    },
    dispatchData (componentName) {
      return dispatchData.call(this, componentName)
    },
    myEval (fun) {
      const Fn = Function
      return new Fn('return ' + fun).call(this.myParent)
    },
    change () {
      if (!this.lib.isFunction(this.options.change)) return
      this.options.change(this.privateValue, this.mykey)
    },
    setLabelStyle () {
      if (!this.$refs.formItem) return
      const formItem = this.$refs.formItem.$el
      const height = formItem.offsetHeight
      const label = formItem.getElementsByTagName('label')[0]
      label.style.height = height + 'px'
      label.style.lineHeight = height + 'px'
    },
    async setCpOptions () {
      const { items } = this.options
      let cpOptions = []
      this.cpOptions = []
      if (this.lib.isArray(items)) {
        cpOptions = items.map(item => {
          if (this.lib.isObject(item)) {
            return item
          } else if (this.isString(item)) {
            return { name: item, value: item }
          }
        })
      } else if (this.lib.isObject(items)) {
        const it = []
        for (const key in items) {
          it.push({ name: items[key], value: key })
        }
        cpOptions = this.it
      } else if (this.options.async) {
        cpOptions = await this.options.async(this.mykey, this.options)
      }
      for (const im of cpOptions) {
        let have = false
        for (const rs of this.cpOptions) {
          if (rs.value === im.value) {
            have = true
          }
        }
        if (!have) {
          this.cpOptions.push(im)
        }
      }
      this.setOpFinish && this.setOpFinish()
    },
    dispatch (componentName, params) {
      dispatch.call(this, componentName, params)
    }
  }
}
