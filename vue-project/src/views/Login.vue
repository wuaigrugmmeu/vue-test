<template>
  <div class="login-container flex-center">
    <div class="login-box shadow rounded">
      <h2 class="text-center">系统登录</h2>
      <div class="form-item">
        <label>账号：</label>
        <input 
          type="text" 
          v-model="loginForm.username" 
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        />
      </div>
      <div class="form-item">
        <label>密码：</label>
        <input 
          type="password" 
          v-model="loginForm.password" 
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        />
      </div>
      <div class="form-item tips text-right">
        <p class="text-secondary">测试账号: admin / 123456</p>
      </div>
      <div class="btn-container">
        <button 
          :disabled="authStore.loading" 
          @click="handleLogin"
          class="login-btn"
        >
          {{ authStore.loading ? '登录中...' : '登 录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  // 简单表单验证
  if (!loginForm.username || !loginForm.password) {
    alert('请输入用户名和密码')
    return
  }

  try {
    await authStore.login(loginForm.username, loginForm.password)
    // 登录成功后直接跳转到用户管理页面，而非首页
    router.push('/users')
  } catch (error) {
    // 错误由状态管理中处理，不需要再次处理
    console.error('登录失败:', error)
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  background-color: var(--background-color);
}

.login-box {
  width: 350px;
  padding: var(--spacing-large);
  background: var(--white);
}

h2 {
  margin-bottom: var(--spacing-large);
  color: var(--primary-color);
}

.form-item {
  margin-bottom: var(--spacing-medium);
}

.form-item label {
  display: block;
  margin-bottom: var(--spacing-extra-small);
  font-weight: bold;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-small);
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  padding: 12px 0;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius-small);
  cursor: pointer;
  font-size: var(--font-size-medium);
  transition: background-color var(--transition-duration) var(--transition-timing-function);
}

.login-btn:hover {
  background-color: #66b1ff;
}

.login-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.tips {
  font-size: var(--font-size-extra-small);
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>