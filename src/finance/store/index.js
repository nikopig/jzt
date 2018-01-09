import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    Con_Id: '', // 选择的委托方id
    Ldc_Id: '', // 选择的物流中心id
    Ssa_Id: '', // 选择的客户id
    Address_Id: '' // 客户地址id
  },
  mutations: {
    saveSelect (state, payload) {
      state.Con_Id = payload.Con_Id
      state.Ldc_Id = payload.Ldc_Id
      state.Ssa_Id = payload.Ssa_Id
      state.Address_Id = payload.Address_Id
    }
  }
})

export default store
