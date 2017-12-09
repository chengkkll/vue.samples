<template>
  <edit-panel :title="title" v-loading="loading">
    <el-form :model="data" label-width="80px" :rules ="rules">
      <el-row :gutter="20">
        <el-col :span="8" :offset="1">
          <el-form-item label="登录账号" label-width="85px" prop="logon_account">
            <el-input placeholder="请输入登录账号" v-model="data.logon_account"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" label-width="85px" prop="logon_password">
            <el-input type="password" placeholder="请输入登录密码" v-model="data.logon_password"></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="85px" prop="name">
            <el-input placeholder="请输入员工姓名" v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item label="编号" label-width="85px">
            <el-input placeholder="请输入编号" v-model="data.code"></el-input>
          </el-form-item>
          <el-form-item label="籍贯" label-width="85px">
            <el-input placeholder="请输入籍贯" v-model="data.native_place"></el-input>
          </el-form-item>
           <el-form-item label="电话" label-width="85px" prop="mobile">
            <el-input placeholder="请输入电话" v-model="data.mobile"></el-input>
          </el-form-item>
           <el-form-item label="座机" label-width="85px">
            <el-input placeholder="请输入座机" v-model="data.telephone"></el-input>
          </el-form-item>
           <el-form-item label="籍贯" label-width="85px">
            <el-input placeholder="请输入籍贯" v-model="data.native_place"></el-input>
          </el-form-item>
           <el-form-item label="地址" label-width="85px">
            <el-input placeholder="请输入地址" v-model="data.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item label="性别" label-width="85px">
            <el-select v-model="data.gender" placeholder="请选择性别">
              <el-option
                v-for="item in sexes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-if="item.id !== data.id">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="角色" label-width="85px" prop="role.id">
            <el-select v-model="data.role.id" placeholder="请选择角色">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="部门" label-width="85px" prop="department.id">
            <el-select v-model="data.department.id" placeholder="请选择部门">
              <el-option
                v-for="item in departments"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="状态" label-width="85px">
            <el-select v-model="data.state" placeholder="请选择状态">
              <el-option
                v-for="item in states"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证" label-width="85px">
            <el-input placeholder="请输入身份证" v-model="data.idnumber"></el-input>
          </el-form-item>
          <el-form-item label="学历" label-width="85px">
            <el-input placeholder="请输入学历" v-model="data.education"></el-input>
          </el-form-item>
          <el-form-item label="职称" label-width="85px">
            <el-input placeholder="请输入职称" v-model="data.title"></el-input>
          </el-form-item>
          <el-form-item label="职务" label-width="85px">
            <el-input placeholder="请输入职务" v-model="data.position"></el-input>
          </el-form-item>
          <el-form-item label="" label-width="85px">
            <el-button type="primary"  @click="save" :disabled="!valid">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </edit-panel>
</template>

<script>
import employeeApi from '@/model/api/employee';
import departmentApi from '@/model/api/department';
import roleApi from '@/model/api/role';
import Edit from '@/view/components/edit-panel/edit';

const states = [
  {
    id: 1,
    name: '可用',
  },
  {
    id: 3,
    name: '登录锁住',
  },
  {
    id: 5,
    name: '不可用',
  },
];

const sexes = [
  {
    id: 0,
    name: '未选择',
  },
  {
    id: 1,
    name: '男',
  },
  {
    id: 5,
    name: '女',
  },
];

export default {
  name: 'Employee',
  extends: Edit,
  data() {
    return {
      name: '员工',
      sexes,
      data: {
        role: {},
        department: {},
      },
      states,
      departments: [],
      roles: [],
      rules: {
        name: [
          { required: true, message: '请输入员工名称', trigger: 'blur' },
        ],
        logon_account: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
        logon_password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
        ],
        'role.id': [
          { required: true, message: '请输入选择角色', trigger: 'blur' },
        ],
        'department.id': [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    handleDetDetail() {
      return employeeApi.getEmployeeById(this.id);
    },
    handleSave() {
      return employeeApi.saveEmployee(this.data)
        .then(() => {
          if (this.isNew) {
            this.$router.push({
              name: 'System.Employees',
            });
          }
        });
    },
    getAllDepartments() {
      departmentApi.getAllDepartments()
        .then((departments) => {
          this.departments = departments;
        }, () => {
          this.$message.error('获取所有部门失败, 请重试');
        });
    },
    getAllRoles() {
      roleApi.getAllRoles()
        .then((roles) => {
          this.roles = roles;
        }, () => {
          this.$message.error('获取所有角色失败, 请重试');
        });
    },
  },
  computed: {
    valid() {
      return this.data.name
        && this.data.logon_account
        && this.data.logon_password
        && this.data.mobile
        && this.data.role.id
        && this.data.department.id;
    },
  },
  mounted() {
    this.getAllDepartments();
    this.getAllRoles();
  },
};
</script>

<style scoped lang="scss">

</style>
