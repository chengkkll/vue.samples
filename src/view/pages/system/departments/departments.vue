<template>
  <div class="departments">
    <!-- can-create: 是否可以编辑 -->
    <!-- can-search: 是否可以搜索 -->
    <!-- create-to: 编辑的跳转路径 -->
   <list-container 
    @currentChange="currentChange" 
    @search="search"
    :pagination="pagination"
    create-to="System.Departments.Edit"
    :can-create="checkFun('SystemManage.DepartmentController.Create')"
    :can-search="checkFun('SystemManage.DepartmentController.SearchPage')"
    v-loading="loading">
    <div slot="search">
      <el-row :gutter="24">
        <el-col :span="12">
           <el-form :model="query" label-width="20px">
            <el-form-item label="部门名称" label-width="85px">
              <el-input placeholder="请输入部门名称" v-model="query.name" auto-complete="off"></el-input>
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
        height="400"> 
        <el-table-column
          prop="date"
          label="序号"
          type="index"
          :index="countMethod">
        </el-table-column>
        <el-table-column
          sortable
          prop="name"
          label="部门名称">
        </el-table-column>
        <el-table-column
          prop="parent_name"
          label="上级部门">
        </el-table-column>
        <el-table-column
          prop="manage_name"
          label="主管名称">
        </el-table-column>
        <el-table-column
          prop="update_date"
          sortable
          label="更新时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button  
              @click="edit('System.Departments.Edit', scope.row.id)" 
              type="text"
              v-if="checkFun('SystemManage.DepartmentController.Update')"
              size="small" >编辑</el-button>
            <el-button  
              @click="action(scope.row.id, '删除', handleDlete)" 
              type="text" size="small"  
              v-if="checkFun('SystemManage.DepartmentController.Delete')">删除</el-button>
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
import departmentApi from '@/model/api/department';

export default {
  name: 'Departments',
  // 所有列表都应该继承于 list 这个通用组件
  extends: List,
  // 如果需要身份验证接口 checkFun() 那么就需要mixins这个组件
  mixins: [AuthCheck],
  data() {
    return {
      // 该字段用于表示当前操作的数据名称
      name: '部门',
    };
  },
  methods: {
    // 该事件是必须事件，用于获取列表数据获取
    getData(query) {
      return departmentApi.getDepartmentsByQuery(query);
    },
    // 如果需要做异步操作. 那么把异步需要call的API放在这里，在html中绑定这个事件, 如67行代码
    handleDlete(id) {
      return departmentApi.deletDepartmentById(id);
    },
  },
};
</script>

<style scoped lang="scss">

</style>
