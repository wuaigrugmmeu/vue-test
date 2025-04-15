// 模拟的用户数据
const mockUsers = [
  {
    username: 'admin',
    password: '123456',
    name: '管理员'
  },
  {
    username: 'user',
    password: '123456',
    name: '普通用户'
  }
];

/**
 * 模拟登录API
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise} 返回登录结果的Promise
 */
export function login(username, password) {
  return new Promise((resolve, reject) => {
    // 模拟网络请求延迟
    setTimeout(() => {
      const user = mockUsers.find(
        user => user.username === username && user.password === password
      );
      
      if (user) {
        // 登录成功，返回用户信息和token(模拟)
        resolve({
          code: 200,
          data: {
            token: `mock-token-${Date.now()}`,
            userInfo: {
              name: user.name,
              username: user.username
            }
          },
          message: '登录成功'
        });
      } else {
        // 登录失败
        reject({
          code: 401,
          message: '用户名或密码错误'
        });
      }
    }, 1000); // 延迟1秒，模拟网络请求
  });
}

/**
 * 退出登录
 */
export function logout() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '退出登录成功'
      });
    }, 500);
  });
}