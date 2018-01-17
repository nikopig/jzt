<template>
  <div class="order-sum common-container">
    <div class="content-order">
      <div class="title">
        开票信息
      </div>
      <el-form :label-position="'top'" :model="kpxxform" ref="kpxxform">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-form-item label="开票员:">
              <el-input v-model="kpxxform.Invoice_Staff" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="业务单号:">
              <el-input v-model="kpxxform.Businessbill_No"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品大类:">
              <el-input v-model="kpxxform.Goods_Type" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出库方式:">
              <el-select v-model="choiceType">
                <el-option v-for="(tItem, tIndex) in outType" :label="tItem.label" :value="tItem.value" :key="tIndex"></el-option>
              </el-select>
              <!--<el-input v-model="outType.label" :disabled="true"></el-input>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出库整件数:">
              <el-input v-model="quality.Outbound_Pcss" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出库零散数:">
              <el-input v-model="quality.Outbound_Spss" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出库数量:">
              <el-input v-model="quality.Outbound_Quantitys" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="出库时间:" :rules="[{ type: 'date', required: true, message: '请输入到货时间', trigger: 'blur' }]"
                          prop="Delivery_Time">
              <el-date-picker
                v-model="kpxxform.Delivery_Time"
                size="mini"
                type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="choiceType == '2'">
            <el-form-item label="时效:">
              <el-input v-model="kpxxform.Aging"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="choiceType == '2'">
            <el-form-item label="公里数:">
              <el-input v-model="kpxxform.Kilometers"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="choiceType == '2'">
            <el-form-item label="是否回单:">
              <el-radio-group v-model="kpxxform.Is_Receipt">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="choiceType == '2'">
            <el-form-item label="是否现场打印:">
              <el-radio-group v-model="kpxxform.Is_ScenePrint">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="备注:">
              <el-input v-model="kpxxform.Remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="title">
        地址信息
      </div>
      <el-form :label-position="'top'" :model="dzxxform">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-form-item label="出库地址(双击可选择):">
              <div class='content' @dblclick="openDialog('rk')">
                <el-input v-model="dzxxform.OutbAddress" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系人:">
              <el-input v-model="dzxxform.OutContact_Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系电话:">
              <el-input v-model="dzxxform.OutContact_Phone" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="title">
        客户信息
      </div>
      <el-form :label-position="'top'" :model="khxxform">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-form-item label="客户名称:">
              <div class='content'>
                <el-input v-model="khxxform.Ssa_Name" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户地址:">
              <el-input v-model="khxxform.SsaAddress" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户联系人:">
              <el-input v-model="khxxform.SsaContact_Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="客户联系电话:">
              <el-input v-model="khxxform.SsaContact_Phone" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="title">
        开票清单
      </div>
      <el-card class="box-card" v-for="(item,index) in orders" :key="index">
        <div slot="header" class="clearfix">
          <span style="margin-left: 75px">商品类型:&nbsp;&nbsp;{{item.Business_Model_Desc}}</span>
          <span style="margin-left: 75px">客户类型：{{kpxxform.Outbound_TYPE}}</span>
          <span style="float: right;">
            <el-button type="text" @click="orderCancel(item.Sdetails_Id)"><i class="el-icon-mo-shanchu"></i>&nbsp;&nbsp;删除</el-button>
          </span>
        </div>
        <el-form>
              <common-row>
                <common-col>
                  <span class="label">商品名称：</span>
                  <div class="content">
                    <el-input v-model="item.Goods_Name" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">生产厂家：</span>
                  <div class="content">
                    <el-input v-model="item.Manufacturer" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">商品批号：</span>
                  <div class="content">
                    <el-input v-model="item.Goods_Lotno" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">生产日期：</span>
                  <div class="content">
                    <el-input v-model="item.Production_Date" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">有效日期：</span>
                  <div class="content">
                    <el-input v-model="item.Valid_Until" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">包装单位：</span>
                  <div class="content">
                    <el-input v-model="item.Package_Unit" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">温层：</span>
                  <div class="content">
                    <el-input v-model="item.Refrigeration_Type" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">出库件数：</span>
                  <div class="content">
                    <el-input v-model="item.Outbound_Pcs" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">出库零散数：</span>
                  <div class="content">
                    <el-input v-model="item.Outbound_Sps" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">出库数量：</span>
                  <div class="content">
                    <el-input v-model="item.Outbound_Quantity" :disabled="true"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">商品价值：</span>
                  <div class="content">
                    <el-input v-model="item.Goods_Value" :disabled="true"></el-input>
                  </div>
                </common-col>
              </common-row>
            </el-form>
      </el-card>
    </div>
    <div class="bottom">
      <span class="btn-group">
        <el-button>模板导出</el-button>
        <el-button>模板导入</el-button>
        <el-button @click="orderConfirm">提交订单</el-button>
        <el-button @click="orderCancel()">订单取消</el-button>
      </span>
    </div>
    <common-modal ref='sx' :DialogTitle='DialogTitles[1]' :TableHeader='Tables.sx' :listData='copySxData' :isVisible.sync="dialogShow.sx" :isPages="false" @confirm='confirmSX' @search="searchSX"></common-modal>
    <common-modal ref='rk' :isPages="false" :DialogTitle='DialogTitles[0]' :TableHeader='Tables.rk' :listData='copyRkData' :isVisible.sync="dialogShow.rk" @confirm='confirmRK' @search="searchRK"></common-modal>
  </div>
