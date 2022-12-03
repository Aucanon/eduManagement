import request from '@/utils/request'

// 获取编辑页面菜单信息
export const getEditMenuInfo = (id) => request({ method: 'GET', url: `/boss/menu/getEditMenuInfo?id=${id}` })

// 添加菜单
export const createOrUpdateMenu = (data) => request({ method: 'POST', url: 'boss/menu/saveOrUpdate', data })

// 获取所有菜单
export const getAllMenus = () => request({ method: 'GET', url: '/boss/menu/getAll' })

// 删除菜单
export const deleteMenu = (id) => request({ method: 'DELETE', url: `/boss/menu/${id}` })

// 获取所有菜单并按层级展示
export const getMenuNodeList = () => request({ method: 'GET', url: '/boss/menu/getMenuNodeList' })

// 给角色分配菜单
export const allocateRoleMenus = (data) => request({ method: 'POST', url: '/boss/menu/allocateRoleMenus', data })

// 获取角色拥有的菜单列表
export const getRoleMenus = (roleId) => request({ method: 'GET', url: `/boss/menu/getRoleMenus?roleId=${roleId}` })
