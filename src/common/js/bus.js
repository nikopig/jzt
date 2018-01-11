import Vue from 'vue'
export const Bus = new Vue()
export const Types = {
  refreshTransport: 'refresh-transport', // 刷新运单
  refreshConsi: 'refresh-consi', // 刷新委托单
  refreshFeeRule: 'refresh-fee-rule', // 刷新仓储费用规则列表
  refreshRentStorage: 'refresh-rent-storage' // 刷新仓储租赁列表
}
