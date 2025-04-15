<template>
  <div class="home page-container">
    <header class="header space-between mb-large">
      <div class="logo-section flex">
        <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="50" height="50" />
        <div class="header-title">
          <h1>Vue 3 应用首页</h1>
        </div>
      </div>
      <div class="user-info flex">
        <span class="welcome-text">欢迎，{{ authStore.name }}</span>
        <el-button type="danger" size="small" @click="handleLogout" class="logout-btn">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </header>

    <main>
      <div class="content card-container">
        <h2 class="mb-medium">系统功能</h2>
        <div class="feature-cards">
          <div class="card" @click="navigateTo('/users')">
            <div class="card-icon">👥</div>
            <h3>用户管理</h3>
            <p>管理系统用户，支持增删改查和分页查询</p>
          </div>
          <div class="card" @click="navigateTo('/roles')">
            <div class="card-icon">🔑</div>
            <h3>角色管理</h3>
            <p>管理系统角色和权限</p>
          </div>
          <div class="card disabled">
            <div class="card-icon">⚙️</div>
            <h3>系统设置</h3>
            <p>系统配置和参数设置（即将推出）</p>
          </div>
        </div>
      </div>

      <div class="dashboard-container">
        <div class="dashboard-header">
          <h2>系统仪表盘</h2>
          <div class="dashboard-date">
            <el-icon><Calendar /></el-icon>
            <span>{{ currentDate }}</span>
          </div>
        </div>
        
        <!-- 统计卡片区域 -->
        <div class="stat-cards">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-card-icon user-icon">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-card-content">
                  <div class="stat-card-title">用户总数</div>
                  <div class="stat-card-value">{{ statistics.userCount }}</div>
                  <div class="stat-card-trend">
                    <span class="trend-up">
                      <el-icon><ArrowUp /></el-icon> {{ statistics.userGrowth }}%
                    </span>
                    较上月
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-card-icon role-icon">
                  <el-icon><Key /></el-icon>
                </div>
                <div class="stat-card-content">
                  <div class="stat-card-title">角色总数</div>
                  <div class="stat-card-value">{{ statistics.roleCount }}</div>
                  <div class="stat-card-trend">
                    较上月
                    <span class="trend-stable">
                      <el-icon><ArrowRight /></el-icon> {{ statistics.roleGrowth }}%
                    </span>
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-card-icon visit-icon">
                  <el-icon><View /></el-icon>
                </div>
                <div class="stat-card-content">
                  <div class="stat-card-title">本月访问量</div>
                  <div class="stat-card-value">{{ statistics.visitCount }}</div>
                  <div class="stat-card-trend">
                    <span class="trend-up">
                      <el-icon><ArrowUp /></el-icon> {{ statistics.visitGrowth }}%
                    </span>
                    较上月
                  </div>
                </div>
              </div>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="6">
              <div class="stat-card">
                <div class="stat-card-icon operation-icon">
                  <el-icon><Operation /></el-icon>
                </div>
                <div class="stat-card-content">
                  <div class="stat-card-title">系统操作数</div>
                  <div class="stat-card-value">{{ statistics.operationCount }}</div>
                  <div class="stat-card-trend">
                    <span class="trend-down">
                      <el-icon><ArrowDown /></el-icon> {{ statistics.operationGrowth }}%
                    </span>
                    较上月
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 图表区域 -->
        <div class="chart-section">
          <el-row :gutter="20">
            <el-col :xs="24" :lg="12">
              <el-card class="chart-card" shadow="hover">
                <template #header>
                  <div class="chart-header">
                    <h3>用户活跃度趋势</h3>
                    <el-select v-model="userChartPeriod" size="small" style="width: 120px">
                      <el-option label="最近7天" value="week" />
                      <el-option label="最近30天" value="month" />
                      <el-option label="最近90天" value="quarter" />
                    </el-select>
                  </div>
                </template>
                <div class="chart-container" ref="userChart"></div>
              </el-card>
            </el-col>
            
            <el-col :xs="24" :lg="12">
              <el-card class="chart-card" shadow="hover">
                <template #header>
                  <div class="chart-header">
                    <h3>系统访问数据</h3>
                    <el-select v-model="visitChartPeriod" size="small" style="width: 120px">
                      <el-option label="最近7天" value="week" />
                      <el-option label="最近30天" value="month" />
                      <el-option label="最近90天" value="quarter" />
                    </el-select>
                  </div>
                </template>
                <div class="chart-container" ref="visitChart"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 最近操作记录 -->
        <el-card class="operation-log" shadow="hover">
          <template #header>
            <div class="op-log-header">
              <h3>最近操作记录</h3>
              <el-button type="primary" size="small" text>查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="recentOperations" style="width: 100%" stripe>
            <el-table-column prop="time" label="操作时间" width="180" />
            <el-table-column prop="user" label="操作用户" width="150" />
            <el-table-column prop="type" label="操作类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getOperationTypeTag(row.type)" size="small">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="操作内容" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small">
                  {{ row.status === 'success' ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import * as echarts from 'echarts'
import { 
  Calendar, 
  User, 
  Key, 
  View, 
  Operation, 
  ArrowUp, 
  ArrowDown,
  ArrowRight,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 图表引用
const userChart = ref(null)
const visitChart = ref(null)
const userChartInstance = ref(null)
const visitChartInstance = ref(null)

// 图表周期选择
const userChartPeriod = ref('week')
const visitChartPeriod = ref('week')

// 当前日期
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
}))

