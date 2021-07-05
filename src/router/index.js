import Vue from 'vue'
import Router from 'vue-router'

const modulesFiles = require.context('@/page', true, /\.vue$/)
const pages = modulesFiles.keys().reduce((page, modulePath) => {
  const value = modulesFiles(modulePath)
  page.push(value.default)
  return page
}, [])

let routes = []

for (const page of pages) {
  if (!page.isComponent) {
    routes.push({ path: page.path, component: page, name: page.name, meta: { login: true, title: page.title || '' } })
  }
  Vue.component(page.name, page)
}

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(Router)

let router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
