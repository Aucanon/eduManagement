<template>
  <div class="edit-advert">
    <el-card style="padding:20px">
      <el-form label-width="80px" :rules="rules" :model="adverts">
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="adverts.name"></el-input>
        </el-form-item>
        <el-form-item label="广告位置" prop="spaceId">
          <el-select v-model="adverts.spaceId" placeholder="请选择">
            <el-option value="1">1</el-option>
            <el-option value="2">2</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="adverts.startTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="endTime">
          <el-date-picker
            v-model="adverts.endTime"
            type="datetime"
            placeholder="选择到期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上线/下线">
          <el-radio v-model="adverts.status" :label="0">下线</el-radio>
          <el-radio v-model="adverts.status" :label="1">上线</el-radio>
        </el-form-item>
        <el-form-item label="广告图片" prop="img">
          <el-upload
            action
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :http-request="handleUpload">
            <img v-if="adverts.img" :src="adverts.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告链接" prop="link">
          <el-input v-model="adverts.link"></el-input>
        </el-form-item>
        <el-form-item label="广告备注" prop="text">
          <el-input v-model="adverts.text" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { uploadImage, saveOrUpdateAdvert } from '@/service/advert'

export default {
  name: 'EditAdvert',
  data () {
    return {
      adverts: {
        id: null,
        name: '',
        spaceId: 0,
        keyword: '',
        htmlContent: '',
        text: '',
        img: '',
        link: '',
        startTime: '',
        endTime: '',
        createTime: '',
        updateTime: '',
        status: 0,
        priority: 0,
        startTimeFormatString: '',
        endTimeFormatString: ''
      },
      isUpLoading: false,
      limit: 2,
      rules: {
        name: [
          { required: true, message: '请输入广告名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        startTime: { required: true, message: '请输入开始时间', trigger: 'blur' },
        endTime: { required: true, message: '请输入到期时间', trigger: 'blur' },
        link: { required: true, message: '请输入广告链接', trigger: 'blur' }
      }
    }
  },
  created () {
    this.loadAdert()
  },
  methods: {
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    async handleUpload (option) {
      this.isUpLoading = true
      // option.file 为上传文件的信息
      // 使用 FormData 处理对象
      const fd = new FormData()
      fd.append('file', option.file)
      const { data } = await uploadImage(fd)
      if (data.state === 1) {
        this.adverts.img = data.content.name
        this.isUpLoading = false
      }
    },
    loadAdert () {
      this.adverts.id = this.$route.query.id
      this.adverts.name = this.$route.query.name
      this.adverts.spaceId = this.$route.query.spaceId
      this.adverts.img = this.$route.query.img
      this.adverts.link = this.$route.query.link
      this.adverts.text = this.$route.query.text
      this.adverts.startTime = this.$route.query.startTime
      this.adverts.endTime = this.$route.query.endTime
      this.adverts.status = this.$route.query.status
    },
    onSubmit () {
      this.$confirm('是否提交数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await saveOrUpdateAdvert(this.adverts)
        console.log(data)
        if (data.state === 1) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.$router.push({ name: 'advert' })
        }
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
  ::v-deep.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
