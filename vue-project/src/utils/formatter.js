/**
 * 格式化与表单验证相关的工具函数
 */

/**
 * 格式化日期时间
 * @param {string|Date} date 日期对象或日期字符串
 * @param {string} format 格式化模板，默认 YYYY-MM-DD HH:mm:ss
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return '';
  }
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取角色对应的标签类型
 * @param {string} role 角色代码
 * @returns {string} 对应的Element Plus标签类型
 */
export function getRoleTagType(role) {
  const typeMap = {
    'admin': 'danger',
    'editor': 'warning',
    'user': 'info'
  };
  return typeMap[role] || 'info';
}

/**
 * 角色代码到显示名称的映射
 */
export const roleMapping = {
  'admin': '管理员',
  'editor': '编辑',
  'user': '普通用户'
};

/**
 * 状态值到显示文本的映射
 */
export const statusMapping = {
  'active': '启用',
  'inactive': '禁用',
  'enabled': '启用',
  'disabled': '禁用'
};

/**
 * 表单验证规则
 */
export const validationRules = {
  required: (message = '此项为必填项') => ({
    required: true,
    message,
    trigger: 'blur'
  }),
  
  email: {
    type: 'email',
    message: '请输入正确的邮箱地址',
    trigger: 'blur'
  },
  
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号',
    trigger: 'blur'
  },
  
  username: {
    pattern: /^[a-zA-Z0-9_]{4,20}$/,
    message: '用户名由4-20位字母、数字、下划线组成',
    trigger: 'blur'
  },
  
  password: {
    pattern: /^[a-zA-Z0-9_!@#$%^&*]{6,20}$/,
    message: '密码由6-20位字母、数字或特殊字符组成',
    trigger: 'blur'
  }
};