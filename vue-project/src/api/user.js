// 生成随机颜色
const getRandomColor = () => {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#6366f1', 
    '#8b5cf6', '#ec4899', '#ef4444', '#0ea5e9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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

// 从localStorage获取数据，如果没有则创建初始数据
const getUsersFromStorage = () => {
  const storedUsers = localStorage.getItem('mock_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // 创建初始用户数据
  const initialUsers = Array.from({ length: 100 }, (_, index) => {
    const id = index + 1;
    const roleTypes = ['admin', 'editor', 'user'];
    const statusTypes = ['active', 'inactive'];
    
    return {
      id,
      username: `用户${id}`,
      email: `user${id}@example.com`,
      phone: `1${Math.floor(Math.random() * 10)}${String(Math.floor(Math.random() * 1000000000)).padStart(9, '0')}`,
      role: roleTypes[Math.floor(Math.random() * roleTypes.length)],
      status: statusTypes[Math.floor(Math.random() * statusTypes.length)],
      createTime: formatDate(new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)),
      avatarColor: getRandomColor()
    };
  });
  
  // 存储到localStorage
  localStorage.setItem('mock_users', JSON.stringify(initialUsers));
  
  return initialUsers;
};

// 保存用户数据到localStorage
const saveUsersToStorage = (users) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// 初始化用户数据
let users = getUsersFromStorage();

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 获取用户列表（带分页）
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 * @param {object} filters 过滤条件
 * @returns {Promise} 用户列表数据和分页信息
 */
export const fetchUsers = async (page = 1, pageSize = 10, filters = {}) => {
  await delay(500);
  
  // 获取最新数据
  users = getUsersFromStorage();
  
  // 应用过滤条件
  let filteredUsers = [...users];
  
  if (filters.username) {
    filteredUsers = filteredUsers.filter(user => 
      user.username.toLowerCase().includes(filters.username.toLowerCase())
    );
  }
  
  if (filters.role) {
    filteredUsers = filteredUsers.filter(user => user.role === filters.role);
  }
  
  if (filters.status) {
    filteredUsers = filteredUsers.filter(user => user.status === filters.status);
  }

  // 计算分页数据
  const total = filteredUsers.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filteredUsers.slice(start, end);
  
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
 * 获取单个用户详情
 * @param {number} id 用户ID
 * @returns {Promise} 用户详情
 */
export const getUserById = async (id) => {
  await delay(300);
  
  // 获取最新数据
  users = getUsersFromStorage();
  
  const user = users.find(u => u.id === parseInt(id));
  if (!user) {
    throw new Error('用户不存在');
  }
  return user;
};

/**
 * 添加用户
 * @param {object} userData 用户数据
 * @returns {Promise} 新增的用户数据
 */
export const addUser = async (userData) => {
  await delay(500);
  
  // 获取最新数据
  users = getUsersFromStorage();
  
  const newUser = {
    ...userData,
    id: Math.max(...users.map(u => u.id), 0) + 1,
    createTime: formatDate(new Date()),
    avatarColor: getRandomColor()
  };
  
  users.push(newUser);
  saveUsersToStorage(users);
  
  return newUser;
};

/**
 * 更新用户
 * @param {object} userData 用户数据
 * @returns {Promise} 更新后的用户数据
 */
export const updateUser = async (userData) => {
  await delay(500);
  
  // 获取最新数据
  users = getUsersFromStorage();
  
  const index = users.findIndex(u => u.id === parseInt(userData.id));
  if (index !== -1) {
    // 保留创建时间和头像颜色不变
    userData.createTime = users[index].createTime;
    userData.avatarColor = users[index].avatarColor;
    users[index] = { ...userData };
    
    saveUsersToStorage(users);
    return users[index];
  }
  throw new Error('用户不存在');
};

/**
 * 删除用户
 * @param {number} id 用户ID
 * @returns {Promise} 操作结果
 */
export const deleteUser = async (id) => {
  await delay(500);
  
  // 获取最新数据
  users = getUsersFromStorage();
  
  const index = users.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    users.splice(index, 1);
    saveUsersToStorage(users);
    return { success: true, message: '删除成功' };
  }
  throw new Error('用户不存在');
};

/**
 * 批量删除用户
 * @param {Array} ids 用户ID数组
 * @returns {Promise} 操作结果
 */
export const batchDeleteUsers = async (ids) => {
  await delay(800);
  
  // 获取最新数据
  users = getUsersFromStorage();
  
  const deletedCount = ids.reduce((count, id) => {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      users.splice(index, 1);
      return count + 1;
    }
    return count;
  }, 0);
  
  saveUsersToStorage(users);
  
  return {
    success: true,
    message: `成功删除${deletedCount}个用户`,
    deletedCount
  };
};