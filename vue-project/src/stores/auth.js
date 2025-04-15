// filepath: /workspaces/vue-test/vue-project/src/stores/auth.js
import { defineStore } from 'pinia'
import { login, logout } from '../api/auth.js'
import { ElMessage } from 'element-plus'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    username: (state) => state.userInfo.username || '',
    name: (state) => state.userInfo.name || '用户'
  },
  
  actions: {
    async login(username, password) {
      this.loading = true
      try {
        const res = await login(username, password)
        
        // 保存token和用户信息
        this.token = res.data.token
        this.userInfo = res.data.userInfo
        
        // 存储到localStorage
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
        
        ElMessage.success('登录成功')
        return res
      } catch (error) {
        ElMessage.error(error.message || '登录失败，请检查用户名和密码')
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      try {
        await logout()
        
        // 清除状态和本地存储
        this.token = ''
        this.userInfo = {}
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        
        ElMessage.success('已退出登录')
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败', error)
      }
    },
    
    checkAuth() {
      // 从localStorage恢复状态
      const token = localStorage.getItem('token')
      const userInfo = localStorage.getItem('userInfo')
      
      if (token) {
        this.token = token
        this.userInfo = JSON.parse(userInfo || '{}')
        return true
      }
      
      return false
    }
  }
})