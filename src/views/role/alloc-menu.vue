<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
      ref="menu-tree"
      node-key="id"
      :data="menus"
      :props="defaultProps"
      @node-click="handleNodeClick"
      show-checkbox
      default-expand-all
      :default-checked-keys="checkedKeys">
    </el-tree>
    <div style="margin: 20px;">
      <el-button @click="onReset">清空</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/service/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('保存成功！')
        this.$router.push({ name: 'role' })
      }
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    // 数据筛选 （筛选被选中菜单项的 ID）
    getCheckedKeys (menus) {
      // 遍历数据 将所有存在子节点的 node 排除 对子节点列表进行筛选
      menus.forEach(menu => {
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          // 对子节点进行选中状态检测
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 说明选中的是叶子节点 并存储 ID
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
