import lib from '../utils/lib'
export default {

  data () {
    return {
      PDictionaryMap: {},
      PRuesMaps: {},
      PComponentsMaps: {},
      PDealComponents: {
        SCascader: [],
        SDateTime: [],
        SCheckbox: [],
        SDate: [],
        SArea: [],
        SCaseType: [],
        SSelect: [],
        STreebox: []
      },
      PFullLoading: null
    }
  },
  created () {
    this.PInit()
  },
  methods: {
    PInit () {
      if (!this.isPage) return
      try {
        this.PSetClumnsKeys()
        this.PSetDictionary()
      } catch (error) {
        lib.customConsole(error.message)
      }
    },
    PDealQueryParams (queryData, noEffective = ['page', 'total', 'limit']) {
      const params = {
        page: queryData.page,
        limit: queryData.limit
      }
      for (const key in queryData) {
        const value = queryData[key]
        if (value) {
          if (lib.isArray(value)) {
            params[key] = value.length > 0 ? value[value.length - 1] : ''
          } else if (!noEffective.includes(key) && key.indexOf('Range') < 0) {
            params[key] = value
          }
        }
      }
      return params
    },
    PFormToData (form) {
      if (!form) return
      const newData = {}
      for (const key in form) {
        const value = form[key]
        if (this.PDealComponents) {
          const { SCascader, SArea, SDateTime, SCheckbox, SDate, SCaseType, SSelect } = this.PDealComponents
          if (SArea && SArea.includes(key) && lib.isArray(value)) {
            newData[key] = value.length > 0 ? value[value.length - 1] : ''
          } else if (SCascader && SCascader.includes(key) && lib.isArray(value)) {
            newData[key] = value.join('-')
          } else if (SCheckbox && SCheckbox.includes(key) && lib.isArray(value)) {
            newData[key] = value.join(',')
          } else if (SSelect && SSelect.includes(key) && lib.isArray(value)) {
            newData[key] = value.join(',')
          } else if (SDateTime && SDateTime.includes(key)) {
            newData[key] = value ? lib.myMoment(value).formate('YYYY-MM-DD') : ''
          } else if (SDate && SDate.includes(key)) {
            newData[key] = value ? lib.myMoment(value).formate('YYYY-MM-DD HH:mm:ss') : ''
          } else if (SCaseType && SCaseType.includes(key)) {
            newData[key] = value
          } else {
            newData[key] = value
          }
        } else {
          newData[key] = value
        }
      }
      return newData
    },
    PDataToForm (data, form) {
      if (!data || !form) return
      const newForm = {}
      for (const key in data) {
        const value = data[key]
        if (Object.prototype.hasOwnProperty.call(form, key)) {
          if (this.PDealComponents) {
            const { SCascader, SArea, SDateTime, SCheckbox, SDate, SSelect } = this.PDealComponents
            if (SArea && SArea.includes(key)) {
              newForm[key] = value ? lib.stringSplitBy(value, [6, 9, 12, 14]) : []
            } else if (SCascader && SCascader.includes(key)) {
              newForm[key] = value ? value.split('-') : []
            } else if (SCheckbox && SCheckbox.includes(key)) {
              newForm[key] = value ? value.split(',') : []
            } else if (SSelect && SSelect.includes(key)) {
              newForm[key] = value ? value.split(',') : []
            } else if (SDateTime && SDateTime.includes(key)) {
              newForm[key] = value ? new Date(value) : ''
            } else if (SDate && SDate.includes(key)) {
              newForm[key] = value ? new Date(value) : ''
            } else {
              newForm[key] = value
            }
          } else {
            newForm[key] = value
          }
        }
      }
      return { ...form, ...newForm }
    },
    async PSetDictionary () {
      try {
        if (this.dictionariyLoad) {
          this.PFullLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(255, 255, 255, 0.3)'
          })
        }
        for (const key in this.PComponentsMaps) {
          const value = this.PComponentsMaps[key]
          if (!Object.prototype.hasOwnProperty.call(this.PDictionaryMap, key)) {
            this.$set(this.PDictionaryMap, key, {})
            if (lib.isFunction(value)) {
              const datas = await value()
              for (const item of datas) {
                this.$set(this.PDictionaryMap[key], item.value, item.name)
              }
            } else if (lib.isArray(value)) {
              for (const item of value) {
                this.$set(this.PDictionaryMap[key], item.value, item.name)
              }
            } else if (lib.isObject(value)) {
              this.$set(this.PDictionaryMap, key, { ...value })
            }
          }
        }
        this.PDictionaryMap = { ...this.PDictionaryMap }
        if (this.dictionariyLoad) {
          this.PFullLoading.close()
        }
        lib.customConsole(this.$vnode.tag.replace('vue-component-', '') + '：字典加载完毕，可以调用dictionariyLoad函数；字典参看PDictionaryMap')
        this.dictionariyLoad && this.dictionariyLoad()
      } catch (error) {
        lib.customConsole(error.message)
        if (this.dictionariyLoad) {
          this.PFullLoading.close()
        }
      }
    },
    PFormatterCommon (row, column) {
      try {
        const { property } = column
        const propertyList = property.split(','); let result = ''
        for (const pl of propertyList) {
          const pls = this.PDealProperty({ row, property: pl })
          if (propertyList.length > 1) {
          }
          result = lib.isEffective(pls) ? result += pls : result
        }
        if (!lib.isEffective(result)) {
          result = '-'
        }
        return result
      } catch (error) {
        lib.customConsole(error.message)
      }
    },
    PDealProperty ({ row, property }) {
      const data = row[property]
      let result = data
      const { STreebox, SCascader } = this.PDealComponents
      if (lib.isObject(this.PDictionaryMap[property])) {
        if (STreebox.includes(property) || SCascader.includes(property)) {
          const listData = data.split(',')
          result = listData.map(item => {
            let itemList = item.split('-')
            itemList = itemList.map(il => {
              return this.PDictionaryMap[property][il] || ''
            })
            return itemList.join('-')
          })
          result = result.join(',')
        } else {
          result = this.PDictionaryMap[property][data] || ''
        }
      }
      if (property === 'code' || property === 'gridCode') {
        result = this.PGetGridName(data)
      }
      const rules = this.PRuesMaps[property]
      if (rules && rules === 'idCard') {
        result = lib.stringCardCodeEncrypt(data)
      }
      if (rules && rules === 'mobile') {
        result = lib.stringPhoneEncrypt(data)
      }
      if (rules && rules === 'phone') {
        result = lib.stringPhoneEncrypt(data)
      }
      if (rules && rules === 'landline') {
        result = lib.stringPhoneEncrypt(data)
      }
      if (rules && rules === 'email') {
        result = lib.stringEmailEncrypt(data)
      }
      if (rules && rules === 'name') {
        result = lib.stringNameEncrypt(data)
      }
      if (rules && rules === 'date' && data) {
        result = lib.dateFormate(data, 'YYYY-MM-DD')
      }
      if (rules && rules === 'datetime' && data) {
        result = lib.dateFormate(data)
      }
      return result
    },
    PSetClumnsKeys () {
      let components = []; let rules = {}
      for (const key in this.$data) {
        const lkey = key.toLowerCase(); const value = this.$data[key]
        if (lkey.indexOf('components') >= 0 && lib.isArray(value)) {
          components = [...value, ...components]
        }
        if (lkey.indexOf('rule') >= 0 && lib.isObject(value)) {
          rules = { ...value, ...rules }
        }
      }
      for (const item of components) {
        if (item.async && item.key) {
          this.PComponentsMaps[item.key] = item.async
        }
        if (item.items && item.key) {
          this.PComponentsMaps[item.key] = item.items
        }
        if (item.name === 'SCascader') {
          this.PDealComponents.SCascader.push(item.key)
        } else if (item.name === 'SCheckbox') {
          this.PDealComponents.SCheckbox.push(item.key)
        } else if (item.name === 'SDateTime' && (!item.type || item.type === 'date')) {
          this.PDealComponents.SDateTime.push(item.key)
          this.PRuesMaps[item.key] = 'date'
        } else if (item.name === 'SDateTime' && item.type === 'datetime') {
          this.PDealComponents.SDate.push(item.key)
          this.PRuesMaps[item.key] = 'datetime'
        } else if (item.name === 'SArea' || item.name === 'SAreaAsyn') {
          this.PDealComponents.SArea.push(item.key)
        } else if (item.name === 'SSelect' && item.multiple) {
          this.PDealComponents.SSelect.push(item.key)
        } else if (item.name === 'SCaseType') {
          this.PDealComponents.SCaseType.push(item.key)
        } else if (item.name === 'STreebox') {
          this.PDealComponents.STreebox.push(item.key)
        }
      }
      for (const key in rules) {
        const value = rules[key]
        if (lib.isObject(value) && value.type) {
          this.PRuesMaps[key] = value.type
        }
      }
    }
  }
}
