<template>
  <el-menu
    :collapse="isCollapse"
    :default-active="nowRouteName"
    class="left-nav"
    background-color="#1d364b"
    text-color="#9ba3af"
    active-text-color="#FFF">
    <el-submenu 
      :index="menu.link || menu.name" 
      v-for="menu in menus"
      :key="menu.name">
      <template slot="title">
        <i :class="[menu.icon||'el-icon-menu']"></i>
        <span>{{menu.name}}</span>
      </template>
      <el-menu-item
        :index="sub_menu.link"
        @click="handleMenuClick(sub_menu.link)"
        v-for="sub_menu in menu.sub_menu" 
        :key="sub_menu.index">{{sub_menu.name}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>

export default {
  name: 'LeftNav',
  props: ['menus', 'isCollapse'],
  data() {
    return {
      nowRouteName: '',
    };
  },
  created() {
    this.nowRouteName = this.$route.name;
  },
  methods: {
    handleMenuClick(name) {
      this.$router.push({
        name,
      });
    },
    // 手动监控路由变化，更新当前激活菜单
    update(route) {
      this.nowRouteName = route.name;
    },
  },
  watch: {
    $route: {
      handler(newV) {
        this.update(newV);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.el-menu{
  border-right: none;
}

</style>

