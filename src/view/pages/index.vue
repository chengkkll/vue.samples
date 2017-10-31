<template>
  <div class="app-container"
     v-loading="loading"
     element-loading-text="基础数据加载中...">
    <el-container style="height: 100%" v-if="!loading">
      <el-header height="50px">
        <top-nav :user="user"></top-nav>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: #1d364b">
          <left-nav :menus="user.menu"></left-nav>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { setToken } from '@/config/http';
import env from '@/config/env';
import authApi from '@/model/api/auth';
import io from 'socket.io-client';

export default {
  name: 'IndexPage',
  data() {
    return {
      user: {
        functions: [],
        menus: [],
        name: null,
      },
      loading: true,
      socket: null,
    };
  },
  methods: {
    erroToLogin() {
      setToken();
      this.$router.push({ name: 'Login' });
    },

    getDetailById() {
      return authApi.getDetailById(this.$store.state.user.id)
        .then((userDetail) => {
          this.userDetail = userDetail;
          // 讲用户详情也缓存起来
          this.$store.commit('setUserDetail', userDetail);
          if (this.user.menu.length === 0) {
            this.erroToLogin();
            return;
          }
          // 默认进入第一个路由
          if (this.user.menu.length !== 0 && this.$route.name === 'IndexPage') {
            this.$router.push({ name: this.user.menu[0].sub_menu[0].link });
          }
          this.loading = false;
        });
    },
    createSocket() {
      console.log('before create socket');
      if (!env.socketUrl) return;
      // 如果已经有socket连接的，那就断掉重连一次
      if (this.socket) this.socket.disconnect();
      this.socket = io(`${env.socketUrl}/`, {
        path: '/stream/socket.io',
      });
      // socket 创建成功
      this.socket.on('connect', () => {
        console.log('create socket success');
        this.socket.emit('enter_room', '1q2w3e');
      });
      // 可以在这里监控socket的数据推送，有数据就可以去操作 store，供整个应用使用
      this.socket.on('newMes', (data) => {
        console.log('has new mes', data);
      });
    },
  },
  created() {
    // 此处是顶层数据的分发处，此处基础数据如果没有拿到的话，无法正常进入系统，跳转到登录页面
    const promises = [];
    promises.push(authApi.getInfoByToken());
    // promises.push(authApi.getAllFunctions());
    // promises.push(authApi.getAllMenus());
    Promise.all(promises).then(
      // ([user, funs, menus]) => {
      ([user]) => {
        this.user = user;
        // 去除掉没有下级的一级导航
        this.user.menu = _.filter(this.user.menu, menu => menu.sub_menu.length);
        // 将三个顶层数据缓存在数据管理机里
        this.$store.commit('setUser', user);
        // this.$store.commit('setMenus', menus);
        // this.$store.commit('setFunctions', funs);
        // 获取用户详情会 pedding 于 power 接口，需要在这里获取
        this.getDetailById()
          .then(() => {
            // 前置数据都准备好了，可以创建socket了
            this.createSocket();
          });
      },
      () => {
        this.erroToLogin();
      });
  },
};
</script>

<style lang="scss">
/*本文件用于设置全局样式 */
.app-container{
  height: 100%;
}
.el-container{
  .el-header{
    padding: 0px;
  }
}

</style>
