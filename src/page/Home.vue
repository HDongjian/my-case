<template>
  <div class="home">
    <my-header title="大家好，这是一个无聊的导航页面"></my-header>
    <div class="content">
      <div class="card-content">
        <el-row :gutter="16">
          <el-col v-for="(item,i) in links" :key="i" :span="8">
            <el-card class="box-card">
              <div slot="header">{{item.title}}</div>
              <div class="links">
                <el-collapse accordion>
                  <el-collapse-item :title="link.title" :name="k" v-for="(link,k) in item.links" :key="i+'_'+k">
                    <h5 @click.stop="go(link)" slot="title">{{link.title}}</h5>
                    <p>{{link.description}}</p>
                  </el-collapse-item>
                </el-collapse>
                <!-- <div @click="go(link)">
                  <h5>{{link.title}}</h5>
                  <p>{{link.description}}</p>
                </div> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="footer">
        <div class="f-content">
          <div class="code">
            <p>津ICP备19009907号</p>
            <p>津ICP备19009907号-1</p>
          </div>
          <div class="we-chart">
            <img src="../assets/my-wechart.jpg" alt="二维码">
            <span>可以加微信，不加也行</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  path: '/',
  name: 'home',
  title: '大家好，这是一个无聊的导航页面',
  data () {
    return {
      links: []
    }
  },
  created () {
    this.initLink()
  },
  methods: {
    go (link) {
      if (link.path) {
        this.$router.push(link.path)
      }
      if (link.address) {
        window.open(link.address)
      }
    },
    initLink () {
      this.$http.request({
        method: 'get',
        url: `/static/home.json`
      }).then((res) => {
        this.links = res.data
      })
    }
  }
}
</script>

<style lang="scss">
.home {
  height: 100%;
  overflow: hidden;
  .content {
    height: calc(100% - 60px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
  .card-content {
    padding: 16px;
    min-height: calc(100% - 70px);
    box-sizing: border-box;
    padding-top: 0;
    .el-card {
      height: 100%;
    }
    .el-row {
      .el-col {
        margin-top: 16px;
      }
    }
    .box-card {
      .el-card__header {
        position: relative;
        font-weight: bold;
        color: #ff6a00;
        > div {
          font-size: 16px;
        }
        &::after {
          content: '';
          height: 20px;
          width: 4px;
          background-color: #ff6a00;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .el-card__body {
        height: 200px;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
      }
    }
    .links {
      .el-collapse-item__header {
        font-weight: bold;
      }
      h5 {
        &:hover{
          color: #ff6a00;
        }
        span {
          font-size: 12px;
          font-weight: normal;
          color: #ff6a00;
        }
      }
    }
  }
  .footer {
    background-color: #ff6a00;
    height: 70px;
    padding: 10px 0;
    .f-content {
      width: 380px;
      margin: 0 auto;
      > div {
        display: inline-block;
        vertical-align: top;
        color: #fff;
      }
      .code {
        height: 70px;
        p {
          text-align: center;
          height: 35px;
          line-height: 35px;
        }
      }
      .we-chart {
        line-height: 70px;
        float: right;
        img {
          margin-right: 18px;
          vertical-align: middle;
          height: 70px;
          width: 70px;
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .home {
    .el-col-8 {
      width: 100% !important;
    }
  }
}
</style>