</template>

<script>
  import commonModal from '@/common/components/common-modal'
  import commonRow from '@/common/components/common-row'
  import commonCol from '@/common/components/common-col'
  import Api from '@/common/js/api'
  import { DateFtt, someMeta } from '@/common/js/utils'

  export default {
    data () {
      return {
        currentIndex: 0,
        kpxxform: {
          Outbound_TYPE: '',
          Invoice_Staff: '',
          Businessbill_No: '',
          Goods_Type: '',
          OutbAddress_Id: '',
          thAddress: '',
          Delivery_Time: '',
          Remarks: '',
          Aging: '',
          Kilometers: '',
          Business_Model_Desc: '', // 业务类型
          Is_Receipt: 'Y',
          Is_ScenePrint: 'Y'
        },
        dzxxform: {
          OutbAddress: '',
          OutContact_Name: '',
          OutContact_Phone: ''
        },
        khxxform: {
          Ssa_Name: '',
          SsaAddress: '',
          SsaContact_Name: '',
          SsaContact_Phone: ''
        },
        DialogTitles: ['出库地址'],
        Tables: {
          rk: [
            {
              title: '物流中心',
              field: 'Ldc_Name'
            },
            {
              title: '出库地址',
              field: 'Address'
            },
            {
              title: '联系人',
              field: 'Contact_Name'
            },
            {
              title: '联系电话',
              field: 'Contact_Phone'
            }
          ]
        },
        orders: [],   //开票订单
        ordersInform: [],    //开票信息
        sxData: [],
        copySxData: [],
        rkData: [],
        copyRkData: [],
        outType: [
          {
            label: '出库待配',
            value: '1'
          },
          {
            label: '出库配送',
            value: '2'
          }
        ], // 出库方式
        choiceType: '', // 选择的出库方式
        isPrintRadio: [
          {
            radioKey: '1',
            radioValue: '是'
          },
          {
            radioKey: '2',
            radioValue: '否'
          }
        ], // 是否打印 / 回单
        deliveryType: '1', // 配送费计算方式
        dialogShow: {
          sx: false,
          rk: false
        }
      }
    },
    components: {
      commonModal,
      commonRow,
      commonCol
    },
    methods: {
      openDialog (val) {
        this.dialogShow[val] = true
      },
      confirmSX (row) {
        this.orders[this.currentIndex].Aging = row.Aging
      },
      confirmRK (row) {
        this.kpxxform.OutbAddress_Id = row.Address_Id
        this.dzxxform.OutbAddress = row.Address
        this.dzxxform.InContact_Name = row.Contact_Name
        this.dzxxform.InContact_Phone = row.Contact_Phone
      },
      showDialog (value, index) {
        this.$refs[value].pihaoDialog = true
        if (this.currentIndex) this.currentIndex = index
      },
      getAddress (ssaId) {
        Api.get('GetAddress', {
          Ssa_Id: ssaId || '%'
        }).then((res) => {
          if (!res.Flag) {
            this.$alert(res.ErrInfo)
            return
          }
          this.sxData = res.MsgInfo
          this.copySxData = this.sxData
        })
      },
      getLdcAddress (conId, ldcId) {
        Api.get('GetLdcAddress', {
          Con_Id: conId,
          Ldc_Id: ldcId
        }).then((res) => {
          if (!res.Flag) {
            this.$alert(res.ErrInfo)
            return
          }
          this.rkData = res.MsgInfo
          this.copyRkData = this.rkData
        })
      },
      getOrders () {
        let that = this
        Api.get('GetCartOutHz', {
          Operator: Api.userInfo.USERID
        }).then((res) => {
          if (!res.Flag) {
            this.$alert(res.ErrInfo)
            return
          }
          that.ordersInform = res.MsgInfo
          if (that.ordersInform.length > 0) {
            that.getAddress(that.ordersInform[0].Ssa_Id)
            that.getLdcAddress(that.ordersInform[0].Con_Id, that.ordersInform[0].Ldc_Id)
            for (let key in that.ordersInform[0]) {
              if (key in that.kpxxform) {
                that.kpxxform[key] = that.ordersInform[0][key]
              }
              if (key in that.dzxxform) {
                that.dzxxform[key] = that.ordersInform[0][key]
              }
              if (key in that.khxxform) {
                that.khxxform[key] = that.ordersInform[0][key]
              }
            }
          } else {
            Object.assign(this.$data, this.$options.data())
          }
        })
        Api.get('GetCartOutMx', {Operator: Api.userInfo.USERID}).then(res => {
          if (!res.Flag) {
            this.$alert(res.ErrInfo)
            return
          }
          that.orders = res.MsgInfo
          if (this.orders.length > 0) {
            this.kpxxform.Business_Model_Desc = this.orders[0].Business_Model_Desc
            this.choiceType = this.kpxxform.Business_Model_Desc === '仓储' ? '1' : '2'
          }
        })
      },
      orderConfirm () {
        this.$refs.kpxxform.validate((valid) => {
          if (valid) {
            let judge = someMeta(this.orders, (a, b) => {
              return a.Goods_Lotno === b.Goods_Lotno && a.Goods_Name === b.Goods_Name
            })
            if (judge) {
              this.$alert('订单中存在同一商品同一批号的明细，无法提交')
              return false
            }
            let param = {
              hz_params: {
                Outbound_Mode: this.choiceType,
                OutbAddress_Id: this.kpxxform.OutbAddress_Id ? this.kpxxform.OutbAddress_Id : '',
                Delivery_Time: DateFtt('yyyy-MM-dd', this.kpxxform.Delivery_Time),
                Remarks: this.kpxxform.Remarks ? this.kpxxform.Remarks : '',
                Businessbill_No: this.kpxxform.Businessbill_No,
                Aging: this.kpxxform.Aging,
                Kilometers: this.kpxxform.Kilometers,
                Is_Receipt: this.kpxxform.Is_Receipt,
                Is_ScenePrint: this.kpxxform.Is_ScenePrint,
                Goods_Type: this.kpxxform.Goods_Type,
                Operator: Api.userInfo.USERID
              }
            }
            param.hz_params = JSON.stringify(param.hz_params)
//            param.list_params = JSON.stringify(param.list_params)
            Api.post('OutCartSubmit', param).then(res => {
              if (res.Flag) {
                this.$alert('提交订单成功！', '提示').then(() => {
                  this.getOrders()
                })
              } else {
                this.$alert(res.ErrInfo)
              }
            })
          } else {
            return false
          }
        })
      },
      orderCancel (sid) {
        let params = {
          Operator: Api.userInfo.USERID,
          Sdetails_Id: sid || ''
        }
        let notice = sid ? '此操作将删除该条明细, 是否继续?' : '此操作将取消订单, 是否继续?'
        this.$confirm(notice, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.post('OutCartCancel', params).then(res => {
            if (res.Flag) {
              this.$alert('取消订单成功！', '提示')
                .then(() => {
                  this.getOrders()
                })
            } else {
              this.$alert(res.ErrInfo)
            }
          })
        })
      },
      searchSX (keyword) {
        let searchRegex = new RegExp(keyword.trim(), 'i')
        this.copyThData = this.sxData.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
      },
      searchRK (keyword) {
        let searchRegex = new RegExp(keyword.trim(), 'i')
        this.copyRkData = this.rkData.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
      }
    },
    computed: {
      quality () {
        let temp = {
          Outbound_Quantitys: 0,
          Outbound_Pcss: 0,
          Outbound_Spss: 0
        }
        this.orders.forEach(item => {
          temp.Outbound_Quantitys += item.Outbound_Quantity
          temp.Outbound_Pcss += item.Outbound_Pcs
          temp.Outbound_Spss += item.Outbound_Sps
        })
        return temp
      }
    },
    activated () {
      this.getOrders()
    }
  }
