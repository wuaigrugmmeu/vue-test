# vue-test

## 项目简介

这是一个基于Vue 3框架的标准项目，使用Vite作为构建工具，实现了用户登录功能。项目包含模拟API接口，用于演示登录验证流程。

## 项目结构

```
vue-project/              # 项目根目录
├── index.html            # HTML入口文件
├── jsconfig.json         # JavaScript配置文件
├── package.json          # 项目依赖和脚本配置
├── README.md             # 项目说明文档
├── vite.config.js        # Vite构建工具配置文件
├── public/               # 静态资源目录
│   └── favicon.ico       # 网站图标
└── src/                  # 源代码目录
    ├── App.vue           # 应用程序主组件
    ├── main.js           # 应用程序入口文件
    ├── api/              # API接口目录
    │   └── auth.js       # 认证相关的API（登录/登出）
    ├── assets/           # 资源文件目录
    │   ├── base.css      # 基础CSS样式
    │   ├── logo.svg      # Vue logo图片
    │   └── main.css      # 主要CSS样式
    ├── components/       # 通用组件目录
    │   ├── HelloWorld.vue    # 欢迎组件
    │   ├── TheWelcome.vue    # 欢迎页面组件
    │   ├── WelcomeItem.vue   # 欢迎项目组件
    │   └── icons/           # 图标组件目录
    │       ├── IconCommunity.vue     # 社区图标组件
    │       ├── IconDocumentation.vue # 文档图标组件
    │       ├── IconEcosystem.vue     # 生态系统图标组件
    │       ├── IconSupport.vue       # 支持图标组件
    │       └── IconTooling.vue       # 工具图标组件
    ├── router/           # 路由目录
    │   └── index.js      # 路由配置文件
    └── views/            # 视图组件目录
        ├── HomeView.vue  # 主页视图组件
        └── Login.vue     # 登录页面组件
```

## 功能模块说明

### 1. 登录模块

- **文件位置**: `src/views/Login.vue` 和 `src/api/auth.js`
- **功能描述**: 提供用户登录界面和认证功能
- **实现方式**: 使用模拟API进行用户名和密码验证
- **测试账号**:
  - 用户名: `admin`, 密码: `123456`
  - 用户名: `user`, 密码: `123456`

### 2. 路由管理

- **文件位置**: `src/router/index.js`
- **功能描述**: 管理页面路由跳转和权限控制
- **实现方式**: 使用Vue Router 4，配置了登录页和主页的路由规则
- **权限控制**: 实现了路由守卫，未登录用户会被重定向到登录页面

### 3. 主页模块

- **文件位置**: `src/views/HomeView.vue`
- **功能描述**: 已登录用户的主页界面
- **功能**: 展示登录用户信息，提供退出登录功能

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **路由管理**: Vue Router 4
- **CSS方案**: 使用Scoped CSS进行样式隔离

## 开发与运行

### 安装依赖

```bash
cd vue-project
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目预览

登录后的应用将展示用户信息，并提供退出登录功能。整个应用通过Vue Router管理路由，未登录状态会自动跳转到登录页面进行身份验证。