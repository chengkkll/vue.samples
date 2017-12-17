<template>
  <div class="employees">
   <list-container 
    @currentChange="currentChange" 
    @search="search"
    :pagination="pagination"
    create-to="System.Employees.Edit"
    :can-create="checkFun('SystemManage.EmployeeController.Create')"
    :can-search="checkFun('SystemManage.EmployeeController.SearchPage')"
    v-loading="loading">
    <div slot="search">
      <el-row :gutter="24">
        <el-col :span="12">
           <el-form :model="query" label-width="20px">
            <el-form-item label="员工名称" label-width="85px">
              <el-input placeholder="请输入员工名称" v-model="query.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
         </el-col >
      </el-row>
     </div>
     <div slot="table">
       <el-table
        border
        stripe
        sortable="custom"
        @sort-change="sortChange"
        :default-sort="sort"
        :data="data"
        style="width: 100%"
        :max-height="maxHeight"> 
        <el-table-column
          prop="date"
          label="序号"
          type="index"
          :index="countMethod">
        </el-table-column>
        <el-table-column
          sortable
          prop="name"
          label="员工名称">
        </el-table-column>
        <el-table-column
          prop="logon_account"
          label="登录账号">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="部门">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="update_date"
          sortable
          label="更新时间">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
        </el-table-column>
        <el-table-column
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button  
              @click="edit('System.Employees.Edit', scope.row.id)" 
              type="text" 
              size="small"
              v-if="checkFun('SystemManage.EmployeeController.Update')">
              编辑
            </el-button>
            <el-button  
              @click="action(scope.row.id, '恢复', handleEnable)" 
              type="text" 
              size="small"
              v-if="checkFun('SystemManage.EmployeeController.Enable') && scope.row.originState === 5">
              恢复
            </el-button>
            <el-button  
              @click="action(scope.row.id, '禁止', handleDisable, 'error')" 
              type="text" 
              size="small"
              v-if="checkFun('SystemManage.EmployeeController.Disable', 'error') && scope.row.originState === 1">
              禁止
            </el-button>
            <el-button  
              @click="action(scope.row.id, '解锁登录', handleUnlockLogin)" 
              type="text" 
              size="small"
              v-if="checkFun('SystemManage.EmployeeController.Unlock')  && scope.row.originState === 3">
              解锁登录
            </el-button>
            <el-button  
              @click="action(scope.row.id, '删除', handleDlete, 'error')" 
              type="text" 
              size="small" 
              v-if="checkFun('SystemManage.EmployeeController.Delete')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
     </div>
   </list-container>
  </div>
</template>

<script>
import List from '@/view/components/list-container/list';
import AuthCheck from '@/view/components/auth-check';
import employeeApi from '@/model/api/employee';

export default {
  name: 'Employees',
  extends: List,
  mixins: [AuthCheck],
  data() {
    return {
      name: '员工',
    };
  },
  methods: {
    getData(query) {
      return employeeApi.getEmployeesByQuery(query);
    },
    handleDlete(id) {
      return employeeApi.deletEmployeeById(id);
    },
    handleUnlockLogin(id) {
      return employeeApi.unlockEmployee(id);
    },
    handleEnable(id) {
      return employeeApi.enableEmployee(id);
    },
    handleDisable(id) {
      return employeeApi.disableEmployee(id);
    },
  },
};
</script>

<style scoped lang="scss">

</style>
