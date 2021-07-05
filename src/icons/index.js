const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext) => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)

const pictures = require.context('./png', true, /\.png$/)
const pictureModules = pictures.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/\.\/(.*)\.png/, '$1')
  const value = pictures(modulePath)
  modules[moduleName] = value
  return modules
}, {})

export default {
  install (Vue) {
    Vue.pictures = Vue.prototype.$pictures = pictureModules
  }
}
