/**
 * 表格和分页操作相关的通用工具函数
 */

import { ElMessage, ElMessageBox } from 'element-plus';

/**
 * 通用的表格删除确认函数
 * @param {Object} options 选项
 * @param {string} options.title 确认框标题
 * @param {string} options.message 确认框内容
 * @param {Function} options.onConfirm 确认回调函数
 */
export async function confirmDelete({
  title = '确认删除',
  message = '确定要删除所选项吗？',
  onConfirm
} = {}) {
  try {
    await ElMessageBox.confirm(message, title, {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    if (typeof onConfirm === 'function') {
      await onConfirm();
    }
  } catch (error) {
    // 用户取消操作，不需要额外处理
  }
}

/**
 * 通用的表格选择处理
 * @param {object} tableRef 表格引用
 * @returns {object} 表格选择处理方法
 */
export function useTableSelection(tableRef) {
  const clearSelection = () => {
    tableRef.value?.clearSelection();
  };
  
  return {
    clearSelection
  };
}

/**
 * 处理批量删除操作
 * @param {Array} selectedRows 选中的行数据
 * @param {string} idKey 行数据中ID的键名，默认为"id"
 * @param {Function} deleteCallback 删除回调函数
 * @param {Function} clearSelectionFn 清除选择的函数
 */
export async function handleBatchAction(selectedRows, idKey = 'id', deleteCallback, clearSelectionFn) {
  if (!selectedRows || selectedRows.length === 0) {
    ElMessage.warning('请至少选择一项');
    return;
  }

  const ids = selectedRows.map(item => item[idKey]);
  
  try {
    await confirmDelete({
      message: `确定要删除选中的 ${ids.length} 项吗？`,
      onConfirm: async () => {
        await deleteCallback(ids);
        if (typeof clearSelectionFn === 'function') {
          clearSelectionFn();
        }
        ElMessage.success('批量删除成功');
      }
    });
  } catch (error) {
    ElMessage.error(`操作失败: ${error.message}`);
  }
}

/**
 * 通用的分页配置
 */
export const defaultPagination = {
  page: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper',
  total: 0
};