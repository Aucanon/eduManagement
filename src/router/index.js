import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */'@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layout' */'@/views/layout/index.vue'),
    meta: {
      // 所有 / 及子路由需要验证
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import(/* webpackChunkName: 'home' */'@/views/resource/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        meta: { title: '角色管理' },
        component: () => import(/* webpackChunkName: 'role' */'@/views/role/index.vue')
      },
      {
        path: '/menu',
        name: 'menu',
        meta: { title: '菜单管理' },
        component: () => import(/* webpackChunkName: 'menu' */'@/views/menu/index.vue')
      },
      {
        path: '/resource',
        name: 'resource',
        meta: { title: '资源管理' },
        component: () => import(/* webpackChunkName: 'resource' */'@/views/resource/index.vue')
      },
      {
        path: '/course',
        name: 'course',
        meta: { title: '课程管理' },
        component: () => import(/* webpackChunkName: 'course' */'@/views/course/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: { title: '用户管理' },
        component: () => import(/* webpackChunkName: 'user' */'@/views/user/index.vue')
      },
      {
        path: '/advert',
        name: 'advert',
        meta: { title: '广告管理' },
        component: () => import(/* webpackChunkName: 'advert' */'@/views/advert/index.vue')
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        meta: { title: '广告位管理' },
        component: () => import(/* webpackChunkName: 'advert-space' */'@/views/advert-space/index.vue')
      },
      {
        path: '/menu-create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create' */'@/views/menu/create.vue')
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-eidt',
        component: () => import(/* webpackChunkName: 'menu-edit' */'@/views/menu/edit.vue')
      },
      {
        path: '/resource-category',
        name: 'resource-category',
        component: () => import(/* webpackChunkName: 'resource-category' */'@/views/resource/resourceCategory.vue')
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */'@/views/role/alloc-menu.vue'),
        props: true
      },
      {
        path: '/role/:roleId/alloc-resouce',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'alloc-resource' */'@/views/role/alloc-resource.vue'),
        props: true
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */'@/views/course/create.vue')
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */'@/views/course/edit.vue'),
        props: true
      },
      {
        path: '/course/:courseId/:courseName/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */'@/views/course/section.vue'),
        props: true
      },
      {
        path: '/course/:courseId/:lessonId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */'@/views/course/video.vue'),
        props: true
      },
      {
        path: '/advert-space/create',
        name: 'advert-space-create',
        component: () => import(/* webpackChunkName: 'advert-space-create' */'@/views/advert-space/addAdvertSpace.vue')
      },
      {
        path: '/advert-space/:id/update',
        name: 'advert-space-update',
        component: () => import(/* webpackChunkName: 'advert-space-update' */'@/views/advert-space/updateAdvertSpace.vue'),
        props: true
      },
      {
        path: '/advert/create',
        name: 'advert-create',
        component: () => import(/* webpackChunkName: 'advert-create' */'@/views/advert/addAdvert.vue')
      },
      {
        path: '/advert/edit',
        name: 'advert-edit',
        component: () => import(/* webpackChunkName: 'advert-edit' */'@/views/advert/editAdvert.vue')
      }
    ]
  },
  {
    path: '*',
    name: 'error-page',
    component: () => import(/* webpackChunkName: 'error-page' */'@/views/error-page/index.vue')
  }
]

const router = new VueRouter({
  routes
})

// 设置全局路由守卫身份验证
router.beforeEach((to, from, next) => {
  // 验证路由是否需要身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      // 未登录 跳转到登录页
      return next({
        name: 'login',
        query: {
          // 将访问的路由fullpath传递给页面
          redirect: to.fullPath
        }
      })
    } else {
      // 已登录
      next()
    }
  } else {
    next()
  }
})

export default router
