<template>
  <div class="journal layout mournal">
    <my-header :title="$route.meta.title" :menus="menus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="月份">
          <el-date-picker @change="dateChange" style="width:120px" v-model="form.day" type="month" placeholder="月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="餐补计算时间">
          <el-time-select @change="dateChange" style="width:100px" value-format="HH:mm" :picker-options="{ start: '18:00',step: '00:15',end: '23:00'}" v-model="form.date" placeholder="餐补计算时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="每日考勤汇总表" class="upload-item">
          <el-input style="width:300px" readonly placeholder="每日考勤汇总表" v-model="form.every">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="everyInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importEvery">
        </el-form-item>
        <el-form-item label="餐补情况统计文件" class="upload-item">
          <el-input style="width:300px" readonly placeholder="餐补情况统计文件" v-model="form.journal">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="journalInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importJournal">
        </el-form-item>

        <el-form-item label="考勤汇总表" class="upload-item">
          <el-input style="width:300px" readonly placeholder="考勤汇总表" v-model="form.clock">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="clockInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importClock">
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="exportTable">导出</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table" style="height: calc(100% - 50px);">
        <el-table border height="100%" v-if="showTable" ref="table" :data="users">
          <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column fixed="left" align="center" prop="部门" label="部门" width="100"></el-table-column>
          <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="100"></el-table-column>
          <el-table-column align="center" prop="考勤情况" label="考勤情况" min-width="200"></el-table-column>
          <el-table-column align="center" prop="打卡" label="打卡地址" width="340"></el-table-column>
          <el-table-column align="center" prop="未写日志明细" label="未写日志明细" width="160"></el-table-column>
          <el-table-column align="center" prop="晚班餐补" label="晚班餐补" width="100">
            <template v-if="row['晚班餐补详情']" slot-scope="{row}">{{row['晚班餐补详情'].length}}</template>
          </el-table-column>
          <el-table-column align="center" prop="晚班餐补详情" label="晚班餐补详情" width="200">
            <template v-if="row['晚班餐补详情']" slot-scope="{row}">
              <p v-for="(item,i) in row['晚班餐补详情']" :key="i">{{item}}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="考勤情况">
            <el-table-column align="center" width="45" :prop="item" v-for="(item,i) in days" :key="i" :label="item">
              <template v-if="row[item]" slot-scope="{row}">
                <p class="day-error-item" :title="row[item]">{{row[item]}}</p>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  path: '/mournal',
  name: 'mournal',
  title: '月度考勤日志管理',
  data () {
    return {
      menus: [{
        name: '每日考勤日志管理',
        router: '/journal'
      }, {
        name: '月度考勤日志管理',
        router: '/mournal'
      }],
      showTable: false,
      form: {
        day: '',
        date: '21:00',
        every: '',
        clock: '',
        journal: ''
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
      this.form.clock = ''
      this.form.journal = ''
      this.form.every = ''
      this.$refs.journalInput.value = ''
      this.$refs.clockInput.value = ''
      this.initDate()
      this.initUser()
    },
    initDate () {
      const year = new Date().getFullYear()
      const month = new Date().getMonth()
      this.form.day = year + '-' + month
      this.form.date = '21:00'
      this.dateChange()
    },
    dateChange () {
      this.initUser()
      let start = this.$lib.dateMonthFirstDay(this.form.day)
      let end = this.$lib.dateMonthLastDay(this.form.day)
      start = this.$lib.dateFormate(start, 'YYYY-MM-DD')
      end = this.$lib.dateFormate(end, 'YYYY-MM-DD')
      let days = this.$biz.getAllDates(start, end)
      this.days = days.map(item => {
        return this.$lib.dateFormate(item, 'DD')
      })
      this.showTable = false
      setTimeout(() => {
        this.showTable = true
      }, 1)
    },
    exportTable () {
      // var table1 = document.querySelector('#table1')
      var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)// 将一个table对象转换成一个sheet对象
      this.$biz.openDownloadDialog(this.$biz.sheet2blob(sheet), `${this.$lib.dateFormate(new Date(this.form.day), 'YYYY-MM')}月度考勤日志统计-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`)
    },
    importEvery (e) {
      var f = e.target.files[0]
      this.form.every = f.name
      this.$biz.readExcel(f, data => {
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
            resultMap[item[name]].push(item[result].replace(/,|，/g, ''))
          }
          if (Object.hasOwnProperty.call(item, clock) && Object.hasOwnProperty.call(item, name)) {
            clockMap[item[name]].push(this.$lib.handleDate(item[clock], 'MM/DD'))
          }
        }
        this.users = this.users.map(item => {
          item['考勤情况'] = (resultMap[item['姓名']] || []).join('，')
          item['未写日志明细'] = (clockMap[item['姓名']] || []).join('，')
          let days = this.$biz.dealResultTotal(item['考勤情况'])
          return { ...item, ...days }
        })
      })
    },
    importJournal (e) {
      var f = e.target.files[0]
      this.form.journal = f.name
      this.$biz.readExcel(f, data => {
        let time = ''; let result = ''; let name = ''; let cDay = ''
        let resultMap = {}
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (i < 3) {
            for (const key in element) {
              if (element[key] === '下班1打卡时间' && !time) {
                time = key
              }
              if (element[key] === '下班1打卡结果' && !result) {
                result = key
              }
              if (element[key] === '姓名' && !name) {
                name = key
              }
              if (element[key] === '日期' && !cDay) {
                cDay = key
              }
            }
          }
        }
        for (const item of data) {
          if (Object.hasOwnProperty.call(item, result) && Object.hasOwnProperty.call(item, name) && Object.hasOwnProperty.call(item, time)) {
            if (!Object.hasOwnProperty.call(resultMap, item[name])) {
              resultMap[item[name]] = []
            }
            let day = this.$biz.dealTime(this.form.date); let clock = this.$biz.dealTime(item[time])
            if (clock >= day && item[result] !== '出差') {
              resultMap[item[name]].push(item[cDay] + ' ' + item[time])
            }
          }
        }
        this.users = this.users.map(item => {
          item['晚班餐补详情'] = resultMap[item['姓名']] || []
          return item
        })
      })
    },
    importClock (e) {
      var f = e.target.files[0]
      this.form.clock = f.name
      this.$biz.readExcel(f, data => {
        console.log(data)
        let result = '__EMPTY_2'; let name = '__EMPTY_1'; let clock = '__EMPTY_3'
        let resultMap = {}; let resultTotal = {}; let clockMap = {}
        for (const item of data) {
          if (Object.hasOwnProperty.call(item, result) && Object.hasOwnProperty.call(item, name)) {
            resultMap[item[name]] = this.$biz.dealResultTotal(item[result])
            resultTotal[item[name]] = item[result]
          }
          if (Object.hasOwnProperty.call(item, clock) && Object.hasOwnProperty.call(item, name)) {
            console.log(item[clock])
            let clocks = item[clock] ? String(item[clock]).split(/,|，/) : []
            clocks = clocks.map(item => this.$lib.handleDate(item, 'MM/DD'))
            clockMap[item[name]] = clocks.join('，')
          }
        }
        this.users = this.users.map(item => {
          item['考勤情况'] = resultTotal[item['姓名']]
          item['未写日志明细'] = clockMap[item['姓名']]
          item = { ...item, ...resultMap[item['姓名']] }
          return item
        })
      })
    },
    initUser () {
      this.$http.request({
        method: 'get',
        url: `/static/user.xlsx`,
        responseType: 'blob'
      }).then((res) => {
        this.$biz.readExcel(res.data, data => {
          this.users = data
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
