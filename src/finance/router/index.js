import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // diecType标识应收应付类型  isAudit标识是否已对账
  // hashbang: false,
  // history: true,
  routes: [
    // 流水
    {
      path: '/:diecType',
      component: resolve => require(['../pages/accountFlow'], resolve),
      children: [
        {
          path: '',
          name: 'mainList',
          component: resolve => require(['../components/accountFlow/mainList'], resolve)
        },
        {
          path: 'itemList/:Operator_Id/:SettleUp_Company_Id/:Con_Name/:Service_Type/:Mon/:Begin_Date/:End_Date/:Payment_Type/:PrintReconciliation_Record_Id',
          name: 'itemList',
          component: resolve => require(['../components/accountFlow/itemList'], resolve)
        },
        {
          path: 'detailList/:Operator_Id/:SettleUp_Company_Id/:Service_Type/:Mon/:Begin_Date/:End_Date/:Payment_Type/:Service_Item/:PrintReconciliation_Record_Id',
          name: 'detailList',
          component: resolve => require(['../components/accountFlow/detailList'], resolve)
        }
      ]
    },
    // 对账
    {
      path: '/accountBalance/:diecType',
      component: resolve => require(['../pages/accountBalance'], resolve),
      children: [
        {
          path: '',
          name: 'balanceMainList',
          component: resolve => require(['../components/accountBalance/mainList'], resolve)
        },
        {
          path: 'itemList/:Operator_Id/:SettleUp_Company_Id/:Con_Name/:Service_Type/:Mon/:Begin_Date/:End_Date/:Payment_Type',
          name: 'balanceItemList',
          component: resolve => require(['../components/accountBalance/itemList'], resolve)
        },
        {
          path: 'detailList/:Payment_Record_Id',
          name: 'balanceDetailList',
          component: resolve => require(['../components/accountBalance/detailList'], resolve)
        }
      ]
    },
    // 委托方审核传10 承运方审核传20
    {
      path: '/cariAudit/:diecType/:isAudit',
      component: resolve => require(['../pages/cariAudit'], resolve),
      children: [
        {
          path: '',
          name: 'cariMainList',
          component: resolve => require(['../components/cariAudit/mainList'], resolve)
        },
        {
          path: 'itemList/:Operator_Id/:SettleUp_Company_Id/:Con_Name/:Service_Type/:Mon/:Begin_Date/:End_Date/:Payment_Type',
          name: 'cariItemList',
          component: resolve => require(['../components/cariAudit/itemList'], resolve)
        },
        {
          path: 'detailList/:Payment_Record_Id',
          name: 'cariDetailList',
          component: resolve => require(['../components/cariAudit/detailList'], resolve)
        }
      ]
    },
    // 应收结算传10， 应付结算传20
    {
      path: '/accountSettle/:diecType',
      component: resolve => require(['../pages/accountSettle'], resolve),
      children: [
        {
          path: '',
          name: 'handle',
          component: resolve => require(['../components/accountSettle/handle'], resolve)
        },
        {
          path: 'handleDetailList/:Payment_Record_Id/:routeName/:paymentOperateState',
          name: 'handleDetailList',
          component: resolve => require(['../components/accountSettle/handleDetailList'], resolve)
        },
        {
          path: 'handleCancel',
          name: 'handleCancel',
          component: resolve => require(['../components/accountSettle/handleCancel'], resolve)
        },
        {
          path: 'otherHandle',
          name: 'otherHandle',
          component: resolve => require(['../components/accountSettle/handle'], resolve)
        },
        {
          path: 'otherHandleDetailList/:Payment_Record_Id/:routeName',
          name: 'otherHandleDetailList',
          component: resolve => require(['../components/accountSettle/otherHandleDetailList'], resolve)
        }
      ]
    },
    // 应收查询传10， 应付查询传20
    {
      path: '/accountQuery/:diecType',
      component: resolve => require(['../pages/accountQuery'], resolve),
      children: [
        {
          path: '',
          name: 'queryMainList',
          component: resolve => require(['../components/accountQuery/mainList'], resolve)
        },
        {
          path: 'itemList/:Begin_Date/:End_Date/:Mon/:Query_State/:Danw_Id/:Service_Type',
          name: 'queyItemList',
          component: resolve => require(['../components/accountQuery/itemList'], resolve)
        },
        {
          path: 'detailList/:Begin_Date/:End_Date/:Mon/:Query_State/:Danw_Id/:Service_Type/:Service_Item',
          name: 'queryDetailList',
          component: resolve => require(['../components/accountQuery/detailList'], resolve)
        }
      ]
    },
    // 应收应付账款查询   应收传10， 应付传20
    {
      path: '/foundQuery/:diecType',
      component: resolve => require(['../pages/foundQuery'], resolve),
      children: [
        {
          path: '',
          name: 'foundMainList',
          component: resolve => require(['../components/foundQuery/mainList'], resolve)
        },
        {
          path: 'detailList/:arg',
          name: 'foundDetailList',
          component: resolve => require(['../components/foundQuery/detailList'], resolve)
        }
      ]
    },
    // 费用生成
    {
      path: '/accountFee/10',
      component: resolve => require(['../pages/accountFee'], resolve),
      children: [
        {// 费用列表
          path: '',
          name: 'feeList',
          component: resolve => require(['../components/accountFee/feeList'], resolve)
        },
        {// 业务数据
          path: 'busiList/:Rec_Id/:Operator_Id/:Begin_Date/:End_Date/:SettleUp_Company_Id/:Service_Item/:Service_Type',
          name: 'busiList',
          component: resolve => require(['../components/accountFee/busiList'], resolve)
        }/*,
        {// 业务明细
          path: 'busiDetailList',
          name: 'busiDetailList',
          component: resolve => require(['../components/accountFee/busiDetailList'], resolve)
        }*/
      ]
    }
  ]
})

router.beforeEach(function (to, from, next) {
  next()
})

export default router
