import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import qs from 'qs' // 处理请求参数格式

// 创建axios实例
const request = axios.create({
  timeout: 2000
})

function geteBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagounews.com'
  } else {
    return 'http://edufront.lagounews.com'
  }
}

// 请求拦截器
request.interceptors.request.use(function (config) {
  config.baseURL = geteBaseURL(config.url)

  // 统一设置TOken信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }

  return config
})

function redirectLogin () {
  router.push({
    name: '/login',
    query: {
      // currentRoute 相当于存储了信息的对象
      redirect: router.currentRoute
    }
  })
}

// 存储是否正在更新 Token 的状态
let isRefreshing = false
// 存储因为等待 Token 刷新挂起的请求
let requests = []

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 状态码2xx
  return response
}, function (error) {
  if (error.response) {
    // The request was made and the server responded with a status code 请求发送成功 响应接收完毕 但是状态码标记为失败状态
    // 判断失败的状态码
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      errorMessage = 'Token无效'
      // 1.无 Token 信息
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 检测是否已经存在刷新 Token 的请求
      if (isRefreshing) {
        // 将当前失败请求存储在请求列表中
        return requests.push(() => {
          // 当前函数调用后 自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      // 2.Token 无效 错误 过期
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 刷新 Token 失败
        if (res.data.state !== 1) {
          // 清楚无效用户信息
          store.commit('setUser', null)
          // 跳转重新登陆
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新 Token 成功
        // 存储新 Token
        store.commit('setUser', res.data.content)
        // 重新发送请求
        // error.config 是本次失败请求的配置对象
        // 根据 requests 发送失败的请求
        requests.forEach((callback) => callback())
        // 发送完清除数组
        requests = []
        // 将本次请求发送
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMessage = '没有权限请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误请联系管理员'
    }
    Message.error(errorMessage)
  } else if (error.request) {
    // The request was made but no response was received 请求发送成功 但是未收到响应
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    Message.error('请求超时！请重试')
  } else {
    // Something happened in setting up the request that triggered an Error 意料之外的错误
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default request
