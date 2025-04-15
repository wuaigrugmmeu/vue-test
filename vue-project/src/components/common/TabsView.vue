<template>
  <div class="tabs-view-container">
    <el-scrollbar class="tabs-scrollbar">
      <div class="tabs-wrapper">
        <el-tabs 
          v-model="tabsStore.activeTab" 
          type="card" 
          @tab-click="handleTabClick" 
          @tab-remove="handleTabRemove"
          class="tabs-nav"
        >
          <el-tab-pane
            v-for="tab in tabsStore.tabs"
            :key="tab.path"
            :label="tab.title || formatTabName(tab.name)"
            :name="tab.path"
            :closable="tab.closable"
          ></el-tab-pane>
        </el-tabs>
      </div>
    </el-scrollbar>
    
    <div class="tabs-actions">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="tabs-action-trigger">
          <el-icon><More /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOthers">
              <el-icon><CircleClose /></el-icon>关闭其他标签
            </el-dropdown-item>
            <el-dropdown-item command="closeAll">
              <el-icon><RemoveFilled /></el-icon>关闭所有标签
            </el-dropdown-item>
            <el-dropdown-item command="refresh">
              <el-icon><Refresh /></el-icon>刷新当前页面
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useTabsStore } from '../../stores/tabs'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { More, CircleClose, RemoveFilled, Refresh } from '@element-plus/icons-vue'

const tabsStore = useTabsStore()
const route = useRoute()
const router = useRouter()

// 格式化标签名称，将首字母大写
const formatTabName = (name) => {
  if (!name) return '未命名'
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// 点击标签时切换路由
const handleTabClick = (tab) => {
  tabsStore.switchTab(tab.props.name)
}

// 移除标签
const handleTabRemove = (targetPath) => {
  tabsStore.closeTab(targetPath)
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch(command) {
    case 'closeOthers':
      tabsStore.closeOtherTabs()
      break
    case 'closeAll':
      tabsStore.closeAllTabs()
      break
    case 'refresh':
      const { path, query } = route
      router.replace({
        path: '/redirect' + path,
        query
      })
      break
  }
}

onMounted(() => {
  // 初始化标签页
  tabsStore.initTabs(route)
})
</script>

<style scoped>
.tabs-view-container {
  position: relative;
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.tabs-scrollbar {
  flex: 1;
  overflow: hidden;
}

.tabs-wrapper {
  display: flex;
  align-items: center;
}

.tabs-nav {
  width: 100%;
}

.tabs-actions {
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tabs-action-trigger {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  color: #909399;
}

.tabs-action-trigger:hover {
  color: var(--primary-color);
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-bottom: none;
  border-left: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item:first-child) {
  border-left: none;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0;
  margin-bottom: 0;
}

:deep(.el-tabs__header) {
  margin: 0;
  border: none;
}

:deep(.el-tabs__item) {
  height: 35px;
  line-height: 35px;
  padding: 0 15px;
}

:deep(.el-tabs__item.is-active) {
  background-color: #ecf5ff;
  color: var(--primary-color);
  border-bottom: none;
}
</style>