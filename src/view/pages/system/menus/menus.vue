<template>
  <edit-panel title="菜单管理" v-loading="loading">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-button type="primary"  @click="updateRootMenu()">新增一级菜单</el-button>
      </el-col>
    </el-row>
    <br>
    <br>
    <el-row :gutter="24" v-if="menus.length">
      <el-col>
        <el-tabs type="border-card">
          <el-tab-pane
            v-for="menu in menus" 
            :label="menu.name" 
            :key="menu.id">
            <span 
              @click="updateSubMenu(menu, item)" 
              class="material-button selected" 
              v-for="item in menu.sub_menu"
              :key="item.name">
              {{item.name}}</span>&nbsp;&nbsp;
              <div class="input-group">
                 <el-button round  @click="updateSubMenu(menu)">新增二级菜单</el-button>
                 <el-button type="success" round  @click="updateRootMenu(menu)">编辑当前一级菜单</el-button>
                 <el-button type="danger" round  @click="deleteRootMenu(menu)">删除当前一级菜单</el-button>
              </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      width="40%"
      :visible.sync="dialogVisible"
      :before-close="handleDialogClose">
      <el-row :gutter="20">
        <el-col>
          <el-form :model="editingMenu" label-width="80px">
            <el-form-item label="上级菜单" label-width="85px" v-if="editingType === 'sub'">
              <el-input placeholder="上级菜单" v-model="rootMenu.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="菜单名称" label-width="85px">
              <el-input placeholder="菜单管理" v-model="editingMenu.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单地址" label-width="85px">
              <el-input placeholder="System.Menus" v-model="editingMenu.link"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" label-width="85px" v-if="editingType === 'root'">
              <el-input placeholder="el-icon-setting" v-model="editingMenu.icon"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </edit-panel>
</template>

<script>
import authApi from '@/model/api/auth';

export default {
  name: 'Menus',
  data() {
    return {
      loading: false,
      menus: [],
      activeMenuTabName: '',
      newRootMenuName: '',
      dialogVisible: false,
      editingType: '',
      rootMenu: {},
      editingMenu: {},
    };
  },
  created() {
    this.getMenus();
  },
  computed: {
    title() {
      let title = '';
      switch (this.editingType) {
        case 'root': {
          title = `${this.editingMenu.id ? '编辑' : '新增'}根菜单 `;
          if (this.editingMenu.name) {
            title = `${title} [${this.editingMenu.name}]`;
          }
          break;
        }
        case 'sub': {
          title = `${this.editingMenu.link ? '编辑' : '新增'} [${this.rootMenu.name}] 的子菜单 `;
          if (this.editingMenu.name) {
            title = `${title} [${this.editingMenu.name}]`;
          }
          break;
        }
        default: {
          break;
        }
      }
      return title;
    },
  },
  methods: {
    // 获取所有菜单
    getMenus() {
      this.loading = true;
      authApi.getAllMenus()
        .then((menus) => {
          this.menus = menus;
          this.loading = false;
        }, () => {
          this.loading = false;
          this.$message.error('获取全部菜单失败, 请重试');
        });
    },
    // 删除当前根菜单
    deleteRootMenu(rootMenu) {
      this.$confirm(`此操作将永久删除 [${rootMenu.name}] 以及其下的所有子菜单！ `, '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        authApi.deleteMenu(rootMenu.id)
          .then(() => {
            this.$message.success('删除成功!');
            this.reset();
            this.getMenus();
          }, () => {
            this.$message.error('删除失败, 请重试!');
          });
      });
    },
    // 添加根菜单
    updateRootMenu(rootMenu = {}) {
      this.editingType = 'root';
      this.editingMenu = rootMenu;
      this.dialogVisible = true;
    },
    // 添加子菜单
    updateSubMenu(rootMenu, subMenu = {}) {
      this.editingType = 'sub';
      this.rootMenu = rootMenu;
      this.editingMenu = subMenu;
      this.dialogVisible = true;
    },
    confirm() {
      let params = {};
      switch (this.editingType) {
        case 'root': {
          params = this.editingMenu;
          break;
        }
        case 'sub': {
          params = this.rootMenu;
          let catched = false;
          params.sub_menu = params.sub_menu.map((menu) => {
            if (menu.name === this.editingMenu.name) {
              catched = true;
              return this.editingMenu;
            }
            return menu;
          });
          if (!catched) {
            params.sub_menu.push(this.editingMenu);
          }
          break;
        }
        default: {
          break;
        }
      }
      const title = params.id ? '更新菜单' : '创建菜单';
      authApi.updateMenu(params)
        .then(() => {
          this.$message.success(`${title}成功`);
          this.reset();
          this.getMenus();
        }, () => {
          this.$message.error(`${title}失败, 请重试`);
        });
      this.dialogVisible = false;
    },
    handleDialogClose(done) {
      if (typeof done === 'function') {
        done();
      }
      this.reset();
    },
    reset() {
      this.rootMenu = {};
      this.editingMenu = {};
      this.editingType = '';
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss">
.input-group{
  margin-top: 20px;
  margin-left: 4px;
}
</style>
