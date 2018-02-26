<template>
  <div class="handle">
    <div class="toolbar">
      <div class="btn-box">
        <el-button type="text" icon="el-icon-plus" @click="billCancel" :disabled="formSearchData.Payment_Operate_State==='J'">
          撤销开票
        </el-button>
      </div>
      <div class="btn-box">
        <el-button type="text" icon="el-icon-plus" @click="settleCancel"
                   :disabled="formSearchData.Payment_Operate_State==='K'">撤销结算
        </el-button>
      </div>
    </div>
    <div class="condition-box">
      <div class="form-search">
        <el-form :inline="true" :model="formSearchData">
          <el-form-item label="运营方">
            <el-input v-model="formSearchData.Operator_Name" placeholder="双击选择"
                      icon="el-icon-close"
                      @click="deleteSelect('Operator_Id')"
                      @dblclick.native="openDialog('Operator_Id')"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="结算单位">
            <el-input v-model="formSearchData.Ssa_Name" placeholder="双击选择"
                      icon="el-icon-close"
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
          <el-form-item label="单据状态">
            <el-select v-model="formSearchData.Payment_Operate_State" placeholder="请选择" @change="changePayment">
              <el-option label="已开票" value="K"></el-option>
              <el-option label="已结算" value="J"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchData" size="small" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="tableData" v-show="formSearchData.Payment_Operate_State === 'K'" @selection-change="whichSelect"
              style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="运营方" width="200" show-overflow-tooltip prop="Operator_Name"></el-table-column>
      <el-table-column label="对账单位" width="200" show-overflow-tooltip prop="Sys_Name"></el-table-column>
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
            <el-form-item label="对账单位">
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
    <el-table :data="tableData" @selection-change="whichSelect" v-show="formSearchData.Payment_Operate_State === 'J'"
              style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="运营方" width="200" show-overflow-tooltip prop="Operator_Name"></el-table-column>
      <el-table-column label="结算单位" width="200" show-overflow-tooltip prop="Sys_Name"></el-table-column>
      <el-table-column label="开票时间" show-overflow-tooltip prop="Invoice_Time"></el-table-column>
      <el-table-column label="单据状态" show-overflow-tooltip prop="Payment_Operate_State"></el-table-column>
      <el-table-column label="对账金额(元)" show-overflow-tooltip prop="Reconciliation_Amount"></el-table-column>
      <el-table-column label="已结算金额(元)" show-overflow-tooltip prop="SettleUp_Amount_Ywc"></el-table-column>
      <el-table-column label="开票金额(元)" show-overflow-tooltip prop="Invoice_Amount"></el-table-column>
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
            <el-form-item label="开票金额">
              <span>{{props.row.Invoice_Amount + '元'}}</span>
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
    <!--<el-table :data="tableData"
              @selection-change="whichSelect"
              style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="运营方"
        width="200"
        show-overflow-tooltip
        prop="Operator_Name">
      </el-table-column>
      <el-table-column
        label="结算单位"
        width="200"
        show-overflow-tooltip
        prop="Sys_Name">
      </el-table-column>
      <el-table-column
        label="开票时间"
        show-overflow-tooltip
        prop="Invoice_Time">
      </el-table-column>
      <el-table-column
        label="单据状态"
        show-overflow-tooltip
        prop="Payment_Operate_State">
      </el-table-column>
      <el-table-column
        label="对账金额"
        show-overflow-tooltip
        prop="Reconciliation_Amount">
      </el-table-column>
      <el-table-column :label="formSearchData.Payment_Operate_State==='K'?'开票金额':'结算金额'" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="formSearchData.Payment_Operate_State==='K'">
            <el-input v-model="scope.row.Invoice_Amount" v-if="!scope.row.isDisabled"></el-input>
            <span v-if="scope.row.isDisabled">{{scope.row.Invoice_Amount}}</span>
          </span>
          <span v-if="formSearchData.Payment_Operate_State==='J'">
            <el-input v-model="scope.row.SettleUp_Amount" v-if="!scope.row.isDisabled"></el-input>
            <span v-if="scope.row.isDisabled">{{scope.row.SettleUp_Amount}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="费用类型"
        show-overflow-tooltip
        prop="Service_Type">
      </el-table-column>
      <el-table-column
        label="费用项目"
        show-overflow-tooltip
        prop="Service_Item">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="toDetail(scope.row.Payment_Record_Id)"
            type="text"
            size="small">
            详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="运营方">
              <span>{{ props.row.Operator_Name }}</span>
            </el-form-item>
            <el-form-item :label="formSearchData.Payment_Operate_State==='K'?'对账单位':'结算单位'">
              <span>{{ props.row.Sys_Name }}</span>
            </el-form-item>
            <el-form-item label="开票时间">
              <span>{{ props.row.Invoice_Time }}</span>
            </el-form-item>
            <el-form-item label="单据状态">
              <span>{{ props.row.Payment_Operate_State }}</span>
            </el-form-item>
            <el-form-item label="对账金额">
              <span>{{ props.row.Reconciliation_Amount }}</span>
            </el-form-item>
            <el-form-item label="开票金额" v-if="formSearchData.Payment_Operate_State==='K'">
              {{props.row.Invoice_Amount}}
            </el-form-item>
            <el-form-item label="结算金额" v-if="formSearchData.Payment_Operate_State==='J'">
              {{props.row.SettleUp_Amount}}
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
            <el-form-item label="结算时间">
              <span>{{ props.row.SettleUp_Time }}</span>
            </el-form-item>
            <el-form-item label="开票员">
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
    </el-table>-->
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
  //  import commonSelect from '@/common/service/select/select-service-type'
  import selectServiceType from '@/common/service/select/select-service-type'
  import balanceModal from '@/common/service/modal/balance-modal'
  import operatorModal from '@/common/service/modal/operator-modal'

  export default {
    data () {
      return {
        formSearchData: {
          Begin_Date: '',
          End_Date: '',
          Payment_Operate_State: 'K',
          Ssa_Name: '',
          SettleUp_Company_Id: '',
          Operator_Name: '',
          Operator_Id: '',
          Service_Type: ''
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
        Payment_Record_Id: [], // 存勾选了的ID
        currentRouteName: '',
        diecType: ''
      }
    },
    methods: {
      billCancel () {
        if (this.Payment_Record_Id.length > 0) {
          let params = {
            Operator: Api.userInfo.USERNAME,
            list_params: {}
          }
          params.list_params = JSON.stringify(this.Payment_Record_Id)
          Api.post('JlpPayInvoiceCancel', params).then(res => {
            if (res.Flag) {
              this.$alert('撤销成功！', '友情提示').then(() => {
                this.init()
              })
            } else {
              this.$alert(res.ErrInfo, '友情提示')
            }
          })
        } else {
          this.$alert('请勾选后再执行！', '友情提示')
        }
      },
      settleCancel () {
        if (this.Payment_Record_Id.length > 0) {
          let params = {
            Operator: Api.userInfo.USERNAME,
            list_params: {}
          }
          params.list_params = JSON.stringify(this.Payment_Record_Id)
          Api.post('JlpPaySettleUpCancel', params).then(res => {
            if (res.Flag) {
              this.$alert('撤销成功！', '友情提示').then(() => {
                this.init()
              })
            } else {
              this.$alert(res.ErrInfo, '友情提示')
            }
          })
        } else {
          this.$alert('请勾选后再执行！', '友情提示')
        }
      },
      toDetail (id) {
        this.$router.push({
          name: 'handleDetailList',
          params: {
            Payment_Record_Id: id,
            routeName: this.currentRouteName,
            paymentOperateState: this.formSearchData.Payment_Operate_State
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
        if (this.formSearchData.Payment_Operate_State === 'K') {
          paramsPort = 'BalQ_JlpInvoiceCancel'
        }
        if (this.formSearchData.Payment_Operate_State === 'J') {
          paramsPort = 'BalQ_JlpSettleCancel'
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
        this.Payment_Record_Id = []
        val.forEach(item => {
          let idOne = {
            Payment_Record_Id: item.Payment_Record_Id
          }
          this.Payment_Record_Id.push(idOne)
        })
      },
      init () {
        this.currentRouteName = this.$route.name // 记录当前的路由，传递给第二级数据
        this.diecType = this.$route.params.diecType
        let nowDate = new Date()
        this.formSearchData.Begin_Date = this.formSearchData.Begin_Date ? this.formSearchData.Begin_Date : new Date(nowDate.setDate(nowDate.getDate() - 30))
        this.formSearchData.End_Date = this.formSearchData.End_Date ? this.formSearchData.End_Date : new Date()
        this.getData()
      }
    },
    mounted () {
      this.init()
    },
    computed: {
      openBillMoney () { // 开票总金额
        let total = 0
        this.tableData.forEach(item => {
          if (!item.isDisabled) {
            total = floatAdd(total, item.Invoice_Amount)
          }
        })
        return total
      },
      settleMoney () { // 结算金额
        let total = 0
        this.tableData.forEach(item => {
          if (!item.isDisabled) {
            total = floatAdd(total, item.SettleUp_Amount)
          }
        })
        return total
      },
      settleAllMoney () { // 应收总金额
        let total = 0
        this.tableData.forEach(item => {
          if (!item.isDisabled) {
            total = floatAdd(total, item.Reconciliation_Amount)
          }
        })
        return total
      },
      settleOtherMoney () { // 未收金额
        let that = this
        return parseFloat(that.settleAllMoney) - parseFloat(that.settleMoney)
      }
    },
    watch: {
      '$route' (val) {
        this.init()
      }
    },
    components: {
      selectServiceType,
      balanceModal,
      operatorModal
    }
  }
</script>

<style lang="less">
  .handle {
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
    .condition-box {
      margin-top: 20px;
      border: 1px solid #EBEEF5;
      padding: 22px 15px 0 15px;
      .form-search {
        border-bottom: 1px dashed #EBEEF5;
      }
      .open-bill {
        margin-top: 22px;
      }
      .settle-confirm {
        margin-top: 22px;
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
  }
</style>
