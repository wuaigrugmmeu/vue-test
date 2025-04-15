<template>
  <div class="home">
    <header>
      <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="125" height="125" />
      <div class="header-content">
        <h1>Vue 3 应用首页</h1>
        <div class="user-info">
          <span>欢迎，{{ userInfo.name }}</span>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </div>
      </div>
    </header>

    <main>
      <div class="content">
        <h2>系统功能</h2>
        <div class="feature-cards">
          <div class="card" @click="navigateTo('/users')">
            <div class="card-icon">👥</div>
            <h3>用户管理</h3>
            <p>管理系统用户，支持增删改查和分页查询</p>
          </div>
          <div class="card disabled">
            <div class="card-icon">🔑</div>
            <h3>角色管理</h3>
            <p>管理系统角色和权限（即将推出）</p>
          </div>
          <div class="card disabled">
            <div class="card-icon">⚙️</div>
            <h3>系统设置</h3>
            <p>系统配置和参数设置（即将推出）</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../api/auth.js'

const router = useRouter()
const userInfo = ref({
  name: '用户',
  username: ''
})

onMounted(() => {
  // 获取存储的用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})

const handleLogout = async () => {
  try {
    await logout()
    // 清除本地存储的登录信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败', error)
  }
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  margin-right: 20px;
}

.header-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  margin: 0;
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #ff7d7d;
}

.content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #303133;
  margin-bottom: 25px;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 25px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeaea;
}

.card:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background-color: #f0f7ff;
}

.card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.card h3 {
  color: #303133;
  margin-top: 0;
  margin-bottom: 10px;
}

.card p {
  color: #606266;
  margin: 0;
}
</style>