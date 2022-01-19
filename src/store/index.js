import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    atTmenus: [{
      name: '员工管理',
      router: '/staff'
    }, {
      name: '每日打卡日志统计',
      router: '/journal'
    }, {
      name: '月度打卡日志统计',
      router: '/sournal'
    }, {
      name: '月度请假统计',
      router: '/leave'
    }, {
      name: '月度外出统计',
      router: '/out'
    }, {
      name: '月度出差统计',
      router: '/business'
    }, {
      name: '月度考勤最终版',
      router: '/mournal'
    }]
  }
})

export default store
