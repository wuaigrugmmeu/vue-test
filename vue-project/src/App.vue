<script setup>
// 不再需要直接导入组件，因为会通过路由系统加载
</script>

<template>
  <!-- 路由出口，将显示当前路由匹配的组件 -->
  <router-view></router-view>
</template>

<style>
/* 全局样式，移除默认边距 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}
</style>
