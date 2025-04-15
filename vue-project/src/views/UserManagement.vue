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
          </div>
        </el-header>
        
        <el-main>
          <div class="content-body">
            <UserList 
              v-if="activeComponent === 'list'"
              :users="users"
              :pagination="pagination"
              :loading="loading"
              @search="handleSearch"
              @reset="resetSearch"
              @page-change="handlePageChange"
              @page-size-change="handlePageSizeChange"
              @add="showAddUserForm"
              @edit="showEditUserForm"
              @delete="deleteUserById"
              @batch-delete="batchDeleteUsers"
            />
            
            <UserForm
              v-if="activeComponent === 'form'"
              :user="currentUser"
              :isSubmitting="submitting"
              @submit="submitUserForm"
              @cancel="cancelUserForm"
            />
          </div>
        </el-main>
      </el-container>
      
      <!-- 使用Element Plus的通知组件替代Vuetify的Snackbar -->
      <el-notification
        v-if="notification.show"
        :title="notification.title"
        :type="notification.type"
        :message="notification.message"
        :duration="3000"
        @close="notification.show = false"
      ></el-notification>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import SideMenu from '../components/SideMenu.vue'
import UserList from '../components/UserList.vue'
import UserForm from '../components/UserForm.vue'
import { fetchUsers, getUserById, addUser, updateUser, deleteUser, batchDeleteUsers as batchDeleteUsersApi } from '../api/user.js'

const router = useRouter()

// 活跃菜单项
const activeMenu = ref('users')

// 当前显示的组件：list 或 form
const activeComponent = ref('list')

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 用户列表数据
const users = ref([])

// 分页信息
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

// 搜索条件
const filters = ref({
  username: '',
  role: '',
  status: ''
})

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

// 通知消息
const notification = ref({
  show: false,
  title: '',
  message: '',
  type: 'success',
})

// 初始化加载数据
onMounted(() => {
  loadUsers()
})

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const result = await fetchUsers(
      pagination.value.page,
      pagination.value.pageSize,
      filters.value
    )
    users.value = result.list
    pagination.value = result.pagination
  } catch (error) {
    showNotification('加载失败', '加载用户失败: ' + error.message, 'error')
    console.error('加载用户失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索用户
const handleSearch = (searchParams) => {
  filters.value = { ...searchParams }
  pagination.value.page = 1 // 重置为第一页
  loadUsers()
}

// 重置搜索
const resetSearch = () => {
  filters.value = {
    username: '',
    role: '',
    status: ''
  }
  pagination.value.page = 1
  loadUsers()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.value.page = page
  loadUsers()
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1 // 重置为第一页
  loadUsers()
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
const submitUserForm = async (userData) => {
  submitting.value = true
  try {
    if (userData.id) {
      // 更新现有用户
      await updateUser(userData)
      showNotification('更新成功', '用户更新成功', 'success')
    } else {
      // 添加新用户
      await addUser(userData)
      showNotification('添加成功', '用户添加成功', 'success')
    }
    // 返回列表并刷新数据
    activeComponent.value = 'list'
    await loadUsers()
  } catch (error) {
    showNotification('操作失败', '操作失败: ' + error.message, 'error')
    console.error('保存用户失败:', error)
  } finally {
    submitting.value = false
  }
}

// 删除单个用户
const deleteUserById = async (id) => {
  loading.value = true
  try {
    await deleteUser(id)
    showNotification('删除成功', '用户删除成功', 'success')
    await loadUsers() // 重新加载数据
  } catch (error) {
    showNotification('删除失败', '删除失败: ' + error.message, 'error')
    console.error('删除用户失败:', error)
  } finally {
    loading.value = false
  }
}

// 批量删除用户
const batchDeleteUsers = async (ids) => {
  loading.value = true
  try {
    const result = await batchDeleteUsersApi(ids)
    showNotification('删除成功', `成功删除${result.deletedCount}个用户`, 'success')
    await loadUsers() // 重新加载数据
  } catch (error) {
    showNotification('批量删除失败', '批量删除失败: ' + error.message, 'error')
    console.error('批量删除用户失败:', error)
  } finally {
    loading.value = false
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
      resetSearch()
      break
    case 'roles':
      // 跳转到角色管理页面
      router.push('/roles')
      break
    case 'settings':
      // 后续可添加设置页面的跳转逻辑
      break
    // 可以添加其他菜单项的处理逻辑
  }
}

// 显示通知消息
const showNotification = (title, message, type = 'success') => {
  ElNotification({
    title,
    message,
    type,
    duration: 3000
  })
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
  background-color: #f5f7fa;
  overflow-x: hidden;
  overflow-y: auto;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  background-color: #fff;
}

.header-content h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #303133;
}

.el-main {
  padding: 0;
  overflow-x: hidden;
}

.content-body {
  background-color: transparent;
  border-radius: 4px;
}
</style>