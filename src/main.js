import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'

import '../static/iconfont/iconfont.css'

Vue.prototype.$axios = axios

var vm = new Vue({
  el: '#app',
  router,
  components: { App },  // 注册了组件
  template: '<App/>'
})