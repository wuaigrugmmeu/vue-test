<template>
  <div class="role-list-container">
    <!-- 搜索和操作按钮区域 -->
    <div class="search-area">
      <el-form :inline="true" class="search-form">
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
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="action-buttons">
        <el-button type="primary" @click="$emit('add')">
          <el-icon><Plus /></el-icon>添加角色
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
      :data="roles"
      style="width: 100%"
      border
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
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
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      
      <el-table-column label="操作" width="220" fixed="right">
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
      
      <template #empty>
        <div style="text-align: center; padding: 30px 0">
          <el-empty description="暂无角色数据"></el-empty>
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
import { Search, Plus, Delete, Edit, Key, Setting } from '@element-plus/icons-vue'

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

const emit = defineEmits(['search', 'reset', 'page-change', 'page-size-change', 'delete', 'batch-delete', 'add', 'edit', 'permission'])

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
const handlePageSizeChange = () => {
  emit('page-size-change', pageSize.value)
}

// 表格多选变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 删除单个角色
const handleDelete = (id) => {
  // 内置角色不能删除
  if (id <= 5) return
  
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
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

/* 优化操作按钮样式 */
.action-buttons-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>