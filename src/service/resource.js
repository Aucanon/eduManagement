import request from '@/utils/request'

// 获取所有资源
export const getAllResource = () => request({ method: 'GET', url: '/boss/resource/getAll' })

// 按条件分页查询资源接口
export const getResourcePages = (data) => request({ method: 'POST', url: '/boss/resource/getResourcePages', data })

// 查询资源分类列表接口
export const getResourceCategories = () => request({ method: 'GET', url: '/boss/resource/category/getAll' })

// 保存或更新资源接口
export const addOrUpdateResource = (data) => request({ method: 'POST', url: '/boss/resource/saveOrUpdate', data })

// 删除资源
export const deleteResource = (id) => request({ method: 'DELETE', url: `/boss/resource/${id}` })

// 查询资源分配列表
export const getAllCategory = () => request({ method: 'GET', url: '/boss/resource/category/getAll' })

// 保存或更新资源分类
export const saveOrUpdateCategory = (data) => request({ method: 'POST', url: '/boss/resource/category/saveOrderUpdate', data })

// 删除资源分类
export const deleteCategory = (id) => request({ method: 'DELETE', url: `/boss/resource/category/${id}` })

// 获取角色拥有的资源列表
export const getRoleSource = (roleId) => request({ method: 'GET', url: `/boss/resource/getRoleResources?roleId=${roleId}` })

// 给角色分配资源
export const allocRoleSource = (data) => request({ method: 'POST', url: '/boss/resource/allocateRoleResources', data })
