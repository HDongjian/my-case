<template>
  <div class="grid-base layout">
    <my-header :title="$route.meta.title"></my-header>
    <el-row>
      <el-col :span="18">
        <div class="grid" :style="gridStyles">
          <div :class="{'grid-item':true}" v-for="i in form.items" :key="i">item{{i}}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <el-form ref="form" size="medium" :model="form" label-width="60px">
          <el-form-item label="项数">
            <el-input-number :controls="false" v-model="form.items" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="间距">
            <el-input-number :controls="false" v-model="form.gap" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="顺序">
            <el-select v-model="form.flow" placeholder="请选择">
              <el-option v-for="item in options" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.flow==='column'" label="列数">
            <el-input-number :controls="false" v-model="form.columns" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item v-if="form.flow==='row'" label="行数">
            <el-input-number :controls="false" v-model="form.rows" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'grid-base',
  path: '/grid-base',
  title: 'Grid布局',
  data () {
    return {
      options: ['row', 'column'],
      form: {
        rows: 4,
        items: 12,
        columns: 4,
        gap: 10,
        flow: 'row'
      }
    }
  },
  computed: {
    gridStyles () {
      let styles = {}
      styles['grid-template-columns'] = `repeat(${this.form.columns}, 1fr)`
      styles['grid-template-rows'] = `repeat(${this.form.rows}, 1fr)`
      styles['grid-auto-flow'] = this.form.flow
      styles['grid-gap'] = `${this.form.gap}px`
      return styles
    }
  }
}
</script>

<style lang="scss">
.el-select-dropdown__item {
  text-align: center;
}
.grid-base {
  // background-color: #201e33;
  transition: height 0.3s;
  .el-input-number {
    width: 200px;
  }
  input {
    text-align: center;
  }
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      padding: 15px;
    }
    .el-col-18 {
      border-right: 1px solid #6e3547;
    }
  }
  .grid {
    display: grid;
    // grid-template-columns: repeat(4, 1fr);
    // grid-template-rows: repeat(4, 1fr);
    // grid-gap: 10px;
    // grid-template-rows: repeat(10, 100px);
    // grid-auto-flow: column;
  }
  .grid-item {
    transition: height 0.3s;
    padding: 30px 0;
    // height: 100px;
    // background-color: #302742;
    background-color: #ffe1cc;
    border: 1px solid #ff6a00;
    border-radius: 4px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    // &:nth-child(1) {
    //   grid-column: 1 / span 2;
    //   grid-row: 1 / span 3;
    //   // grid-column: span 3 / auto;
    // }
  }
}
</style>
