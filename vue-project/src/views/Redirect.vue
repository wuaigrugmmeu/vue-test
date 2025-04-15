<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  
  // 取得真实路径并进行重定向
  const redirectPath = '/' + path
  router.replace({ path: redirectPath, query })
})
</script>

<template>
  <div>重定向中...</div>
</template>