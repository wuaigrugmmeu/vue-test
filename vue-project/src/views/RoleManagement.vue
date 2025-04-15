<template>
  <div class="role-management">
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
            <RoleList 
              v-if="activeComponent === 'list'"
              :roles="roles"
              :pagination="pagination"
              :loading="loading"
              @search="handleSearch"
              @reset="resetSearch"
              @page-change="handlePageChange"
              @page-size-change="handlePageSizeChange"
              @add="showAddRoleForm"
              @edit="showEditRoleForm"
              @delete="deleteRoleById"
              @batch-delete="batchDeleteRoles"
              @permission="showPermissionDialog"
              @message="handleMessage"
            />
            
            <RoleForm
              v-if="activeComponent === 'form'"
              :role="currentRole"
              :isSubmitting="submitting"
              @submit="submitRoleForm"
              @cancel="cancelRoleForm"
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
import { ElNotification } from 'element-plus'
import SideMenu from '../components/SideMenu.vue'
import RoleList from '../components/RoleList.vue'
import RoleForm from '../components/RoleForm.vue'
import { fetchRoles, getRoleById, addRole, updateRole, deleteRole, batchDeleteRoles as batchDeleteRolesApi } from '../api/role.js'

const router = useRouter()

// 活跃菜单项
const activeMenu = ref('roles')

// 当前显示的组件：list 或 form
const activeComponent = ref('list')

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 角色列表数据
const roles = ref([])

// 分页信息
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

// 搜索条件
const filters = ref({
  name: '',
  code: '',
  status: ''
})

// 当前正在编辑的角色
const currentRole = ref(null)

// 页面标题
const pageTitle = computed(() => {
  if (activeComponent.value === 'list') {
    return '角色管理'
  } else if (activeComponent.value === 'form') {
    return currentRole.value && currentRole.value.id ? '编辑角色' : '新增角色'
  }
  return '角色管理'
})

// 初始化加载数据
onMounted(() => {
  loadRoles()
})

// 加载角色列表
const loadRoles = async () => {
  loading.value = true
  try {
    const result = await fetchRoles(
      pagination.value.page,
      pagination.value.pageSize,
      filters.value
    )
    roles.value = result.list
    pagination.value = result.pagination
  } catch (error) {
    showNotification('加载失败', '加载角色失败: ' + error.message, 'error')
    console.error('加载角色失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索角色
const handleSearch = (searchParams) => {
  filters.value = { ...searchParams }
  pagination.value.page = 1 // 重置为第一页
  loadRoles()
}

// 重置搜索
const resetSearch = () => {
  filters.value = {
    name: '',
    code: '',
    status: ''
  }
  pagination.value.page = 1
  loadRoles()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.value.page = page
  loadRoles()
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1 // 重置为第一页
  loadRoles()
}

// 显示新增角色表单
const showAddRoleForm = () => {
  currentRole.value = null
  activeComponent.value = 'form'
}

// 显示编辑角色表单
const showEditRoleForm = (role) => {
  currentRole.value = { ...role }
  activeComponent.value = 'form'
}

// 取消角色表单
const cancelRoleForm = () => {
  activeComponent.value = 'list'
  currentRole.value = null
}

// 提交角色表单（添加或更新）
const submitRoleForm = async (roleData) => {
  submitting.value = true
  try {
    if (roleData.id) {
      // 更新现有角色
      await updateRole(roleData)
      showNotification('更新成功', '角色更新成功', 'success')
    } else {
      // 添加新角色
      await addRole(roleData)
      showNotification('添加成功', '角色添加成功', 'success')
    }
    // 返回列表并刷新数据
    activeComponent.value = 'list'
    await loadRoles()
  } catch (error) {
    showNotification('操作失败', '操作失败: ' + error.message, 'error')
    console.error('保存角色失败:', error)
  } finally {
    submitting.value = false
  }
}

// 删除单个角色
const deleteRoleById = async (id) => {
  loading.value = true
  try {
    await deleteRole(id)
    showNotification('删除成功', '角色删除成功', 'success')
    await loadRoles() // 重新加载数据
  } catch (error) {
    showNotification('删除失败', '删除失败: ' + error.message, 'error')
    console.error('删除角色失败:', error)
  } finally {
    loading.value = false
  }
}

// 批量删除角色
const batchDeleteRoles = async (ids) => {
  loading.value = true
  try {
    const result = await batchDeleteRolesApi(ids)
    
    // 构建消息
    let message = `成功删除${result.deletedCount}个角色`
    if (result.skippedCount > 0) {
      message += `，${result.skippedCount}个内置角色无法删除`
    }
    
    showNotification('删除成功', message, 'success')
    await loadRoles() // 重新加载数据
  } catch (error) {
    showNotification('批量删除失败', '批量删除失败: ' + error.message, 'error')
    console.error('批量删除角色失败:', error)
  } finally {
    loading.value = false
  }
}

// 显示权限对话框
const showPermissionDialog = (role) => {
  // 这里简化处理，直接进入编辑页面
  showEditRoleForm(role)
}

// 处理菜单选择
const handleMenuSelect = (menuId) => {
  activeMenu.value = menuId
  
  // 根据不同的菜单项跳转到不同的页面/功能
  switch (menuId) {
    case 'dashboard':
      router.push('/')
      break
    case 'roles':
      // 当前已在角色管理页面，只需重置状态
      activeComponent.value = 'list'
      resetSearch()
      break
    case 'users':
      router.push('/users')
      break
    // 可以添加其他菜单项的处理逻辑
  }
}

// 处理从组件传来的消息
const handleMessage = (messageObj) => {
  showNotification(messageObj.title || '提示', messageObj.message, messageObj.type)
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
.role-management {
  display: flex;
  height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
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
  padding: 20px;
  overflow-x: hidden;
}

.content-body {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>