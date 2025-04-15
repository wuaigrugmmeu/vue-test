<template>
  <div class="base-table-container" ref="containerRef">
    <!-- 搜索区域-通过slot传入 -->
    <slot name="search"></slot>

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <div class="left-actions">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="right-actions">
        <slot name="toolbar-right"></slot>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="data"
      style="width: 100%"
      border
      v-loading="loading"
      @selection-change="handleSelectionChange"
      :height="tableHeight"
      :max-height="maxHeight"
      :class="{ 'auto-height': autoHeight }"
    >
      <slot></slot>
      
      <template #empty>
        <div style="text-align: center; padding: 30px 0">
          <el-empty :description="emptyText"></el-empty>
        </div>
      </template>
    </el-table>

    <!-- 分页组件 -->
    <div class="pagination-container" v-if="showPagination">
      <div class="total-info">共 {{ pagination.total }} 条数据</div>
      <div class="pagination-control">
        <el-select
          v-model="pageSize"
          style="width: 100px"
          @change="handlePageSizeChange"
          size="small"
        >
          <el-option
            v-for="item in pageSizes"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
      total: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  // 自动调整高度以填充可用空间
  autoHeight: {
    type: Boolean,
    default: true
  },
  // 表格最大高度，默认填满容器
  maxHeight: {
    type: Number,
    default: null
  },
  // 表格最小高度，避免表格过小
  minHeight: {
    type: Number,
    default: 200
  }
});

const emit = defineEmits([
  'page-change',
  'page-size-change',
  'selection-change'
]);

// 表格引用，暴露给父组件
const tableRef = ref(null);
const containerRef = ref(null);

// 表格高度
const tableHeight = ref(null);

// 自动计算表格高度
const calculateTableHeight = async () => {
  if (!props.autoHeight) return;

  await nextTick();
  
  if (!containerRef.value || !tableRef.value?.$el) return;
  
  // 获取数据行数
  const rowCount = props.data.length;
  
  // 估计行高和其他元素高度
  const estimatedRowHeight = 60; // 每行的高度
  const headerHeight = 50; // 表头高度
  const otherElements = 20; // 其他元素的高度（边框等）
  
  // 计算表格内容需要的最小高度 (行数 * 行高 + 表头 + 其他)
  const contentMinHeight = rowCount * estimatedRowHeight + headerHeight + otherElements;
  
  // 获取容器可见高度
  const containerHeight = containerRef.value.clientHeight;
  const containerRect = containerRef.value.getBoundingClientRect();
  const tableTop = tableRef.value.$el.getBoundingClientRect().top - containerRect.top;
  
  // 计算分页区域的高度
  const paginationArea = containerRef.value.querySelector('.pagination-container');
  const paginationHeight = props.showPagination && paginationArea ? paginationArea.offsetHeight + 10 : 0;
  
  // 计算表格应该的高度 = 容器高度 - 表格到容器顶部距离 - 分页高度 - 底部边距
  let availableHeight = containerHeight - tableTop - paginationHeight - 5;
  
  // 如果提供了最大高度限制
  if (props.maxHeight && availableHeight > props.maxHeight) {
    availableHeight = props.maxHeight;
  }
  
  // 表格高度应该至少能容纳所有数据行
  const finalHeight = Math.max(availableHeight, contentMinHeight, props.minHeight);
  
  // 如果高度变化了，才更新
  if (tableHeight.value !== finalHeight) {
    tableHeight.value = finalHeight;
  }
};

// 分页数据
const pageSize = ref(props.pagination.pageSize || 10);
const currentPage = computed({
  get: () => props.pagination.page,
  set: (val) => emit('page-change', val)
});

// 选中行变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection);
};

// 换页
const changePage = (page) => {
  emit('page-change', page);
};

// 更改每页条数
const handlePageSizeChange = () => {
  emit('page-size-change', pageSize.value);
};

// 监听窗口大小变化
const handleResize = () => {
  calculateTableHeight();
};

// 监听数据变化重新计算高度
watch(() => props.data, () => {
  nextTick(() => {
    calculateTableHeight();
  });
}, { flush: 'post' });

// 监听加载状态变化重新计算高度
watch(() => props.loading, () => {
  nextTick(() => {
    calculateTableHeight();
  });
}, { flush: 'post' });

onMounted(() => {
  window.addEventListener('resize', handleResize);
  nextTick(() => {
    calculateTableHeight();
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 暴露方法给父组件
defineExpose({
  clearSelection: () => tableRef.value?.clearSelection(),
  recalculateHeight: calculateTableHeight
});
</script>

<style scoped>
.base-table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-small);
}

.left-actions, .right-actions {
  display: flex;
  gap: var(--spacing-small);
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px; /* 减少与表格的距离 */
  padding: var(--spacing-small);
  background-color: var(--white);
  border-radius: var(--border-radius-medium);
  flex-shrink: 0;
}

.pagination-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

:deep(.el-table) {
  margin-bottom: 0;
  flex: 1;
  overflow: hidden;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}

:deep(.el-table__body-wrapper) {
  overflow-x: hidden !important;
}

/* 增加行间距，突出每一行 */
:deep(.el-table__row) {
  height: 60px; /* 增加行高 */
}

:deep(.el-table__cell) {
  padding: 12px 0; /* 增加单元格内边距 */
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: var(--el-fill-color-lighter); /* 加深斑马纹颜色 */
}

/* 表格边框样式优化 */
:deep(.el-table--border) {
  border-bottom: 1px solid var(--el-table-border-color);
}

:deep(.el-table--border::after) {
  display: none;
}

/* 表格底部距离分页器的距离 */
:deep(.el-table__footer-wrapper) {
  margin-bottom: 0;
}

/* 调整滚动条样式 */
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  border-radius: 3px;
  background-color: rgba(144, 147, 153, 0.3);
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background-color: transparent;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: var(--spacing-small);
  }
  
  .pagination-container {
    flex-direction: column;
    gap: var(--spacing-small);
  }
  
  .pagination-control {
    width: 100%;
    justify-content: center;
  }
}
</style>