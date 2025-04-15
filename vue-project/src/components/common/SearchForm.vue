<template>
  <div class="search-area">
    <el-form :inline="true" class="search-form">
      <slot></slot>
      
      <el-form-item>
        <el-button type="primary" @click="$emit('search')" :loading="loading">
          <el-icon><Search /></el-icon>搜索
        </el-button>
        <el-button @click="$emit('reset')">重置</el-button>
        <slot name="extra-buttons"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['search', 'reset']);
</script>

<style scoped>
.search-area {
  margin-bottom: var(--spacing-large);
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-large);
  box-shadow: var(--box-shadow-light);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-medium);
}

.search-form .el-form-item {
  margin-bottom: var(--spacing-small);
  margin-right: 0;
}

:deep(.el-select),
:deep(.el-input) {
  width: 180px;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.el-select-dropdown__item) {
  padding: 0 20px;
}

@media (max-width: 768px) {
  .search-form .el-form-item {
    width: 100%;
  }
  
  :deep(.el-select),
  :deep(.el-input) {
    width: 100%;
  }
}
</style>