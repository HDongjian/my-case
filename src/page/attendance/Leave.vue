<template>
  <div class="journal layout mournal">
    <my-header :title="$route.meta.title" :menus="$store.state.atTmenus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="月份">
          <el-date-picker @change="dateChange" style="width:120px" v-model="form.day" type="month" placeholder="月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="请假表" class="upload-item">
          <el-input style="width:500px" readonly placeholder="请假表" v-model="form.every">
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
        <el-table :span-method="objectSpanMethod" border height="100%" ref="table" :data="rowsList">
          <el-table-column align="center" type="index" :label="`${this.$lib.dateFormate(form.day, 'YYYY年MM月')}请假明细表`">
            <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column fixed="left" align="center" prop="部门" label="部门" width="100"></el-table-column>
            <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="80"></el-table-column>
            <el-table-column align="center" v-for="(type,i) in typeList" :key="i" :label="type.name">
              <el-table-column align="center" :label="`${type.name}日期`" min-width="200">
                <template slot-scope="{row}">
                  <div v-html="dealDates(row[type.name])"></div>
                  <!-- <span v-for="(item,k) in row[type.name]" :key="i+'_'+k">{{dealDates(item)}}<br/></span> -->
                </template>
              </el-table-column>
              <el-table-column align="center" prop="time" label="总计" width="50">
                <template slot-scope="{row}">{{countHouers(row[type.name])}}</template>
              </el-table-column>
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
  path: '/leave',
  name: 'leave',
  title: '月度请假统计',
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
      rows: {},
      rowsList: [],
      users: [],
      days: [],
      deptMaps: {},
      typeList: [
        { name: '事假', types: ['事假'] },
        { name: '调休', types: ['调休'] },
        { name: '年假', types: ['年假'] },
        { name: '病假', types: ['病假'] },
        { name: '产检/福利假', types: ['福利假', '孕检假'] },
        { name: '其他', types: [] }
      ]
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
      const year = new Date().getFullYear()
      const month = new Date().getMonth()
      this.form.day = year + '-' + month
      this.dateChange()
    },
    dateChange () {
      this.initUser()
    },
    exportTable () {
      var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)
      let fileName = `${this.$lib.dateFormate(this.form.day, 'YYYY年MM月')}请假明细表-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`
      let sheetName = this.$lib.dateFormate(this.form.day, 'YYYY年MM月')
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
        this.rows = {}
        for (const item of data) {
          if (item['审批结果'] !== '同意') continue
          if (!Object.hasOwnProperty.call(this.rows, item['发起人姓名'])) {
            this.rows[item['发起人姓名']] = { time: 0 }
          }
          // this.rows[item['发起人姓名']].time += Number(item['请假时数(小时)'])
          this.dealTypes(item['开始时间1'], item['结束时间1'], item['请假类型1'], item['发起人姓名'], item['请假时数(小时)'])
          this.dealTypes(item['开始时间2'], item['结束时间2'], item['请假类型2'], item['发起人姓名'])
          this.dealTypes(item['开始时间3'], item['结束时间2'], item['请假类型3'], item['发起人姓名'])
        }
        this.rowsList = this.users.filter(item => {
          return Object.hasOwnProperty.call(this.rows, item['姓名'])
        })
        this.rowsList = this.rowsList.sort((x, y) => {
          return x['部门'].localeCompare(y['部门'], 'zh-CN')
        })
        let flag = ''
        this.rowsList = this.rowsList.map(item => {
          if (!this.deptMaps[item['部门']]) {
            this.deptMaps[item['部门']] = 0
          }
          this.deptMaps[item['部门']]++
          if (flag !== item['部门']) {
            item.start = true
            flag = item['部门']
          }
          return { ...item, ...this.rows[item['姓名']] }
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
    },
    dealTypes (start, end, type, name, time) {
      if (start && end && type) {
        let typeName = '其他'
        for (const tp of this.typeList) {
          if (tp.types.includes(type)) {
            typeName = tp.name
          }
        }
        if (!Object.hasOwnProperty.call(this.rows[name], typeName)) {
          this.rows[name][typeName] = []
        }
        this.rows[name][typeName].push({ start, end, type, time: time || 0 })
      }
    },
    dealDates (row) {
      if (!row || !row.length) return ''
      let result = row.map(item => {
        let { start, end } = item
        if (this.$lib.dateFormate(start, 'YYYY-MM-DD') === this.$lib.dateFormate(end, 'YYYY-MM-DD')) {
          return this.$lib.dateFormate(start, 'YYYY.MM.DD/HH:mm') + '-' + this.$lib.dateFormate(end, 'HH:mm')
        } else {
          return this.$lib.dateFormate(start, 'YYYY.MM.DD/HH:mm') + '-' + this.$lib.dateFormate(end, 'YYYY.MM.DD/HH:mm')
        }
      })
      return result.join('<br/>')
    },
    countHouers (list) {
      if (!list || !list.length) return ''
      let total = 0
      for (const item of list) {
        total += Number(item.time)
      }
      return total
    }
  }
}
</script>

<style lang="scss">
</style>
