<template>
  <div class="course-image">
    <el-form-item :label="label">
      <el-progress
        type="circle"
        :percentage="percentage"
        :width="178"
        v-if="isUpLoading"
        :status="percentage === 100 ? 'success' : undefined">
      </el-progress>
      <el-upload
        v-else
        class="avatar-uploader"
        :on-success="handleAvatarSuccess"
        :file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload">
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/service/course'

export default {
  name: 'CourseImage',
  data () {
    return {
      isUpLoading: false,
      percentage: 0
    }
  },
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
    async handleUpload (option) {
      this.isUpLoading = true
      // option.file 为上传文件的信息
      // 使用 FormData 处理对象
      const fd = new FormData()
      fd.append('file', option.file)
      const { data } = await uploadCourseImage(fd, event => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        // this.course.courseListImg = data.data.name
        this.$emit('input', data.data.name)
        this.isUpLoading = false
        this.percentage = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  ::v-deep .avatar-uploader .el-upload:hover {
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
