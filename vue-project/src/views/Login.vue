<template>
  <div class="login-container">
    <div class="login-box">
      <h2>系统登录</h2>
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
      <div class="form-item tips">
        <p>测试账号: admin / 123456</p>
      </div>
      <div class="btn-container">
        <button 
          :disabled="loading" 
          @click="handleLogin"
          class="login-btn"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth.js'

const router = useRouter()
const loading = ref(false)
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
    loading.value = true
    const res = await login(loginForm.username, loginForm.password)
    
    // 将用户信息和token存储到localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
    
    alert('登录成功')
    
    // 登录成功后跳转到首页
    router.push('/')
  } catch (error) {
    alert(error.message || '登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  width: 350px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  padding: 12px 0;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-btn:hover {
  background-color: #66b1ff;
}

.login-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.tips {
  font-size: 12px;
  color: #606266;
  text-align: right;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>