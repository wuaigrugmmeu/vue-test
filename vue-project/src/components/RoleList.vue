<template>
  <div class="role-list-container">
    <!-- 使用通用搜索表单 -->
    <SearchForm
      :loading="loading"
      @search="handleSearch"
      @reset="handleReset"
    >
      <el-form-item label="角色名称">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入角色名称"
          clearable
          @keyup.enter="handleSearch"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="角色编码">
        <el-input
          v-model="searchForm.code"
          placeholder="请输入角色编码"
          clearable
          @keyup.enter="handleSearch"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="全部状态" value=""></el-option>
          <el-option label="启用" value="enabled"></el-option>
          <el-option label="禁用" value="disabled"></el-option>
        </el-select>
      </el-form-item>
    </SearchForm>

    <!-- 使用通用表格组件 -->
    <BaseTable
      ref="tableRef"
      :data="roles"
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
          <el-icon><Plus /></el-icon>添加角色
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
      <el-table-column label="角色名称" prop="name" min-width="120"></el-table-column>
      <el-table-column label="角色编码" prop="code" min-width="120"></el-table-column>
      <el-table-column label="描述" prop="description" min-width="200" show-overflow-tooltip></el-table-column>
      
      <el-table-column label="状态" prop="status" width="100">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 'enabled' ? 'success' : 'danger'"
            effect="light"
          >
            {{ statusMapping[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <div class="action-buttons-cell">
            <el-button
              v-if="!row.isSystem"
              type="primary"
              size="small"
              @click="$emit('edit', row)"
            >
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="$emit('permission', row)"
            >
              <el-icon><Setting /></el-icon>权限
            </el-button>
            <el-button
              v-if="!row.isSystem"
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
import { Plus, Delete, Edit, Setting } from '@element-plus/icons-vue'
import BaseTable from './common/BaseTable.vue'
import SearchForm from './common/SearchForm.vue'
import { statusMapping } from '../utils/formatter.js'
// 导入并重命名工具函数，避免可能的命名冲突
import { confirmDelete as showConfirmDialog } from '../utils/tableHelper.js'

const props = defineProps({
  roles: {
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

const emit = defineEmits(['search', 'reset', 'page-change', 'page-size-change', 'delete', 'batch-delete', 'add', 'edit', 'permission', 'message'])

// 表格引用
const tableRef = ref(null)

// 搜索表单
const searchForm = ref({
  name: '',
  code: '',
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
    name: '',
    code: '',
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

// 删除单个角色
const handleDelete = (id) => {
  // 内置角色不能删除
  if (id <= 5) {
    emit('message', {
      type: 'warning',
      message: '内置角色不能删除'
    })
    return
  }
  
  // 可以使用工具函数，但这里保留原有逻辑以保持一致性
  confirmDialog.value = {
    show: true,
    message: '确定要删除该角色吗？',
    callback: 'deleteRole',
    params: id
  }
}

// 批量删除角色
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) return
  
  // 过滤掉内置角色
  const filteredIds = selectedRows.value
    .filter(item => item.id > 5)
    .map(item => item.id)
  
  if (filteredIds.length === 0) {
    emit('message', {
      type: 'warning',
      message: '内置角色不能删除'
    })
    return
  }
  
  confirmDialog.value = {
    show: true,
    message: `确定要删除选中的 ${filteredIds.length} 个角色吗？${selectedRows.value.length > filteredIds.length ? '（内置角色将被自动忽略）' : ''}`,
    callback: 'batchDelete',
    params: filteredIds
  }
}

// 确认删除操作
const confirmDelete = () => {
  if (confirmDialog.value.callback === 'deleteRole') {
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
watch(() => props.roles, () => {
  tableRef.value?.clearSelection()
})
</script>

<style scoped>
.role-list-container {
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

.action-buttons-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>