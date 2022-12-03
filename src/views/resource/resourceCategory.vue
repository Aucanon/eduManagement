<template>
  <div class="resourceCategory">
    <el-card>
      <el-button size="mini" @click="handleAdd">添加</el-button>
      <el-table
        :data="category">
        <el-table-column
          prop="id"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          label="操作">
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
      <el-dialog :title="isEdit ? '编辑分类' : '添加分类'" :visible.sync="dialogFormVisible" :before-close="closeHandler" width="500px">
      <el-form :model="gridData" ref="gridData" label-position="right" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="gridData.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="gridData.sort" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeHandler">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getAllCategory, saveOrUpdateCategory, deleteCategory } from '@/service/resource'
export default {
  name: 'ResourceCategory',
  data () {
    return {
      category: {},
      gridData: {
        id: null,
        name: '',
        sort: 0
      },
      dialogFormVisible: false,
      isEdit: false
    }
  },
  created () {
    this.loadAllCategory()
  },
  methods: {
    async loadAllCategory () {
      const { data } = await getAllCategory()
      if (data.code === '000000') {
        this.category = data.data
      }
    },
    async onSubmit () {
      const { data } = await saveOrUpdateCategory(this.gridData)
      if (data.code === '000000') {
        this.loadAllCategory()
        this.closeHandler()
      }
    },
    handleAdd () {
      this.isEdit = false
      this.dialogFormVisible = true
    },
    handleEdit (row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.gridData.name = row.name
      this.gridData.sort = row.sort
      this.gridData.id = row.id
    },
    handleDelete (row) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteCategory(row.id)
        if (data.code === '000000') {
          this.loadAllCategory()
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
    closeHandler () {
      this.dialogFormVisible = false
      this.$refs.gridData.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
