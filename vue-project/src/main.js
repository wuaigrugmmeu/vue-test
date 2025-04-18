import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createPinia } from 'pinia' // 导入Pinia

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia() // 创建Pinia实例

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia) // 使用Pinia
app.use(ElementPlus, {
  locale: zhCn, // 设置语言为中文
})

app.mount('#app')
