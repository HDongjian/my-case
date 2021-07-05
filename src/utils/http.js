import axios from 'axios'

export default {
  install (Vue, options) {
    axios.defaults.baseURL = options.api
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.post['Accept'] = 'application/json; charset=utf-8, text/plain, */*'
    axios.defaults.headers.put['Content-Type'] = 'application/json'
    axios.defaults.headers.put['Accept'] = 'application/json; charset=utf-8, text/plain, */*'
    axios.defaults.withCredentials = true

    axios.interceptors.request.use(function (request) {
      let url = request.url
      let tpi = url.indexOf('_t=')
      if (tpi !== -1) {
        url = url.substring(0, tpi - 1)
      }

      let c = url.indexOf('?') === -1 ? '?' : '&'
      request.url = `${url}${c}_t=${parseInt(new Date().getTime() / 1000, 10)}`

      return request
    }, error => Promise.reject(error))

    Vue.http = Vue.prototype.$http = axios
  },
  $http: axios
}
