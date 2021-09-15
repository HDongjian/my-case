<template>
  <div class="ascii_painting layout">
    <my-header :title="$route.meta.title"></my-header>
    <div class="layout-content" @click.stop="playOrStop">
      <!-- <el-button @click="playOrStop">播放</el-button> -->
      <video ref="video" id="video" controls>
        <source src="../../assets/sly.mp4" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
      <div ref="container" id="container"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ascii-painting',
  path: '/ascii-painting',
  title: '字符画',
  data () {
    return {
      stop: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    playOrStop () {
      if (this.stop) {
        this.$refs.video.play()
      } else {
        this.$refs.video.pause()
      }
    },
    init () {
      const loading = this.$loading({
        lock: true,
        text: '加载完毕点击播放',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      var container = document.getElementById('container')
      var offScreenCvs = document.createElement('canvas')
      var offScreenCtx = offScreenCvs.getContext('2d', { alpha: false })
      var offScreenCvsWidth, offScreenCvsHeight
      var samplerStep = 4
      var fontSize = 8

      var imageData
      var x, y, pos
      var asciiCharArray = '#KDGLftji+;,:. '.split('')
      var durationPerChar = 255 / asciiCharArray.length

      var maxWidth = 400; var maxHeight = 400

      var video = document.getElementById('video')
      video.crossOrigin = 'anonymous' // 允许跨域
      video.onloadeddata = () => {
        setTimeout(() => {
          loading.close()
        }, 4000)
        offScreenCvsWidth = video.videoWidth
        offScreenCvsHeight = video.videoHeight
        var ratio = offScreenCvsWidth / offScreenCvsHeight
        if (video.videoWidth > maxWidth) {
          offScreenCvsWidth = maxWidth
          offScreenCvsHeight = Math.floor(offScreenCvsWidth / ratio)
        }
        if (video.videoHeight > maxHeight) {
          offScreenCvsHeight = maxHeight
          offScreenCvsWidth = Math.floor(offScreenCvsHeight * ratio)
        }
        offScreenCvs.width = offScreenCvsWidth
        offScreenCvs.height = offScreenCvsHeight

        offScreenCtx.drawImage(video, 0, 0, offScreenCvsWidth, offScreenCvsHeight)
        imageData = offScreenCtx.getImageData(0, 0, offScreenCvsWidth, offScreenCvsHeight)

        if (fontSize < 12) {
          // container.style.transform = 'scale(' + (fontSize / 12) + ') translate(-50%,-50%)'
          // container.style.transformOrigin = '0 0'
          fontSize = 12
        }
        let height = offScreenCvsHeight / samplerStep * fontSize
        container.style.width = (offScreenCvsWidth * fontSize / samplerStep) + 'px'
        container.style.height = height + 'px'
        container.style.fontSize = fontSize + 'px'
        container.style.lineHeight = fontSize + 'px'
        container.style.letterSpacing = (fontSize / 2) + 'px'

        render()

        // video.onclick = function () {
        //   video.paused ? video.play() : video.pause()
        // }

        video.onplay = () => {
          this.stop = false
          rendering = false
          requestAnimationFrame(tick)
        }

        video.onpause = () => {
          this.stop = true
        }
      }

      var timeNow = Date.now()
      var timeLast = timeNow
      var delta = 0
      var interval
      var fps = 60

      interval = 1000 / fps

      var rendering = false
      var tick = () => {
        if (this.stop) return false
        timeNow = Date.now()
        delta = timeNow - timeLast
        if (delta > interval) {
          timeLast = timeNow

          if (!rendering) {
            rendering = true
            offScreenCtx.drawImage(video, 0, 0, offScreenCvsWidth, offScreenCvsHeight)
            imageData = offScreenCtx.getImageData(0, 0, offScreenCvsWidth, offScreenCvsHeight)
            render()
            rendering = false
          }
        }
        requestAnimationFrame(tick)
      }

      function render () {
        var imageDataContent = imageData.data
        var strArray = []
        var part1, part2
        var letter
        var value
        for (y = 0; y < offScreenCvsHeight; y += samplerStep) {
          strArray.push('<p>')
          for (x = 0; x < offScreenCvsWidth; x += samplerStep) {
            pos = y * offScreenCvsWidth + x
            value = imageDataContent[pos * 4] * 0.3086 + imageDataContent[pos * 4 + 1] * 0.6094 + imageDataContent[pos * 4 + 2] * 0.0820
            imageDataContent[pos * 4] = imageDataContent[pos * 4 + 1] = imageDataContent[pos * 4 + 2] = value

            part1 = Math.floor(value / durationPerChar)
            part2 = parseFloat((value % durationPerChar).toFixed(5))
            letter = part2 ? asciiCharArray[part1] : (part1 ? asciiCharArray[part1 - 1] : '0')

            strArray.push(letter === ' ' ? '&nbsp;' : letter)
          }
          strArray.push('</p>')
        }
        container.innerHTML = strArray.join('')
      }
    }
  }
}
</script>

<style lang="scss">
.ascii_painting {
  canvas,
  video,
  #container {
    display: block;
    margin: auto;
  }

  #container {
    line-height: 12px;
    font-size: 12px;
    font-family: 'SimHei', monospace;
    letter-spacing: 6px;
    // margin-top: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    // transform: translate(-50%, -50%);
    // right: 200px;
    // top: 50%;
    transform: scale(.6) translate(-50%,-50%);
    transform-origin:0 0;
    margin: 0;
    overflow: hidden;
    p {
      font-family: cursive;
    }
  }
  @media screen and (max-width: 600px) {
     #container {
       transform: scale(.5) translate(-50%,-50%);
     }
  }

  video {
    height: 0;
    width: 0;
    outline: 0;
    // max-height: 300px;
    // position: absolute;
    // left: 200px;
    // top: 50%;
    // transform: translateY(-50%);
  }
}
</style>
