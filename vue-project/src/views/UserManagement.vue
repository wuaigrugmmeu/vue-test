<template>
  <div class="user-management">
    <SideMenu 
      :activeMenu="activeMenu"
      @menu-select="handleMenuSelect"
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
            <UserList 
              v-if="activeComponent === 'list'"
              :users="userStore.users"
              :pagination="userStore.pagination"
              :loading="userStore.loading"
              @search="handleSearch"
              @reset="handleResetSearch"
              @page-change="handlePageChange"
              @page-size-change="handlePageSizeChange"
              @add="showAddUserForm"
              @edit="showEditUserForm"
              @delete="handleDeleteUser"
              @batch-delete="handleBatchDelete"
            />
            
            <UserForm
              v-if="activeComponent === 'form'"
              :user="currentUser"
              :isSubmitting="userStore.submitting"
              @submit="handleSubmitForm"
              @cancel="cancelUserForm"
            />
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SideMenu from '../components/SideMenu.vue'
import UserList from '../components/UserList.vue'
import UserForm from '../components/UserForm.vue'
import { useUserStore } from '../stores/user.js'
import { useAuthStore } from '../stores/auth.js'
import { ArrowDown, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// 活跃菜单项
const activeMenu = ref('users')

// 当前显示的组件：list 或 form
const activeComponent = ref('list')

// 当前正在编辑的用户
const currentUser = ref(null)

// 页面标题
const pageTitle = computed(() => {
  if (activeComponent.value === 'list') {
    return '用户管理'
  } else if (activeComponent.value === 'form') {
    return currentUser.value && currentUser.value.id ? '编辑用户' : '新增用户'
  }
  return '用户管理'
})

// 初始化加载数据
onMounted(() => {
  userStore.loadUsers()
})

// 搜索用户
const handleSearch = (searchParams) => {
  userStore.searchUsers(searchParams)
}

// 重置搜索
const handleResetSearch = () => {
  userStore.resetSearch()
}

// 处理页码变化
const handlePageChange = (page) => {
  userStore.changePage(page)
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize) => {
  userStore.changePageSize(pageSize)
}

// 显示新增用户表单
const showAddUserForm = () => {
  currentUser.value = null
  activeComponent.value = 'form'
}

// 显示编辑用户表单
const showEditUserForm = (user) => {
  currentUser.value = { ...user }
  activeComponent.value = 'form'
}

// 取消用户表单
const cancelUserForm = () => {
  activeComponent.value = 'list'
  currentUser.value = null
}

// 提交用户表单（添加或更新）
const handleSubmitForm = async (userData) => {
  try {
    await userStore.submitUserForm(userData)
    // 返回列表并刷新数据
    activeComponent.value = 'list'
    await userStore.loadUsers()
  } catch (error) {
    console.error('保存用户失败:', error)
  }
}

// 删除单个用户
const handleDeleteUser = async (id) => {
  try {
    await userStore.deleteUserById(id)
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

// 批量删除用户
const handleBatchDelete = async (ids) => {
  try {
    await userStore.batchDeleteUsers(ids)
  } catch (error) {
    console.error('批量删除用户失败:', error)
  }
}

// 处理菜单选择
const handleMenuSelect = (menuId) => {
  activeMenu.value = menuId
  
  // 根据不同的菜单项跳转到不同的页面/功能
  switch (menuId) {
    case 'dashboard':
      router.push('/')
      break
    case 'users':
      // 当前已在用户管理页面，只需重置状态
      activeComponent.value = 'list'
      userStore.resetSearch()
      break
    case 'roles':
      // 跳转到角色管理页面
      router.push('/roles')
      break
    case 'settings':
      // 后续可添加设置页面的跳转逻辑
      break
  }
}

// 处理用户操作命令
const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.user-management {
  display: flex;
  height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  overflow-x: hidden;
  overflow-y: auto;
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

.el-main {
  padding: 0;
  overflow-x: hidden;
}

.content-body {
  background-color: transparent;
  border-radius: var(--border-radius-medium);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .user-management {
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