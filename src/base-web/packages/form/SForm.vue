<template>
  <el-form :label-position="labelPosition||'right'" :class="{'d-inline v-align-top':inline,'s-form':true,'s-form-detail':isDetail}" :inline="inline" :model="data" ref="form" :rules="dealRules" :label-width="labelWidth">
    <el-row :class="{'d-inline':inline}" :gutter="gutter">
      <el-col :class="{'w-at':inline}" :span="item.span" v-for="(item,k) in dealComonents" :key="`form_${k}_${mykey}`">
        <el-form-item :class="cpClassName(item)" :label-width="cpLabelWidth(item)" :label="item.label" :prop="item.key">
          <component :mykey="mykey" :parent="parent" :data="data" :size="size" :disabled='disabled' :label-width="labelWidth" :isDetail="isDetail" :ref="item.key||'forms'" :value="formData[item.key]" :ruleType="rules[item.key]?rules[item.key].type:''" :options="item" :is="item.name"></component>
        </el-form-item>
      </el-col>
      <div style="display:inline-block"><slot></slot></div>
    </el-row>
  </el-form>
</template>

<script>
import lib from '../../utils/lib'
import { dispatchData } from '../../utils/package'
export default {
  name: 'SForm',
  props: {
    parent: { type: String },
    mykey: { type: String },
    size: { type: String, default: 'medium' },
    data: { type: Object, required: true },
    gutter: { type: Number, default: 0 },
    components: { type: Array, required: true },
    disabled: { type: Boolean, default: false },
    isDetail: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    rules: { type: Object, default: () => { return {} } },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String }
  },
  data () {
    return {
      resetData: {},
      formData: {},
      trigger: {
        SInput: 'blur',
        SSelect: 'change',
        SDateTime: 'change',
        SLocation: 'change',
        SRadio: 'change',
        SCheckbox: 'change',
        SUploader: 'change',
        SArea: 'change',
        SCascader: 'change'
      },
      validatorFunMap: {
        number: 'validateNumber',
        mobile: 'validateMobile',
        idCard: 'validateIdCard',
        landline: 'validateLanline',
        phone: 'validatePhone',
        creditCode: 'validateCreditCode',
        grid: 'validateGrid',
        email: 'validateEmail',
        name: 'validateName',
        json: 'validateJson',
        object: 'validateObject',
        url: 'validateUrl'
      },
      myParent: null,
      dealComonents: []
    }
  },
  created () {
    this.resetData = { ...this.data }
    this.formData = { ...this.data }
    try {
      this.getParent()
      this.setLabelTitle()
    } catch (error) {
      lib.customConsole(error.message)
    }
  },
  watch: {
    data: {
      handler () {
        this.formData = { ...this.data }
      },
      deep: true
    },
    components: {
      handler () {
        this.resetComponent()
      },
      deep: true
    }
  },
  computed: {
    dealRules () {
      const rules = {}
      for (const key in this.rules) {
        rules[key] = []
        const cp = this.findCPInf(key)
        if (!cp) {
          lib.customConsole(key + '该属性未在components中找到')
          continue
        }
        const { type } = this.rules[key]
        if (this.validatorFunMap[type]) {
          rules[key].push({ required: this.rules[key].required, validator: this[this.validatorFunMap[type]], trigger: this.trigger[cp.name] })
        } else {
          rules[key].push({ required: this.rules[key].required, validator: this.validateString, trigger: this.trigger[cp.name] })
        }
      }
      return rules
    }
  },
  methods: {
    cpClassName (options) {
      return options.class
    },
    cpLabelWidth (options) {
      if (options.labelWidth) {
        return options.labelWidth
      }
      if (!options.label) return
      if (this.labelWidth === 'lauto') {
        const ll = options.label.length
        return 40 + (ll - 1) * 12 + 'px'
      }
      if (this.labelWidth === 'sauto') {
        const ll = options.label.length > 4 ? options.label.length : 4
        return 40 + (ll - 1) * 12 + 'px'
      }
      if (this.labelWidth === 'vauto') {
        const ll = options.label.length
        return 40 + (ll - 1) * 12 + 'px'
      }
      return ''
    },
    setLabelTitle () {
      this.$nextTick(() => {
        const formEl = this.$refs.form.$el
        const labels = formEl.getElementsByTagName('label')
        for (const label of labels) {
          label.title = label.innerText
        }
      })
    },
    getParent () {
      if (!this.parent) {
        this.myParent = this.$parent
      } else {
        this.myParent = dispatchData.call(this, this.parent)
      }
      if (!this.myParent) {
        lib.customConsole('未找到父组件，可以尝试设置componentName属性值')
        return
      }
      this.dealComonents = this.components.filter(item => {
        if (item.show) {
          return this.myEval(item.show)
        } else {
          return true
        }
      })
    },
    resetComponent () {
      this.dealComonents = this.components.filter(item => {
        const show = item.show ? this.myEval(item.show) : true
        return show
      })
      for (const item of this.dealComonents) {
        if (item.key && this.$refs[item.key] && this.$refs[item.key].length) {
          const component = this.$refs[item.key][0]
          if (lib.isFunction(component.initData)) {
            component.initData && component.initData()
          }
        }
      }
    },
    validateObject (rule, value, callback) {
      if (!lib.isObject(value) || JSON.stringify(value) === '{}') {
        callback(new Error('对象格式不正确'))
      }
      const { action, required, label } = this.getFieldInfo(rule)
      for (const key in value) {
        if (required && !lib.isEffective(value[key])) {
          callback(new Error(`请${action}${label}`))
        }
      }
      callback()
    },
    validateJson (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isJSON(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateString (rule, value, callback) {
      setTimeout(() => {
        const { action, required, label } = this.getFieldInfo(rule)
        value = this.formData[rule.field]
        if (!required) { callback() }
        if (required && !lib.isEffective(value)) {
          callback(new Error(`请${action}${label}`))
        } else {
          callback()
        }
      }, 1)
    },
    validateNumber (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isValidatorNum(value)) {
        callback(new Error(`${label}必须为数字`))
      } else {
        callback()
      }
    },
    validateMobile (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isMobile(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateIdCard (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isIdentificationNumber(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateLanline (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isLandline(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validatePhone (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isPhone(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateCreditCode (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isSocialCreditCode(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateUrl (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isLink(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateEmail (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isEmail(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateName (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value && !lib.isChineseName(value)) {
        callback(new Error(`${label}格式错误`))
      } else {
        callback()
      }
    },
    validateGrid (rule, value, callback) {
      const { action, required, label } = this.getFieldInfo(rule)
      if (required && !lib.isEffective(value)) {
        callback(new Error(`请${action}${label}`))
      } else if (value.length < 3) {
        callback(new Error(`${label}需选择到网格`))
      } else {
        callback()
      }
    },
    validate (callback) {
      try {
        this.$refs.form.validate((valid) => {
          callback(valid)
        })
      } catch (error) {
        lib.customConsole(error)
      }
    },
    resetFields () {
      this.$refs.form.resetFields()
      this.$emit('update:data', this.formData)
    },
    clearFields () {
      for (const key in this.formData) {
        if (lib.isArray(this.formData[key])) {
          this.formData[key] = []
        } else if (lib.isObject(this.formData[key])) {
          this.formData[key] = {}
        } else {
          this.formData[key] = ''
        }
      }
      this.$emit('update:data', this.formData)
    },
    detectingChange (params) {
      const { key, value } = params
      if (Object.prototype.hasOwnProperty.call(this.formData, key)) {
        this.formData[key] = value
      }
      this.$emit('update:data', this.formData)
      this.mykey && this.$emit('change', { data: this.formData, key: this.mykey })
    },
    getFieldInfo (rule) {
      const cp = this.findCPInf(rule.field)
      const required = this.rules[rule.field].required
      const action = this.trigger[cp.name] === 'blur' ? '填写' : '选择'
      return { action, required, label: cp.label }
    },
    findCPInf (key) {
      for (const component of this.components) {
        if (component.key === key) {
          return component
        }
      }
    },
    myEval (fun) {
      const Fn = Function
      return new Fn('return ' + fun).call(this.myParent)
    }
  }
}
</script>
<style lang="scss">
.s-form.s-form-detail{
  .el-form{
    position: relative;
    .user-photo{
      position: absolute;
      right:50px;
      top:10px;
      .el-form-item__label-wrap{
        display: none;
      }
    }
    .el-form-item__error{
      display: none;
    }
  }
  .el-checkbox__input.is-disabled + span.el-checkbox__label{
    color:#333;
  }
  .el-checkbox__input.is-disabled{
    display: none;
  }
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before {
    display: none;
  }
  .el-form-item__label-wrap .el-form-item__label{
    margin-right: 0px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item{
    margin-bottom: 0px;
    padding-left: 10px;
  }
}
.s-form .w-at{
  width: auto;
}
.s-query-form .el-row{
  .el-col:first-child{
    height:50px;
  }
}
.s-form .d-inline{
  /*display: inline-block;*/
  display: flex;
  flex-wrap: wrap;
}
.s-form .el-form-item__label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
