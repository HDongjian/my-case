<template>
  <div class="journal layout mournal">
    <my-header :title="$route.meta.title" :menus="$store.state.atTmenus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="月份">
          <el-date-picker @change="dateChange" style="width:120px" v-model="form.day" type="month" placeholder="月份"></el-date-picker>
        </el-form-item>
        <el-form-item label="餐补计算时间">
          <el-time-select @change="dateChange" style="width:100px" value-format="HH:mm" :picker-options="{ start: '18:00',step: '00:15',end: '23:00'}" v-model="form.date" placeholder="餐补计算时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="每日统计" class="upload-item">
          <el-input style="width:300px" readonly placeholder="每日统计" v-model="form.journal">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input @change="importJournal" ref="journalInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file'>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="exportTable">导出</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table" style="height: calc(100% - 50px);">
        <el-table border :row-class-name="rowStyle" :cell-style="cellStyle" :span-method="objectSpanMethod" height="100%" v-if="showTable" ref="table" :data="users">
          <el-table-column fixed="left" align="center" label="序号" width="50">
            <template slot-scope="{$index}">{{Math.ceil(($index+1)/2)}}</template>
          </el-table-column>
          <el-table-column fixed="left" align="center" prop="部门" label="部门" width="100"></el-table-column>
          <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="100"></el-table-column>
          <el-table-column fixed="left" align="center" prop="part" label="时间" width="80"></el-table-column>
          <el-table-column align="center" label="考勤情况">
            <el-table-column align="center" width="30" :prop="day" v-for="(day,i) in days" :key="i" :label="day">
              <template v-if="form.journal&&resultMap[row['姓名']]&&resultMap[row['姓名']][day]" slot-scope="{row}">
                <p @click="dayOpen(resultMap[row['姓名']][day],row.part)" v-if="row.part==='上午'" class="day-error-item">{{resultMap[row['姓名']][day].upText}}</p>
                <p @click="dayOpen(resultMap[row['姓名']][day],row.part)" v-if="row.part==='下午'" class="day-error-item">{{resultMap[row['姓名']][day].downText}}</p>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="本月出勤" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].attendanceDays}}</template>
          </el-table-column>
          <el-table-column align="center" label="全勤计数" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].fullAattendance}}</template>
          </el-table-column>
          <el-table-column align="center" label="全勤补贴" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].fullAattendance*50}}</template>
          </el-table-column>
          <el-table-column align="center" label="午餐餐补天数" width="120">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].lunchCount}}</template>
          </el-table-column>
          <el-table-column align="center" label="午餐金额总计" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].lunchAmount}}</template>
          </el-table-column>
          <el-table-column align="center" label="晚餐餐补天数" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].dinnerCount}}</template>
          </el-table-column>
          <el-table-column align="center" label="晚餐金额总计" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].dinnerAmount}}</template>
          </el-table-column>
          <el-table-column align="center" label="加班餐补天数" width="120">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].restCount}}</template>
          </el-table-column>
          <el-table-column align="center" label="加班金额总计" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].restAmount}}</template>
          </el-table-column>
          <el-table-column align="center" label="餐补总计" width="100">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].mealTotal}}</template>
          </el-table-column>
          <el-table-column align="center" label="备注" width="200">
            <template v-if="resultCountData[row['姓名']]" slot-scope="{row}">{{resultCountData[row['姓名']].remark}}<span v-if="resultCountData[row['姓名']].lateMin">，共计迟到{{resultCountData[row['姓名']].lateMin}}分钟</span> </template>
          </el-table-column>
          <!-- <el-table-column align="center" prop="晚班餐补" label="晚班餐补" width="100">
            <template v-if="row['晚班餐补详情']" slot-scope="{row}">{{row['晚班餐补详情'].length}}</template>
          </el-table-column>
          <el-table-column align="center" prop="晚班餐补详情" label="晚班餐补详情" width="200">
            <template v-if="row['晚班餐补详情']" slot-scope="{row}">
              <p v-for="(item,i) in row['晚班餐补详情']" :key="i">{{item}}</p>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <el-dialog :title="`${dayRow.name}：${dayRow.date}${dayPart}`" :visible.sync="dayModal" width="400px" @close="dayClose">
      <div class="day-modal-div">
        <p><label>姓名</label><span>{{dayRow.name}}</span></p>
        <p><label>日期</label><span>{{dayRow.date}}</span></p>
        <p><label>班次</label><span>{{dayRow.brequency||'无'}}</span></p>
        <p>
          <label>餐补标准</label>
          <el-input-number v-model="dayRow.mtUnit" :step="1" label="可编辑"></el-input-number>
        </p>
        <p v-if="dayRow.isRest"><label>加班餐补餐补</label>
          <el-input-number v-model="dayRow.restCount" :step="1" label="可编辑"></el-input-number>
        </p>
        <template v-if="dayPart==='上午'">
          <p><label>上班打卡时间</label><span>{{dayRow.up1Time||'无'}}</span></p>
          <p><label>上班打卡结果</label><span>{{dayRow.up1Result||'无'}}</span></p>
          <p v-if="!dayRow.isRest">
            <label>午餐餐补</label>
            <el-input-number v-model="dayRow.isLunch" :step="1" label="可编辑"></el-input-number>
          </p>
          <p>
            <label>显示结果</label>
            <el-select v-model="dayRow.upText" placeholder="可选择">
              <el-option v-for="item in dayRowOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </p>
        </template>
        <template v-else>
          <p><label>下班打卡时间</label><span>{{dayRow.down1Time||'无'}}</span></p>
          <p><label>下班打卡结果</label><span>{{dayRow.down1Result||'无'}}</span></p>
          <p v-if="!dayRow.isRest">
            <label>晚餐餐补</label>
            <el-input-number v-model="dayRow.isDinner" :step="1" label="可编辑"></el-input-number>
          </p>
          <p>
            <label>显示结果</label>
            <el-select v-model="dayRow.downText" placeholder="可选择">
              <el-option v-for="item in dayRowOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </p>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dayClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  path: '/mournal',
  name: 'mournal',
  title: '月度考勤最终版',
  data () {
    return {
      showTable: false,
      form: {
        day: '',
        date: '21:00',
        every: '',
        clock: '',
        journal: ''
      },
      users: [],
      days: [],
      dayModal: false,
      dayRow: {},
      dayPart: '',
      dayRowOptions: ['√', '休', '迟', '差', '早', '缺', '年', '外', '事', '出', '无'],
      resultMap: {},
      resultCountData: {}
    }
  },
  created () {
    this.initDate()
    this.initUser()
  },
  watch: {
    resultMap: {
      handler () {
        this.dealCountData()
      },
      deep: true
    }
  },
  methods: {
    clear () {
      this.form.clock = ''
      this.form.journal = ''
      this.form.every = ''
      this.$refs.journalInput.value = ''
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
        return this.$lib.dateFormate(item, 'D')
      })
      this.showTable = false
      setTimeout(() => {
        this.showTable = true
      }, 1)
    },
    exportTable () {
      // var table1 = document.querySelector('#table1')
      var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)// 将一个table对象转换成一个sheet对象
      let fileName = `${this.$lib.dateFormate(new Date(this.form.day), 'YYYY-MM')}考勤表最终版-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`
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
    dayOpen (row, part) {
      this.dayRow = row
      this.dayPart = part
      this.dayModal = true
    },
    dayClose () {
      this.dayModal = false
      this.dayRow = {}
    },
    importJournal (e) {
      var f = e.target.files[0]
      this.form.journal = f.name
      this.$biz.readExcel(f, data => {
        let [n, d, b, st1, sr1, xt1, xr1, kqz, cdm, gzsc] = this.getTitleKey(data, ['姓名', '日期', '班次', '上班1打卡时间', '上班1打卡结果', '下班1打卡时间', '下班1打卡结果', '考勤组', '迟到时长(分钟)', '工作时长(分钟)'])
        let resultMap = {}
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (i <= 2) continue
          let nk = item[n]; let dt = this.dealDT(item[d])
          let dtd = this.$lib.dateFormate(dt, 'D')
          if (!Object.hasOwnProperty.call(resultMap, nk)) resultMap[nk] = {}
          if (!Object.hasOwnProperty.call(resultMap[nk], dt)) {
            if (item[sr1] === '外勤') { item[sr1] = '正常' }
            if (item[xr1] === '外勤') { item[xr1] = '正常' }
            resultMap[nk][dtd] = {
              name: item[n],
              date: dt,
              cdm: item[cdm],
              brequency: item[b],
              up1Time: item[st1],
              up1Result: item[sr1],
              down1Time: item[xt1],
              down1Result: item[xr1],
              isLunch: 0,
              isDinner: 0,
              mtUnit: 0,
              restCount: 0
            }
          }
          if (!item[b]) {
            resultMap[nk][dtd]['upText'] = '无'
            resultMap[nk][dtd]['downText'] = '无'
            continue
          }
          if (item[b] === '休息') {
            resultMap[nk][dtd]['isRest'] = true
            resultMap[nk][dtd]['upText'] = '休'
            resultMap[nk][dtd]['downText'] = '休'
            if (item[kqz].indexOf('北京') >= 0 || item[kqz].indexOf('天津') >= 0) {
              resultMap[nk][dtd]['mtUnit'] = 20
            } else {
              resultMap[nk][dtd]['mtUnit'] = 15
            }
            if (item[gzsc]) {
              let diff = item[gzsc] / 60
              if (diff >= 5) {
                resultMap[nk][dtd]['restCount'] = 1
              }
              if (diff >= 9) {
                resultMap[nk][dtd]['restCount'] = 2
              }
            }
          } else {
            if (item[b].indexOf('北京') >= 0 || item[b].indexOf('天津') >= 0) {
              resultMap[nk][dtd]['mtUnit'] = 20
            } else {
              resultMap[nk][dtd]['mtUnit'] = 15
            }
            resultMap[nk][dtd]['upText'] = this.dealDayText(item[sr1])
            resultMap[nk][dtd]['downText'] = this.dealDayText(item[xr1])
            if (item[gzsc] && item[gzsc] / 60 >= 4) {
              resultMap[nk][dtd]['isLunch'] = 1
            }
            if (item[xt1] && this.form.date) {
              let day = this.$biz.dealTime(this.form.date); let clock = this.$biz.dealTime(item[xt1])
              if (clock >= day && item[xr1] !== '出差') {
                resultMap[nk][dtd]['isDinner'] = 1
              }
            }
          }
        }
        this.resultMap = resultMap
        this.dealCountData()
      })
    },
    dealCountData () {
      this.resultCountData = {}
      for (const n in this.resultMap) {
        if (!Object.hasOwnProperty.call(this.resultCountData, n)) {
          this.resultCountData[n] = {
            attendanceDays: 0, // 本月出勤
            fullAattendance: 1, // 是否全勤
            lunchCount: 0, // 午餐餐补天数
            lunchAmount: 0, // 午餐金额
            dinnerCount: 0, // 晚餐餐补
            dinnerAmount: 0, // 晚餐金额
            restCount: 0, // 加班餐补
            restAmount: 0, // 加班金额
            mealTotal: 0, // 总金额
            lateMin: 0, // 迟到分钟数
            remark: '' // 备注
          }
        }
        for (const d in this.resultMap[n]) {
          let { cdm, downText, upText, isDinner, isLunch, mtUnit, restCount } = this.resultMap[n][d]
          if (this.judgeAttend(downText, upText)) {
            this.resultCountData[n].attendanceDays++
          }
          if ((downText !== '休' && upText !== '休') && (downText !== '√' || upText !== '√')) {
            this.resultCountData[n].fullAattendance = 0
          }
          this.resultCountData[n].lunchCount += isLunch
          this.resultCountData[n].lunchAmount += (isLunch * mtUnit)
          this.resultCountData[n].dinnerCount += isDinner
          this.resultCountData[n].dinnerAmount += (isDinner * mtUnit)
          this.resultCountData[n].restCount += restCount
          this.resultCountData[n].restAmount += (restCount * mtUnit)
          this.resultCountData[n].mealTotal += (restCount * mtUnit + isLunch * mtUnit + isDinner * mtUnit)
          if (downText === '缺' || upText === '缺') {
            this.resultCountData[n].remark = '有忘记打卡'
          }
          if (cdm) {
            this.resultCountData[n].lateMin += Number(cdm)
          }
        }
      }
      this.resultCountData = { ...this.resultCountData }
    },
    judgeAttend (text1, text2) {
      let errs = ['休', '事', '缺', '无', '年']
      for (const item of errs) {
        if (text1 === item && text2 === item) {
          return false
        }
      }
      return true
    },
    dealDayText (text) {
      let result = ''
      if (text === '正常') {
        result = '√'
      } else if (text === '出差') {
        result = '差'
      } else if (text === '外勤') {
        result = '勤'
      } else if (text) {
        result = text.substring(0, 1)
      }
      return result
    },
    initUser () {
      this.$http.request({
        method: 'get',
        url: `/static/user.xlsx`,
        responseType: 'blob'
      }).then((res) => {
        this.$biz.readExcel(res.data, data => {
          this.users = data.reduce((pre, cur) => {
            return pre.concat([{ ...cur, part: '上午' }, { ...cur, part: '下午' }])
          }, [])
        })
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (['餐补额度', '序号', '部门', '姓名', '本月出勤', '全勤计数', '全勤补贴', '午餐餐补天数', '金额总计', '午餐金额总计', '晚餐金额总计', '备注', '加班金额总计', '加班餐补天数', '餐补总计', '晚餐餐补天数'].includes(column.label)) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getTitleKey (data, names) {
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (i < 3) {
          for (const key in element) {
            names = names.map(item => {
              item = element[key] === item ? key : item
              return item
            })
          }
        }
      }
      return names
    },
    dealDT (dt) {
      if (/^\d{1,2}-\d{1,2}-(\d{1,2}).*/.test(dt)) {
        let day = RegExp.$1
        let date = this.$lib.dateFormate(new Date(this.form.day), 'YYYY-MM')
        return `${date}-${day}`
      }
    },
    rowStyle ({ row, rowIndex }) {
      if (rowIndex % 4 === 0 || (rowIndex - 1) % 4 === 0) {
        return 'row-class-style'
      }
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (!this.resultMap[row['姓名']] || !this.resultMap[row['姓名']][column.label]) return
      let data = this.resultMap[row['姓名']][column.label]
      if (data.restCount > 0 || (row.part === '下午' && data.isDinner > 0)) {
        return 'background-color: #e1f3d8'
      }
      if ((data && row.part === '上午' && data.upText === '休') || (data && row.part === '下午' && data.downText === '休')) {
        return 'background-color: rgba(255, 255, 0,.2);'
      }
      if ((data && data.upText === '无') || (data && data.downText === '无')) {
        return 'background-color: rgba(0, 0, 0,.05);'
      }
    }
  }
  // if (row['考勤情况'] && row['考勤情况'].length && columnIndex === 3) {
  //   return 'background-color: rgba(255, 106, 0,.1);'
  // }
  // if (row['考勤结果'] && row['考勤结果'] !== '正常' && columnIndex === 4) {
  //   return 'background-color: rgba(255, 106, 0,.1);'
  // }
  // if (row['未写日志明细'] && columnIndex === 5) {
  //   return 'background-color: rgba(255, 106, 0,.1);'
  // }
}
</script>

<style lang="scss">
.mournal {
  .el-table th > .cell {
    padding: 0;
  }
  .el-table--small th,
  .el-table--small td,
  .el-table .cell,
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding: 0;
  }
  .row-class-style {
    background-color: #fef6f0;
  }
}
.day-modal-div {
  > p {
    height: 32px;
    margin-top: 10px;
    line-height: 32px;
    display: flex;
    > label {
      width: 120px;
    }
    > span,
    .el-input,
    .el-select {
      flex: 1;
    }
  }
}
</style>
