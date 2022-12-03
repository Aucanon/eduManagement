<template>
  <div class="resource-list">
    <el-card class="box-class">
      <div class="clearfix" slot="header">
        <el-form
        :inline="true"
        :model="form"
        class="demo-form-inline"
        ref="form">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
              <el-option
              v-for="item in resourceCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="onReset">重置</el-button>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button size="mini" @click="handleAdd">添加</el-button>
      <el-button size="mini" @click="$router.push({ name: 'resource-category' })">资源分类</el-button>
      <el-table
        v-loading="isLoading"
        :data="resources"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径"
          align="center">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          align="center">
        </el-table-column>
        <el-table-column
          label="添加时间"
          align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="isEdit ? '编辑分类' : '添加分类'" :visible.sync="dialogFormVisible" :before-close="closeHandler" width="400px">
      <el-form :model="resourceForm" ref="resourceForm" label-position="right" label-width="80px">
        <el-form-item label="资源名称" prop="name">
          <el-col :span="20">
            <el-input v-model="resourceForm.name" size="mini" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-col :span="20">
            <el-input v-model="resourceForm.url" size="mini" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="resourceForm.categoryId" size="mini" clearable>
            <el-option
            v-for="item in resourceCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-col :span="20">
            <el-input v-model="resourceForm.description" type="textarea" size="mini" clearable></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateResource">确 定</el-button>
      </div>
    </el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 15, 20]"
        :page-size=form.size
        layout="total, sizes, prev, pager, next, jumper"
        :total=totalCount
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories, addOrUpdateResource, deleteResource } from '@/service/resource'

export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        current: 1,
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      resources: [],
      totalCount: 0,
      resourceCategory: {},
      isLoading: false,
      gridData: [],
      dialogFormVisible: false,
      resourceForm: {
        id: null,
        name: '',
        categoryId: 0,
        url: '',
        description: ''
      },
      isEdit: false
    }
  },
  methods: {
    onSubmit () {
      this.form.current = 1
      this.loadResource()
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    async loadResource () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategory = data.data
      }
    },
    async addOrUpdateResource () {
      const { data } = await addOrUpdateResource(this.resourceForm)
      if (data.code === '000000') {
        this.loadResource()
        this.dialogFormVisible = false
        this.$refs.resourceForm.resetFields()
      }
    },
    closeHandler () {
      this.dialogFormVisible = false
      this.$refs.resourceForm.resetFields()
    },
    handleAdd () {
      this.isEdit = false
      this.dialogFormVisible = true
    },
    handleEdit (row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.resourceForm.id = row.id
      this.resourceForm.name = row.name
      this.resourceForm.url = row.url
      this.resourceForm.categoryId = row.categoryId
      this.resourceForm.description = row.description
    },
    async handleDelete (row) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteResource(row.id)
        if (data.code === '000000') {
          this.loadResource()
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
    },
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.loadResource(this.form)
    },
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResource(this.form)
    }
  },
  created () {
    this.loadResource()
    this.loadResourceCategories()
  },
  filters: {
    dataFormat (date) {
      date = new Date(date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : `0${n}`
      }
      return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
