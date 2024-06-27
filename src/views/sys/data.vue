<template>
  <div>
    <el-card id="search">

      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.staCode" placeholder="测站码" clearable style="width: 200px;" />
          <el-input v-model="searchModel.staName" placeholder="测站名" clearable style="width: 200px;" />
          <el-select v-model="searchModel.staSort" placeholder="请选择">
            <el-option
              v-for="item in sort"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" round icon="el-icon-search" @click="getStaList">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openAddUI" />
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table :data="staList" stripe style="width: 100%">
        <el-table-column label="#" width="180">
          <template slot-scope="scope">
            {{ (searchModel.pageNo-1)*searchModel.pageSize + scope.$index + 1 }}
          </template>

        </el-table-column>
        <el-table-column prop="staCode" label="测站码" width="100" />
        <el-table-column prop="staName" label="测站名" width="100" />
        <el-table-column prop="staSort" label="测验项目类型" width="150" />
        <el-table-column prop="address" label="测站地址" width="150" />
        <el-table-column prop="riverName" label="河流名称" width="150" />
        <el-table-column prop="buildTime" label="建站时间" width="150" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openModifyUI(scope.row)">修改</el-button>
            <el-button v-if="isAdmin===1" type="danger" icon="el-icon-delete" size="mini" @click="deleteSta(scope.row.staCode)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页条-->
    <el-pagination
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--    增加测站条-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible1" @close="clearForm">
      <el-form ref="staFormRef" :model="staForm" :rules="rules">
        <el-form-item label="对象编码" prop="objCode" :label-width="formLabelWidth">
          <el-input v-model="staForm.objCode" autocomplete="off" placeholder="对象编码" />
        </el-form-item>
        <el-form-item label="测站编码" prop="staCode" :label-width="formLabelWidth">
          <el-input v-model="staForm.staCode" autocomplete="off" placeholder="测站编码" />
        </el-form-item>
        <el-form-item label="测站名称" prop="staName" :label-width="formLabelWidth">
          <el-input v-model="staForm.staName" autocomplete="off" placeholder="测站名称" />
        </el-form-item>
        <el-form-item label="河流名称" prop="riverName" :label-width="formLabelWidth">
          <el-input v-model="staForm.riverName" autocomplete="off" placeholder="河流名称" />
        </el-form-item>
        <el-form-item label="测站地址" prop="address" :label-width="formLabelWidth">
          <el-input v-model="staForm.address" autocomplete="off" placeholder="测站地址" />
        </el-form-item>
        <el-form-item label="测站类型" prop="staSort" :label-width="formLabelWidth">
          <el-select v-model="staForm.staSort" placeholder="请选择角色">
            <el-option
              v-for="item in sort"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible2" @close="clearForm">
      <el-form ref="staFormRef" :model="staForm" :rules="rules">
        <el-form-item label="测站名称" prop="staName" :label-width="formLabelWidth">
          <el-input v-model="staForm.staName" autocomplete="off" placeholder="测站名称" />
        </el-form-item>
        <el-form-item label="测站地址" prop="address" :label-width="formLabelWidth">
          <el-input v-model="staForm.address" autocomplete="off" placeholder="测站地址" />
        </el-form-item>
        <el-form-item label="测站类型" prop="staSort" :label-width="formLabelWidth">
          <el-select v-model="staForm.staSort" placeholder="请选择角色">
            <el-option
              v-for="item in sort"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="modifySta">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dataApi from '@/api/sta.js'
import userApi from '@/api/userManage'
import logApi from '@/store/modules/user'
import { data } from 'autoprefixer'
import sta from '@/api/sta.js'
export default {
  data() {
    return {
      isAdmin: 0,
      formLabelWidth: '130px',
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      staList: [],
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      staForm: {
        objCode: '',
        staCode: '',
        staName: '',
        staSort: '',
        riverName: '',
        buildTime: ''
      },
      sort: [{
        value: '',
        label: '无'
      }, {
        value: '水质站',
        label: '水质站'
      }, {
        value: '水位站',
        label: '水位站'
      }, {
        value: '水文站',
        label: '水文站'
      }, {
        value: '蒸发站',
        label: '蒸发站'
      }, {
        value: '墒情站',
        label: '墒情站'
      }, {
        value: '雨量站',
        label: '雨量站'
      }],
      rules: {
        objCode: [
          { required: true, message: '请输入对象编码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到10个字符', trigger: 'blur' }
        ],
        staName: [
          { required: true, message: '请输入测站名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到10个字符', trigger: 'blur' }
        ],
        staCode: [
          { required: true, message: '请输入测站编码', trigger: 'blur' },
          { min: 8, max: 8, message: '长度8个字符', trigger: 'blur' }
        ],
        riverName: [
          { required: true, message: '请输入河流名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 2 到10个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入测站地址', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getStaList()
  },
  methods: {
    clearForm() {
      this.staForm = {}
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getStaList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getStaList()
    },
    getStaList() {
      dataApi.getStaList(this.searchModel).then(response => {
        this.total = response.data.total
        this.staList = response.data.records
      })
      userApi.getInfo(logApi.state.token).then(response => {
        this.isAdmin = response.data.roles[0] === 'user' ? 0 : 1
      })
    },
    openAddUI() {
      this.title = '新增测站'
      this.dialogFormVisible1 = true
    },
    addUser() {
      dataApi.addSta(this.staForm).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.dialogFormVisible1 = false
        this.getStaList()
      })
    },
    openModifyUI(row) {
      this.staForm.staCode = row.staCode
      this.staForm.staSort = row.staSort
      this.staForm.objCode = row.objCode
      this.staForm.riverName = row.riverName
      this.title = '修改测站'
      this.dialogFormVisible2 = true
    },
    modifySta() {
      dataApi.modifySta(this.staForm).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        })
        this.dialogFormVisible2 = false
        this.getStaList()
      })
    },
    deleteSta(staCode) {
      this.$confirm('确认永久删除该测站？后果自负！', '删除提示', {
        iconClass: 'el-icon-question', // 自定义图标样式
        confirmButtonText: '确认删除', // 确认按钮文字
        cancelButtonText: '取消', // 取消按钮文字
        showClose: true, // 是否显示右上角关闭按钮
        type: 'warning' // 提示类型  success/info/warning/error
      }).then(res => { // 选择确认按钮进入此方法
        // 确认操作
        alert('确认')
        dataApi.deleteSta(staCode).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.getStaList()
        })
      }).catch(() => { // 选择取消按钮进入此方法
        alert('取消')
      })
    }
  }
}
</script>

<style scoped>

</style>
