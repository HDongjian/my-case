import XLSX from 'xlsx'
export default {
  install (Vue) {
    Vue.biz = Vue.prototype.$biz = {
      readExcel (f, callback) {
        const loading = Vue.prototype.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        })
        var reader = new FileReader()
        reader.onload = (e) => {
          var data = e.currentTarget.result
          var wb = XLSX.read(data, { type: 'binary' })
          let Jdata = []
          for (const sheet of wb.SheetNames) {
            let data = XLSX.utils.sheet_to_json(wb.Sheets[sheet])
            Jdata = Jdata.concat(data)
          }
          callback(Jdata)
          loading.close()
        }
        reader.readAsBinaryString(f)
      },
      myMoment (date = new Date().getTime()) {
        date = new Date(date)
        return date
      },
      dealResultTotal (result) {
        let rs = result.split(/,|，/)
        let rsMap = {}
        for (const item of rs) {
          /(\d\/\d{1,3})(.*)/.test(item)
          let date = RegExp.$1; let cnt = RegExp.$2
          rsMap[Vue.lib.dateFormate(date, 'DD')] = cnt
        }

        return rsMap
      },
      // this.$biz.openDownloadDialog(this.$biz.sheet2blob(sheet), `${this.$lib.dateFormate(new Date(this.form.date), 'YYYY-MM-DD')}考勤日志统计-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`)
      sheet2blob (sheet, sheetName) {
        sheetName = sheetName || 'sheet1'
        var workbook = {
          SheetNames: [sheetName],
          Sheets: {}
        }
        workbook.Sheets[sheetName] = sheet // 生成excel的配置项

        var wopts = {
          bookType: 'xlsx', // 要生成的文件类型
          bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
          type: 'binary'
        }
        var wbout = XLSX.write(workbook, wopts)
        var blob = new Blob([s2ab(wbout)], {
          type: 'application/octet-stream'
        }) // 字符串转ArrayBuffer
        function s2ab (s) {
          var buf = new ArrayBuffer(s.length)
          var view = new Uint8Array(buf)
          for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
          return buf
        }
        return blob
      },
      openDownloadDialog (url, saveName) {
        if (typeof url === 'object' && url instanceof Blob) {
          url = URL.createObjectURL(url) // 创建blob地址
        }
        var aLink = document.createElement('a')
        aLink.href = url
        aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event
        if (window.MouseEvent) event = new MouseEvent('click')
        else {
          event = document.createEvent('MouseEvents')
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        }
        aLink.dispatchEvent(event)
      },
      dealTime (time) {
        return Number(time.substring(0, 2))
      },
      getAllDates (begin, end) {
        if (!begin || !end) {
          return false
        }
        let ab = begin.split('-')
        let ae = end.split('-')
        let db = new Date()
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
        let de = new Date()
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
        let unixDb = db.getTime()
        let unixDe = de.getTime()
        let arr = []
        for (let k = unixDb; k <= unixDe;) {
          arr.push(this.myMoment(new Date(Vue.lib.dateFormate(parseInt(k), 'YYYY-MM-DD'))))
          k = k + 24 * 60 * 60 * 1000
        }
        return arr
      },
      dealMTXName (name) {
        if (!/^[u4e00-u9fa5]|_{0,1}(\d{8})-(\d{8})/.test(name)) return []
        let start = RegExp.$1; let end = RegExp.$2
        start = Vue.biz.dealNumberDate(start)
        end = Vue.biz.dealNumberDate(end)
        let dates = Vue.biz.getAllDates(start, end)
        return dates.map(item => {
          return Vue.lib.dateFormate(new Date(item), 'YYYY-MM-DD')
        })
      },
      dealNumberDate (number) {
        let result = [number.substring(0, 4), number.substring(4, 6), number.substring(6, 8)]
        return result.join('-')
      }
    }
  }
}
