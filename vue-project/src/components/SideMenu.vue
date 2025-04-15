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
        {{ userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U' }}
      </el-avatar>
      <div class="user-details">
        <div class="username">{{ userInfo.name || '用户' }}</div>
        <div class="role">管理员</div>
      </div>
    </div>
  </el-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['menu-select'])

const userInfo = ref({
  name: '',
  username: ''
})

const menuItems = [
  { id: 'dashboard', label: '仪表盘', icon: 'Odometer' },
  { id: 'users', label: '用户管理', icon: 'User' },
  { id: 'roles', label: '角色管理', icon: 'Key' },
  { id: 'settings', label: '系统设置', icon: 'Setting' },
]

const selectMenu = (menuId) => {
  emit('menu-select', menuId)
}

onMounted(() => {
  // 从localStorage获取用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})
</script>

<style scoped>
.side-menu {
  height: 100vh;
  width: 220px;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.user-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: #4b545c;
}

.user-avatar {
  background-color: #409EFF;
  margin-right: 10px;
}

.user-details {
  flex-grow: 1;
}

.username {
  font-weight: 500;
  color: white;
  font-size: 14px;
}

.role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.el-menu-item [class^="el-icon-"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}
</style>