// 统计数据
const statistics = reactive({
  userCount: 156,
  userGrowth: 12.5,
  roleCount: 8,
  roleGrowth: 0,
  visitCount: 3426,
  visitGrowth: 25.7,
  operationCount: 1582,
  operationGrowth: -5.3
})

// 最近操作记录
const recentOperations = ref([
  { 
    time: '2025-04-15 10:23:45', 
    user: '管理员', 
    type: '新增', 
    content: '新增用户：张三', 
    status: 'success' 
  },
  { 
    time: '2025-04-15 09:18:22', 
    user: '运营人员', 
    type: '修改', 
    content: '修改角色权限：财务', 
    status: 'success' 
  },
  { 
    time: '2025-04-15 08:45:11', 
    user: '管理员', 
    type: '删除', 
    content: '删除过期数据', 
    status: 'success' 
  },
  { 
    time: '2025-04-14 17:32:58', 
    user: '测试账号', 
    type: '登录', 
    content: '账号登录系统', 
    status: 'failure' 
  },
  { 
    time: '2025-04-14 16:55:33', 
    user: '管理员', 
    type: '导出', 
    content: '导出用户数据报表', 
    status: 'success' 
  }
])

// 不同操作类型对应的标签类型
const getOperationTypeTag = (type) => {
  const map = {
    '新增': 'success',
    '修改': 'warning',
    '删除': 'danger',
    '登录': 'info',
    '导出': 'primary'
  }
  return map[type] || 'info'
}

// 初始化用户活跃度图表
const initUserChart = () => {
  if (!userChart.value) return
  
  // 销毁旧实例
  if (userChartInstance.value) {
    userChartInstance.value.dispose()
  }
  
  userChartInstance.value = echarts.init(userChart.value)
  
  // 根据周期选择生成日期数据
  const days = userChartPeriod.value === 'week' ? 7 : userChartPeriod.value === 'month' ? 30 : 90
  const dateList = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1) + i)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
  
  // 生成模拟数据
  const generateRandomData = (base, variance, length) => {
    return Array.from({ length }, () => Math.floor(base + Math.random() * variance))
  }
  
  const activeUsers = generateRandomData(80, 40, days)
  const newUsers = generateRandomData(20, 15, days)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['活跃用户', '新增用户'],
      bottom: '0%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dateList,
      axisLabel: {
        interval: userChartPeriod.value === 'week' ? 0 : 'auto'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        smooth: true,
        data: activeUsers,
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(64, 158, 255, 0.7)'
              },
              {
                offset: 1,
                color: 'rgba(64, 158, 255, 0.1)'
              }
            ]
          }
        }
      },
      {
        name: '新增用户',
        type: 'bar',
        data: newUsers,
        itemStyle: {
          color: '#67C23A'
        }
      }
    ]
  }
  
  userChartInstance.value.setOption(option)
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    userChartInstance.value && userChartInstance.value.resize()
  })
}

