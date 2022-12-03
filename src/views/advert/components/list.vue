<template>
  <div class="advert-list">
    <el-card>
      <el-button
      size="mini"
      @click="$router.push({
        name: 'advert-create'
      })">
      添加广告</el-button>
      <el-table
        v-loading="isLoading"
        :data="advert"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="120"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="spaceName"
          label="广告位置"
          width="150"
          align="center">
          <!-- <template slot-scope="scope">
            {{ getSpaceName(scope.row.spaceId) }}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告图片"
          align="center">
          <template slot-scope="scope">
            <img height="80px" :src="scope.row.img || 'https://edu-lagou.oss-cn-beijing.aliyuncs.com/images/2021/11/10/16365363744812522.png'">
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          align="center">
          <template slot-scope="scope">
            <p>开始时间：{{ scope.row.startTimeFormatString }}</p>
            <p>到期时间：{{ scope.row.endTimeFormatString }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="上线/下线"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleChangeStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({
                name: 'advert-edit',
                query: {
                  id: scope.row.id,
                  name: scope.row.name,
                  spaceId: scope.row.spaceId,
                  img: scope.row.img,
                  link: scope.row.link,
                  text: scope.row.text,
                  startTime: scope.row.startTime,
                  endTime: scope.row.endTime,
                  status: scope.row.status
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
import { getAdvertList, getAllSpaces, updateAdvertStatus, getSpacesById } from '@/service/advert'

export default {
  name: 'AdvertList',
  data () {
    return {
      advert: [],
      isLoading: false
    }
  },
  created () {
    this.loadAdvertList()
    this.loadAdvertspace()
  },
  methods: {
    // async getSpaceName (spaceId) {
    //   const { data } = await getSpacesById(spaceId)
    //   if (data.state === 1) {
    //     return data.content.name
    //   } else {
    //     return '123'
    //   }
    // },
    async loadAdvertList () {
      this.isLoading = true
      const { data } = await getAdvertList()
      if (data.state === 1) {
        this.advert = data.content
        console.log('广告列表', data)
      }
      this.isLoading = false
    },
    async loadAdvertspace () {
      const { data } = await getAllSpaces()
      console.log('广告位', data)
    },
    handleChangeStatus (row) {
      this.$confirm('是否修改上线状态？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await updateAdvertStatus(row)
        if (data.state === 1) {
          this.loadAdvertList()
          this.$message.success('状态修改成功！')
        }
      }).catch(() => {
        this.loadAdvertList()
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
