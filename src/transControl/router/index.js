import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 主页面
    {
      path: '/',
      component: resolve => require(['../pages/main'], resolve)
    },
    //装车单打印
    {
      path: '/loadinglistPrint',
      name: 'loadinglistPrint',
      component: resolve => require(['../pages/loadinglistPrint'], resolve)
    }
  ]
})
