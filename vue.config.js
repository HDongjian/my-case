const path = require('path')
const zopfli = require('@gfx/zopfli')
const BrotliPlugin = require('brotli-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const resolve = (dir) => path.join(__dirname, dir)
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: !IS_PROD,
  parallel: require('os').cpus().length > 1,
  css: {
    extract: false
  },
  pwa: {},
  devServer: {
    port: process.env.VUE_APP_PORT,
    open: true,
    overlay: {
      warning: true,
      errors: true
    },
    hotOnly: false,
    https: false,
    proxy: {
      '/api': {
        // target: 'http://localhost:3010',
        target: 'https://hdongyu.com',
        changeOrigin: true
      }
    }
  },
  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
    return config
  },
  configureWebpack: (config) => {
    const plugins = []
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          algorithm (input, compressionOptions, callback) {
            return zopfli.gzip(input, compressionOptions, callback)
          },
          compressionOptions: {
            numiterations: 15
          },
          minRatio: 0.99,
          test: productionGzipExtensions
        })
      )
      plugins.push(
        new BrotliPlugin({
          test: productionGzipExtensions,
          minRatio: 0.99
        })
      )
      // 单独打包第三方库
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            common: {
              name: 'chunk-common',
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              reuseExistingChunk: true,
              enforce: true
            },
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              priority: 2,
              reuseExistingChunk: true,
              enforce: true
            },
            elementUI: {
              name: 'chunk-elementui',
              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
              chunks: 'all',
              priority: 3,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      }
    }
    config.plugins = [...config.plugins, ...plugins]
  }
}
