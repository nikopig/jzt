import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/transAging',
      name: 'transAging',
      component: resolve => require(['../pages/transAging'], resolve)
    },
    {
      path: '/costservices',
      name: 'costservices',
      component: resolve => require(['../pages/costservices'], resolve)
    },
    { // 仓储费用规则
      path: '/feeRuleStorage',
      name: 'feeRuleStorage',
      component: resolve => require(['../pages/feeRuleStorage'], resolve)
    }
  ]
})
