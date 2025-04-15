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
      component: HomeView,
      meta: {
        title: '仪表盘',
        icon: 'Odometer'
      }
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagement,
      meta: {
        title: '用户管理',
        icon: 'User'
      }
    },
    {
      path: '/roles',
      name: 'roles',
      component: RoleManagement,
      meta: {
        title: '角色管理',
        icon: 'Key'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录',
        hidden: true  // 在标签页中隐藏
      }
    },
    {
      // 用于刷新页面的辅助路由
      path: '/redirect/:path(.*)',
      name: 'redirect',
      component: () => import('../views/Redirect.vue'),
      meta: {
        hidden: true
      }
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