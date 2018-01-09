import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'exception',
      component: resolve => require(['../pages/exception'], resolve),
      children: [
      	{
      		path: '', redirect: 'client'
      	},
      	{
      		path: 'client',
      		name: 'client',
      		component: resolve => require(['../components/exception/client/clientData'], resolve)
      	},
      	{
      		path: 'goods',
      		name: 'goods',
      		component: resolve => require(['../components/exception/goods/goodsData'], resolve)
      	},
      	{
      		path: 'staff',
      		name: 'staff',
      		component: resolve => require(['../components/exception/staff/staffData'], resolve)
      	},
      	{
      		path: 'entry',
      		name: 'entryPlan',
      		component: resolve => require(['../components/exception/entry/entryData'], resolve)
      	},
      	{
      		path: 'out',
      		name: 'outPlan',
      		component: resolve => require(['../components/exception/out/outData'], resolve)
      	},
      	{
      		path: 'transport',
      		name: 'transportPlan',
      		component: resolve => require(['../components/exception/transport/transportData'], resolve)
      	}
      ]
    }
  ]
})
