<template>
  <edit-panel :title="title" v-loading="loading">
    <el-row :gutter="24">
      <el-col :span="12" :offset="1">
        <el-form :model="data" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" label-width="85px" prop="name">
            <el-input placeholder="请输入角色名称" v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item label="描述信息" label-width="85px" prop="desc">
            <el-input type="textarea" placeholder="请输入描述信息" v-model="data.desc"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24" v-if="menus.length">
      <el-col :span="23" :offset="1">
        <el-form>
          <el-form-item label="角色菜单" label-width="85px">
            <el-tabs type="border-card">
              <el-tab-pane
                v-for="menu in menus" 
                :label="menu.name" 
                :key="menu.id">
                <span 
                  @click="handleTabClick(item)" 
                  class="menu-span" 
                  :class="{selected: item.selected}" 
                  v-for="item in menu.sub_menu"
                  :key="item.name">
                  {{item.name}}</span>&nbsp;&nbsp;
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="24" v-if="functions.length">
      <el-col :span="23" :offset="1">
        <el-form>
          <el-form-item label="功能权限" label-width="85px">
            <el-tabs type="border-card">
              <el-tab-pane
                v-for="root in functions" 
                :label="root.name" 
                :key="root.id">
                  <el-tabs type="border-card">
                    <el-tab-pane
                      v-for="item in root.group" 
                      :label="item.name" 
                      :key="item.id">
                      <span 
                        @click="handleTabClick(fun)" 
                        class="menu-span" 
                        :class="{selected: fun.selected}" 
                        v-for="fun in item.functionList"
                        :key="fun.name">
                        {{fun.name}}</span>&nbsp;&nbsp;
                    </el-tab-pane>
                  </el-tabs>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
     <el-row :gutter="24">
      <el-col :span="12" :offset="1">
        <el-form :model="data" label-width="80px" :rules="rules">
          <el-form-item label="设置首页" label-width="85px" prop="page">
            <el-select v-model="data.page" placeholder="请选择首页">
              <el-option
                v-for="page in getAllPages()"
                :key="page.link"
                :label="page.name"
                :value="page.link">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" label-width="85px" prop="name">
            <el-button type="primary"  @click="save" :disabled="!valid">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </edit-panel>
</template>

<script>
import roleApi from '@/model/api/role';
import authApi from '@/model/api/auth';
import Edit from '@/view/components/edit-panel/edit';

export default {
  name: 'Role',
  extends: Edit,
  data() {
    return {
      name: '角色',
      roles: [],
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '请输入角色描述名称', trigger: 'blur' },
        ],
        page: [
          { required: true, message: '请选择首页', trigger: 'blur' },
        ],
      },
      menus: [],
      functions: [],
      activeMenuTabName: '',
    };
  },
  methods: {
    handleDetDetail() {
      return roleApi.getRoleById(this.id)
        .then((role) => {
          this.getMenusAndFuns();
          return role;
        });
    },
    handleSave() {
      this.data.menu = this.mapMenu(this.menus);
      this.data.functions = this.mapFunctions(this.functions);
      return roleApi.saveRole(this.data)
        .then(() => {
          if (this.isNew) {
            this.$router.push({
              name: 'System.Roles',
            });
          }
        });
    },
    // 获取所有菜单和所有功能点
    getMenusAndFuns() {
      this.loading = true;
      const promises = [];
      promises.push(authApi.getAllMenus());
      promises.push(authApi.getAllFunctions());
      Promise.all(promises)
        .then(([menus, functions]) => {
          this.loading = false;
          this.functions = functions;
          this.menus = menus;
          this.initData();
        }, () => {
          this.loading = false;
          this.$message.error('获取全部菜单，全部功能点失败, 请重试');
        });
    },
    // 初始化数据
    initData() {
      if (!this.data.menu) {
        this.data.menu = [];
      }
      if (!this.data.functions) {
        this.data.functions = [];
      }
      this.data.menu.forEach((a) => {
        a.sub_menu.forEach((b) => {
          // 此处 b为 this.data.menu.sub_menu[i]
          this.menus.forEach((c) => {
            c.sub_menu.forEach((d) => {
              if (d.link === b.link) {
                d.selected = true;
              }
            });
          });
        });
      });
      this.data.functions.forEach((a) => {
        // 此处a为 this.data.functions[i]
        this.functions.forEach((b) => {
          b.group.forEach((c) => {
            c.functionList.forEach((d) => {
              if (a.policy === d.policy) {
                d.selected = true;
              }
            });
          });
        });
      });
    },
    // fix element ui bug
    handleTabClick(item) {
      item.selected = !item.selected;
      this.menus = _.cloneDeep(this.menus);
      this.functions = _.cloneDeep(this.functions);
    },
    // 映射菜单
    mapMenu(data) {
      let menu = _.cloneDeep(data);
      menu.forEach((item) => {
        item.sub_menu = item.sub_menu.filter(sub => sub.selected);
      });
      menu = menu.filter(item => item.sub_menu.length);
      return menu;
    },
    // 映射功能点
    mapFunctions(functions) {
      const result = [];
      functions.forEach((first) => {
        first.group.forEach((second) => {
          second.functionList.forEach((fun) => {
            if (fun.selected) {
              result.push(fun);
            }
          });
        });
      });
      return result;
    },
    // 获取所有可选择的首页
    getAllPages() {
      const result = [];
      if (!this.menus) return [];
      this.menus.forEach((a) => {
        a.sub_menu.forEach((b) => {
          if (b.selected) {
            result.push(b);
          }
        });
      });
      this.result = result;
      return result;
    },
  },
  computed: {
    valid() {
      return this.data.name
        && this.data.desc
        && this.data.page;
    },
  },
  mounted() {
    if (this.isNew) {
      this.getMenusAndFuns();
    }
  },
};
</script>

<style scoped lang="scss">
.function-span, .menu-span{
  height: 22px;
  line-height: 22px;
  display: inline-block;
  outline: none;
  cursor: pointer;
  padding: 4px 8px;
  margin: 6px 4px;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(204, 209, 217, 0.3);
  user-select: none;
}
.selected{
  color: #FFF;
  border: 1px solid rgb(63, 81, 181);
  background-color: rgb(63, 81, 181);
}
</style>
