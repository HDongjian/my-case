<template>
  <div class="journal layout">
    <my-header :title="$route.meta.title" :menus="$store.state.atTmenus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="日期">
          <el-date-picker @change="dateChange" v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="日志限填周期(天)">
          <el-input-number @change="dateChange" v-model="form.day" :min="1" :step="1" label="日志限填周期"></el-input-number>
        </el-form-item>

        <el-form-item label="日志文件" class="upload-item">
          <el-input style="width:300px" readonly placeholder="请选择日志文件" v-model="form.journal">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="journalInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importJournal">
        </el-form-item>

        <el-form-item label="打卡统计文件" class="upload-item">
          <el-input style="width:300px" readonly placeholder="请选择打卡统计文件" v-model="form.clock">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="clockInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="importClock">
        </el-form-item>
        <el-form-item label="打卡地点文件" class="upload-item">
          <el-input style="width:300px" readonly placeholder="请选择打开地点文件" v-model="form.address">
            <template slot="append"><a class="theme-color" href="javascript:;">选择</a></template>
          </el-input>
          <input ref="addressInput" class="upload-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' @change="addressClock">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportTable">导出</el-button>
          <el-button @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- style="height: calc(100% - 100px);width: 100%;overflow:auto" -->
      <div class="table" style="height: calc(100% - 50px);">
        <el-table :cell-style="cellStyle" border height="100%" ref="table" :data="users" v-show="!showTable" v-loading="showTable">
          <el-table-column :label="$lib.dateFormate(new Date(form.date), 'YYYY年MM月DD日')+'考勤情况'" width="100%" align="center">
            <el-table-column v-if="showExpand" type="expand" label="详情" width="50">
              <template slot-scope="{row}">
                <el-form label-position="left">
                  <el-form-item label="部门："><span>{{row['部门']}}</span></el-form-item>
                  <el-form-item label="上班时间："><span>{{row['上班时间']}}</span></el-form-item>
                  <el-form-item v-if="row['考勤结果']" label="考勤结果："><span>{{row['考勤结果']}}</span></el-form-item>
                  <el-form-item v-if="row['考勤情况']&&row['考勤情况'].length" label="考勤详情：">
                    <span v-for="(item,i) in row['考勤情况']" :key="i">{{item.key}}：{{item.value}}；</span>
                  </el-form-item>
                  <el-form-item label="日报填写范围：">
                    <span>{{$lib.dateFormate(row.start, 'YYYY-MM-DD HH:mm')}}至{{$lib.dateFormate(row.end, 'YYYY-MM-DD HH:mm')}}</span>
                  </el-form-item>
                  <el-form-item v-if="row['未写日志明细']" label="日志结果："><span>{{row['未写日志明细']}}</span></el-form-item>
                  <el-form-item v-if="row['日志明细']" label="日志明细：">
                    <div class="dd-div">
                      <p class="dd-p" v-for="(item,i) in row['日志明细']" :key="i">
                        <span class="flag">{{item.flag?'符合':'不符合'}}</span>
                        <span class="time">{{item.time}}</span>
                        <my-copy :text="`字数 ${item.content?item.content.length:0}`" :tooltip="item.content"></my-copy>
                      </p>
                    </div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
            <!-- <el-table-column fixed="left" align="center" prop="部门" label="部门" width="100"></el-table-column> -->
            <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="100"></el-table-column>
            <el-table-column align="center" prop="考勤情况" label="考勤情况" min-width="200">
              <template slot-scope="{row}">{{dealReslultList(row['考勤情况'])}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="考勤结果" label="考勤结果" width="200"></el-table-column>
            <el-table-column align="center" prop="打卡" label="打卡地址" width="340"></el-table-column>
            <el-table-column align="left" label="打卡明细" width="500">
              <template slot-scope="{row}" v-if="addressMap[row['姓名']]">
                <div class="address-detail" v-for="(item,i) in addressMap[row['姓名']]" :key="i">
                  <span>{{item.time}}</span>
                  <span>{{item.address}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="未写日志明细" label="未写日志明细" width="200">
              <template slot-scope="{row}" v-if="row['未写日志明细']">{{$lib.dateFormate(new Date(form.date), 'M/DD')}}</template>
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
  path: '/journal',
  name: 'journal',
  title: '每日打卡日志统计',
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
        day: 1,
        date: '',
        clock: '',
        address: '',
        journal: ''
      },
      anormalError: [
        '迟到次数', '迟到时长(分钟)', '严重迟到次数', '严重迟到时长', '旷工迟到天数', '早退次数', '早退时长(分钟)', '上班缺卡次数', '下班缺卡次数', '旷工天数', '出差时长', '外出时长', '调休(小时)', '调休(小时)', '婚假(小时)', '产假(小时)', '陪产假(小时)', '路途假(小时)', '丧假(小时)', '加班(小时)', '事假(小时)', '病假(小时)', '年假(小时)', '工作日（转调休）', '休息日（转调休）', '节假日（转调休）', '迟到时长', '早退时长', '调休', '婚假', '产假', '陪产假', '路途假', '丧假', '加班', '事假', '病假', '年假'
      ],
      minteKeys: [ '迟到时长', '早退时长' ],
      hourKeys: [ '调休', '婚假', '产假', '陪产假', '路途假', '丧假', '加班', '事假', '病假', '年假' ],
      resultList: [],
      users: [],
      showExpand: true,
      addressMap: {}
    }
  },
  created () {
    // console.log(this.$lib.dateFormate(new Date('2012/12/11 10:10'), 'M/DD'))
    this.initDate()
    this.initUser()
  },
  methods: {
    clear () {
      this.resultList = []
      this.form.clock = ''
      this.form.journal = ''
      this.form.address = ''
      this.$refs.journalInput.value = ''
      this.$refs.clockInput.value = ''
      this.$refs.addressInput.value = ''
      this.initDate()
      this.initUser()
    },
    exportTable () {
      this.showExpand = false
      this.$nextTick(() => {
        var sheet = XLSX.utils.table_to_sheet(this.$refs.table.$el)// 将一个table对象转换成一个sheet对象
        let fileName = `${this.$lib.dateFormate(new Date(this.form.date), 'YYYY-MM-DD')}考勤日志统计-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`
        let sheetName = this.$lib.dateFormate(new Date(this.form.date), 'M月DD日')
        let Sheets = {}; let SheetNames = []
        Sheets[sheetName] = sheet
        SheetNames.push(sheetName)
        let workBook = {
          SheetNames,
          Sheets
        }
        XLSX.writeFile(workBook, fileName)
        this.showExpand = true
      })
    },
    initDate () {
      // this.form.date = '2021-06-10'
      // let today = new Date('2021-06-10')
      let today = new Date()
      let week = today.getDay()
      if (week === 1) {
        this.form.day = 3
      } else {
        this.form.day = 1
      }
      this.form.date = this.$lib.dateFormate(today.getTime() - this.form.day * 24 * 60 * 60 * 1000, 'YYYY-MM-DD')
    },
    dateChange () {
      this.form.clock = ''
      this.form.journal = ''
      this.$refs.journalInput.value = ''
      this.$refs.clockInput.value = ''
      this.initUser()
    },
    initUser () {
      this.$http.request({
        method: 'get',
        url: `/static/user.xlsx`,
        responseType: 'blob'
      }).then((res) => {
        this.$biz.readExcel(res.data, data => {
          this.users = (data || []).map(item => {
            item['上班时间'] = this.$lib.handleDate(item['上班时间'], 'HH:mm')
            item.start = new Date(this.$lib.dateFormate(this.form.date, 'YYYY-MM-DD') + ' ' + item['上班时间']).getTime()
            item.end = item.start + (this.form.day || 1) * 24 * 60 * 60 * 1000
            return item
          })
        })
      })
    },
    addressClock (e) {
      var f = e.target.files[0]
      this.form.address = f.name
      this.$biz.readExcel(f, data => {
        let dates = this.$biz.dealMTXName(f.name)
        let date = this.$lib.dateFormate(new Date(this.form.date), 'YYYY-MM-DD')
        if (!dates.includes(date)) {
          this.$message.info(`${f.name}表中并没有${date}时间的考勤数据`)
          return
        }
        let [r, a, t, n] = this.$biz.getTitleKey(data, ['打卡结果', '打卡地址', '打卡时间', '姓名'])
        let resultMap = {}
        for (let i = 0; i < data.length; i++) {
          if (i <= 2) continue
          const ele = data[i]
          if (this.$lib.dateFormate(new Date(ele[t]), 'YYYY-MM-DD') !== date) continue
          if (!Object.hasOwnProperty.call(resultMap, ele[n])) resultMap[ele[n]] = []
          if (ele[r] === '外勤') {
            resultMap[ele[n]].push({ time: ele[t], address: ele[a] })
          }
        }
        console.log(resultMap)
        this.addressMap = resultMap
      })
    },
    importJournal (e) {
      var f = e.target.files[0]
      this.form.journal = f.name
      this.$biz.readExcel(f, data => {
        try {
          let Jdata = data
          Jdata = Jdata.map(item => {
            item.content = ''
            for (const key in item) {
              if (key.indexOf('工作') >= 0 || key.indexOf('任务') >= 0) {
                item.content += item[key]
              }
            }
            item.content = item.content.replace(/\n/g, '')
            item.content = item.content.replace(/\s/g, '')
            item.contentLength = item.content.length
            return item
          })
          Jdata = Jdata.sort((x, y) => {
            return y.contentLength - x.contentLength
          })
          this.users = this.users.map(item => {
            let jis = Jdata.filter((o) => o['填报人'] === item['姓名'])
            let content = ''
            item['日志明细'] = []
            if (jis && jis.length) {
              let t = item['上班时间']
              let start = new Date(this.$lib.dateFormate(this.form.date, 'YYYY-MM-DD') + ' ' + t).getTime()
              let end = start + (this.form.day || 1) * 24 * 60 * 60 * 1000
              for (const ji of jis) {
                let ft = ji['最后一次修改时间']
                if (!ft) continue
                ft = ft.replace(/年|月/g, '-')
                ft = ft.replace(/日/g, '')
                ft = new Date(ft).getTime()
                let dd = {
                  content: ji.content,
                  time: this.$lib.dateFormate(ft, 'YYYY-MM-DD HH:mm'),
                  flag: false
                }
                if (ft < end && ft > start) {
                  content += ji.content
                  dd.flag = true
                }
                item['日志明细'].push(dd)
              }
              item['日志明细'] = item['日志明细'].sort((x, y) => {
                return y.flag - x.flag
              })
              if (!content) {
                item['未写日志明细'] = `日志填写日期不符要求`
              }
              if (content.length > 0 && content.length < 50) {
                item['未写日志明细'] = '日志字数小于50'
              }
            } else {
              item['未写日志明细'] = '未填写日志'
            }
            return item
          })
        } catch (error) {
          console.log(error)
        }
      })
    },
    importClock (e) {
      var f = e.target.files[0]
      this.form.clock = f.name
      let dates = this.$biz.dealMTXName(f.name)
      let date = this.$lib.dateFormate(new Date(this.form.date), 'YYYY-MM-DD')
      if (!dates.includes(date)) {
        this.$message.info(`${f.name}表中并没有${date}时间的考勤数据`)
        return
      }
      this.showTable = true
      this.$biz.readExcel(f, data => {
        this.resultList = []
        let totalMap = {}; let nameKey = ''; let anaomalrKey = ''
        let dday = this.$lib.dateFormate(new Date(this.form.date), 'D')

        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (i === 0) {
            let keys = Object.keys(element)
            if (keys.length === 1) {
              nameKey = keys[0]
            }
          }
          if (i <= 2) {
            for (const key in element) {
              if (String(dday) === String(element[key])) {
                anaomalrKey = key
              }
              totalMap[key] = element[key]
            }
          }
        }
        this.users = this.users.map(item => {
          let ji = data.find((o) => o[nameKey] === item['姓名'])
          if (!ji) return item
          item['考勤情况'] = []
          // console.log(ji[anaomalrKey])
          item['考勤结果'] = ji[anaomalrKey]
          if (ji[anaomalrKey] && ji[anaomalrKey] !== '正常') {
            for (const key in ji) {
              if (this.anormalError.includes(totalMap[key])) {
                item['考勤情况'].push({ key: totalMap[key], value: ji[key] })
              }
            }
          }
          return item
        })
        this.showTable = false
        this.users = [...this.users]
        console.log(this.users)
      })
    },
    dealArray (input) {
      let output = input.reduce((re, obj) => {
        const item = re.find((o) => o['填报人'] === obj['填报人'])
        if (item) {
          let nes = this.dealWorkTotal(obj)
          for (const key in nes) {
            item[key] = nes[key]
          }
        } else {
          re.push(obj)
        }
        return re
      }, [])
      return output
    },
    dealWorkTotal (obj) {
      let result = {}
      for (const key in obj) {
        if (key.indexOf('工作') >= 0) {
          result[`${key}_A`] = obj[key]
        }
      }
      return result
    },
    dealReslultList (list) {
      if (!list || !list.length) return ''
      let result = []
      for (const item of list) {
        if (/^(.{1,10})\((.{1,4})\)$/.test(item.key)) {
          let name = RegExp.$1; let unit = RegExp.$2
          name = name.replace('时长', '')
          result.push(`${name}${item.value}${unit}`)
        } else if (item.key === '上班缺卡次数') {
          result.push('上班无记录')
        } else if (item.key === '下班缺卡次数') {
          result.push('下班无记录')
        } else if (item.key === '旷工天数') {
          result.push(`旷工${item.value}天`)
        } else if (item.key === '严重迟到时长') {
          result.push(`严重迟到${item.value}`)
        } else if (item.key === '旷工迟到天数') {
          result.push(`旷工迟到${item.value}天`)
        } else if (item.key === '出差时长') {
          result.push(`出差${item.value}小时`)
        } else if (item.key === '外出时长') {
          result.push(`外出${item.value}小时`)
        } else if (item.key === '外出时长') {
          result.push(`外出${item.value}小时`)
        } else if (this.minteKeys.includes(item.key)) {
          result.push(`${item.key}${item.value}分钟`)
        } else if (this.hourKeys.includes(item.key)) {
          result.push(`${item.key}${item.value}小时`)
        }
      }
      if (result.length) {
        return this.$lib.dateFormate(this.form.date, 'M/DD') + result.join('、')
      }
      return ''
      //
    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      if (row['考勤情况'] && row['考勤情况'].length && columnIndex === 3) {
        return 'background-color: rgba(255, 106, 0,.1);'
      }
      if (row['考勤结果'] && row['考勤结果'] !== '正常' && columnIndex === 4) {
        return 'background-color: rgba(255, 106, 0,.1);'
      }
      if (row['未写日志明细'] && columnIndex === 5) {
        return 'background-color: rgba(255, 106, 0,.1);'
      }
    }
  }
}
</script>

<style lang="scss">
.address-detail {
  display: flex;
  > span {
    &:first-child {
      width: 140px;
    }
    &:nth-child(2) {
      flex: 1;
    }
  }
}
</style>
