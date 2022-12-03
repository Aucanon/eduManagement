<template>
  <div class="user-list">
    <el-form
    :inline="true"
    :model="filterParams"
    ref="filter-form">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="filterParams.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="rangeDate">
        <el-date-picker
          v-model="filterParams.rangeDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleQuery"
          :disabled="isLoading">查询
        </el-button>
        <el-button
          :disabled="isLoading"
          @click="handleReset">重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
        :data="users"
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="用户ID"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="头像"
          align="center">
          <template slot-scope="scope">
            <img width="30px" style="border-radius: 50%;" :src="scope.row.portrait || 'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="注册时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="状态"
          align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleForbidUser(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible">
        <el-select v-model="roleIdList" multiple placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.value"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAllocRole">确 定</el-button>
        </span>
      </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterParams.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size=filterParams.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=totalCount
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getUserPages, forbidUser } from '@/service/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/service/role'

export default {
  name: 'UserList',
  data () {
    return {
      users: [],
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      totalCount: 0,
      isLoading: true,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentRoleID: null
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      if (data.code === '000000') {
        this.$message.success('禁用成功！')
      } else {
        this.$message.error('暂不提供禁用功能！')
      }
    },
    async handleSelectRole (userInfo) {
      this.currentRoleID = userInfo.id
      this.dialogVisible = true
      const { data } = await getAllRoles()
      if (data.code === '000000') {
        this.roles = data.data
      }
      const { data: data2 } = await getUserRoles(userInfo.id)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: this.currentRoleID,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    },
    handleReset () {
      this.$refs['filter-form'].resetFields()
      this.loadUsers()
    },
    handleQuery () {
      this.filterParams.current = 1
      this.loadUsers()
    },
    handleSizeChange (val) {
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadUsers(this.filterParams)
    },
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.loadUsers(this.filterParams)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
