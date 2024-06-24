<template>
  <div>
    <el-card id="search">

      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.username" placeholder="用户名" clearable/>
          <el-input v-model="searchModel.email" placeholder="邮箱" clearable/>
          <el-button type="primary" round icon="el-icon-search" @click="getUserList">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle @click="openAddUI"/>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column label="#" width="180">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>

        </el-table-column>
        <el-table-column prop="id" label="用户id" width="180"/>
        <el-table-column prop="username" label="用户名" width="180"/>
        <el-table-column prop="roleName" label="角色"/>
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openModifyUI(scope.row)" type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button @click="deleteUser(scope.row.id)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
    <!--新增对话框-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="clearForm">
      <el-form :model="userForm" ref="userFormRef" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" autocomplete="off" placeholder="密码"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off" placeholder="邮箱"/>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="userForm.roleName" placeholder="请选择角色">
            <!-- 下拉框选项 -->
            <el-option label="admin" value="admin"/>
            <el-option label="vip" value="vip"/>
            <el-option label="user" value="user"/>
            <!-- 添加更多选项 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改对话框-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible2" @close="clearForm">
      <el-form :model="userForm" ref="userFormRef" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="userForm.username" autocomplete="off" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="userForm.password" autocomplete="off" placeholder="密码"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off" placeholder="邮箱"/>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="userForm.roleName" placeholder="请选择角色">
            <!-- 下拉框选项 -->
            <el-option label="admin" value="admin"/>
            <el-option label="vip" value="vip"/>
            <el-option label="user" value="user"/>
            <!-- 添加更多选项 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/userManage'
import row from "element-ui/packages/row";

export default {
  computed: {
    row() {
      return row
    }
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      var format = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
      if (!format.test(value)) {
        return callback(new Error('邮箱格式错误'))
      }
      callback()
    }
    return {
      formLabelWidth: '130px',
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      userForm: {
        id: '',
        username: '',
        password: '',
        email: '',
        roleName: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到10个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入电子邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.getUserList()

  },
  methods: {
    clearForm() {
      this.userForm = {}
      this.$refs.userFormRef.clearValidate()
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo
      this.getUserList()
    },
    getUserList() {
      userApi.getUserList(this.searchModel).then(response => {
        this.total = response.data.total
        this.userList = response.data.data
      })
    },
    openAddUI() {
      this.title = '新增用户'
      this.dialogFormVisible = true
    },
    openModifyUI(row) {
      // this.userForm.username = row.username
      // this.userForm.password = row.password
      // this.userForm.email = row.email
      // this.userForm.roleName = row.roleName
      this.userForm.id = row.id
      this.title = '修改用户'
      this.dialogFormVisible2 = true
    },
    addUser() {
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          userApi.addUser(this.userForm).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getUserList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    modifyUser() {
      this.$refs.userFormRef.validate((valid) => {
        if (valid) {
          userApi.modifyUser(this.userForm).then(response => {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.dialogFormVisible2 = false
            this.getUserList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteUser(id) {
      userApi.deleteUser(id).then(response => {
        this.getUserList()
      })
    }
  }
}
</script>

<style scoped>
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>
