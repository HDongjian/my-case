import MixinPage from './mixins/page'
import MixinPackage from './mixins/package'
import Lib from './utils/lib'

const modulesFiles = require.context('./', true, /\.vue$/)
const components = modulesFiles.keys().reduce((components, modulePath) => {
  const moduleName = modulePath.replace(/^\.(.*)\/(.*)\.\w+$/, '$2')
  const value = modulesFiles(modulePath)
  components[moduleName] = value.default
  return components
}, {})

const install = function (Vue, opts = {}) {
  const FilePreviewerConstructor = Vue.extend(components.FilePreviewer)
  const instance = new FilePreviewerConstructor()
  instance.$mount()
  document.body.appendChild(instance.$el)
  Vue.prototype.$fp = instance
  Vue.prototype.$lib = Lib
  Vue.mixin(MixinPage)
  for (const name in components) {
    Vue.component(name, components[name])
  }
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '0.1.0',
  install,
  Lib,
  MixinPage,
  MixinPackage,
  ...components
}
