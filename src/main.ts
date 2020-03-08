import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';
import VueCompositionApi from '@vue/composition-api';
import hooks from '@u3u/vue-hooks';

Vue.use(VueCompositionApi);
Vue.use(hooks);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
