import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/consignInfoManage',
      name: 'consignInfoManage',
      component: resolve => require(['../pages/consignInfoManage'], resolve)
    }
  ]
})
