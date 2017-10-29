<template>
  <div class="roles">
   <list-container 
    @currentChange="currentChange" 
    @search="search"
    :pagination="pagination"
    :create-to="{name: 'System.Roles.Edit', params: {id: 'new'}}"
    :can-create="checkFun('SystemManage.RoleController.Create')"
    :can-search="checkFun('SystemManage.RoleController.SearchPage')"
    v-loading="loading">
    <div slot="search">
      <el-row :gutter="24">
        <el-col :span="12">
           <el-form :model="query" label-width="20px">
            <el-form-item label="角色名称" label-width="85px">
              <el-input placeholder="请输入角色名称" v-model="query.name"></el-input>
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
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述信息">
        </el-table-column>
        <el-table-column
          prop="update_user"
          label="操作人">
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
              v-if="checkFun('SystemManage.RoleController.Update')"
              @click="handleEdit(scope.row)" 
              type="text" 
              size="small">编辑</el-button>
            <el-button  
              v-if="checkFun('SystemManage.RoleController.Delete')"
              @click="deleteData(scope.row)" 
              type="text" 
              size="small" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
     </div>
   </list-container>
  </div>
</template>

<script>
import List from '@/view/components/list-container/list';
import roleApi from '@/model/api/role';
import AuthCheck from '@/view/components/auth-check';

export default {
  name: 'Roles',
  extends: List,
  mixins: [AuthCheck],
  data() {
    return {
      name: '角色',
    };
  },
  methods: {
    getData(query) {
      return roleApi.getRolesByQuery(query);
    },
    handleDlete(id) {
      return roleApi.deletRoleById(id);
    },
    handleEdit(data) {
      this.$router.push({
        name: 'System.Roles.Edit',
        params: {
          id: data.id,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">

</style>
