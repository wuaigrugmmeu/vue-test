// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 从localStorage获取角色数据，如果没有则创建初始数据
const getRolesFromStorage = () => {
  const storedRoles = localStorage.getItem('mock_roles');
  if (storedRoles) {
    return JSON.parse(storedRoles);
  }
  
  // 创建初始角色数据
  const initialRoles = [
    {
      id: 1,
      name: '超级管理员',
      code: 'super_admin',
      description: '拥有系统所有权限',
      status: 'enabled',
      permissions: ['all'],
      createTime: formatDate(new Date(2023, 0, 1)),
      sort: 1
    },
    {
      id: 2,
      name: '管理员',
      code: 'admin',
      description: '拥有大部分系统权限',
      status: 'enabled',
      permissions: ['user:view', 'user:create', 'user:edit', 'user:delete', 'role:view', 'role:create', 'role:edit', 'role:delete'],
      createTime: formatDate(new Date(2023, 0, 5)),
      sort: 2
    },
    {
      id: 3,
      name: '编辑',
      code: 'editor',
      description: '负责内容编辑',
      status: 'enabled',
      permissions: ['content:view', 'content:create', 'content:edit'],
      createTime: formatDate(new Date(2023, 0, 10)),
      sort: 3
    },
    {
      id: 4,
      name: '普通用户',
      code: 'user',
      description: '普通用户角色',
      status: 'enabled',
      permissions: ['content:view'],
      createTime: formatDate(new Date(2023, 0, 15)),
      sort: 4
    },
    {
      id: 5,
      name: '访客',
      code: 'guest',
      description: '访客角色',
      status: 'disabled',
      permissions: ['content:view'],
      createTime: formatDate(new Date(2023, 0, 20)),
      sort: 5
    }
  ];
  
  // 存储到localStorage
  localStorage.setItem('mock_roles', JSON.stringify(initialRoles));
  
  return initialRoles;
};

// 保存角色数据到localStorage
const saveRolesToStorage = (roles) => {
  localStorage.setItem('mock_roles', JSON.stringify(roles));
};

// 初始化角色数据
let roles = getRolesFromStorage();

// 模拟权限树结构数据
export const permissionTree = [
  {
    id: 'system',
    label: '系统管理',
    children: [
      {
        id: 'user:view',
        label: '查看用户'
      },
      {
        id: 'user:create',
        label: '创建用户'
      },
      {
        id: 'user:edit',
        label: '编辑用户'
      },
      {
        id: 'user:delete',
        label: '删除用户'
      }
    ]
  },
  {
    id: 'role',
    label: '角色管理',
    children: [
      {
        id: 'role:view',
        label: '查看角色'
      },
      {
        id: 'role:create',
        label: '创建角色'
      },
      {
        id: 'role:edit',
        label: '编辑角色'
      },
      {
        id: 'role:delete',
        label: '删除角色'
      }
    ]
  },
  {
    id: 'content',
    label: '内容管理',
    children: [
      {
        id: 'content:view',
        label: '查看内容'
      },
      {
        id: 'content:create',
        label: '创建内容'
      },
      {
        id: 'content:edit',
        label: '编辑内容'
      },
      {
        id: 'content:delete',
        label: '删除内容'
      }
    ]
  }
];

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取角色列表（带分页）
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 * @param {object} filters 过滤条件
 * @returns {Promise} 角色列表数据和分页信息
 */
export const fetchRoles = async (page = 1, pageSize = 10, filters = {}) => {
  await delay(500);
  
  // 获取最新数据
  roles = getRolesFromStorage();
  
  // 应用过滤条件
  let filteredRoles = [...roles];
  
  if (filters.name) {
    filteredRoles = filteredRoles.filter(role => 
      role.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }
  
  if (filters.code) {
    filteredRoles = filteredRoles.filter(role => 
      role.code.toLowerCase().includes(filters.code.toLowerCase())
    );
  }
  
  if (filters.status) {
    filteredRoles = filteredRoles.filter(role => role.status === filters.status);
  }

  // 计算分页数据
  const total = filteredRoles.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredRoles.slice(start, end);
  
  return {
    list: pageData,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

/**
 * 获取单个角色详情
 * @param {number} id 角色ID
 * @returns {Promise} 角色详情
 */
export const getRoleById = async (id) => {
  await delay(300);
  
  // 获取最新数据
  roles = getRolesFromStorage();
  
  const role = roles.find(r => r.id === parseInt(id));
  if (!role) {
    throw new Error('角色不存在');
  }
  return role;
};

/**
 * 添加角色
 * @param {object} roleData 角色数据
 * @returns {Promise} 新增的角色数据
 */
export const addRole = async (roleData) => {
  await delay(500);
  
  // 获取最新数据
  roles = getRolesFromStorage();
  
  const newRole = {
    ...roleData,
    id: Math.max(...roles.map(r => r.id), 0) + 1,
    createTime: formatDate(new Date())
  };
  
  roles.push(newRole);
  saveRolesToStorage(roles);
  
  return newRole;
};

/**
 * 更新角色
 * @param {object} roleData 角色数据
 * @returns {Promise} 更新后的角色数据
 */
export const updateRole = async (roleData) => {
  await delay(500);
  
  // 获取最新数据
  roles = getRolesFromStorage();
  
  const index = roles.findIndex(r => r.id === parseInt(roleData.id));
  if (index !== -1) {
    // 保留创建时间不变
    roleData.createTime = roles[index].createTime;
    roles[index] = { ...roleData };
    
    saveRolesToStorage(roles);
    return roles[index];
  }
  throw new Error('角色不存在');
};

/**
 * 删除角色
 * @param {number} id 角色ID
 * @returns {Promise} 操作结果
 */
export const deleteRole = async (id) => {
  await delay(500);
  
  // 获取最新数据
  roles = getRolesFromStorage();
  
  const index = roles.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    // 检查是否为内置角色
    if (id <= 5) {
      throw new Error('内置角色不能删除');
    }
    
    roles.splice(index, 1);
    saveRolesToStorage(roles);
    
    return { success: true, message: '删除成功' };
  }
  throw new Error('角色不存在');
};

/**
 * 批量删除角色
 * @param {Array} ids 角色ID数组
 * @returns {Promise} 操作结果
 */
export const batchDeleteRoles = async (ids) => {
  await delay(800);
  
  // 获取最新数据
  roles = getRolesFromStorage();
  
  let deletedCount = 0;
  let skippedCount = 0;
  
  for (const id of ids) {
    const index = roles.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      // 检查是否为内置角色
      if (parseInt(id) <= 5) {
        skippedCount++;
        continue;
      }
      roles.splice(index, 1);
      deletedCount++;
    }
  }
  
  saveRolesToStorage(roles);
  
  return {
    success: true,
    message: `成功删除${deletedCount}个角色${skippedCount > 0 ? '，' + skippedCount + '个内置角色无法删除' : ''}`,
    deletedCount,
    skippedCount
  };
};

/**
 * 获取所有权限
 * @returns {Promise} 权限树列表
 */
export const getAllPermissions = async () => {
  await delay(400);
  return permissionTree;
};