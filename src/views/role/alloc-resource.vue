<template>
  <div class="alloc-resource">
    <el-card>
      <div style="border-top: 1px solid #dcdfe6;" v-for="item in categoryList" :key="item.id">
        <el-row style="background-color: rgb(242, 246, 252);">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ item.name }}</el-checkbox>
        </el-row>
        <el-row>
          <el-checkbox-group v-model="checkedKeys" @change="handleCheckedKeysChange">
            <!-- <el-col :span="8"> -->
            <el-checkbox v-for="source in cateSource(item.id)" :label="source.id" :key="source.id" style="width:30%">
                {{source.name}}
            </el-checkbox>
            <!-- </el-col> -->
          </el-checkbox-group>
        </el-row>
      </div>
      <div class="btn">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onReset">清空</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllResource, getResourceCategories, getRoleSource, allocRoleSource } from '@/service/resource'

export default {
  name: 'AllocResource',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      checkAll: false,
      sourceList: [],
      categoryList: [],
      // roleResource: [],
      checkedKeys: [],
      isIndeterminate: true
    }
  },
  created () {
    this.loadAllResource()
    this.loadResourceCategory()
    this.loadRoleResource()
  },
  methods: {
    cateSource (categryId) {
      let arr = []
      this.sourceList.forEach(source => {
        if (source.categoryId === categryId) {
          arr = [...arr, source]
        }
      })
      return arr
    },
    handleCheckAllChange (val) {
      // console.log(val)
      this.checkedKeys = val ? this.sourceList : []
      this.isIndeterminate = false
    },
    handleCheckedKeysChange (value) {
      console.log(value)
      this.checkedKeys = value
      const checkedCount = value.length
      this.checkAll = checkedCount === this.sourceList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.sourceList.length
    },
    getCheckedKeys (resources) {
      // 遍历数据 将所有存在子节点的 node 排除 对子节点列表进行筛选
      resources.forEach(resource => {
        if (!resource.selected) {
          return
        }
        // 检测是否存在子节点
        if (resource.resourceList) {
          // 对子节点进行选中状态检测
          return this.getCheckedKeys(resource.resourceList)
        }
        // 说明选中的是叶子节点 并存储 ID
        this.checkedKeys = [...this.checkedKeys, resource.id]
      })
    },
    async loadAllResource () {
      const { data } = await getAllResource()
      if (data.code === '000000') {
        this.sourceList = data.data
      }
    },
    async loadResourceCategory () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.categoryList = data.data
      }
    },
    async loadRoleResource () {
      const { data } = await getRoleSource(this.roleId)
      if (data.code === '000000') {
        // this.roleResource = data.data
        this.getCheckedKeys(data.data)
      }
    },
    async onSave () {
      const { data } = await allocRoleSource({
        roleId: this.roleId,
        resourceIdList: this.checkedKeys
      })
      if (data.code === '000000') {
        this.$message.success('保存成功！')
        this.$router.push({ name: 'role' })
      }
    },
    onReset () {
      this.checkedKeys = []
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    padding: 20px;
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
  }
  .el-col {
    padding: 4px 0;
  }
  .btn {
    text-align: center;
    margin-top: 20px;
  }
</style>
