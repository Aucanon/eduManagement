<template>
  <div class="update-advert-space">
    <el-card>
      <el-form :model="newAdvertSpace" :rules="rules" ref="newAdvertSpace" label-position="right" label-width="100px">
        <el-form-item label="广告位名称" prop="name">
          <el-input v-model="newAdvertSpace.name" size="mini" clearable></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="mini" @click="onReset">重置</el-button>
        <el-button size="mini" type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdate } from '@/service/advert'

export default {
  name: 'updateAdvertSpace',
  props: {
    id: {
      type: [Number, String],
      require: true
    }
  },
  data () {
    return {
      newAdvertSpace: {
        name: '',
        id: this.id
      },
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.newAdvertSpace.name = this.$route.query.name
  },
  methods: {
    onReset () {
      this.$refs.newAdvertSpace.resetFields()
    },
    onSubmit () {
      this.$confirm('是否提交数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await saveOrUpdate(this.newAdvertSpace)
        if (data.state === 1) {
          this.$router.push({ name: 'advert-space' })
        }
        this.$message.success('修改成功！')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
