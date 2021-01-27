import Vue from 'vue'
import App from './App'
import request from 'commonality/request.js'//请求方法
Vue.prototype.$request = request
Vue.config.productionTip = false
// main.js 文件
import uView from "uview-ui";
Vue.use(uView);

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
