// filepath: /workspaces/vue-test/vue-project/src/stores/user.js
import { defineStore } from 'pinia'
import { fetchUsers, getUserById, addUser, updateUser, deleteUser, batchDeleteUsers } from '../api/user.js'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    submitting: false,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    },
    filters: {
      username: '',
      role: '',
      status: ''
    }
  }),
  
  getters: {
    getUserById: (state) => {
      return (id) => state.users.find(user => user.id === id)
    }
  },
  
  actions: {
    async loadUsers() {
      this.loading = true
      try {
        const result = await fetchUsers(
          this.pagination.page,
          this.pagination.pageSize,
          this.filters
        )
        this.users = result.list
        this.pagination = result.pagination
        return result
      } catch (error) {
        ElMessage.error(`加载用户失败: ${error.message}`)
        console.error('加载用户失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async searchUsers(searchParams) {
      this.filters = { ...searchParams }
      this.pagination.page = 1
      return this.loadUsers()
    },
    
    async resetSearch() {
      this.filters = {
        username: '',
        role: '',
        status: ''
      }
      this.pagination.page = 1
      return this.loadUsers()
    },
    
    async changePage(page) {
      this.pagination.page = page
      return this.loadUsers()
    },
    
    async changePageSize(pageSize) {
      this.pagination.pageSize = pageSize
      this.pagination.page = 1
      return this.loadUsers()
    },
    
    async submitUserForm(userData) {
      this.submitting = true
      try {
        if (userData.id) {
          // 更新现有用户
          const updated = await updateUser(userData)
          ElMessage.success('用户更新成功')
          return updated
        } else {
          // 添加新用户
          const added = await addUser(userData)
          ElMessage.success('用户添加成功')
          return added
        }
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`)
        console.error('保存用户失败:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },
    
    async deleteUserById(id) {
      this.loading = true
      try {
        await deleteUser(id)
        ElMessage.success('用户删除成功')
        await this.loadUsers()
        return true
      } catch (error) {
        ElMessage.error(`删除失败: ${error.message}`)
        console.error('删除用户失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async batchDeleteUsers(ids) {
      this.loading = true
      try {
        const result = await batchDeleteUsers(ids)
        ElMessage.success(`成功删除${result.deletedCount}个用户`)
        await this.loadUsers()
        return result
      } catch (error) {
        ElMessage.error(`批量删除失败: ${error.message}`)
        console.error('批量删除用户失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})