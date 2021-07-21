<template>
  <div class="journal layout mournal">
    <my-header :title="$route.meta.title" :menus="$store.state.atTmenus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="月份">
          <el-date-picker style="width:120px" v-model="form.day" type="month" placeholder="月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="出差表" class="upload-item">
          <el-input style="width:500px" readonly placeholder="出差表" v-model="form.every">
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
          <el-table-column align="center" type="index" :label="`${this.$lib.dateFormate(form.day, 'YYYY年MM月')}出差明细表`">
            <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column fixed="left" align="center" prop="发起人姓名" label="发起人姓名" width="150"></el-table-column>
            <el-table-column fixed="left" align="center" prop="发起人部门" label="发起人部门" width="150"></el-table-column>
            <el-table-column align="center" prop="行程明细" label="行程明细" width="150"></el-table-column>
            <el-table-column align="center" prop="出差地点" label="出差地点" width="150"></el-table-column>
            <el-table-column align="center" prop="出差类型" label="出差类型" width="150"></el-table-column>
            <el-table-column align="center" prop="开始时间" label="开始时间" width="180"></el-table-column>
            <el-table-column align="center" prop="结束时间" label="结束时间" width="180"></el-table-column>
            <el-table-column align="center" prop="时长" label="时长" width="100"></el-table-column>
            <el-table-column align="center" prop="出差事由" label="出差事由"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  path: '/business',
  name: 'business',
  title: '月度出差统计',
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
      rowsList: [],
      users: []
    }
  },
  created () {
    this.initDate()
  },
  methods: {
    clear () {
      this.form.end = ''
      this.form.start = ''
      this.form.every = ''
      this.$refs.everyInput.value = ''
      this.initDate()
    },
    initDate () {
      const year = new Date().getFullYear()
      const month = new Date().getMonth()
      this.form.day = year + '-' + month
    },
    exportTable () {
      var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)
      let fileName = `${this.$lib.dateFormate(this.form.day, 'YYYY年MM月')}出差明细表-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`
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
        let users = data.reduce(function (prev, cur) {
          let flag = false
          for (const item of prev) {
            if (item['发起人姓名'] === cur['发起人姓名'] && item['开始时间'] === cur['开始时间'] && item['结束时间'] === cur['结束时间']) {
              flag = true
            }
          }
          if (!flag && cur['审批结果'] === '同意') {
            prev.push(cur)
          }
          return prev
        }, [])
        this.users = users.sort((x, y) => {
          return x['发起人姓名'].localeCompare(y['发起人姓名'], 'zh-CN')
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
