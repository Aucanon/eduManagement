import request from '@/utils/request'

// 获取阿里云图片上传凭证
export const aliyunImagUploadAddressAndnAuth = () => request({ method: 'GET', url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json' })

// 获取阿里云视频上传凭证
export const aliyunVideoUploadAddressAndnAuth = (params) => request({ method: 'GET', url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json', params })

// 阿里云转码请求
export const aliyunTranscode = (data) => request({ method: 'POST', url: '/boss/course/upload/aliyunTransCode.json', data })

// 阿里云转码进度
export const aliyunTransCodePercent = (lessonId) => request({ method: 'GET', url: `/boss/course/upload/aliyunTransCodePercent.json?lessonId=${lessonId}` })
