// mutations
const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setUserDetail(state, userDetail) {
    state.userDetail = userDetail;
    // 程序运行到这里，说明已经通过 token 获取到用户详情了
    // 应用已经拿到所有顶层数据，可以进行路由跳转操作了
    // user 中已经带有 functions 和 menus，不需要单独获取
    console.log('congratulations: everything looks good, system ready to work !!!');
  },
};

export default mutations;
