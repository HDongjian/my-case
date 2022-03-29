<template>
  <div class="staff layout">
    <my-header :title="$route.meta.title" :menus="$store.state.atTmenus"></my-header>
    <div class="layout-content">
      <div class="journal-form" style="margin-bottom:18px">
        <el-button type="primary" @click="add">新 增</el-button>
        <el-button type="primary" @click="reset">重 置</el-button>
      </div>
      <div class="table" style="height: calc(100% - 50px);">
        <el-table :data="rows" border style="width: 100%" stripe>
          <!-- <el-table-column align="center" type="index" label="序号" width="100"></el-table-column> -->
          <el-table-column align="center" prop="staffOrder" label="排序序号" width="100"></el-table-column>
          <el-table-column align="center" :formatter="PFormatterCommon" prop="staffDept" width="200" label="部门"></el-table-column>
          <el-table-column align="center" :formatter="PFormatterCommon" prop="staffName" label="姓名"></el-table-column>
          <el-table-column align="center" :formatter="PFormatterCommon" prop="staffLocation" label="打卡地点"></el-table-column>
          <el-table-column align="center" :formatter="PFormatterCommon" prop="staffTime" label="打卡时间"></el-table-column>
          <el-table-column width="150px" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click.stop="toUpdate(scope.row)">编辑</el-button>
              <el-button type="text" class="delect" @click="toDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="addModal" width="400px" :title="dialogTitle" @close="closeAddModal" class="screen-within-dialog">
      <s-form ref="form" labelWidth="100px" :data.sync="form" :rules="formRule" :components="components"></s-form>
      <div class="sd-footer" slot="footer">
        <el-button @click="closeAddModal">取 消</el-button>
        <el-button type="primary" @click="actionAction">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const times = [
  { name: '09:00', value: '09:00' },
  { name: '09:30', value: '09:30' },
  { name: '10:00', value: '10:00' },
  { name: '10:30', value: '10:30' }
]
const depts = [{ 'name': 'GIS', 'value': 'GIS' }, { 'name': 'MIS', 'value': 'MIS' }, { 'name': 'UED设计部', 'value': 'UED设计部' }, { 'name': 'BC', 'value': 'BC' }, { 'name': '工程部', 'value': '工程部' }, { 'name': '解决方案部', 'value': '解决方案部' }, { 'name': '财务部', 'value': '财务部' }, { 'name': '人力资源部', 'value': '人力资源部' }, { 'name': '市场部', 'value': '市场部' }, { 'name': '宜昌分公司', 'value': '宜昌分公司' }, { 'name': '苏州分公司', 'value': '苏州分公司' }, { 'name': '东营分公司', 'value': '东营分公司' }, { 'name': '天津公司', 'value': '天津公司' }, { 'name': '研发部', 'value': '研发部' }, { 'name': '天津DI部', 'value': '天津DI部' }, { 'name': '天津产品部', 'value': '天津产品部' }, { 'name': '天津工程部', 'value': '天津工程部' }, { 'name': '天津行政部', 'value': '天津行政部' }]
export default {
  name: 'Staff',
  path: '/staff',
  title: '员工管理',
  isComponent: false,
  data () {
    return {
      componentName: 'staff',
      isPage: false,
      rows: [],
      addModal: false,
      isDetail: false,
      editId: '',
      form: {
        staffOrder: '',
        staffName: '',
        staffDept: '',
        staffTime: '',
        staffLocation: ''
      },
      formRule: {
        staffOrder: { required: true },
        staffName: { required: true },
        staffDept: { required: true },
        staffTime: { required: true },
        staffLocation: { required: true }
      },
      components: [
        { name: 'SInput', label: '序号', key: 'staffOrder' },
        { name: 'SSelect', label: '部门', key: 'staffDept', items: depts },
        { name: 'SInput', label: '姓名', key: 'staffName' },
        { name: 'SSelect', label: '打卡时间', key: 'staffTime', items: times },
        { name: 'SInput', label: '打卡地点', key: 'staffLocation' }
      ],
      editFlag: false
    }
  },
  computed: {
    dialogTitle () {
      return this.isDetail ? '查看' : (this.editId ? '编辑' : '新增')
    }
  },
  created () {
    this.load()
  },
  methods: {
    reset () {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      return this.$http.request({
        method: 'get',
        url: `/api/botostaff/reset`
      }).then((res) => {
        setTimeout(() => {
          loading.close()
        }, 1000)
        if (!res) return []
        let data = res.data.data || []
        this.rows = data
      })
    },
    async load () {
      this.rows = await this.$biz.initUser(true)
    },
    add () {
      this.addModal = true
      this.editId = ''
    },
    async toUpdate (row) {
      this.form = this.PDataToForm(row, this.form)
      this.editId = row.staffId
      this.addModal = true
    },
    toDelete (row) {
      this.$confirm('您确认要删除该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.request({
          method: 'post',
          url: `/api/botostaff/delect/` + row.staffId
        }).then((res) => {
          if (res.data.code !== 200) return
          this.$message.success('删除成功')
          this.load(1)
        })
      })
    },
    closeAddModal () {
      this.isDetail = false
      this.addModal = false
      this.$refs.form.resetComponent()
      this.$refs.form.clearFields()
      this.editId = ''
    },
    actionAction () {
      this.$refs.form.validate((valid) => {
        let data = this.PFormToData(this.form)
        this.$http.request({
          method: 'post',
          url: this.editId ? `/api/botostaff/update/${this.editId}` : `/api/botostaff/add`,
          data
        }).then((res) => {
          if (res.data.code !== 200) {
            this.$message.info(res.data.message)
            return
          }
          this.$message.success(this.editId ? '修改成功' : '添加成功')
          this.load(1)
          this.closeAddModal()
        })
      })
    }
  }
}
</script>
