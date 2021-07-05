export const dispatchData = function (componentName) {
  var parent = this.$parent || this.$root
  var name = parent.$options._componentTag || parent.componentName
  if (name === componentName) {
    return parent
  }
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent
    if (parent) {
      name = parent.$options._componentTag || parent.componentName
    }
  }
  return parent
}

export const dispatch = function (componentName, params) {
  var parent = this.$parent || this.$root
  var name = parent.$options._componentTag || parent.componentName
  if (name === componentName) {
    return parent
  }
  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent
    if (parent) {
      name = parent.$options._componentTag || parent.componentName
    }
  }
  if (parent && parent.detectingChange) {
    parent.detectingChange(params)
  }
}
