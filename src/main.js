import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router/index'
import store from './store/index'
import App from './App'
import Components from './components/index'
import http from './utils/http'
import biz from './utils/biz'
import { title, api } from './config'
import icons from './icons/index'
import BaseWeb from './base-web'
import './styles/index.scss'

Vue.lib = BaseWeb.Lib
require('es6-promise').polyfill()

Vue.use(ElementUI)
Vue.use(Components)
Vue.use(BaseWeb)
Vue.use(icons)
Vue.use(http, { api })
Vue.use(biz)
Vue.prototype.$ELEMENT = { size: 'small' }
document.title = title
Vue.store = store
Vue.router = router

new Vue({
  store,
  router,
  render: (h) => h(App)
}).$mount('#app')
