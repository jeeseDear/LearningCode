import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
require('common/sass/index.scss')
// fastclick解决移动端300msclick事件延迟
fastclick.attach(document.body)
// 懒加载
Vue.use(VueLazyLoad, {
  loading:require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
