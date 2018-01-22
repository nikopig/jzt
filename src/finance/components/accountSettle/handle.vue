<template>
  <div class="handle">
    <div class="toolbar">
      <div class="btn-box" v-if="isHandle!=='otherHandle'">
        <el-button type="text" icon="plus" @click="openBill" :disabled="formSearchData.Payment_Operate_State==='K'">开票
        </el-button>
      </div>
      <div class="btn-box">
        <el-button type="text" icon="plus" @click="settleConfirm"
                   :disabled="formSearchData.Payment_Operate_State==='3' && $route.name !== 'otherHandle'">结算
          <!--其他应付tab结算按钮放开，只有结算操作，没有开票操作-->
        </el-button>
      </div>
    </div>
    <div class="common-condition-box">
      <div class="form-search">
        <el-form :inline="true" :model="formSearchData">
          <el-form-item label="运营方">
            <el-input v-model="formSearchData.Operator_Name" placeholder="双击选择"
                      icon="close"
                      @click="deleteSelect('Operator_Id')"
                      @dblclick.native="openDialog('Operator_Id')"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="结算单位">
            <el-input v-model="formSearchData.Ssa_Name" placeholder="双击选择"
                      icon="close"
                      @click="deleteSelect('SettleUp_Company_Id')"
                      @dblclick.native="openDialog('SettleUp_Company_Id')" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="formSearchData.Begin_Date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="formSearchData.End_Date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="费用类型">
            <select-service-type @change="changeServiceType"
                                 v-model="formSearchData.Service_Type"></select-service-type>
          </el-form-item>
          <el-form-item label="单据状态" v-if="isHandle!=='otherHandle'">
            <el-select v-model="formSearchData.Payment_Operate_State" placeholder="请选择" @change="changePayment">
              <el-option
                v-for="item in Payment_Operate_State.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData" size="small" icon="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="open-bill" v-show="formSearchData.Payment_Operate_State==='3' && $route.name !== 'otherHandle'">
        <el-form :inline="true" :model="openBillData" ref="openBillData">
          <!--<el-form-item label="开票时间">
            <el-date-picker
              v-model="openBillData.user"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>-->
          <el-form-item label="发票号"
                        prop="SettleUp_Invoice"
                        :rules="[
                          { required: true, message: '请输入发票号', trigger: 'blur' }
                        ]">
            <el-input v-model="openBillData.SettleUp_Invoice"></el-input>
          </el-form-item>
          <el-form-item label="发票金额">
            <el-input v-model="openBillMoney" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <!--其他应付tab开票表单隐藏，只有结算操作，没有开票操作-->
      </div>
      <div class="settle-confirm" v-show="formSearchData.Payment_Operate_State==='K' || $route.name === 'otherHandle'">
        <!--其他应付tab结算表单放开，只有结算操作，没有开票操作-->
        <el-form :inline="true" :model="settleConfirmData" ref="settleConfirmData">
          <!--<el-form-item label="结算时间">
            <el-date-picker
              v-model="openBillData.user"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>-->
          <el-form-item label="支付方式"
                        prop="SettleUp_Mode"
                        :rules="[
                        { required: true, message: '请选择支付方式', trigger: 'blur' }]">
            <common-select field="SettleUp_Mode"
                           v-model="settleConfirmData.SettleUp_Mode"
                           placeholder="双击选择"></common-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="settleConfirmData.Remarks"></el-input>
          </el-form-item>
          <el-form-item label="应收总金额">
            <el-input v-model="settleAllMoney" disabled></el-input>
          </el-form-item>
          <el-form-item label="结算金额">
            <el-input v-model="settleMoney" disabled></el-input>
          </el-form-item>
          <el-form-item label="未收金额">
            <el-input v-model="settleOtherMoney" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="tableData" v-show="formSearchData.Payment_Operate_State === '3'" @selection-change="whichSelect"
              style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="运营方" width="200" show-overflow-tooltip prop="Operator_Name"></el-table-column>
      <el-table-column label="结算单位" width="200" show-overflow-tooltip prop="Sys_Name"></el-table-column>
      <el-table-column label="单据状态" show-overflow-tooltip prop="Payment_Operate_State"></el-table-column>
      <el-table-column label="对账金额(元)" prop="Reconciliation_Amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="已开票金额(元)" prop="Invoice_Amount_Ywc" show-overflow-tooltip></el-table-column>
      <el-table-column label="未开票金额(元)" prop="Invoice_Amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="费用类型" show-overflow-tooltip prop="Service_Type"></el-table-column>
      <el-table-column label="费用项目" show-overflow-tooltip prop="Service_Item"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="scope">
          <el-button @click.native.prevent="toDetail(scope.row.Payment_Record_Id)" type="text" size="small">详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="运营方">
              <span>{{ props.row.Operator_Name }}</span>
            </el-form-item>
            <el-form-item label="结算单位">
              <span>{{ props.row.Sys_Name }}</span>
            </el-form-item>
            <el-form-item label="单据状态">
              <span>{{ props.row.Payment_Operate_State }}</span>
            </el-form-item>
            <el-form-item label="对账金额">
              <span>{{ props.row.Reconciliation_Amount + '元'}}</span>
            </el-form-item>
            <el-form-item label="未开票金额">
              <span>{{props.row.Invoice_Amount + '元'}}</span>
            </el-form-item>
            <el-form-item label="已开票金额">
              <span>{{props.row.Invoice_Amount_Ywc + '元'}}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.Remarks }}</span>
            </el-form-item>
            <el-form-item label="对账人">
              <span>{{ props.row.Reconciliation_Staff }}</span>
            </el-form-item>
            <el-form-item label="生成时间">
              <span>{{ props.row.Created_Time }}</span>
            </el-form-item>
            <el-form-item label="开票员" v-if="currentRouteName==='handle'">
              <span>{{ props.row.Invoice_Staff }}</span>
            </el-form-item>
            <el-form-item label="费用类型">
              <span>{{ props.row.Service_Type }}</span>
            </el-form-item>
            <el-form-item label="费用项目">
              <span>{{ props.row.Service_Item }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="tableData" @selection-change="whichSelect" v-show="formSearchData.Payment_Operate_State === 'K'"
              style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="运营方" width="200" show-overflow-tooltip prop="Operator_Name"></el-table-column>
      <el-table-column label="结算单位" width="200" show-overflow-tooltip prop="Sys_Name"></el-table-column>
      <el-table-column label="开票时间" show-overflow-tooltip prop="Invoice_Time"></el-table-column>
      <el-table-column label="单据状态" show-overflow-tooltip prop="Payment_Operate_State"></el-table-column>
      <el-table-column label="对账金额(元)" show-overflow-tooltip prop="Reconciliation_Amount"></el-table-column>
      <el-table-column label="已结算金额(元)" show-overflow-tooltip prop="SettleUp_Amount_Ywc"></el-table-column>
      <el-table-column label="结算金额(元)" show-overflow-tooltip>
        <template scope="scope">
          <span>
            <el-input v-model="scope.row.SettleUp_Amount" v-if="!scope.row.isDisabled"></el-input>
            <span v-if="scope.row.isDisabled">{{scope.row.SettleUp_Amount}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="费用类型" show-overflow-tooltip prop="Service_Type"></el-table-column>
      <el-table-column label="费用项目" show-overflow-tooltip prop="Service_Item"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template scope="scope">
          <el-button @click.native.prevent="toDetail(scope.row.Payment_Record_Id)" type="text" size="small">详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="运营方">
              <span>{{ props.row.Operator_Name }}</span>
            </el-form-item>
            <el-form-item label="结算单位">
              <span>{{ props.row.Sys_Name }}</span>
            </el-form-item>
            <el-form-item label="开票时间" v-if="currentRouteName==='handle'">
              <span>{{ props.row.Invoice_Time }}</span>
            </el-form-item>
            <el-form-item label="单据状态">
              <span>{{ props.row.Payment_Operate_State }}</span>
            </el-form-item>
            <el-form-item label="对账金额">
              <span>{{ props.row.Reconciliation_Amount + '元' }}</span>
            </el-form-item>
            <el-form-item label="已结算金额">
              <span>{{props.row.SettleUp_Amount_Ywc + '元'}}</span>
            </el-form-item>
            <el-form-item label="结算金额">
              <span>{{props.row.SettleUp_Amount + '元'}}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.Remarks }}</span>
            </el-form-item>
            <el-form-item label="对账人">
              <span>{{ props.row.Reconciliation_Staff }}</span>
            </el-form-item>
            <el-form-item label="生成时间">
              <span>{{ props.row.Created_Time }}</span>
            </el-form-item>
            <el-form-item label="开票员" v-if="currentRouteName==='handle'">
              <span>{{ props.row.Invoice_Staff }}</span>
            </el-form-item>
            <el-form-item label="费用类型">
              <span>{{ props.row.Service_Type }}</span>
            </el-form-item>
            <el-form-item label="费用项目">
              <span>{{ props.row.Service_Item }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <div class="handle-footer">
      <el-pagination
        @current-change="pageChange"
        :current-page.sync="pages.currentPage"
        :page-size="pages.pageSize"
        layout="total, prev, pager, next"
        :total="pages.totalItems">
      </el-pagination>
    </div>
    <operator-modal :visible.sync="dialogShow.Operator_Id" @change="selectOper"></operator-modal>
    <balance-modal :visible.sync="dialogShow.SettleUp_Company_Id" @change="selectSsa"></balance-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import commonSelect from '@/common/service/select/select-dictionary'
  import selectServiceType from '@/common/service/select/select-service-type'
  import balanceModal from '@/common/service/modal/balance-modal'
  import operatorModal from '@/common/service/modal/operator-modal'

  export default {
    data () {
      return {
        formSearchData: {
          Begin_Date: '',
          End_Date: '',
          Payment_Operate_State: '3',
          Ssa_Name: '',
          SettleUp_Company_Id: '',
          Operator_Name: '',
          Operator_Id: '',
          Service_Type: '' // 费用类型
        },
        openBillData: {
          SettleUp_Invoice: ''
        },
        settleConfirmData: {
          SettleUp_Mode: '',
          Remarks: ''
        },
        tableData: [],
        dialogShow: {
          Operator_Id: false,
          SettleUp_Company_Id: false
        },
        pages: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0
        },
        isHandle: '', // 判断是应收应付还是其他应收应付
        diecType: '',
        currentRouteName: '',
        Payment_Operate_State: {
          options: [{
            value: '3',
            label: '开票'
          }, {
            value: 'K',
            label: '结算'
          }]
        }
      }
    },
    methods: {
      openBill () {
        this.$refs.openBillData.validate((valid) => {
          if (valid) {
            let params = {
              Operator: Api.userInfo.USERNAME,
              Total_Amount: this.openBillMoney + '',
              list_params: {}
            }
            let paramsList = []
            this.tableData.forEach(item => {
              if (!item.isDisabled) {
                let param = {
                  Payment_Record_Id: item.Payment_Record_Id,
                  Reconciliation_Amount: parseFloat(item.Reconciliation_Amount),
                  Invoice_Amount: parseFloat(item.Invoice_Amount),
                  SettleUp_Invoice: this.openBillData.SettleUp_Invoice
                }
                paramsList.push(param)
              }
            })
            params.list_params = JSON.stringify(paramsList)
            if (paramsList.length > 0) {
              Api.post('JlpPaymentInvoice', params).then(res => {
                if (res.Flag) {
                  this.$alert('开票成功！', '友情提示').then(() => {
                    this.init()
                  })
                } else {
                  this.$alert('开票失败，请稍后再试！', '友情提示')
                }
              })
            } else {
              this.$alert('请勾选后再执行！', '友情提示')
            }
          } else {
            return false
          }
        })
      },
      toDetail (id) {
        if (this.currentRouteName === 'handle') {
          this.$router.push({
            name: 'handleDetailList',
            params: {
              Payment_Record_Id: id,
              routeName: this.currentRouteName,
              paymentOperateState: this.formSearchData.Payment_Operate_State
            }
          })
        }
        if (this.currentRouteName === 'otherHandle') {
          this.$router.push({
            name: 'otherHandleDetailList',
            params: {Payment_Record_Id: id, routeName: this.currentRouteName}
          })
        }
      },
      settleConfirm () {
        this.$refs.settleConfirmData.validate((valid) => {
          if (valid) {
            let params = {
              Operator: Api.userInfo.USERNAME,
              Total_Amount: this.settleMoney,
              list_params: {}
            }
            let paramsList = []
            this.tableData.forEach(item => {
              if (!item.isDisabled) {
                let param = {
                  Payment_Record_Id: item.Payment_Record_Id,
                  Reconciliation_Amount: parseFloat(item.Reconciliation_Amount),
                  Invoice_Amount: parseFloat(item.Invoice_Amount),
                  SettleUp_Amount: parseFloat(item.SettleUp_Amount),
                  SettleUp_Mode: this.settleConfirmData.SettleUp_Mode,
                  Remarks: this.settleConfirmData.Remarks ? this.settleConfirmData.Remarks : '%'
                }
                paramsList.push(param)
              }
            })
            params.list_params = JSON.stringify(paramsList)
            if (paramsList.length > 0) {
              Api.post('JlpPaymentSettleUp', params).then(res => {
                if (res.Flag) {
                  this.$alert('结算成功！', '友情提示').then(() => {
                    this.init()
                  })
                } else {
                  this.$alert('结算失败，请稍后再试！', '友情提示')
                }
              })
            } else {
              this.$alert('请勾选后再执行！', '友情提示')
            }
          } else {
            return false
          }
        })
      },
      searchData () {
        this.pages.currentPage = 1
        this.pages.totalItems = 0
        this.getData()
      },
      getData () {
        let params = {
          Begin_Date: DateFtt('yyyy-MM-dd', this.formSearchData.Begin_Date, false, true),
          End_Date: DateFtt('yyyy-MM-dd', this.formSearchData.End_Date, true),
          Operator_Id: this.formSearchData.Operator_Id ? this.formSearchData.Operator_Id : '%',
          SettleUp_Company_Id: this.formSearchData.SettleUp_Company_Id ? this.formSearchData.SettleUp_Company_Id : '%',
          StartIndex: (this.pages.currentPage - 1) * 10,
          PageSize: this.pages.pageSize,
          Payment_Type: this.diecType,
          Service_Type: this.formSearchData.Service_Type ? this.formSearchData.Service_Type : '%'
        }
        let paramsPort = ''
        if (this.$route.name === 'otherHandle') {
          paramsPort = 'BalQ_JlpInvoiceDataQt'
        } else {
          if (this.formSearchData.Payment_Operate_State === '3') {
            paramsPort = 'JlpBalancePayment'
          }
          if (this.formSearchData.Payment_Operate_State === 'K') {
            paramsPort = 'BalQ_JlpInvoiceData'
          }
        }
        Api.get(paramsPort, params).then(res => {
          if (res.Flag) {
            this.tableData = res.MsgInfo
            this.tableData.forEach((item, $index) => {
              item.Created_Time = DateFtt('yyyy-MM-dd', new Date(item.Created_Time.replace(/-/g, '/')))
              Vue.set(item, 'isDisabled', true)
              Vue.set(item, 'index', $index)
            })
            this.pages.totalItems = res.MsgInfo[0] ? res.MsgInfo[0].Sum_Cnt : 0
          } else {
            this.$alert('数据请求失败，请重试！', '提示')
          }
        })
      },
      changeServiceType () {
        this.getData()
      },
      pageChange () {
        this.getData()
      },
      changePayment () {
        this.getData()
      },
      openDialog (val) {
        this.dialogShow[val] = true
      },
      selectOper (row) {
        this.formSearchData.Operator_Id = row.Operator_Id
        this.formSearchData.Operator_Name = row.Operator_Name
      },
      selectSsa (row) {
        this.formSearchData.Ssa_Name = row.MINGCHENG
        this.formSearchData.SettleUp_Company_Id = row.SettleUp_Company_Id
      },
      deleteSelect (val) {
        if (val === 'Operator_Id') {
          this.formSearchData.Operator_Id = ''
          this.formSearchData.Operator_Name = ''
        }
        if (val === 'SettleUp_Company_Id') {
          this.formSearchData.SettleUp_Company_Id = ''
          this.formSearchData.Ssa_Name = ''
        }
      },
      whichSelect (val) {
        let that = this
        that.tableData.forEach(item => {
          Vue.set(item, 'isDisabled', true)
        })
        val.forEach(item => {
          that.tableData[item.index].isDisabled = false
        })
      },
      init () {
        this.initALLData() // 重置所有表单，主要用于应收跳到应付情况
        this.diecType = this.$route.params.diecType
        this.currentRouteName = this.$route.name // 记录当前的路由，传递给第二级数据
        if (this.$route.name === 'otherHandle') {
          this.isHandle = 'otherHandle'
          this.formSearchData.Payment_Operate_State = 'K'
          if (this.diecType === '10') {
            this.diecType = '21'
          }
          if (this.diecType === '20') {
            this.diecType = '11'
          }
        } else {
          this.isHandle = ''
          this.formSearchData.Payment_Operate_State = this.formSearchData.Payment_Operate_State ? this.formSearchData.Payment_Operate_State : '3'
        }
        let nowDate = new Date()
        this.formSearchData.Begin_Date = this.formSearchData.Begin_Date ? this.formSearchData.Begin_Date : new Date(nowDate.setDate(nowDate.getDate() - 30))
        this.formSearchData.End_Date = this.formSearchData.End_Date ? this.formSearchData.End_Date : new Date()
        this.getData()
      },
      initALLData () {
        this.formSearchData.Ssa_Name = ''
        this.formSearchData.SettleUp_Company_Id = ''
        this.formSearchData.Operator_Name = ''
        this.formSearchData.Operator_Id = ''
        this.openBillData.SettleUp_Invoice = ''
        this.settleConfirmData.SettleUp_Mode = ''
        this.settleConfirmData.Remarks = ''
        this.tableData = []
      }
    },
    activated () {
      this.init()
    },
    watch: {
      '$route' (val) {
        this.init()
      }
    },
    computed: {
      openBillMoney () { // 开票总金额
        let total = 0
        this.tableData.forEach(item => {
          if (!item.isDisabled) {
            total = floatAdd(total, item.Invoice_Amount ? item.Invoice_Amount : 0)
          }
        })
        return total
      },
      settleMoney () { // 结算金额
        let total = 0
        this.tableData.forEach(item => {
          if (!item.isDisabled) {
            total = floatAdd(total, item.SettleUp_Amount ? item.SettleUp_Amount : 0)
          }
        })
        return total
      },
      settleAllMoney () { // 应收总金额
        let total = 0
        this.tableData.forEach(item => {
          if (!item.isDisabled) {
            total = floatAdd(total, item.Reconciliation_Amount ? item.Reconciliation_Amount : 0)
          }
        })
        return total
      },
      settleOtherMoney () { // 未收金额
        let that = this
        return parseFloat(that.settleAllMoney) - parseFloat(that.settleMoney)
      }
    },
    components: {
      commonSelect,
      selectServiceType,
      balanceModal,
      operatorModal
    }
  }
</script>

<style lang="less">
  .handle {
    .el-table__expanded-cell {
      .el-form-item__label {
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .el-form-item__content {
        font-size: 12px;
        line-height: 24px;
      }
    }
    .toolbar {
      width: 100%;
      height: 42px;
      background-color: #EBEEF5;
      .el-button--text {
        color: #666;
      }
      .btn-box {
        display: inline-block;
        *display: inline-block;
        zoom: 1;
        padding: 5px 15px;
        .el-button--text.is-disabled {
          color: #bfcbd9;
        }
      }
    }
    .common-condition-box {
      margin-top: 20px;
      border: 1px solid #EBEEF5;
      padding: 22px 15px 0 15px;
      .form-search {
        border-bottom: 1px dashed #EBEEF5;
        /*.el-form-item {*/
          /*margin-bottom: 0;*/
        /*}*/
      }
      .open-bill {
        margin-top: 10px;
        .el-form-item {
          margin-bottom: 10px;
        }
      }
      .settle-confirm {
        margin-top: 10px;
        .el-form-item {
          margin-bottom: 10px;
        }
      }
    }
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    .handle-footer {
      text-align: center;
      margin-top: 15px;
    }
  }
</style>
