// 入口文件 - main.js
import Vue from 'vue'
import App from './App'
import music from './music'
import songList from './components/songList/songList'
import playControl from './components/playControl/playControl.vue'
import comment from './components/comment/comment'
import login from './components/login/login'
import axios from 'axios'

Vue.component("songList", songList);
Vue.component("playControl", playControl);
Vue.component("comment", comment);
Vue.component("login", login);
Vue.component("music", music);
Vue.config.productionTip = false
Vue.prototype.$axios = axios 

//默认路由前缀
axios.defaults.baseURL = 'http://118.31.47.122:3000'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  axios,
  components: { App },
  template: '<App/>'
})


import './assets/js/index.js'

// 导入全局的css样式
import './assets/css/currency.css'
import './assets/css/play.css'