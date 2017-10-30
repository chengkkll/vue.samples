
import { $http } from '@/config/const';
import EmployeeClass from '@/model/factory/employee';


 // 分页获取部门
function getEmployeesByQuery(query) {
  return $http.post('/Employee/Search', query)
    .then((res) => {
      // 格式化 员工信息，便于表格显示
      const result = {
        pagination: res.data.pagination,
        data: _.map(res.data.data, employee => new EmployeeClass(employee).show),
      };
      return result;
    });
}

// 通过 ID 获取部门
function getEmployeeById(id) {
  return $http.get(`/Employee/${id}`)
    .then(res => res.data);
}

// 保存员工
function saveEmployee(employee) {
  if (employee.id) {
    return $http.put('/Employee', employee)
    .then(res => res.data);
  }
  return $http.post('/Employee', employee)
    .then(res => res.data);
}

// 根据 ID 删除员工
function deletEmployeeById(id) {
  return $http.delete(`/Employee/${id}`)
    .then(res => res.data);
}

 // 可用单个员工
function enableEmployee(id) {
  return $http.patch(`/Employee/Enable/${id}`)
    .then(res => res.data);
}

// 禁用单个员工
function disableEmployee(id) {
  return $http.patch(`/Employee/Disable/${id}`)
    .then(res => res.data);
}

// 解锁单个员工
function unlockEmployee(id) {
  return $http.patch(`/Employee/Unlock/${id}`)
    .then(res => res.data);
}


export default {
  getEmployeesByQuery,
  getEmployeeById,
  saveEmployee,
  deletEmployeeById,
  enableEmployee,
  disableEmployee,
  unlockEmployee,
};
