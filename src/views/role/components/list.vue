<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-position="right" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" clearable placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" v-loading="isLoading">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
      <el-button @click="dialogVisible = true">添加角色</el-button>
      <el-table
        v-loading="isLoading"
        :data="roles"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <div>
              <el-button
              type="text"
              @click="$router.push({
                name: 'alloc-menu',
                params: {
                  roleId: scope.row.id
                }
              })">分配菜单</el-button>
              <el-button
              type="text"
              @click="$router.push({
                name: 'alloc-resource',
                params: {
                  roleId: scope.row.id
                }
              })">分配资源</el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="closeHandler">
        <el-form :model="gridData" ref="gridData" label-position="right" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="gridData.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="gridData.code" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input type="textarea" v-model="gridData.description" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeHandler">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { geteRoles, deleteRole, addOrUpdateRole } from '@/service/role'

export default {
  name: 'RoleList',
  data () {
    return {
      form: {
        name: ''
      },
      isLoading: false,
      roles: [],
      isEdit: false,
      dialogVisible: false,
      gridData: {
        id: null,
        code: '',
        name: '',
        description: ''
      }
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await geteRoles(this.form)
      if (data.code === '000000') {
        this.roles = data.data.records
        this.isLoading = false
      }
    },
    onReset () {
      this.$refs.form.resetFields()
      this.form.name = ''
      this.loadRoles()
    },
    onSearch () {
      this.loadRoles()
    },
    async onSubmit () {
      const { data } = await addOrUpdateRole(this.gridData)
      if (data.code === '000000') {
        this.loadRoles()
        this.closeHandler()
      }
    },
    closeHandler () {
      this.dialogVisible = false
      this.$refs.gridData.resetFields()
    },
    handleEdit (row) {
      this.isEdit = true
      this.dialogVisible = true
      this.gridData.id = row.id
      this.gridData.name = row.name
      this.gridData.code = row.code
      this.gridData.description = row.description
    },
    handleDelete (row) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteRole(row.id)
        if (data.code === '000000') {
          this.loadRoles()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
