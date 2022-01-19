<template>
  <div class="journal layout">
    <my-header :title="$route.meta.title" :menus="$store.state.atTmenus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="月份">
          <el-date-picker @change="dateChange" style="width:120px" v-model="form.day" type="month" placeholder="月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="每日考勤汇总表" class="upload-item">
          <el-input style="width:500px" readonly placeholder="每日考勤汇总表" v-model="form.every">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="everyInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importEvery">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportTable">导出</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table" style="height: calc(100% - 50px);">
        <el-table border height="100%" ref="table" :data="users">
          <el-table-column align="center" type="index" :label="`${form.start}-${form.end}考勤及日志情况`">
            <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="100"></el-table-column>
            <el-table-column align="center" prop="考勤情况" label="考勤情况" min-width="200"></el-table-column>
            <el-table-column align="center" prop="未写日志明细" label="未写日志明细" width="300"></el-table-column>
            <el-table-column align="center" prop="未打卡次数" label="未打卡次数" width="300"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  path: '/Sournal',
  name: 'sournal',
  title: '月度打卡日志统计',
  data () {
    return {
      showTable: false,
      form: {
        day: '',
        date: '21:00',
        every: '',
        start: '',
        end: ''
      },
      users: [],
      days: []
    }
  },
  created () {
    this.initDate()
    this.initUser()
  },
  methods: {
    clear () {
      this.form.end = ''
      this.form.start = ''
      this.form.every = ''
      this.$refs.everyInput.value = ''
      this.initDate()
      this.initUser()
    },
    initDate () {
      const month = new Date().getMonth()
      this.form.day = this.$lib.dateFormate(Date.now() - (month * 24 * 60 * 60 * 1000), 'YYYY-MM')
      console.log(this.form.day)
      this.form.date = '21:00'
      this.dateChange()
    },
    dateChange () {
      this.initUser()
      let start = this.$lib.dateMonthFirstDay(this.form.day)
      let end = this.$lib.dateMonthLastDay(this.form.day)
      start = this.$lib.dateFormate(start, 'M月DD日')
      end = this.$lib.dateFormate(end, 'M月DD日')
      this.form.start = start
      this.form.end = end
    },
    exportTable () {
      var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)
      let fileName = `${this.form.start}-${this.form.end}考勤及日志情况-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`
      let sheetName = `${this.form.start}-${this.form.end}考勤及日志情况`
      let Sheets = {}; let SheetNames = []
      Sheets[sheetName] = sheet
      SheetNames.push(sheetName)
      let workBook = {
        SheetNames,
        Sheets
      }
      XLSX.writeFile(workBook, fileName)
    },
    importEvery (e) {
      var f = e.target.files[0]
      this.form.every = f.name
      this.$biz.readExcel(f, data => {
        console.log(data)
        let result = '__EMPTY_2'; let name = '__EMPTY_1'; let clock = '__EMPTY_4'
        let resultMap = {}; let clockMap = {}
        for (const item of data) {
          if (!Object.hasOwnProperty.call(resultMap, item[name])) {
            resultMap[item[name]] = []
          }
          if (!Object.hasOwnProperty.call(clockMap, item[name])) {
            clockMap[item[name]] = []
          }
          if (Object.hasOwnProperty.call(item, result) && Object.hasOwnProperty.call(item, name)) {
            // let ri = item[result]
            let dt = this.dealCountPec(item[result])
            resultMap[item[name]] = resultMap[item[name]].concat(dt)
          }
          if (Object.hasOwnProperty.call(item, clock) && Object.hasOwnProperty.call(item, name)) {
            console.log(item[clock], this.$lib.handleDate(item[clock], 'YYYY-MM-DD'))
            clockMap[item[name]].push(this.$lib.handleDate(item[clock], 'M/DD'))
          }
        }
        this.users = this.users.map(item => {
          item['考勤情况'] = (resultMap[item['姓名']] || []).join('，')
          item['未写日志明细'] = (clockMap[item['姓名']] || []).join('，')
          item['未打卡次数'] = (resultMap[item['姓名']] || []).filter(item => {
            return item.indexOf('无记录') >= 0 || item.indexOf('已补卡') >= 0
          })
          item['未打卡次数'] = item['未打卡次数'].join('，')
          return { ...item }
        })
      })
    },
    dealCountPec (content) {
      let result = content.split(/,|，/)
      if (result.length === 1) return result
      if (result.length >= 1 && /^(\d{1,2}\/\d{1,3}).*$/.test(result[0])) {
        let time = RegExp.$1
        return result.map((item, i) => {
          if (i > 0 && !/^(\d{1,2}\/\d{1,3}).*$/.test(item)) {
            item = time + item
          }
          return item
        })
      }
      return []
    },
    async initUser () {
      let data = await this.$biz.initUser()
      this.users = data
      // this.$http.request({
      //   method: 'get',
      //   url: `/static/user.xlsx`,
      //   responseType: 'blob'
      // }).then((res) => {
      //   this.$biz.readExcel(res.data, data => {
      //     this.users = data
      //   })
      // })
    }
  }
}
</script>

<style lang="scss">
</style>
