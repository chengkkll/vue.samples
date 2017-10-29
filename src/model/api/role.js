
import { $http } from '@/config/const';

 // 分页获取角色
function getRolesByQuery(query) {
  return $http.post('/Role/Search', query)
    .then(res => res.data);
}

// 通过 ID 获取角色
function getRoleById(id) {
  return $http.get(`/Role/${id}`)
    .then(res => res.data);
}

// 保存角色
function saveRole(department) {
  if (department.id) {
    return $http.put('/Role', department)
    .then(res => res.data);
  }
  return $http.post('/Role', department)
    .then(res => res.data);
}

// 获取所有角色
function getAllRoles() {
  return $http.get('/Role/Select')
  .then(res => res.data);
}

// 根据 ID 删除角色
function deletRoleById(id) {
  return $http.delete(`/Role/${id}`)
    .then(res => res.data);
}
export default {
  getRolesByQuery,
  getRoleById,
  saveRole,
  getAllRoles,
  deletRoleById,
};
