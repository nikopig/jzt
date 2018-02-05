import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // 主查询
    {
      path: '/main/:type',
      name: 'main',
      component: resolve => require(['../pages/main'], resolve)
    },
    // 承运方主查询
    {
      path: '/carriMain',
      name: 'carriMain',
      component: resolve => require(['../pages/carriMain'], resolve)
    },
    // 委托方回单
    {
      path: '/consiReceipt',
      component: resolve => require(['../pages/consiReceipt'], resolve),
      children: [
        {
          path: '',
          name: 'consiMainList',
          component: resolve => require(['../components/consiReceipt/mainList'], resolve)
        },
        {
          path: 'itemList/:Courier_Number',
          name: 'consiItemList',
          component: resolve => require(['../components/consiReceipt/itemList'], resolve)
        },
        {
          path: 'detailList/:ConOrder_No/:Refrigeration_Type/:Ssa_Id',
          name: 'consiDetailList',
          component: resolve => require(['../components/consiReceipt/detailList'], resolve)
        }
      ]
    },
    // 承运方回单
    {
      path: '/carriReceipt',
      component: resolve => require(['../pages/carriReceipt'], resolve),
      children: [
        {
          path: '',
          name: 'carriMainList',
          component: resolve => require(['../components/carriReceipt/mainList'], resolve)
        },
        {
          path: 'itemList/:row',
          name: 'carriItemList',
          component: resolve => require(['../components/carriReceipt/itemList'], resolve)
        },
        {
          path: 'receiptDetailList/:row',
          name: 'receiptDetailList',
          component: resolve => require(['../components/carriReceipt/receiptDetailList'], resolve)
        },
        {
          path: 'orderDetailList/:summarizeRow/:row',
          name: 'orderDetailList',
          component: resolve => require(['../components/carriReceipt/orderDetailList'], resolve)
        }
      ]
    },
    // 委托方总订单数
    {
      path: '/consiOrder',
      component: resolve => require(['../pages/consiOrder'], resolve),
      children: [
        {
          path: '/:Con_Id/:Con_Name/:startDate/:endDate',
          name: 'orderList',
          component: resolve => require(['../components/consiOrder/orderList'], resolve)
        },
        {
          path: 'orderDetail',
          name: 'orderDetail',
          component: resolve => require(['../components/consiOrder/orderDetail'], resolve)
        },
        {
          path: 'logisticInfo',
          name: 'logisticInfo',
          component: resolve => require(['../components/consiOrder/logisticInfo'], resolve)
        }
      ]
    },
    // 库存查询
    {
      path: '/stockQuery',
      component: resolve => require(['../pages/stockQuery'], resolve),
      children: [
        {
          path: '',
          name: 'stockMainList',
          component: resolve => require(['../components/stockQuery/mainList'], resolve)
        },
        {
          path: 'itemList/:Ldc_Id/:Con_Id/:Con_Name/:TableHeader',
          name: 'stockItemList',
          component: resolve => require(['../components/stockQuery/itemList'], resolve)
        }
      ]
    },
    //委托方应付账款查询
    {
      path: '/consiFee',
      component: resolve => require(['../pages/consiFee'], resolve),
      children: [
        {
          path: '',
          name: 'feeMainList',
          component: resolve => require(['../components/consiFee/mainList'], resolve)
        },
        {
          path: 'orderList/:Operator_Id/:SettleUp_Company_Id/:Con_Name/:Service_Type/:Mon/:Begin_Date/:End_Date',
          name: 'feeOrderList',
          component: resolve => require(['../components/consiFee/orderList'], resolve)
        },
        {
          path: 'orderDetail/:Operator_Id/:SettleUp_Company_Id/:Service_Type/:Mon/:Begin_Date/:End_Date/:Service_Item',
          name: 'feeOrderDetail',
          component: resolve => require(['../components/consiFee/orderDetail'], resolve)
        }
      ]
    },
    // 温度下载
    {
      path: '/temperatureDownload',
      component: resolve => require(['../pages/temperatureDownload'], resolve),
      children: [
        {
          path: '',
          name: 'tempMainList',
          component: resolve => require(['../components/temperatureDownload/mainList'], resolve)
        },
        {
          path: 'detailList/:HANGHAO/:DANJ_NO/:CHEPAI_NO/:sid/:beginDate/:endDate/:High_Temp/:Low_Temp/:flag',
          name: 'tempDetailList',
          component: resolve => require(['../components/temperatureDownload/detailList'], resolve)
        }
      ]
    },
    // 外链
    {
      path: '/outLink/:src',
      name: 'outLink',
      component: resolve => require(['@/common/components/common-frame'], resolve)
    },
    // 日历
    {
      path: '/datePicker',
      name: 'datePicker',
      component: resolve => require(['../pages/datePicker'], resolve)
    },
    // 承运账款查询
    {
      path: '/carriFee',
      name: 'carriFee',
      component: resolve => require(['../pages/carriFee'], resolve),
      children: [
        {
          path: '',
          name: 'carriFeeMainList',
          component: resolve => require(['../components/carriFee/mainList'], resolve)
        },
        {
          path: 'itemList/:row',
          name: 'carriFeeItemList',
          component: resolve => require(['../components/carriFee/itemList'], resolve)
        },
        {
          path: 'detailList/:row',
          name: 'carriFeeDetailList',
          component: resolve => require(['../components/carriFee/detailList'], resolve)
        }
      ]
    },
    // 承运方查委托单
    {
      path: '/carriSearch',
      name: 'carriSearch',
      component: resolve => require(['../pages/carriSearch'], resolve),
      children: [
        {
          path: '',
          name: 'carriSearchMain',
          component: resolve => require(['../components/carriSearch/mainList'], resolve)
        },
        {
          path: 'itemList/:row',
          name: 'carriSearchItemList',
          component: resolve => require(['../components/carriSearch/itemList'], resolve)
        },
        {
          path: 'carriSearchOrderDetailList/:summarizeRow/:row',
          name: 'carriSearchOrderDetailList',
          component: resolve => require(['../components/carriSearch/orderDetailList'], resolve)
        }
      ]
    },
    // 运营方监控
    {
      path: '/operatorMonitor',
      name: 'operatorMonitor',
      component: resolve => require(['../pages/operatorMonitor'], resolve)
    }
  ]
})
