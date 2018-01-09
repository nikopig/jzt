<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="goBack(-1)">{{breadcrumbItems.name}}</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="toolbar" v-if="routeName === 'handle'&&paymentOperateState==='3'">
      <div class="btn-box">
        <el-button type="text" icon="plus" @click="openBill">开票</el-button>
      </div>
    </div>
    <div class="open-bill" v-if="routeName === 'handle'&&paymentOperateState==='3'">
      <el-form :inline="true" :model="openBillData" ref="openBillData">
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
    </div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%" @selection-change="selectedData">
        <el-table-column type="selection" width="55"
                         v-if="routeName === 'handle'&&paymentOperateState==='3'"></el-table-column>
        <el-table-column prop="ConOrder_No" :label="labelText"></el-table-column>
        <el-table-column prop="Total_Amount" label="对账金额"></el-table-column>
        <el-table-column prop="Invoice_Amount" label="开票金额"></el-table-column>
        <el-table-column prop="Create_Time" label="开票时间"></el-table-column>
        <el-table-column prop="Start_Address" label="起点"></el-table-column>
        <el-table-column prop="End_Address" label="终点"></el-table-column>
        <el-table-column prop="TotalBox_Num" label="总件数"></el-table-column>
        <el-table-column prop="Gross_Volume" label="总体积"></el-table-column>
        <el-table-column prop="Gross_Weight" label="总重量"></el-table-column>
      </el-table>
    </div>
    <div class="handle-footer">
      <el-pagination
        @current-change="pageChange"
        :current-page.sync="pages.currentPage"
        :page-size="pages.pageSize"
        layout="total, prev, pager, next"
        :total="pages.totalItems">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import { floatAdd } from '@/common/js/utils'

  export default {
    name: 'handleDetailList',
    components: {},
    data () {
      return {
        diecType: '', // 收支类型(10:应收，11:其它应收，20:应付，21:其它应付)
        Payment_Record_Id: '',
        routeName: '',
        paymentOperateState: '', // 判断结算还是开票
        pages: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0
        },
        breadcrumbItems: {
          name: ''
        },
        tableData: [],
        openBillData: {
          SettleUp_Invoice: ''
        },
        selectedOpenBill: []
      }
    },
    computed: {
      labelText () {
        return (this.diecType === '10' || this.diecType === '11') ? '订单号' : '委托单号'
      },
      openBillMoney () {
        let total = 0
        if (this.selectedOpenBill.length > 0) {
          this.selectedOpenBill.forEach(item => {
            total = floatAdd(total, item.Total_Amount ? item.Total_Amount : 0)
          })
        }
        return total
      }
    },
    methods: {
      pageChange () {
        this.getDetail()
      },
      goBack (val) {
        this.$router.go(val)
      },
      getDetail () {
        let param = {
          Payment_Record_Id: this.Payment_Record_Id,
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        let paramPort = ''
        if (this.routeName === 'handle') {
          if (this.paymentOperateState === '3') {
            paramPort = 'JlpBalancePaymentMx'
          }
          if (this.paymentOperateState === 'K') {
            paramPort = 'BalQ_JlpInvoiceDataMx'
          }
        }
        if (this.routeName === 'handleCancel') {
          if (this.paymentOperateState === 'K') {
            paramPort = 'BalQ_JlpInvoiceCancelMx'
          }
          if (this.paymentOperateState === 'J') {
            paramPort = 'BalQ_JlpInvoiceDataMx'
          }
        }
        Api.get(paramPort, param).then(res => {
          if (res.Flag) {
            this.tableData = res.MsgInfo
            if (this.tableData.length > 0) this.pages.totalItems = this.tableData[0].Sum_Cnt
          } else {
            this.$alert('请求数据失败！', res.ErrInfo)
          }
        })
      },
      init () {
        this.openBillData.SettleUp_Invoice = ''
        this.diecType = this.$route.params.diecType
        this.paymentOperateState = this.$route.params.paymentOperateState
        this.Payment_Record_Id = this.$route.params.Payment_Record_Id
        this.routeName = this.$route.params.routeName
        if (this.routeName === 'handle' && this.diecType === '10') {
          this.breadcrumbItems.name = '应收结算'
        }
        if (this.routeName === 'handleCancel' && this.diecType === '10') {
          this.breadcrumbItems.name = '应收撤销'
        }
        /*if (this.routeName === 'otherHandle' && this.diecType === '10') {
          this.breadcrumbItems.name = '其它应付结算'
        }*/
        if (this.routeName === 'handle' && this.diecType === '20') {
          this.breadcrumbItems.name = '应付结算'
        }
        if (this.routeName === 'handleCancel' && this.diecType === '20') {
          this.breadcrumbItems.name = '应付撤销'
        }
        /* if (this.routeName === 'otherHandle' && this.diecType === '20') {
           this.breadcrumbItems.name = '其它应收结算'
         }*/
        this.getDetail()
      },
      selectedData (selection) {
        this.selectedOpenBill = selection
      },
      openBill () {
        if (this.selectedOpenBill.length === 0) {
          this.$alert('请勾选单据', '提示')
          return
        }
        this.$refs.openBillData.validate((valid) => {
          if (valid) {
            let param = {
              Operator: '',
              Total_Amount: '',
              list_params: {}
            }
            param.Total_Amount = this.openBillMoney
            param.Operator = Api.userInfo.USERNAME
            let paramsList = []
            this.selectedOpenBill.forEach(item => {
              let paramTemp = {
                Payment_Record_Id: this.Payment_Record_Id,
                Fee_Record_Id: item.Fee_Record_Id,
                Total_Amount: item.Total_Amount,
                Invoice_Amount: item.Invoice_Amount,
                SettleUp_Invoice: this.openBillData.SettleUp_Invoice
              }
              paramsList.push(paramTemp)
            })
            param.list_params = JSON.stringify(paramsList)
            Api.post('JlpPaymentInvoiceMx', param).then(res => {
              if (res.Flag) {
                this.$alert('开票成功!', '提示').then(() => {
                  this.init()
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .headbar {
    margin-bottom: 10px;
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
    }
  }

  .open-bill {
    margin-top: 10px;
    margin-left: 10px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .condition-box {
    margin-top: 20px;
    border: 1px solid #EBEEF5;
    padding: 15px;
    .label-input {
      label {
        padding-right: 8px;
      }
      .el-input {
        width: auto;
      }
    }
  }

  .handle-footer {
    text-align: center;
    margin-top: 15px;
  }

  .table-box {
    margin-top: 20px;
  }
</style>
