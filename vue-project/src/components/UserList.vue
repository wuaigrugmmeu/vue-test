<template>
  <div class="user-list-container">
    <!-- 使用通用搜索表单 -->
    <SearchForm
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    >
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
          <el-option 
            v-for="(label, value) in roleMapping" 
            :key="value" 
            :label="label" 
            :value="value"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="全部状态" value=""></el-option>
          <el-option label="启用" value="active"></el-option>
          <el-option label="禁用" value="inactive"></el-option>
        </el-select>
      </el-form-item>
    </SearchForm>

    <!-- 使用通用表格组件 -->
    <BaseTable
      ref="tableRef"
      :data="users"
      :loading="loading"
      :pagination="pagination"
      :max-height="null"
      :auto-height="true"
      @selection-change="handleSelectionChange"
      @page-change="changePage"
      @page-size-change="handlePageSizeChange"
    >
      <!-- 工具栏 -->
      <template #toolbar-left>
        <el-button type="primary" @click="$emit('add')">
          <el-icon><Plus /></el-icon>添加用户
        </el-button>
      </template>
      
      <template #toolbar-right>
        <el-button
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          <el-icon><Delete /></el-icon>批量删除 ({{ selectedRows.length }})
        </el-button>
      </template>
      
      <!-- 表格列 -->
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
            :type="getRoleTagType(row.role)"
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
            {{ statusMapping[row.status] }}
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
    </BaseTable>

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
import { ref, watch } from 'vue'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import BaseTable from './common/BaseTable.vue'
import SearchForm from './common/SearchForm.vue'
import { getRoleTagType, roleMapping, statusMapping } from '../utils/formatter.js'
// 重命名导入的confirmDelete为showDeleteConfirm，避免命名冲突
import { confirmDelete as showDeleteConfirm } from '../utils/tableHelper.js'

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

// 搜索表单
const searchForm = ref({
  username: '',
  role: '',
  status: ''
})

// 选中的行
const selectedRows = ref([])

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
const handlePageSizeChange = (pageSize) => {
  emit('page-size-change', pageSize)
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
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-form {
  flex-shrink: 0;
}

/* 让BaseTable占据剩余所有空间 */
:deep(.base-table-container) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-info-cell {
  display: flex;
  align-items: center;
}

.action-buttons-cell {
  display: flex;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>