<template>
  <AdminLayout 
    :activeMenu="activeMenu" 
    :pageTitle="pageTitle"
    @menu-select="handleMenuSelect"
  >
    <RoleList 
      v-if="activeComponent === 'list'"
      :roles="roleStore.roles"
      :pagination="roleStore.pagination"
      :loading="roleStore.loading"
      @search="handleSearch"
      @reset="handleResetSearch"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @add="showAddRoleForm"
      @edit="showEditRoleForm"
      @delete="handleDeleteRole"
      @batch-delete="handleBatchDelete"
      @permission="showPermissionDialog"
      @message="handleMessage"
    />
    
    <RoleForm
      v-if="activeComponent === 'form'"
      :role="currentRole"
      :isSubmitting="roleStore.submitting"
      @submit="handleSubmitForm"
      @cancel="cancelRoleForm"
    />
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AdminLayout from '../components/layout/AdminLayout.vue'
import RoleList from '../components/RoleList.vue'
import RoleForm from '../components/RoleForm.vue'
import { useRoleStore } from '../stores/role.js'

const router = useRouter()
const roleStore = useRoleStore()

// 活跃菜单项
const activeMenu = ref('roles')

// 当前显示的组件：list 或 form
const activeComponent = ref('list')

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
  roleStore.loadRoles()
  roleStore.loadPermissions()
})

// 搜索角色
const handleSearch = (searchParams) => {
  roleStore.searchRoles(searchParams)
}

// 重置搜索
const handleResetSearch = () => {
  roleStore.resetSearch()
}

// 处理页码变化
const handlePageChange = (page) => {
  roleStore.changePage(page)
}

// 处理每页条数变化
const handlePageSizeChange = (pageSize) => {
  roleStore.changePageSize(pageSize)
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
const handleSubmitForm = async (roleData) => {
  try {
    await roleStore.submitRoleForm(roleData)
    // 返回列表并刷新数据
    activeComponent.value = 'list'
    await roleStore.loadRoles()
  } catch (error) {
    console.error('保存角色失败:', error)
  }
}

// 删除单个角色
const handleDeleteRole = async (id) => {
  try {
    await roleStore.deleteRoleById(id)
  } catch (error) {
    console.error('删除角色失败:', error)
  }
}

// 批量删除角色
const handleBatchDelete = async (ids) => {
  try {
    await roleStore.batchDeleteRoles(ids)
  } catch (error) {
    console.error('批量删除角色失败:', error)
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
      roleStore.resetSearch()
      break
    case 'users':
      router.push('/users')
      break
    // 可以添加其他菜单项的处理逻辑
  }
}

// 处理从组件传来的消息
const handleMessage = (messageObj) => {
  ElMessage({
    type: messageObj.type || 'info',
    message: messageObj.message,
    title: messageObj.title
  })
}
</script>

<style scoped>
/* 所有样式已移至布局组件，不需要在这里重复 */
</style>