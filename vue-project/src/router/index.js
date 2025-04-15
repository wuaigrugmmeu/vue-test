import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserManagement from '../views/UserManagement.vue'
import RoleManagement from '../views/RoleManagement.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 将根路径重定向到用户管理页面
      redirect: '/users'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: HomeView
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagement
    },
    {
      path: '/roles',
      name: 'roles',
      component: RoleManagement
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// 路由守卫，验证是否登录
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  // 登录页可以直接访问
  if (to.path === '/login') {
    if (isAuthenticated) {
      // 如果已登录且尝试访问登录页，重定向到用户管理页面
      next('/users')
    } else {
      next()
    }
  } else {
    // 其他页面需要验证登录状态
    if (isAuthenticated) {
      next() // 已登录，继续访问
    } else {
      next('/login') // 未登录，重定向到登录页
    }
  }
})

export default router