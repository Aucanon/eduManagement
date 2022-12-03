<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create' })">添加菜单</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="编号"
          type="index"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="菜单级数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="icon"
          label="前端图标"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="180"
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
    </el-card>
  </div>
</template>

<script>
import { getAllMenus, deleteMenu } from '@/service/menu'
export default {
  name: 'MenuIndex',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    handleEdit (row) {
      this.$router.push({
        name: 'menu-eidt',
        params: {
          id: row.id
        }
      })
    },
    handleDelete (row) {
      this.$confirm('确认删除？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteMenu(row.id)
        if (data.code === '000000') {
          this.loadAllMenus()
        }
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
