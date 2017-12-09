import { $http } from '@/config/const';

// 登录
function login(info) {
  return $http.post('/Auth/Login', info)
    .then(res => res.data);
}

// 注册
function register(info) {
  return $http.post('/register', info)
    .then(res => res.data);
}

// 通过 token 获取用户信息
function getInfoByToken() {
  return $http.get('/Employee/Power')
    .then(res => res.data);
}

// 获取多有功能点
function getAllFunctions() {
  return $http.get('/Function')
    .then(res => res.data);
}

// 获取所有菜单
function getAllMenus() {
  return $http.get('/Menu')
    .then(res => res.data);
}

// 获取用户详细信息
function getDetailById(id) {
  return $http.get(`/Employee/${id}`)
    .then(res => res.data);
}

// 更改密码
function changePassword(data) {
  return $http.patch('/Employee/UpPwd/Me', data)
    .then(res => res.data);
}

// 更新一个菜单
function updateMenu(menu) {
  if (menu.id) {
    return $http.post('/Menu', menu)
    .then(res => res.data);
  }
  return $http.put('/Menu', menu)
    .then(res => res.data);
}

// 删除一个主菜单
function deleteMenu(id) {
  return $http.delete(`/Menu/${id}`)
    .then(res => res.data);
}

// 发送验证码
function sendCode(mobile) {
  return $http.post('/Forget/SendCode', {
    mobile,
  })
    .then(res => res.data);
}

// 修改密码
function changePasswordByCode({ mobile, code, newPassword }) {
  return $http.post('/Forget/ChangePassword', {
    mobile,
    code,
    newPassword,
  })
    .then(res => res.data);
}

export default {
  login,
  register,
  getInfoByToken,
  getAllFunctions,
  getAllMenus,
  getDetailById,
  changePassword,
  updateMenu,
  deleteMenu,
  sendCode,
  changePasswordByCode,
};
