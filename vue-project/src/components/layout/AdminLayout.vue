<template>
  <div class="admin-layout">
    <SideMenu 
      :activeMenu="activeMenu"
      @menu-select="$emit('menu-select', $event)"
    />
    
    <div class="main-content">
      <el-container>
        <el-header height="60px">
          <div class="header-content">
            <h2>{{ pageTitle }}</h2>
            <div class="header-actions">
              <el-dropdown trigger="click" @command="handleCommand">
                <div class="user-dropdown-link">
                  <el-avatar :size="32" class="header-avatar">
                    {{ authStore.name ? authStore.name.charAt(0).toUpperCase() : 'U' }}
                  </el-avatar>
                  <span class="header-username">{{ authStore.name }}</span>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="logout">
                      <el-icon><switch-button /></el-icon>退出登录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        
        <el-main>
          <div class="content-body">
            <slot></slot>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';
import SideMenu from '../SideMenu.vue';
import { ArrowDown, SwitchButton } from '@element-plus/icons-vue';

const props = defineProps({
  activeMenu: {
    type: String,
    required: true
  },
  pageTitle: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['menu-select']);
const router = useRouter();
const authStore = useAuthStore();

// 处理用户操作命令
const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout();
    router.push('/login');
  }
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  overflow: hidden;
}

.el-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  overflow: hidden;
  padding: var(--spacing-medium);
  display: flex;
  flex-direction: column;
}

.content-body {
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 var(--spacing-large);
  box-shadow: var(--box-shadow-light);
  background-color: var(--white);
}

.header-content h2 {
  margin: 0;
  font-size: var(--font-size-large);
  font-weight: 500;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-avatar {
  margin-right: var(--spacing-small);
}

.header-username {
  margin-right: var(--spacing-small);
  font-size: var(--font-size-medium);
  color: var(--text-secondary);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
    height: auto;
  }
  
  .main-content {
    width: 100%;
    overflow: visible;
  }
  
  .header-content {
    padding: 0 var(--spacing-medium);
  }
}
</style>