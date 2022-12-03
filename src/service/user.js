import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export const login = (data) => request({ method: 'POST', url: '/front/user/login', data: qs.stringify(data) })

// 用户基本信息接口
export const getUserInfo = () => request({ method: 'GET', url: '/front/user/getInfo' })

// 用户管理分页查询用户信息
export const getUserPages = (data) => request({ method: 'POST', url: '/boss/user/getUserPages', data })

// 禁用用户
export const forbidUser = (userId) => request({ method: 'POST', url: `/boss/user/forbidUser?userId=${userId}` })
