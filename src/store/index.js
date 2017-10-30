import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
// 可以编写类似的子模块
import child from './modules/child';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

// 此处是状态管理的顶层位置，需要在这里做一些应用级别的操作
// token 已经存储在 localstorage 里，此处无需再存储
export default new Vuex.Store({
  state: {
    user: null,
    // 用户详情
    userDetail: null,
  },
  actions,
  getters,
  modules: {
    child,
  },
  mutations,
  strict: debug,
});
