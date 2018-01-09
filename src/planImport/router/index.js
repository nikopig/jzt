import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../pages/entryFlow'], resolve),
      children: [
        {
          path: 'unitInfo',
          name: 'unitInfo',
          component: resolve => require(['../components/entryFlow/unitInfo'], resolve)
        },
        {
          path: 'goodInfo',
          name: 'goodInfo',
          component: resolve => require(['../components/entryFlow/goodInfo'], resolve)
        },
        {
          path: 'myOrder',
          name: 'myOrder',
          component: resolve => require(['../components/entryFlow/myOrder'], resolve)
        },
        {
          path: 'orderSum',
          name: 'orderSum',
          component: resolve => require(['../components/entryFlow/orderSum/orderSum'], resolve)
        }
      ]
    },
    {
      path: '/outFlow',
      component: resolve => require(['../pages/outFlow'], resolve),
      children: [
        {
          path: 'unitInfo',
          name: 'outUnitInfo',
          component: resolve => require(['../components/outFlow/unitInfo'], resolve)
        },
        {
          path: 'goodInfo',
          name: 'outGoodInfo',
          component: resolve => require(['../components/outFlow/goodInfo'], resolve)
        },
        {
          path: 'myOrder',
          name: 'outMyOrder',
          component: resolve => require(['../components/outFlow/myOrder'], resolve)
        },
        {
          path: 'orderSum',
          name: 'outOrderSum',
          component: resolve => require(['../components/outFlow/orderSum/orderSum'], resolve)
        }
      ]
    },
    {
      path: '/entryAudit',
      name: 'entryAudit',
      component: resolve => require(['../pages/entryAudit'], resolve)
    },
    {
      path: '/outAudit',
      name: 'outAudit',
      component: resolve => require(['../pages/outAudit'], resolve)
    }
  ]
})