</script>

<style lang="less">
  @import '../../../../common/style/less/primary.less';
  @import '../../../../common/style/less/common.less';

  .order-sum {
    padding: 30px 70px 0 75px;
    .content-order {
      padding-bottom: 100px;
      .title {
        font-size: 14px;
        color: #000000;
        font-weight: 600;
      }
      .el-form {
        margin-top: 15px;
        .el-form-item {
          .el-form-item__label {
            font-size: 12px;
          }
          .el-form-item__content {
            .el-radio-group {
              width: 100%;
              .el-radio__label {
                font-size: 12px;
              }
            }
            .el-date-editor {
              width: 100%;
            }
            .el-select {
              width: 100%;
            }
          }
        }
      }
      .box-card {
        margin-top: 15px;
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-card__header {
          padding: 0 12px;
          line-height: 32px;
          background-color: @bg-rectangle-def-head;
          font-size: @font-size-small;
          .el-checkbox__inner {
            z-index: 0;
          }
        }
        .el-card__body {
          padding: 10px 10px 10px 0;
          .box-card-content {
            width: 100%;
            display: flex;
            margin-top: 15px;
            .box-card-content-item {
              flex: 1;
              width: 20%;
              text-align: right;
              .label-item {
                text-align: right;
                width: 45%;
                font-size: 12px;
              }
              .el-input, .input-item {
                width: 55%;
                display: inline-block;
              }
              .el-radio-group {
                text-align: left;
              }
            }
            &:nth-child(1) {
              margin-top: 0;
            }
          }
        }
      }
      .checkedCard {
        .el-card__header {
          background-color: #e8f1f5;
        }
        .el-card__body {
          background-color: #f2fbff;
        }
      }
    }
    .bottom {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 72px;
      background-color: #fff;
      border-top: 1px solid #ccc;
      .btn-group {
        float: right;
        margin-right: 70px;
        margin-top: 18px;
        .el-button {
          border: none;
          &:nth-child(1) {
            color: #fff;
            background-color: @bg-button-def-yellow;
            &:hover {
              border: none;
              background-color: @bg-button-hover-yellow;
            }
          }
          &:nth-child(2) {
            color: #fff;
            background-color: @bg-button-def-green;
            &:hover {
              border: none;
              background-color: @bg-button-hover-green;
            }
          }
          &:nth-child(3) {
            color: #fff;
            background-color: @bg-button-def-blue;
            &:hover {
              border: none;
              background-color: @bg-button-hover-blue;
            }
          }
          &:nth-child(4) {
            color: #fff;
            background-color: @bg-button-def-red;
            &:hover {
              border: none;
              background-color: @bg-button-hover-red;
            }
          }
        }
      }
    }
  }

  .order-sum-select {
    .el-select-dropdown__item {
      font-size: 12px;
      padding: 0 10px;
      height: 24px;
      line-height: 24px;
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
