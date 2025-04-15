<template>
  <el-card class="role-form-container" shadow="never">
    <template #header>
      <div class="form-header">
        <h3>{{ isEdit ? '编辑角色' : '添加角色' }}</h3>
      </div>
    </template>
    
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      :rules="rules"
      @submit.prevent="submitForm"
      class="role-form"
    >
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item label="角色名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入角色名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12">
          <el-form-item label="角色编码" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请输入角色编码"
              clearable
              :disabled="isEdit && formData.id <= 5"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="formData.sort"
              :min="1"
              :max="99"
              :step="1"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12">
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="statusEnabled"
              active-text="启用"
              inactive-text="禁用"
              :active-value="true"
              :inactive-value="false"
              style="width: 100%"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入角色描述"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTreeData"
          show-checkbox
          node-key="id"
          :props="{ children: 'children', label: 'label' }"
          :default-checked-keys="formData.permissions"
          :default-expand-all="true"
          @check="handlePermissionCheck"
        ></el-tree>
      </el-form-item>
      
      <el-divider></el-divider>
      
      <div class="form-actions">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="isSubmitting">保存</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { getAllPermissions } from '../api/role.js'

const props = defineProps({
  role: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// 表单引用
const formRef = ref(null)
// 权限树引用
const permissionTreeRef = ref(null)
// 权限树数据
const permissionTreeData = ref([])

// 是否是编辑模式
const isEdit = computed(() => props.role && props.role.id)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  status: 'enabled',
  permissions: [],
  sort: 50
})

// 状态切换 (enabled/disabled)
const statusEnabled = computed({
  get: () => formData.status === 'enabled',
  set: (val) => {
    formData.status = val ? 'enabled' : 'disabled'
  }
})

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符之间', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '角色编码只能包含字母、数字和下划线，且必须以字母或下划线开头', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序号', trigger: 'blur' },
    { type: 'number', message: '排序号必须为数字', trigger: 'blur' }
  ],
  permissions: [
    { type: 'array', required: true, message: '请至少选择一个权限', trigger: 'change' }
  ]
})

// 监听角色数据变化，填充表单
watch(() => props.role, (newValue) => {
  if (newValue) {
    Object.keys(formData).forEach(key => {
      if (key in newValue) {
        formData[key] = newValue[key]
      }
    })
  } else {
    // 重置表单
    Object.keys(formData).forEach(key => {
      if (key === 'status') {
        formData[key] = 'enabled'
      } else if (key === 'sort') {
        formData[key] = 50
      } else if (key === 'permissions') {
        formData[key] = []
      } else {
        formData[key] = ''
      }
    })
  }
}, { immediate: true })

// 处理权限选择
const handlePermissionCheck = (node, checked) => {
  formData.permissions = permissionTreeRef.value.getCheckedKeys()
  
  // 特殊处理'all'权限，如果选择了'all'，则自动选择所有，反之亦然
  if (node.id === 'all') {
    // 如果勾选了'all'，则勾选所有权限
    if (checked.checkedKeys.includes('all')) {
      const allKeys = getAllTreeNodeKeys(permissionTreeData.value)
      permissionTreeRef.value.setCheckedKeys(allKeys)
      formData.permissions = allKeys
    } 
    // 如果取消勾选了'all'，则取消勾选所有权限
    else {
      permissionTreeRef.value.setCheckedKeys([])
      formData.permissions = []
    }
  } else {
    // 如果选择了所有节点，则自动选中'all'
    const allKeys = getAllTreeNodeKeys(permissionTreeData.value)
    const currentCheckedKeys = permissionTreeRef.value.getCheckedKeys()
    
    // 判断是否包含了除'all'外的所有权限
    const hasAllPermissions = allKeys.filter(key => key !== 'all')
      .every(key => currentCheckedKeys.includes(key))
      
    if (hasAllPermissions && !currentCheckedKeys.includes('all')) {
      currentCheckedKeys.push('all')
      permissionTreeRef.value.setCheckedKeys(currentCheckedKeys)
      formData.permissions = currentCheckedKeys
    }
    
    // 如果权限不完全，要取消'all'
    if (!hasAllPermissions && currentCheckedKeys.includes('all')) {
      const newCheckedKeys = currentCheckedKeys.filter(key => key !== 'all')
      permissionTreeRef.value.setCheckedKeys(newCheckedKeys)
      formData.permissions = newCheckedKeys
    }
  }
}

// 递归获取树的所有节点key
const getAllTreeNodeKeys = (nodes) => {
  let keys = []
  nodes.forEach(node => {
    keys.push(node.id)
    if (node.children && node.children.length > 0) {
      keys = [...keys, ...getAllTreeNodeKeys(node.children)]
    }
  })
  return keys
}

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', { ...formData })
    }
  })
}

// 初始化获取权限树数据
onMounted(async () => {
  try {
    const allPermissions = await getAllPermissions()
    
    // 添加一个"全部"权限选项
    permissionTreeData.value = [
      {
        id: 'all',
        label: '全部权限'
      },
      ...allPermissions
    ]
    
    // 如果是超级管理员角色，默认选中"全部"
    if (isEdit.value && formData.permissions.includes('all')) {
      setTimeout(() => {
        const allKeys = getAllTreeNodeKeys(permissionTreeData.value)
        permissionTreeRef.value.setCheckedKeys(allKeys)
        formData.permissions = allKeys
      }, 0)
    }
  } catch (error) {
    console.error('获取权限树失败:', error)
  }
})
</script>

<style scoped>
.role-form-container {
  border-radius: 4px;
  margin: 24px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.role-form {
  padding: 20px 0;
}

.el-row {
  margin-bottom: 16px;
}

.el-form-item {
  margin-bottom: 22px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 树形控件样式优化 */
:deep(.el-tree) {
  background-color: #f9fafc;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
}

:deep(.el-tree-node__content) {
  height: 36px;
}

:deep(.el-divider) {
  margin: 24px 0;
}
</style>