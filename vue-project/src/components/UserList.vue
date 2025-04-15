<template>
  <div class="user-list-container">
    <!-- 搜索和操作按钮区域 -->
    <div class="search-area">
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleSearch"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
            <el-option label="全部角色" value=""></el-option>
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="编辑" value="editor"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部状态" value=""></el-option>
            <el-option label="启用" value="active"></el-option>
            <el-option label="禁用" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="action-buttons">
        <el-button type="primary" @click="$emit('add')">
          <el-icon><Plus /></el-icon>添加用户
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>批量删除 ({{ selectedRows.length }})
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      ref="tableRef"
      :data="users"
      style="width: 100%"
      border
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      
      <el-table-column label="用户名" prop="username" min-width="180">
        <template #default="{ row }">
          <div class="user-info-cell">
            <el-avatar :size="32" :style="{ backgroundColor: row.avatarColor || '#409EFF' }">
              {{ row.username?.charAt(0).toUpperCase() }}
            </el-avatar>
            <span style="margin-left: 10px">{{ row.username }}</span>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="邮箱" prop="email"></el-table-column>
      
      <el-table-column label="手机号" prop="phone"></el-table-column>
      
      <el-table-column label="角色" prop="role">
        <template #default="{ row }">
          <el-tag
            :type="getRoleType(row.role)"
            effect="light"
          >
            {{ roleMapping[row.role] || row.role }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" prop="status">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 'active' ? 'success' : 'danger'"
            effect="light"
          >
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons-cell">
            <el-button
              type="primary"
              size="small"
              @click="$emit('edit', row)"
            >
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row.id)"
            >
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </div>
        </template>
      </el-table-column>
      
      <template #empty>
        <div style="text-align: center; padding: 30px 0">
          <el-empty description="暂无用户数据"></el-empty>
        </div>
      </template>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <div class="total-info">共 {{ pagination.total }} 条数据</div>
      <div class="pagination-control">
        <el-select
          v-model="pageSize"
          style="width: 100px"
          @change="handlePageSizeChange"
          size="small"
        >
          <el-option
            v-for="item in [10, 20, 50, 100]"
            :key="item"
            :label="`${item}条/页`"
            :value="item"
          ></el-option>
        </el-select>
        
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="pagination.total"
          @current-change="changePage"
        ></el-pagination>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <el-dialog
      v-model="confirmDialog.show"
      title="确认删除"
      width="30%"
      :close-on-click-modal="false"
    >
      <span>{{ confirmDialog.message }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmDialog.show = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确认删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Plus, Delete, Edit } from '@element-plus/icons-vue'

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search', 'reset', 'page-change', 'page-size-change', 'delete', 'batch-delete', 'add', 'edit'])

// 表格引用
const tableRef = ref(null)

// 角色映射表
const roleMapping = {
  'admin': '管理员',
  'editor': '编辑',
  'user': '普通用户'
}

// 获取角色对应的标签类型
const getRoleType = (role) => {
  const typeMap = {
    'admin': 'danger',
    'editor': 'warning',
    'user': 'info'
  }
  return typeMap[role] || 'info'
}

// 搜索表单
const searchForm = ref({
  username: '',
  role: '',
  status: ''
})

// 选中的行
const selectedRows = ref([])

// 分页
const pageSize = ref(props.pagination.pageSize || 10)
const currentPage = computed({
  get: () => props.pagination.page,
  set: (val) => emit('page-change', val)
})

// 确认对话框
const confirmDialog = ref({
  show: false,
  message: '',
  callback: null,
  params: null
})

// 搜索
const handleSearch = () => {
  emit('search', { ...searchForm.value })
}

// 重置搜索条件
const handleReset = () => {
  searchForm.value = {
    username: '',
    role: '',
    status: ''
  }
  emit('reset')
}

// 换页
const changePage = (page) => {
  emit('page-change', page)
}

// 更改每页条数
const handlePageSizeChange = () => {
  emit('page-size-change', pageSize.value)
}

// 表格多选变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 删除单个用户
const handleDelete = (id) => {
  confirmDialog.value = {
    show: true,
    message: '确定要删除该用户吗？',
    callback: 'deleteUser',
    params: id
  }
}

// 批量删除用户
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) return
  
  confirmDialog.value = {
    show: true,
    message: `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
    callback: 'batchDelete',
    params: selectedRows.value.map(item => item.id)
  }
}

// 确认删除操作
const confirmDelete = () => {
  if (confirmDialog.value.callback === 'deleteUser') {
    emit('delete', confirmDialog.value.params)
  } else if (confirmDialog.value.callback === 'batchDelete') {
    emit('batch-delete', confirmDialog.value.params)
    tableRef.value?.clearSelection()
  }
  confirmDialog.value.show = false
}

// 页面切换时清空选中项
watch(() => props.pagination.page, () => {
  tableRef.value?.clearSelection()
})

// 表格数据变化时重置选中项
watch(() => props.users, () => {
  tableRef.value?.clearSelection()
})
</script>

<style scoped>
.user-list-container {
  padding: 24px;
}

.search-area {
  margin-bottom: 24px;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 18px;
  gap: 16px;
}

.search-form .el-form-item {
  margin-bottom: 8px;
  margin-right: 0;
}

/* 优化下拉选项样式 */
:deep(.el-select) {
  width: 180px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.el-select-dropdown__item) {
  padding: 0 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 10px;
}

.user-info-cell {
  display: flex;
  align-items: center;
}

.action-buttons-cell {
  display: flex;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 10px;
  background-color: #fff;
  border-radius: 4px;
}

.pagination-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-tag {
  margin-right: 5px;
}

/* 增加表格边距 */
.el-table {
  margin-top: 15px;
}

/* 修改表头样式 */
:deep(.el-table__header) {
  font-weight: 600;
  background-color: #f5f7fa;
}

/* 修改表格行高 */
:deep(.el-table__row) {
  height: 50px;
}
</style>