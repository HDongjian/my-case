export let api
export let web
export let fls
export const title = '导航'
export const port = process.env.VUE_APP_PORT
export const env = process.env.NODE_ENV

if (!api) {
  let segments = location.href.split('/')
  api = segments[0] + '//' + segments[2]
}

let publicPath = '/'
if (publicPath === '/' || !publicPath) {
  web = api
} else if (publicPath.startsWith('/')) {
  web = api + publicPath
} else {
  web = api + '/' + publicPath
}
if (!web.endsWith('/')) {
  web = web + '/'
}
fls = api
