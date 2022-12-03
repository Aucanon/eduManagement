<template>
  <div class="advert-space-list">
    <el-card>
      <el-button
      size="mini"
      @click="$router.push({ name: 'advert-space-create' })">
      添加广告位</el-button>
      <el-table
        v-loading="isLoading"
        :data="advertSpace"
        style="width: 100%">
        <el-table-column
          prop="spaceKey"
          label="spaceKey"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告位名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({
                name: 'advert-space-update',
                params: {
                  id: scope.row.id
                },
                query: {
                  name: scope.row.name
                }
              })"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllSpaces } from '@/service/advert'

export default {
  name: 'AdvertSpaceList',
  data () {
    return {
      advertSpace: [],
      isLoading: false
    }
  },
  created () {
    this.loadAdertSpaces()
  },
  methods: {
    async loadAdertSpaces () {
      this.isLoading = true
      const { data } = await getAllSpaces()
      if (data.state === 1) {
        this.advertSpace = data.content
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
