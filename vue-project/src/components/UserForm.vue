<template>
  <el-card class="user-form-container" shadow="never">
    <template #header>
      <div class="form-header">
        <h3>{{ isEdit ? '编辑用户' : '添加用户' }}</h3>
      </div>
    </template>
    
    <el-form
      ref="formRef"
      :model="formData"
      label-width="80px"
      :rules="rules"
      @submit.prevent="submitForm"
      class="user-form"
    >
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="formData.email"
              type="email"
              placeholder="请输入邮箱"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入手机号"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :sm="12">
          <el-form-item label="角色" prop="role">
            <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="statusActive"
              active-text="启用"
              inactive-text="禁用"
              :active-value="true"
              :inactive-value="false"
              style="width: 100%"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      
      <template v-if="!isEdit">
        <el-row :gutter="20">
          <el-col :sm="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                show-password
              ></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :sm="12">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      
      <el-divider></el-divider>
      
      <div class="form-actions">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="isSubmitting">保存</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)

// 是否是编辑模式
const isEdit = computed(() => props.user && props.user.id)

// 表单数据
const formData = reactive({
  id: '',
  username: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active',
  password: '',
  confirmPassword: ''
})

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '编辑', value: 'editor' },
  { label: '普通用户', value: 'user' }
]

// 状态开关 (active/inactive)
const statusActive = computed({
  get: () => formData.status === 'active',
  set: (val) => {
    formData.status = val ? 'active' : 'inactive'
  }
})

// 自定义验证规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else {
    if (formData.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      callback(new Error('请输入有效的手机号'))
    } else {
      callback()
    }
  }
}

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, message: '用户名长度不能小于2个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  password: [
    { validator: validatePass, trigger: 'blur', required: !isEdit.value }
  ],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur', required: !isEdit.value }
  ]
})

// 监听用户数据变化，填充表单
watch(() => props.user, (newValue) => {
  if (newValue) {
    Object.keys(formData).forEach(key => {
      if (key in newValue) {
        formData[key] = newValue[key]
      }
    })
  } else {
    // 重置表单
    Object.keys(formData).forEach(key => {
      if (key === 'role') {
        formData[key] = 'user'
      } else if (key === 'status') {
        formData[key] = 'active'
      } else {
        formData[key] = ''
      }
    })
  }
}, { immediate: true })

// 提交表单
const submitForm = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      // 创建一个新对象，避免传递密码确认等无用字段
      const userData = {
        id: formData.id,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      }
      
      // 只有在新增用户时才传递密码
      if (!isEdit.value && formData.password) {
        userData.password = formData.password
      }
      
      emit('submit', userData)
    }
  })
}
</script>

<style scoped>
.user-form-container {
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

.user-form {
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

:deep(.el-divider) {
  margin: 24px 0;
}
</style>