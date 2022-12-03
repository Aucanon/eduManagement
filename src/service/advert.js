import request from '@/utils/request'

// 获取所有广告列表
export const getAdvertList = () => request({ method: 'GET', url: '/front/ad/getAdList' })

// 获取所有广告位
export const getAllSpaces = () => request({ method: 'GET', url: '/front/ad/space/getAllSpaces' })

// 更新广告状态
export const updateAdvertStatus = (params) => request({ method: 'GET', url: '/front/ad/updateStatus', params })

// 根据 ID 获取广告位
export const getSpacesById = (id) => request({ method: 'GET', url: `/front/ad/space/getSpaceById?id=${id}` })

// 上传图片
export const uploadImage = (data) => request({ method: 'POST', url: '/front/upload/img', data })

// 新增或修改广告信息
export const saveOrUpdateAdvert = (data) => request({ method: 'POST', url: '/front/ad/saveOrUpdate', data })

// 新增或修改广告位
export const saveOrUpdate = (data) => request({ method: 'POST', url: '/front/ad/space/saveOrUpdate', data })
