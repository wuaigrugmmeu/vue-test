<template>
  <div class="home page-container">
    <header class="header space-between mb-large">
      <div class="logo-section flex">
        <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="50" height="50" />
        <div class="header-title">
          <h1>Vue 3 应用首页</h1>
        </div>
      </div>
      <div class="user-info flex">
        <span class="welcome-text">欢迎，{{ authStore.name }}</span>
        <el-button type="danger" size="small" @click="handleLogout" class="logout-btn">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </header>

    <main>
      <div class="content card-container">
        <h2 class="mb-medium">系统功能</h2>
        <div class="feature-cards">
          <div class="card" @click="navigateTo('/users')">
            <div class="card-icon">👥</div>
            <h3>用户管理</h3>
            <p>管理系统用户，支持增删改查和分页查询</p>
          </div>
          <div class="card" @click="navigateTo('/roles')">
            <div class="card-icon">🔑</div>
            <h3>角色管理</h3>
            <p>管理系统角色和权限</p>
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // 确保状态正确
  authStore.checkAuth()
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    // 退出逻辑在store中处理，包括页面重定向
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
}

.header {
  padding-bottom: var(--spacing-medium);
  border-bottom: 1px solid var(--border-color-lighter);
}

.logo-section {
  align-items: center;
  gap: var(--spacing-medium);
}

.logo {
  margin-right: var(--spacing-medium);
}

h1 {
  margin: 0;
  color: var(--primary-color);
  font-size: var(--font-size-large);
}

.user-info {
  align-items: center;
  gap: var(--spacing-medium);
}

.welcome-text {
  color: var(--text-regular);
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-medium);
  margin-top: var(--spacing-medium);
}

.card {
  background-color: var(--background-color-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-large);
  transition: all var(--transition-duration) var(--transition-timing-function);
  cursor: pointer;
  box-shadow: var(--box-shadow-light);
  border: 1px solid var(--border-color-lighter);
}

.card:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: var(--box-shadow-dark);
  background-color: #f0f7ff;
}

.card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-medium);
}

.card h3 {
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: var(--spacing-small);
}

.card p {
  color: var(--text-secondary);
  margin: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-medium);
  }
  
  .user-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .feature-cards {
    grid-template-columns: 1fr;
  }
}
</style>