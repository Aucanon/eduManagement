<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        课程相关信息
      </div>
      <el-form label-position="right" label-width="80px">
        <el-form-item label="课程内容">
          <el-input :value="this.$route.query.theme" disabled></el-input>
        </el-form-item>
        <el-form-item label="课时">
          <el-input :value="this.$route.query.duration" disabled></el-input>
        </el-form-item>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button
          @click="handleUpload">
          开始上传</el-button>
          <el-button
          @click="$router.push({
            name: 'course-section',
            params: {
              courseId
            }
          })">
          返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传中：{{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频{{ isTranscodeSuccess ? '转码完成' : '正在转码中...' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import { aliyunImagUploadAddressAndnAuth, aliyunVideoUploadAddressAndnAuth, aliyunTranscode, aliyunTransCodePercent } from '@/service/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      require: true
    },
    lessonId: {
      type: [Number, String],
      require: true
    }
  },
  data () {
    return {
      imageUrl: '',
      uploader: null,
      videoId: null,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranscodeSuccess: false
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    initUploader () {
      this.uploader = new AliyunUpload.Vod({
        // userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，
        // eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB（100*1024）
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo) => {
          let uploadAdressAndAuth = null
          if (uploadInfo.isImage) {
            const { data } = await aliyunImagUploadAddressAndnAuth()
            if (data.code === '000000') {
              uploadAdressAndAuth = data.data
              this.imageUrl = uploadAdressAndAuth.imageUrl
            }
          } else {
            const { data } = await aliyunVideoUploadAddressAndnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            if (data.code === '000000') {
              uploadAdressAndAuth = data.data
              this.videoId = data.data.videoId
            }
          }
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAdressAndAuth.uploadAuth,
            uploadAdressAndAuth.uploadAddress,
            uploadAdressAndAuth.imageId || uploadAdressAndAuth.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.image) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo) => {
          this.isUploadSuccess = true
          const { data } = await aliyunTranscode({
            lessonId: this.lessonId,
            coverImageUrl: this.imageUrl,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            const timer = setInterval(async () => {
              const { data } = await aliyunTransCodePercent(this.lessonId)
              if (data.code === '000000') {
                if (data.data === 100) {
                  this.isTranscodeSuccess = true
                  this.$message.success('视频转码成功！')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    },
    handleUpload () {
      this.uploadPercent = 0
      this.isTranscodeSuccess = false
      this.isUploadSuccess = false
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      this.uploader.addFile(imageFile)
      this.uploader.addFile(videoFile)
      this.uploader.startUpload()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