// 初始化系统访问数据图表
const initVisitChart = () => {
  if (!visitChart.value) return
  
  // 销毁旧实例
  if (visitChartInstance.value) {
    visitChartInstance.value.dispose()
  }
  
  visitChartInstance.value = echarts.init(visitChart.value)
  
  // 根据周期选择生成日期数据
  const days = visitChartPeriod.value === 'week' ? 7 : visitChartPeriod.value === 'month' ? 30 : 90
  const dateList = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1) + i)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
  
  // 生成模拟数据
  const generateRandomData = (base, variance, length) => {
    return Array.from({ length }, () => Math.floor(base + Math.random() * variance))
  }
  
  const pageViews = generateRandomData(200, 150, days)
  const uniqueVisitors = generateRandomData(50, 30, days)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['页面浏览量', '独立访客'],
      bottom: '0%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dateList,
      axisLabel: {
        interval: visitChartPeriod.value === 'week' ? 0 : 'auto'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '页面浏览量',
        type: 'line',
        stack: '总量',
        data: pageViews,
        smooth: true,
        itemStyle: {
          color: '#F56C6C'
        },
        lineStyle: {
          width: 2
        }
      },
      {
        name: '独立访客',
        type: 'line',
        stack: '总量',
        data: uniqueVisitors,
        smooth: true,
        itemStyle: {
          color: '#E6A23C'
        },
        lineStyle: {
          width: 2
        }
      }
    ]
  }
  
  visitChartInstance.value.setOption(option)
  
  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    visitChartInstance.value && visitChartInstance.value.resize()
  })
}

// 当图表周期改变时，重新渲染图表
watch(userChartPeriod, () => {
  initUserChart()
})

watch(visitChartPeriod, () => {
  initVisitChart()
})

onMounted(() => {
  // 确保状态正确
  authStore.checkAuth()
  
  // 延迟初始化图表，确保 DOM 已经渲染
  setTimeout(() => {
    initUserChart()
    initVisitChart()
  }, 100)
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    // 退出逻辑在store中处理，包括页面重定向
  } catch (error) {
    console.error('退出登录失败', error)
  }
}

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  padding-bottom: var(--spacing-medium);
  border-bottom: 1px solid var(--border-color-lighter);
}

.logo-section {
  align-items: center;
  gap: var(--spacing-medium);
}

.logo {
  margin-right: var(--spacing-medium);
}

h1 {
  margin: 0;
  color: var(--primary-color);
  font-size: var(--font-size-large);
}

.user-info {
  align-items: center;
  gap: var(--spacing-medium);
}

.welcome-text {
  color: var(--text-regular);
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-medium);
  margin-top: var(--spacing-medium);
}

.card {
  background-color: var(--background-color-light);
  border-radius: var(--border-radius-medium);
  padding: var(--spacing-large);
  transition: all var(--transition-duration) var(--transition-timing-function);
  cursor: pointer;
  box-shadow: var(--box-shadow-light);
  border: 1px solid var(--border-color-lighter);
}

.card:hover:not(.disabled) {
  transform: translateY(-5px);
  box-shadow: var(--box-shadow-dark);
  background-color: #f0f7ff;
}

.card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-medium);
}

.card h3 {
  color: var(--text-primary);
  margin-top: 0;
  margin-bottom: var(--spacing-small);
}

.card p {
  color: var(--text-secondary);
  margin: 0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-medium);
  }
  
  .user-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .feature-cards {
    grid-template-columns: 1fr;
  }
}

.dashboard-container {
  padding: var(--spacing-medium);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.dashboard-date {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.dashboard-date .el-icon {
  margin-right: 5px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 120px;
  display: flex;
  margin-bottom: 20px;
}

.stat-card-icon {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
}

.stat-card-icon .el-icon {
  font-size: 24px;
}

.user-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.role-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.visit-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.operation-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.stat-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-card-title {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-card-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.stat-card-trend {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  gap: 5px;
  align-items: center;
}

.trend-up {
  color: #F56C6C;
}

.trend-down {
  color: #67C23A;
}

.trend-stable {
  color: #E6A23C;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.chart-container {
  height: 350px;
  width: 100%;
}

.operation-log {
  margin-bottom: 20px;
}

.op-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.op-log-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stat-card {
    height: auto;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>