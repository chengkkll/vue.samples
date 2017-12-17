 /* eslint-disable */ 
 import './widget';
import Vue from 'vue';
import router from '@/view/router';
import '@/view/components';
import App from '@/App';
import 'normalize.css';
import '@/assets/svgs/svg';
import '@/config/http';
import store from '@/store';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import VueQuillEditor from 'vue-quill-editor';


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueQuillEditor);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
