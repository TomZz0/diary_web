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
        <el-table-column prop="staCode" label="测站码" width="180" />
        <el-table-column prop="staName" label="测站名" width="180" />
        <el-table-column prop="staSort" label="测站类型" width="180" />
        <el-table-column prop="address" label="测站地址" width="300" />
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
    <!--    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="clearForm">-->
    <!--      <el-form :model="staForm" ref="staFormRef" :rules="rules">-->
    <!--        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">-->
    <!--          <el-input v-model="userForm.username" autocomplete="off" placeholder="用户名" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">-->
    <!--          <el-input v-model="userForm.password" autocomplete="off" placeholder="密码" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">-->
    <!--          <el-input v-model="userForm.email" autocomplete="off" placeholder="邮箱" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="角色" :label-width="formLabelWidth">-->
    <!--          <el-select v-model="userForm.roleName" placeholder="请选择角色">-->
    <!--            &lt;!&ndash; 下拉框选项 &ndash;&gt;-->
    <!--            <el-option label="admin" value="admin" />-->
    <!--            <el-option label="vip" value="vip" />-->
    <!--            <el-option label="user" value="user" />-->
    <!--            &lt;!&ndash; 添加更多选项 &ndash;&gt;-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogFormVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="addUser">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>
<script>
import dataApi from '@/api/sta.js'
export default {
  data() {
    return {
      formLabelWidth: '130px',
      title: '',
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      staList: [],
      dialogFormVisible: false,
      staForm: {
        obj_code: '',
        staCode: '',
        staName: '',
        staPro: ''
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
      }]
    }
  },
  mounted() {
    this.getStaList()
  },
  methods: {
    // clearForm() {
    //   this.userForm = {}
    //   this.$refs.userFormRef.clearValidate()
    // },
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
        console.log(response.data)
        this.total = response.data.total
        this.staList = response.data.records
      })
    }
    // openAddUI() {
    //   this.title = '新增用户'
    //   this.dialogFormVisible = true
    // },
    // addUser() {
    //   this.$refs.userFormRef.validate((valid) => {
    //     if (valid) {
    //       userApi.addUser(this.userForm).then(response => {
    //         this.$message({
    //           message: response.msg,
    //           type: 'success'
    //         })
    //         this.dialogFormVisible = false
    //         this.getUserList()
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    //
    // }
  }
}
</script>

<style scoped>

</style>
