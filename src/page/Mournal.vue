<template>
  <div class="journal layout mournal">
    <my-header :title="$route.meta.title"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="餐补计算时间">
          <el-time-select style="width:100px" value-format="HH:mm" :picker-options="{ start: '18:00',step: '00:15',end: '23:00'}" v-model="form.date" placeholder="餐补计算时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="餐补情况统计文件" class="upload-item">
          <el-input style="width:500px" readonly placeholder="餐补情况统计文件" v-model="form.journal">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="journalInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importJournal">
        </el-form-item>

        <el-form-item label="打卡文件" class="upload-item">
          <el-input style="width:500px" readonly placeholder="请选择打卡文件" v-model="form.clock">
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
        <el-table border height="100%" ref="table" :data="users">
          <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column fixed="left" align="center" prop="部门" label="部门" width="100"></el-table-column>
          <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="100"></el-table-column>
          <el-table-column fixed="left" align="center" prop="晚班餐补" label="晚班餐补" width="150"></el-table-column>
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
      showTable: false,
      form: {
        day: 1,
        date: '21:00',
        clock: '',
        journal: ''
      },
      anormalError: [
        '迟到次数', '迟到时长(分钟)', '严重迟到次数', '严重迟到时长', '旷工迟到天数', '早退次数', '早退时长(分钟)', '上班缺卡次数', '下班缺卡次数', '旷工天数', '出差时长', '外出时长', '调休(小时)', '调休(小时)', '婚假(小时)', '产假(小时)', '陪产假(小时)', '路途假(小时)', '丧假(小时)', '加班(小时)', '事假(小时)', '病假(小时)', '年假(小时)', '工作日（转调休）', '休息日（转调休）', '节假日（转调休）'
      ],
      resultList: [],
      users: []
    }
  },
  created () {
    this.initUser()
  },
  methods: {
    clear () {
      this.resultList = []
      this.form.clock = ''
      this.form.journal = ''
      this.$refs.journalInput.value = ''
      this.$refs.clockInput.value = ''
      this.initDate()
      this.initUser()
    },
    exportTable () {
      // var table1 = document.querySelector('#table1')
      var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)// 将一个table对象转换成一个sheet对象
      this.openDownloadDialog(this.sheet2blob(sheet), `${this.$lib.dateFormate(new Date(this.form.date), 'YYYY-MM-DD')}考勤日志统计.xlsx`)
    },
    importJournal (e) {
      var f = e.target.files[0]
      this.form.journal = f.name
      this.readExcel(f, data => {
        let time = ''; let result = ''
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (i >= 3) {
            for (const key in element) {
              if (element[key] === '下班1打卡时间' && !time) {
                time = key
              }
              if (element[key] === '下班1打卡结果' && !result) {
                result = key
              }
            }
          }
        }
        console.log(time, result)
      })
    },
    importClock (e) { },
    initUser () {
      this.$http.request({
        method: 'get',
        url: `/static/user.xlsx`,
        responseType: 'blob'
      }).then((res) => {
        this.readExcel(res.data, data => {
          this.users = data
        })
      })
    },
    readExcel (f, callback) {
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
      }
      reader.readAsBinaryString(f)
    }
  }
}
</script>

<style lang="scss">
</style>
