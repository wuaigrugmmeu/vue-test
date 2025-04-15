import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

// 定义标签页 store
export const useTabsStore = defineStore('tabs', () => {
  // 当前打开的标签页列表
  const tabs = ref([])
  
  // 当前活动的标签页
  const activeTab = ref('')
  
  // 固定的页面（不允许关闭）
  const fixedTabs = ['dashboard']

  // 添加标签页
  function addTab(route) {
    // 如果是登录页不添加标签
    if (route.name === 'login') return
    
    // 检查标签是否已经存在
    const isExist = tabs.value.some(tab => tab.path === route.path)
    
    if (!isExist) {
      tabs.value.push({
        title: route.meta?.title || route.name,
        path: route.path,
        name: route.name,
        closable: !fixedTabs.includes(route.name)
      })
    }
    
    // 设置当前活动标签
    activeTab.value = route.path
  }

  // 关闭标签页
  function closeTab(targetPath) {
    // 寻找需要关闭的标签索引
    const targetIndex = tabs.value.findIndex(tab => tab.path === targetPath)
    
    // 标签存在且允许关闭
    if (targetIndex !== -1 && tabs.value[targetIndex].closable) {
      // 如果关闭的是当前活动标签，则需要调整活动标签
      if (activeTab.value === targetPath) {
        // 优先选择右侧标签，如不存在则选择左侧标签
        const nextActiveIndex = targetIndex >= tabs.value.length - 1 ? targetIndex - 1 : targetIndex + 1
        
        if (nextActiveIndex >= 0) {
          activeTab.value = tabs.value[nextActiveIndex].path
          router.push(activeTab.value)
        }
      }
      
      // 从数组中移除该标签
      tabs.value.splice(targetIndex, 1)
    }
  }

  // 关闭其他标签页
  function closeOtherTabs() {
    // 只保留固定标签和当前活动标签
    tabs.value = tabs.value.filter(
      tab => !tab.closable || tab.path === activeTab.value
    )
  }

  // 关闭所有标签页
  function closeAllTabs() {
    // 只保留固定标签
    tabs.value = tabs.value.filter(tab => !tab.closable)
    
    // 如果有固定标签，则跳转到第一个固定标签
    if (tabs.value.length > 0) {
      activeTab.value = tabs.value[0].path
      router.push(activeTab.value)
    }
  }

  // 切换到指定标签页
  function switchTab(path) {
    activeTab.value = path
    router.push(path)
  }

  // 初始化标签页（从路由加载）
  function initTabs(route) {
    // 检查是否已经有仪表盘标签，没有则添加
    const hasDashboard = tabs.value.some(tab => tab.name === 'dashboard')
    if (!hasDashboard) {
      tabs.value.push({
        title: '仪表盘',
        path: '/dashboard',
        name: 'dashboard',
        closable: false
      })
    }
    
    // 如果当前路由不是登录页，则添加当前页面的标签
    if (route.name !== 'login') {
      addTab(route)
    }
  }

  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
    switchTab,
    initTabs
  }
})