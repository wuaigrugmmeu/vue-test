<script setup>
// 不再需要直接导入组件，因为会通过路由系统加载
</script>

<template>
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
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  background-color: #f5f5f5;
}
</style>
