import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 主页面
    {
      path: '/',
      component: resolve => require(['../pages/main'], resolve)
    }
  ]
})
