// filepath: /workspaces/vue-test/vue-project/src/stores/role.js
import { defineStore } from 'pinia'
import { fetchRoles, getRoleById, addRole, updateRole, deleteRole, batchDeleteRoles, getAllPermissions } from '../api/role.js'
import { ElMessage } from 'element-plus'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [],
    currentRole: null,
    loading: false,
    submitting: false,
    permissions: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      name: '',
      code: '',
      status: ''
    }
  }),
  
  getters: {
    getRoleById: (state) => {
      return (id) => state.roles.find(role => role.id === id)
    }
  },
  
  actions: {
    async loadRoles() {
      this.loading = true
      try {
        const result = await fetchRoles(
          this.pagination.page,
          this.pagination.pageSize,
          this.filters
        )
        this.roles = result.list
        this.pagination = result.pagination
        return result
      } catch (error) {
        ElMessage.error(`加载角色失败: ${error.message}`)
        console.error('加载角色失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async loadPermissions() {
      try {
        const permissions = await getAllPermissions()
        this.permissions = permissions
        return permissions
      } catch (error) {
        ElMessage.error(`加载权限失败: ${error.message}`)
        console.error('加载权限失败:', error)
        throw error
      }
    },
    
    async searchRoles(searchParams) {
      this.filters = { ...searchParams }
      this.pagination.page = 1
      return this.loadRoles()
    },
    
    async resetSearch() {
      this.filters = {
        name: '',
        code: '',
        status: ''
      }
      this.pagination.page = 1
      return this.loadRoles()
    },
    
    async changePage(page) {
      this.pagination.page = page
      return this.loadRoles()
    },
    
    async changePageSize(pageSize) {
      this.pagination.pageSize = pageSize
      this.pagination.page = 1
      return this.loadRoles()
    },
    
    async submitRoleForm(roleData) {
      this.submitting = true
      try {
        if (roleData.id) {
          // 更新现有角色
          const updated = await updateRole(roleData)
          ElMessage.success('角色更新成功')
          return updated
        } else {
          // 添加新角色
          const added = await addRole(roleData)
          ElMessage.success('角色添加成功')
          return added
        }
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`)
        console.error('保存角色失败:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },
    
    async deleteRoleById(id) {
      this.loading = true
      try {
        await deleteRole(id)
        ElMessage.success('角色删除成功')
        await this.loadRoles()
        return true
      } catch (error) {
        ElMessage.error(`删除失败: ${error.message}`)
        console.error('删除角色失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async batchDeleteRoles(ids) {
      this.loading = true
      try {
        const result = await batchDeleteRoles(ids)
        
        // 构建消息
        let message = `成功删除${result.deletedCount}个角色`
        if (result.skippedCount > 0) {
          message += `，${result.skippedCount}个内置角色无法删除`
        }
        
        ElMessage.success(message)
        await this.loadRoles()
        return result
      } catch (error) {
        ElMessage.error(`批量删除失败: ${error.message}`)
        console.error('批量删除角色失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})