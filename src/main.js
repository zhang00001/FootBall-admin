import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import './permission'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(ElementUI);
// 设置基础URL
// global.Url = 'http://120.79.28.58/'
// axios.defaults.baseURL = '/api/'
// 设置请求超时时间
// axios.defaults.timeout = 5000

// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Vue.prototype.$axios = axios
Vue.prototype.$Message.config({
    top: 100,
    duration: 3
});
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})