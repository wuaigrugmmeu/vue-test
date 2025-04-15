<template>
  <el-menu
    :default-active="activeMenu"
    class="side-menu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="selectMenu"
  >
    <div class="logo-container">
      <h2 class="logo-title">管理系统</h2>
    </div>
    
    <el-menu-item v-for="item in menuItems" :key="item.id" :index="item.id">
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      <span>{{ item.label }}</span>
    </el-menu-item>
    
    <div class="user-info">
      <el-avatar :size="40" class="user-avatar">
        {{ authStore.name ? authStore.name.charAt(0).toUpperCase() : 'U' }}
      </el-avatar>
      <div class="user-details">
        <div class="username">{{ authStore.name || '用户' }}</div>
        <div class="role">管理员</div>
      </div>
    </div>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['menu-select'])
const authStore = useAuthStore()

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: 'Odometer' },
  { id: 'users', label: '用户管理', icon: 'User' },
  { id: 'roles', label: '角色管理', icon: 'Key' },
  { id: 'settings', label: '系统设置', icon: 'Setting' },
]

const selectMenu = (menuId) => {
  emit('menu-select', menuId)
}
</script>

<style scoped>
.side-menu {
  height: 100vh;
  width: 220px;
  transition: width var(--transition-duration) var(--transition-timing-function);
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: var(--spacing-medium) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-title {
  margin: 0;
  font-size: var(--font-size-medium);
  font-weight: 500;
}

.user-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: var(--spacing-medium);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #4b545c;
}

.user-avatar {
  background-color: var(--primary-color);
  margin-right: var(--spacing-small);
}

.user-details {
  flex-grow: 1;
}

.username {
  font-weight: 500;
  color: white;
  font-size: var(--font-size-base);
}

.role {
  font-size: var(--font-size-extra-small);
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.el-menu-item [class^="el-icon-"] {
  margin-right: var(--spacing-extra-small);
  width: 24px;
  text-align: center;
  font-size: var(--font-size-medium);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .side-menu {
    width: 100%;
    height: auto;
    position: relative;
  }

  .user-info {
    position: relative;
    margin-top: var(--spacing-medium);
  }
}
</style>