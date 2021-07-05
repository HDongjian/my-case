;(function (global) {
  'use strict'
  var MyLib = function (options) {}
  MyLib.prototype = {
    /**
     * 自定义打印
     */
    customConsole () {
      let messages = [].slice.call(arguments)
      messages = messages.map((item) => {
        return JSON.stringify(item)
      })
      console.log(`我是BaseWeb:%c ${messages.join(',')}`, 'color:#D93E3E;')
    },
    /**
     * 判断是否是数组
     * @param {array} o
     */
    isArray (o) {
      return Object.prototype.toString.call(o) === '[object Array]'
    },
    /**
     * 判断是否是对象
     * @param {object} o
     */
    isObject (o) {
      return Object.prototype.toString.call(o) === '[object Object]'
    },
    /**
     * 判断是否是字符串
     * @param {string} o
     */
    isString (o) {
      return Object.prototype.toString.call(o) === '[object String]'
    },
    /**
     * 判断是否是数字
     * @param {bumber} o
     */
    isNumber (o) {
      return Object.prototype.toString.call(o) === '[object Number]'
    },
    /**
     * 判断是否是日期
     * @param {date} o
     */
    isDate (o) {
      return Object.prototype.toString.call(o) === '[object Date]'
    },
    /**
     * 判断是否是函数
     * @param {function} o
     */
    isFunction (o) {
      return Object.prototype.toString.call(o) === '[object Function]'
    },
    /**
     * 判断是否是正则表达式
     * @param {regexp} o
     */
    isRegExp (o) {
      return Object.prototype.toString.call(o) === '[object RegExp]'
    },
    /**
     * 判断是否是blob文件
     * @param {blob} o
     */
    isBlob (o) {
      return Object.prototype.toString.call(o) === '[object Blob]'
    },
    /**
     * 判断是否是file文件
     * @param {file} o
     */
    isFile (o) {
      return Object.prototype.toString.call(o) === '[object File]'
    },
    dateXlsxTime (numb) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      return this.dateFormate(time, 'HH:mm')
    },
    /**
     * 处理从 Excel 单元格中读取到的日期格式的字段并转换为指定格式的日期字符串
     *
     * @param {string|number} date 从 Excel 单元格中读取到的日期格式
     * @param {string} fmt 要转换为的格式，默认 yyy-MM-dd HH:mm:ss
     */
    handleDate (date, fmt) {
      if (!date) {
        return date
      }
      date = date.trim ? date.trim() : date
      if (/^[\d.]+$/.test(date)) {
        let dateNum = parseFloat(date)
        // 大于 1000 万说明是一个毫秒数，直接解析并转换为指定格式即可
        if (dateNum > 10000000) {
          return this.dateFormate(dateNum, fmt)
        }
        // 否则认为这个是一个 Excel 格式的日期
        date = this.formatExcelDate(dateNum, fmt)
      } else {
        // 处理中文冒号，和 yyyy/MM/dd 格式的问题
        date = date.replace(/：/g, ':').replace(/\//g, '-')
      }
      // 将不规则的格式，例如 "2020-1-1     1:3:3" 转换成 yyyy-MM-dd HH:mm:ss
      // 再转为 Date 对象进行指定的格式化
      return date
      // let dtPars = date.split(/\s+/g)
      // let dPars = dtPars[0].split('-')
      // dPars[1] = this.padding2(dPars[1])
      // dPars[2] = this.padding2(dPars[2])
      // dtPars[0] = dPars.join('-')
      // if (!dtPars[1]) {
      //   dtPars[1] = '00:00:00'
      // } else {
      //   let tPars = dtPars[1].split(':')
      //   tPars[0] = this.padding2(tPars[0])
      //   // 支持分缺失
      //   tPars[1] = this.padding2(tPars[1] || '00')
      //   // 支持秒缺失
      //   tPars[2] = this.padding2(tPars[2] || '00')
      //   dtPars[1] = tPars.join(':')
      // }
      // return this.dateFormate(new Date(dtPars.join(' ')), fmt)
    },

    /**
     * 缺位补0
     */
    padding2 (part) {
      if (part.length === 1) {
        return '0' + part
      } else {
        return part
      }
    },

    /**
     * 解析Excel表达的日期数字，并转换为指定格式的日期字符串
     *
     * @param {number} numb Excel解析出的数字形式的日期
     * @param {string} format 要转换为的格式，默认 yyy-MM-dd HH:mm:ss
     */
    formatExcelDate (numb, format) {
      const time = new Date((numb - 2) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      time.setHours(time.getHours() - 8)
      return this.dateFormate(time, format)
    },
    /**
     * 日期格式化方法
     * @param {日期} date
     * @param {string} formatStr 日期格式
     */
    dateFormate (date = new Date(), formatStr = 'YYYY-MM-DD HH:mm:ss') {
      date = new Date(date)
      if (!this.isString(formatStr)) {
        formatStr = 'YYYY-MM-DD HH:mm:ss'
      }
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const week = date.getDay()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const weeks = ['日', '一', '二', '三', '四', '五', '六']
      return formatStr.replace(
        /Y{2,4}|M{1,2}|D{1,2}|d{1,4}|H{1,2}|m{1,2}|s{1,2}/g,
        (match) => {
          switch (match) {
            case 'YY':
              return String(year).slice(-2)
            case 'YYY':
            case 'YYYY':
              return String(year)
            case 'mouth':
              return String(month)
            case 'MM':
              return String(month).padStart(2, '0')
            case 'D':
              return String(day)
            case 'DD':
              return String(day).padStart(2, '0')
            case 'd':
              return String(week)
            case 'dd':
              return weeks[week]
            case 'ddd':
              return '周' + weeks[week]
            case 'dddd':
              return '星期' + weeks[week]
            case 'H':
              return String(hour)
            case 'HH':
              return String(hour).padStart(2, '0')
            case 'm':
              return String(minute)
            case 'mm':
              return String(minute).padStart(2, '0')
            case 's':
              return String(second)
            case 'ss':
              return String(second).padStart(2, '0')
            default:
              return match
          }
        }
      )
    },
    /**
     *获取日期的前一天
     * @param {日期} date
     */
    dateYesterday (date = new Date()) {
      date = new Date(date)
      var mouth = Number(date.getMonth()) - 1
      return new Date(
        date.getFullYear() + '-' + mouth + '-' + date.getDate() + ' 00:00:00'
      )
    },
    /**
     *获取日期的后一天
     * @param {日期} date
     */
    dateTomorrow (date = new Date()) {
      date = new Date(date)
      date.setDate(date.getDate() + 1)
      var mouth = Number(date.getMonth()) + 1
      return new Date(
        date.getFullYear() + '-' + mouth + '-' + date.getDate() + ' 00:00:00'
      )
    },
    /**
     *获取日期所在周的第一天
     * @param {日期} date
     */
    dateWeekFirstDay (date = new Date()) {
      date = new Date(date)
      var WeekFirstDay = new Date(date - (date.getDay() - 1) * 86400000)
      var mouth = Number(WeekFirstDay.getMonth()) + 1
      return new Date(
        WeekFirstDay.getFullYear() +
          '-' +
          mouth +
          '-' +
          WeekFirstDay.getDate() +
          ' 00:00:00'
      )
    },
    /**
     *获取日期所在周的最后一天
     * @param {日期} date
     */
    dateWeekLastDay (date = new Date()) {
      date = new Date(date)
      var WeekFirstDay = new Date(date - (date.getDay() - 1) * 86400000)
      var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000)
      var mouth = Number(WeekLastDay.getMonth()) + 1
      return new Date(
        date.getFullYear() +
          '-' +
          mouth +
          '-' +
          WeekLastDay.getDate() +
          ' 23:59:59'
      )
    },
    /**
     *获取日期所在月的第一天
     * @param {日期} date
     */
    dateMonthFirstDay (date = new Date()) {
      date = new Date(date)
      var MonthFirstDay = new Date(date.getFullYear(), date.getMonth(), 1)
      var mouth = Number(MonthFirstDay.getMonth()) + 1
      return new Date(
        MonthFirstDay.getFullYear() +
          '-' +
          mouth +
          '-' +
          MonthFirstDay.getDate() +
          ' 00:00:00'
      )
    },
    /**
     *获取日期所在月的最后一天
     * @param {日期} date
     */
    dateMonthLastDay (date = new Date()) {
      date = new Date(date)
      var MonthNextFirstDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      )
      var MonthLastDay = new Date(MonthNextFirstDay - 86400000)
      var mouth = Number(MonthLastDay.getMonth()) + 1
      return new Date(
        MonthLastDay.getFullYear() +
          '-' +
          mouth +
          '-' +
          MonthLastDay.getDate() +
          ' 23:59:59'
      )
    },
    /**
     * 根据时间格式获取两个时间差
     * @param {开始时间} startTime
     * @param {结束时间} endTime
     * @param {格式要求} formatStr
     */
    dateDifference (
      startTime = new Date(),
      endTime = new Date(),
      formatStr = 'Y天H小时M分S秒'
    ) {
      startTime = new Date(startTime)
      endTime = new Date(endTime)
      formatStr = formatStr.toUpperCase()
      var leave1, leave2, leave3
      var difference = endTime.getTime() - new Date(startTime).getTime() // 时间差的毫秒数
      if (difference < 0) {
        throw new Error(
          'The start time cannot be greater than the end time(开始时间不能大于结束时间)'
        )
      }
      if (formatStr.indexOf('D') >= 0) {
        var days = Math.floor(difference / (24 * 3600 * 1000))
        leave1 = difference % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      } else {
        leave1 = difference
      }
      if (formatStr.indexOf('H') >= 0) {
        var hours = Math.floor(leave1 / (3600 * 1000))
        leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      } else {
        leave2 = leave1
      }
      if (formatStr.indexOf('M') >= 0) {
        var minutes = Math.floor(leave2 / (60 * 1000))
        leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      } else {
        leave3 = leave2
      }
      if (formatStr.indexOf('S') >= 0) {
        var seconds = Math.round(leave3 / 1000)
      }
      return formatStr.replace(
        /D{1,2}|d{1,4}|H{1,2}|m{1,2}|M{1,2}|s{1,2}|S{1,2}/g,
        (match) => {
          switch (match) {
            case 'D':
              return String(days)
            case 'DD':
              return String(days).padStart(2, '0')
            case 'd':
              return String(days)
            case 'dd':
              return String(days).padStart(2, '0')
            case 'H':
              return String(hours)
            case 'HH':
              return String(hours).padStart(2, '0')
            case 'h':
              return String(hours)
            case 'hh':
              return String(hours).padStart(2, '0')
            case 'M':
              return String(minutes)
            case 'MM':
              return String(minutes).padStart(2, '0')
            case 'm':
              return String(minutes)
            case 'mm':
              return String(minutes).padStart(2, '0')
            case 'S':
              return String(seconds)
            case 'SS':
              return String(seconds).padStart(2, '0')
            case 's':
              return String(seconds)
            case 'ss':
              return String(seconds).padStart(2, '0')
            default:
              return match
          }
        }
      )
    },
    /**
     * 校验身份证号码是否正确
     * @param {身份证号码} cardCode
     */
    isIdentificationNumber (cardCode) {
      cardCode = String(cardCode)
      var provinceAndCitys = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外'
      }
      var powers = [
        '7',
        '9',
        '10',
        '5',
        '8',
        '4',
        '2',
        '1',
        '6',
        '3',
        '7',
        '9',
        '10',
        '5',
        '8',
        '4',
        '2'
      ]
      var parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
      var getParityBit = function (cardCode) {
        var id17 = cardCode.substring(0, 17)
        var power = 0
        for (var i = 0; i < 17; i++) {
          power += parseInt(id17.charAt(i), 10) * parseInt(powers[i])
        }
        var mod = power % 11
        return parityBit[mod]
      }
      var checkParityBit = function (cardCode) {
        var parityBit = cardCode.charAt(17).toUpperCase()
        if (getParityBit(cardCode) === parityBit) {
          return true
        } else {
          return false
        }
      }
      var checkAddressCode = function (addressCode) {
        var check = /^[1-9]\d{5}$/.test(addressCode)
        if (!check) return false
        if (provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
          return true
        } else {
          return false
        }
      }
      var checkBirthDayCode = function (birDayCode) {
        var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(
          birDayCode
        )
        if (!check) return false
        var yyyy = parseInt(birDayCode.substring(0, 4), 10)
        var mm = parseInt(birDayCode.substring(4, 6), 10)
        var dd = parseInt(birDayCode.substring(6), 10)
        var xdata = new Date(yyyy, mm - 1, dd)
        if (xdata > new Date()) {
          return false // 生日不能大于当前日期
        } else if (
          xdata.getFullYear() === yyyy &&
          xdata.getMonth() === mm - 1 &&
          xdata.getDate() === dd
        ) {
          return true
        } else {
          return false
        }
      }
      var check15cardCode = function (cardCode) {
        // 15位证件号码的基本校验
        var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(
          cardCode
        )
        if (!check) return false
        // 校验地址码
        var addressCode = cardCode.substring(0, 6)
        check = checkAddressCode(addressCode)
        if (!check) return false
        var birDayCode = '19' + cardCode.substring(6, 12)
        // 校验日期码
        return checkBirthDayCode(birDayCode)
      }
      // 校验18位的证件号码
      var check18cardCode = function (cardCode) {
        // 18位证件号码的基本格式校验
        var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(
          cardCode
        )
        if (!check) return false
        // 校验地址码
        var addressCode = cardCode.substring(0, 6)
        check = checkAddressCode(addressCode)
        if (!check) return false
        // 校验日期码
        var birDayCode = cardCode.substring(6, 14)
        check = checkBirthDayCode(birDayCode)
        if (!check) return false
        // 验证校检码
        return checkParityBit(cardCode)
      }
      var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(cardCode)
      if (!check) return false
      // 判断长度为15位或18位
      if (cardCode.length === 15) {
        return check15cardCode(cardCode)
      } else if (cardCode.length === 18) {
        return check18cardCode(cardCode)
      } else {
        return false
      }
    },
    /**
     * 校验手机号码是否正确
     * @param {手机号码} mobile
     */
    isMobile (mobile) {
      return /^1[3456789]\d{9}$/.test(mobile)
    },
    /**
     * 校验座机号码是否正确
     * @param {座机号码} landline
     */
    isLandline (landline) {
      return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(landline)
    },
    /**
     * 校验联系方式是否正确
     * @param {联系方式} phone
     */
    isPhone (phone) {
      return this.isMobile(phone) || this.isLandline(phone)
    },
    /**
     * 校验邮箱是否正确
     * @param {邮箱} email
     */
    isEmail (email) {
      // eslint-disable-next-line no-useless-escape
      return /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/.test(
        email
      )
    },
    /**
     * 校验是否是汉字
     * @param {汉字} character
     */
    isCharacter (character) {
      return /^[\u4e00-\u9fa5]{1,}$/.test(character)
    },
    /**
     * 校验是否是中国姓名
     * @param {中国姓名} chineseName
     */
    isChineseName (chineseName) {
      return /^[\u4e00-\u9fa5]{2,8}$/.test(chineseName)
    },
    /**
     * 校验是否是社会信用代码校验
     * @param {社会信用代码} code
     */
    isSocialCreditCode (code) {
      if (!code || code.length !== 18) {
        return false
      }

      const baseCode = '0123456789ABCDEFGHJKLMNPQRTUWXY'
      const wt = [
        1,
        3,
        9,
        27,
        19,
        26,
        16,
        17,
        20,
        29,
        25,
        13,
        8,
        24,
        10,
        30,
        28
      ]
      let total = 0
      for (let i = 0; i < code.length - 1; i++) {
        total += baseCode.indexOf(code.substring(i, i + 1)) * wt[i]
      }
      let check = 31 - (total % 31)
      if (check === 31) {
        check = 0
      }
      return baseCode.split('')[check] === code.substring(17, 18)
    },
    /**
     * 校验是否是组织机构代码
     * @param {组织机构代码} code
     */
    isOrgCode (code) {
      if (!code || code.length !== 10) {
        return false
      }
      const values = code.split('-')
      const ws = [3, 7, 9, 10, 5, 8, 4, 2]
      const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const reg = /^([0-9A-Z]){8}$/
      if (!reg.test(values[0])) {
        return false
      }
      let sum = 0
      for (let i = 0; i < 8; i++) {
        sum += str.indexOf(values[0].charAt(i)) * ws[i]
      }
      let C9 = 11 - (sum % 11)
      const YC9 = values[1] + ''
      if (C9 === 11) {
        C9 = '0'
      } else if (C9 === 10) {
        C9 = 'X'
      } else {
        C9 = C9 + ''
      }
      return YC9 === C9
    },
    /**
     * 校验是否是营业执照注册码
     * @param {营业执照注册码} code
     */
    isBizLicenceCode (code) {
      if (!code || code.length !== 15) {
        return false
      }
      const codeArray = (code + '').split('')
      let ti = 0
      let si = 0
      let cj = 0
      let pj = 10
      let lastNum = -1
      for (let i = 0; i < codeArray.length; i++) {
        ti = parseInt(codeArray[i])
        si = pj + ti
        cj = (si % 10 === 0 ? 10 : si % 10) * 2
        pj = cj % 11
        if (i === codeArray.length - 1) {
          lastNum = si % 10
        }
      }
      return lastNum === 1
    },
    /**
     * 校验是否是行业许可证注册码
     * @param {行业许可证注册码} code
     */
    isLicenceCode (code) {
      return code && code.length <= 22
    },
    /**
     * 判断是否是json格式数据
     * @param {json数据} json
     */
    isJSON (json) {
      if (json) {
        try {
          JSON.parse(json)
          return true
        } catch (e) {
          return false
        }
      } else {
        return true
      }
    },
    /**
     * 判断数据是否有效
     * @param {数据} data
     */
    isEffective (data) {
      return (
        data !== '' &&
        data !== undefined &&
        data !== null &&
        JSON.stringify(data) !== '[]'
      )
    },
    /**
     * 判断是否是数字
     * @param {数字} number
     */
    isValidatorNum (number) {
      return /^\d+$/.test(number)
    },
    /**
     * 判断文件名是否有后缀名
     * @param {文件名} filename
     * @param {后缀名} suffixs
     */
    getSuffix (filename, suffixs) {
      if (!this.isArray(suffixs)) return false
      for (const item of suffixs) {
        if (filename.indexOf(item) >= 0) {
          return true
        }
      }
    },
    /**
     * 判断是否是链接
     * @param {链接地址} link
     */
    isLink (link) {
      const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
      return reg.test(link)
    },
    /**
     * 判断是否是外部链接
     * @param {地址} path
     */
    isExternal (path) {
      return /^(https?:|mailto:|tel:)/.test(path)
    },
    /**
     * 判断是否是小写字母
     * @param {字符串} str
     */
    isLowerCase (str) {
      const reg = /^[a-z]+$/
      return reg.test(str)
    },
    /**
     * 判断是否是大写字母
     * @param {字符串} str
     */
    isUpperCase (str) {
      const reg = /^[A-Z]+$/
      return reg.test(str)
    },
    /**
     * 判断是否是图片链接
     * @param {文件链接} o
     */
    isPictureLink (o) {
      if (!o) return false
      const suffixs = ['bmp', 'jpg', 'png', 'jpeg', 'gif', 'svg', 'webp']
      const suffix = this.stringGetSuffix(o)
      return suffix ? suffixs.includes(suffix) : false
    },
    /**
     * 判断是不是视频链接
     * @param {文件链接} o
     */
    isVedioLink (o) {
      if (!o) return false
      const suffixs = ['mp4', '3gpp', 'webm', 'mov', 'avi', 'ogv']
      const suffix = this.stringGetSuffix(o)
      return suffix ? suffixs.includes(suffix) : false
    },
    /**
     * 判断是不是音频链接
     * @param {文件链接} o
     */
    isAudioLink (o) {
      if (!o) return false
      const suffixs = ['wav', 'mp3', 'wma', 'm4a', 'ogg']
      const suffix = this.stringGetSuffix(o)
      return suffix ? suffixs.includes(suffix) : false
    },
    /**
     * 获取链接的后缀名
     * @param {字符串} string
     * @returns
     */
    stringGetSuffix (string) {
      const haveSuffix = /^(.*\.)([a-z0-9]{0,8})([?$&*].*){0,1}/.test(string)
      if (!haveSuffix) return false
      return RegExp.$2
    },
    /**
     * 将驼峰命名转为分割符分开的字符串
     * @param {字符串} string
     * @param {切割符合} separator
     */
    stringToLowerLine (string, separator = '-') {
      if (!this.isString(string)) return string
      var temp = string.replace(/[A-Z]/g, function (match) {
        return separator + match.toLowerCase()
      })
      if (temp.slice(0, 1) === separator) {
        temp = temp.slice(1)
      }
      return temp
    },
    /**
     * 根据身份证计算生日和性别
     * @param {身份证号码} cardCode
     */
    stringGetSexAndBirthday (cardCode) {
      if (!this.isString(cardCode)) return cardCode
      function formatBirthday (day) {
        const year = day.substring(0, 4)
        const month = day.substring(4, 6)
        const date = day.substring(6)
        return `${year}-${month}-${date}`
      }

      if (cardCode.length === 15) {
        return {
          sex: parseInt(cardCode.charAt(14)) % 2 === 0 ? '男' : '女',
          birthday: formatBirthday('19' + cardCode.substring(6, 12))
        }
      }
      if (cardCode.length === 18) {
        return {
          sex: parseInt(cardCode.charAt(16)) % 2 === 0 ? '男' : '女',
          birthday: formatBirthday(cardCode.substring(6, 14))
        }
      }
      return null
    },
    /**
     * 根据数组字符切分字符串
     * @param {字符串} string
     * @param {数组} array
     */
    stringSplitBy (string, array) {
      if (!this.isString(string)) {
        this.customConsole('第一个参数必须是字符串')
        return [string]
      }
      if (!this.isArray(array)) {
        this.customConsole('第二个参数必须是数组')
        return [string]
      }
      const result = []
      for (const number of array) {
        if (this.isValidatorNum(number) && string.length >= number) {
          result.push(string.substring(0, number))
        }
      }
      return result
    },
    /**
     * 根据长度随机生成字母大小写和数字的字符串
     * @param {字符串长度} length
     */
    stringRandomLength (length) {
      length = length || 32
      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678'
      var maxPos = $chars.length
      var string = ''
      for (let i = 0; i < length; i++) {
        string += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return string
    },
    /**
     * 身份证脱敏
     * @param {身份证号码} cardCode
     */
    stringCardCodeEncrypt (cardCode) {
      return cardCode
        ? cardCode.replace(/^(.{3})(?:\d+)(.{3})$/, '$1************$2')
        : ''
    },
    /**
     * 电话脱敏
     * @param {电话} phone
     */
    stringPhoneEncrypt (phone) {
      if (!phone) return ''
      let pat = ''
      if (/^1[3456789]\d{9}$/.test(phone)) {
        pat = /(\d{3})\d*(\d{4})/
        return phone.replace(pat, '$1****$2')
      } else if (/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(phone)) {
        pat = /(([0-9]{3,4}-)?)\d*([0-9]{3})/
        return phone.replace(pat, '$1****$3')
      } else {
        return phone
      }
    },
    /**
     * 邮箱脱敏
     * @param {邮箱} email
     */
    stringEmailEncrypt (email) {
      if (!email) return ''
      let newEmail = email
      if (String(email).indexOf('@') > 0) {
        const str = email.split('@')
        let s = ''
        if (str[0].length > 3) {
          for (let i = 3; i < str[0].length; i++) {
            s += '*'
          }
          newEmail = str[0].substr(0, 3) + s + '@' + str[1]
        } else {
          for (let i = 1; i < str[0].length; i++) {
            s += '*'
          }
          newEmail = str[0].substr(0, 1) + s + '@' + str[1]
        }
      }
      return newEmail
    },
    /**
     * 姓名脱敏
     * @param {姓名} name
     */
    stringNameEncrypt (name) {
      if (name != null && name !== undefined) {
        if (name.length <= 3) {
          return '*' + name.substring(1, name.length)
        } else if (name.length > 3 && name.length <= 6) {
          return '**' + name.substring(2, name.length)
        } else if (name.length > 6) {
          return name.substring(0, 2) + '****' + name.substring(6, name.length)
        }
      } else {
        return ''
      }
    },
    /**
     * 函数防抖
     * @param {函数} fn
     * @param {时间差} delay
     */
    debounce (fn, delay) {
      var timeout
      return function (e) {
        clearTimeout(timeout)
        var context = this
        var args = arguments
        timeout = setTimeout(function () {
          fn.apply(context, args)
        }, delay)
      }
    },
    /**
     * 函数节流
     * @param {函数} fn
     * @param {时间差} threshhold
     */
    throttle (fn, threshhold) {
      var timeout
      var start = new Date()
      threshhold = threshhold || 160
      return function () {
        var context = this
        var args = arguments
        var curr = new Date() - 0
        clearTimeout(timeout) // 总是干掉事件回调
        if (curr - start >= threshhold) {
          fn.apply(context, args)
          start = curr
        } else {
          // 让方法在脱离事件后也能执行一次
          timeout = setTimeout(function () {
            fn.apply(context, args)
          }, threshhold)
        }
      }
    },
    /**
     * 获取数据关键字
     * @param {数据} data
     * @param {关键字} key
     */
    treeAllData (data, key) {
      let result = []
      for (const item of data) {
        result.push(item[key])
        if (item.children && item.children.length) {
          result = result.concat(this.treeAllData(item.children, key))
        }
      }
      return result
    },
    /**
     * 判断树形数据里面某个关键字是否有值
     * @param {数据} data
     * @param {关键字} key
     * @param {值} value
     */
    treeHaveByKey (data, key, value) {
      let result = false
      for (const item of data) {
        if (item[key] === value) {
          result = true
        }
        if (!result && item.children && item.children.length) {
          result = this.treeHaveByKey(item.children, key, value)
        }
      }
      return result
    },
    /**
     * 下载base64文件
     * @param {base64文件} base64
     * @param {文件名} name
     */
    fileBaseDownload (base64, name) {
      const blob = new Blob([base64])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    }
  }

  const lib = new MyLib()

  if (typeof module !== 'undefined' && module.exports) module.exports = lib
  if (typeof define === 'function') {
  // eslint-disable-next-line no-undef
    define(function () {
      return lib
    })
  }
  global.ModifyDivBg = lib
})(this)
