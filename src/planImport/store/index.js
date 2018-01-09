import Vue from 'vue'
import Vuex from 'vuex'
import {SAVE_SELECT} from './config.js'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    Con_Id: '', // 选择的委托方id
    Ldc_Id: '', // 选择的物流中心id
    Ssa_Id: '', // 选择的客户id
    Ldc_Address_Id: '', // 物流中心地址id
    Address_Id: '', // 客户地址id
    Operator_Id: '' // 运营方id
  },
  mutations: {
    [SAVE_SELECT] (state, payload) {
      Object.assign(state, payload)
      // state.Con_Id = payload.Con_Id
      // state.Ldc_Id = payload.Ldc_Id
      // state.Ssa_Id = payload.Ssa_Id
      // state.Address_Id = payload.Address_Id
      // state.Ldc_Address_Id = payload.Ldc_Address_Id
      // state.Operator_Id = payload.Operator_Id
    }
    // setLoading (state, payload) {
    //   console.log(payload)
    //   state.isLoading = !!payload
    // }
  }
})

export default store
