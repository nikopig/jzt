import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    // 主页
    {
      path: '/',
      component: resolve => require(['../pages/home'], resolve)
    }
  ]
})

export default router
