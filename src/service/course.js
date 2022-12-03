import request from '@/utils/request'

// 分页查询课程信息
export const getQueryCourses = (data) => request({ method: 'POST', url: '/boss/course/getQueryCourses', data })

// 课程上下架接口
export const changeState = (params) => request({ method: 'GET', url: '/boss/course/changeState', params })

// 保存或更新课程信息
export const saveOrUpdateCourse = (data) => request({ method: 'POST', url: '/boss/course/saveOrUpdateCourse', data })

// 上传图片接口
export const uploadCourseImage = (data, onUploadProgress) => request({ method: 'POST', url: '/boss/course/upload', data, onUploadProgress })

// 通过课程 ID 获取课程信息接口
export const getCourseById = (courseId) => request({ method: 'GET', url: `/boss/course/getCourseById?courseId=${courseId}` })

// 获取章节和课程接口
export const getSectionAndLesson = (courseId) => request({ method: 'GET', url: `/boss/course/section/getSectionAndLesson?courseId=${courseId}` })

// 新增或更新章节
export const saveOrUpdateSection = (data) => request({ method: 'POST', url: '/boss/course/section/saveOrUpdateSection', data })

// 新增或更新课时
export const saveOrUpdateLesson = (data) => request({ method: 'POST', url: '/boss/course/lesson/saveOrUpdate', data })
