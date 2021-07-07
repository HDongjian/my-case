<template>
  <div class="journal layout">
    <my-header :title="$route.meta.title" :menus="menus"></my-header>
    <div class="layout-content">
      <el-form :inline="true" :model="form" class="journal-form">
        <el-form-item label="日期">
          <el-date-picker @change="dateChange" v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="日志限填周期(天)">
          <el-input-number @change="dateChange" v-model="form.day" :min="1" :step="1" label="日志限填周期"></el-input-number>
        </el-form-item>

        <el-form-item label="日志文件" class="upload-item">
          <el-input style="width:500px" readonly placeholder="请选择日志文件" v-model="form.journal">
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
       <!-- style="height: calc(100% - 100px);width: 100%;overflow:auto" -->
      <div class="table" style="height: calc(100% - 50px);">
        <el-table border height="100%" ref="table" :data="users" v-show="!showTable" v-loading="showTable">
          <el-table-column fixed="left" align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column fixed="left" align="center" prop="部门" label="部门" width="100"></el-table-column>
          <el-table-column fixed="left" align="center" prop="姓名" label="姓名" width="100"></el-table-column>
          <el-table-column align="center" prop="考勤情况" label="考勤情况" min-width="200"></el-table-column>
          <el-table-column v-if="resultList.length>1" align="center" prop="考勤结果" label="考勤结果" min-width="100">
            <el-table-column :key="i" v-for="(item,i) in resultList" :prop="item.key" align="center" :label="item.name"  width="80"></el-table-column>
          </el-table-column>
          <el-table-column align="center" prop="打卡" label="打卡地址" width="340"></el-table-column>
          <el-table-column align="center" prop="上班时间" label="上班时间" width="100"></el-table-column>
          <el-table-column align="center" label="日报填写范围" width="300">
            <template slot-scope="{row}">
              {{$lib.dateFormate(row.start, 'YYYY-MM-DD HH:mm')}}至
              {{$lib.dateFormate(row.end, 'YYYY-MM-DD HH:mm')}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="未写日志明细" label="未写日志明细" width="160"></el-table-column>
          <el-table-column fixed="right" align="center" prop="日志明细" label="日志明细" width="300">
            <template slot-scope="{row}">
              <p class="dd-p" v-for="(item,i) in row['日志明细']" :key="i">
                <span class="flag">{{item.flag?'符合':'不符合'}}</span>
                <span>{{item.time}}</span>
                <my-copy :text="`字数 ${item.content?item.content.length:0}`" :tooltip="item.content"></my-copy>
              </p>
            </template>
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
  title: '每日考勤日志管理',
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
    this.initDate()
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
      this.$biz.openDownloadDialog(this.$biz.sheet2blob(sheet), `${this.$lib.dateFormate(new Date(this.form.date), 'YYYY-MM-DD')}考勤日志统计-${this.$lib.dateFormate(new Date(), 'YYYY年MM月DD日 HH时mm分ss秒')}.xlsx`)
    },
    initDate () {
      // this.form.date = '2021-06-10'
      let today = new Date()
      let week = today.getDay()
      if (week === 1) {
        this.form.day = 3
      } else {
        this.form.day = 1
      }
      this.form.date = this.$lib.dateFormate(Date.now(), 'YYYY-MM-DD')
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
            item.end = new Date(this.$lib.dateFormate(this.form.date, 'YYYY-MM-DD') + ' ' + item['上班时间']).getTime()
            item.start = item.end - (this.form.day || 1) * 24 * 60 * 60 * 1000
            return item
          })
        })
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
              let end = new Date(this.$lib.dateFormate(this.form.date, 'YYYY-MM-DD') + ' ' + t).getTime()
              let start = end - (this.form.day || 1) * 24 * 60 * 60 * 1000
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
      this.showTable = true
      var f = e.target.files[0]
      this.form.clock = f.name
      this.$biz.readExcel(f, data => {
        this.resultList = []
        let resultList = []
        let totalMap = {}; let nameKey = ''; let anaomalrKey = ''
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          if (i === 0) {
            let keys = Object.keys(element)
            if (keys.length === 1) {
              nameKey = keys[0]
            }
          }
          if (i === 2) {
            for (const key in element) {
              let count = key.substring(key.length - 2)
              if (count >= 34) {
                resultList.push(key)
                this.resultList.push({ name: element[key], key })
              }
            }
          }
          if (i <= 2) {
            for (const key in element) {
              if (isNaN(element[key])) {
                if (element[key] === '考勤结果') {
                  anaomalrKey = key
                }
                totalMap[key] = element[key]
              }
            }
          }
        }
        this.users = this.users.map(item => {
          let ji = data.find((o) => o[nameKey] === item['姓名'])
          if (!ji) return item
          item['考勤情况'] = []
          if (resultList.length === 1) {
            if (ji[anaomalrKey] && ji[anaomalrKey] !== '正常') {
              item['考勤情况'].push(ji[anaomalrKey])
              item['考勤结果'] = ji[anaomalrKey]
            }
          }
          for (const key in ji) {
            if (resultList.includes(key)) {
              if (ji[key] !== '正常' && ji[key] !== '休息') { item[key] = ji[key] }
            }
            if (this.anormalError.includes(totalMap[key])) {
              item['考勤情况'].push(`${totalMap[key]}：${ji[key]}`)
            }
          }
          item['考勤情况'] = item['考勤情况'].join('；')
          return item
        })
        this.showTable = false
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
    }
  }
}
</script>

<style lang="scss">

</style>
