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
            <el-form-item label="委托方名称:">
              <el-input v-model="kpxxform.Con_Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="产品大类:">
              <el-input v-model="kpxxform.Goods_Type" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="到货方式:">
              <el-radio-group v-model="kpxxform.Arrival_Mode">
                <el-radio :label="item.radioKey" v-for="(item,index) in radio" :key="index">
                  {{item.radioValue}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="kpxxform.Arrival_Mode === 'A2'">
            <el-form-item label="提货地:" :rules="[{ required: true, message: '请选择提货地', trigger: 'blur' }]"
                          prop="thAddress">
              <div class='content' @dblclick="openDialog('th')">
                <el-input v-model="kpxxform.thAddress" :disabled="true" placeholder="双击选择"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="物流中心:">
              <el-input v-model="kpxxform.Ldc_Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库件数:">
              <el-input v-model="kpxxform.Storage_Pcss" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库零散数:">
              <el-input v-model="kpxxform.Storage_Spss" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="入库数量:">
              <el-input v-model="kpxxform.Storage_Quantitys" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item :label="sjText" :rules="[{ type: 'date', required: true, message: '请输入到货时间', trigger: 'blur' }]"
                          prop="Takegds_Time">
              <el-date-picker
                v-model="kpxxform.Takegds_Time"
                size="mini"
                type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="业务单号：">
              <el-input v-model="kpxxform.Businessbill_No"></el-input>
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
            <el-form-item label="入库地址(双击可选择):">
              <div class='content' @dblclick="openDialog('rk')">
                <el-input v-model="dzxxform.StorageAddress" :disabled="true"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系人:">
              <el-input v-model="dzxxform.InContact_Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系电话:">
              <el-input v-model="dzxxform.InContact_Phone" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" v-if="kpxxform.Arrival_Mode === 'A2'">
          <el-col :span="4">
            <el-form-item label="提货地址:">
              <el-input v-model="dzxxform.thAddress" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系人:">
              <el-input v-model="dzxxform.thInContact_Name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="联系电话:">
              <el-input v-model="dzxxform.thInContact_Phone" :disabled="true"></el-input>
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
          <span style="margin-left: 75px">商品业务类型:&nbsp;&nbsp;{{item.Business_Model}}</span>
          <span style="margin-left: 75px">业务类型：{{item.Storage_Type}}</span>
          <span style="float: right;">
            <el-button type="text" @click="orderCancel(item.Sdetails_Id)"><i class="el-icon-mo-shanchu"></i>&nbsp;&nbsp;删除</el-button>
          </span>
        </div>
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
            <span class="label">入库件数：</span>
            <div class="content">
              <el-input v-model="item.Storage_Pcs" :disabled="true"></el-input>
            </div>
          </common-col>
          <common-col>
            <span class="label">入库零散数：</span>
            <div class="content">
              <el-input v-model="item.Storage_Sps" :disabled="true"></el-input>
            </div>
          </common-col>
          <common-col>
            <span class="label">入库数量：</span>
            <div class="content">
              <el-input v-model="item.Storage_Quantity" :disabled="true"></el-input>
            </div>
          </common-col>
          <common-col v-if="kpxxform.Arrival_Mode === 'A2'">
            <span class="label">商品价值：</span>
            <div class="content">
              <el-input v-model="item.Goods_Value" :disabled="true"></el-input>
            </div>
          </common-col>
          <!--<common-col>-->
            <!--<span class="label">体积：</span>-->
            <!--<div class="content">-->
              <!--<el-input v-model="item.Volume" :disabled="true"></el-input> -->
            <!--</div>-->
          <!--</common-col>-->
          <!--<common-col>-->
            <!--<span class="label">重量：</span>-->
            <!--<div class="content">-->
              <!--<el-input v-model="item.Goods_Weight" :disabled="true"></el-input>-->
            <!--</div>-->
          <!--</common-col>-->
        </common-row>
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
    <common-modal ref='th' :DialogTitle='DialogTitles[1]' :TableHeader='Tables.th' :listData='copyThData' :isVisible.sync="dialogShow.th" :isPages="false" @confirm='confirmTH' @search="searchTH"></common-modal>
    <common-modal ref='rk' :isPages="false" :DialogTitle='DialogTitles[0]' :TableHeader='Tables.rk' :listData='copyRkData' :isVisible.sync="dialogShow.rk" @confirm='confirmRK' @search="searchRK"></common-modal>
  </div>
</template>

<script>
  import commonModal from '@/common/components/common-modal'
  import commonRow from '@/common/components/common-row'
  import commonCol from '@/common/components/common-col'
  import Api from '@/common/js/api'
  import { DateFtt } from '@/common/js/utils'

  export default {
    data () {
      return {
        kpxxform: {
          Invoice_Staff: '',
          Businessbill_No: '',
          Con_Name: '',
          ConAddress: '',
          ConContact_Name: '',
          ConContact_Phone: '',
          Goods_Type: '',
          Arrival_Mode: 'A1',
          Ldc_Name: '',
          StorageAddress_Id: '',
          thAddress: '',
          Takegds_Time: '',
          Remarks: '',
          Storage_Pcss: 0,
          Storage_Spss: 0,
          Storage_Quantitys: 0
        },
        dzxxform: {
          StorageAddress: '',
          InContact_Name: '',
          InContact_Phone: '',
          thAddress_Id: '',
          thAddress: '',
          thInContact_Name: '',
          thInContact_Phone: ''
        },
        khxxform: {
          Ssa_Name: '',
          SsaAddress: '',
          SsaContact_Name: '',
          SsaContact_Phone: ''
        },
        DialogTitles: ['入库地址', '提货地址'],
        Tables: {
          th: [
            {
              title: '名称',
              field: 'Address_Shortname'
            },
            {
              title: '地址',
              field: 'Address_Shortname'
            },
            {
              title: '联系人',
              field: 'Contact_Name'
            },
            {
              title: '联系电话',
              field: 'Contact_Phone'
            }
          ],
          rk: [
            {
              title: '地址类型名称',
              field: 'Ldc_Name'
            },
            {
              title: '入库地址',
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
        thData: [],
        copyThData: [],
        rkData: [],
        copyRkData: [],
        radio: [
          {
            radioKey: 'A1',
            radioValue: '待货入库'
          },
          {
            radioKey: 'A2',
            radioValue: '提货入库'
          }
        ],
        dialogShow: {
          th: false,
          rk: false
        }
      }
    },
    components: {
      commonModal,
      commonRow,
      commonCol
    },
    computed: {
      sjText () {
        return this.kpxxform.Arrival_Mode === 'A1' ? '到货时间：' : '接货时间：'
      }
    },
    methods: {
      openDialog (val) {
        this.dialogShow[val] = true
      },
      confirmTH (row) {
        this.kpxxform.thAddress = row.Address_Shortname
        this.dzxxform.thAddress_Id = row.Address_Id
        this.dzxxform.thAddress = row.Address
        this.dzxxform.thInContact_Name = row.Contact_Name
        this.dzxxform.thInContact_Phone = row.Contact_Phone
      },
      confirmRK (row) {
        this.kpxxform.StorageAddress_Id = row.Address_Id
        this.dzxxform.StorageAddress = row.Address
        this.dzxxform.InContact_Name = row.Contact_Name
        this.dzxxform.InContact_Phone = row.Contact_Phone
      },
      showDialog (value) {
        this.$refs[value].pihaoDialog = true
      },
      getAddress (ssaId) {
        Api.get('GetAddress', {
          Ssa_Id: ssaId || '%'
        }).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          this.thData = res.MsgInfo
          this.copyThData = this.thData
        })
      },
      getLdcAddress (conId, ldcId) {
        Api.get('GetLdcAddress', {
          Con_Id: conId,
          Ldc_Id: ldcId
        }).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          this.rkData = res.MsgInfo
          this.copyRkData = this.rkData
        })
      },
      getOrders () {
        let that = this
        Api.get('GetStoreCartHz', {
          Operator: Api.userInfo.USERID
        }).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
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
        Api.get('GetStoreCartMx', {Operator: Api.userInfo.USERID}).then(res => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          that.kpxxform.Storage_Pcss = 0
          that.kpxxform.Storage_Quantitys = 0
          that.kpxxform.Storage_Spss = 0
          that.orders = res.MsgInfo
          that.orders.forEach(item => {
            that.kpxxform.Storage_Quantitys += item.Storage_Quantity
            that.kpxxform.Storage_Pcss += item.Storage_Pcs
            that.kpxxform.Storage_Spss += item.Storage_Sps
          })
        })
      },
      orderConfirm () {
        this.$refs.kpxxform.validate((valid) => {
          if (valid) {
            let param = {
              list_params: {
                Arrival_Mode: this.kpxxform.Arrival_Mode,
                TdelAddress_Id: this.dzxxform.thAddress_Id ? this.dzxxform.thAddress_Id : '%',
                Takegds_Time: DateFtt('yyyy-MM-dd', this.kpxxform.Takegds_Time),
                Remarks: this.kpxxform.Remarks ? this.kpxxform.Remarks : '',
                Operator: Api.userInfo.USERID,
                StorageAddress_Id: this.kpxxform.StorageAddress_Id,
                Businessbill_No: this.kpxxform.Businessbill_No
              }
            }
            param.list_params = JSON.stringify(param.list_params)
            Api.post('StoreCartSubmit', param).then(res => {
              if (res.Flag) {
                this.$alert('提交订单成功！', '提示').then(() => {
                  this.getOrders()
                })
              } else {
                this.messageInfo(res.ErrInfo)
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
        this.$confirm('此操作将取消订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Api.post('StoreCartCancel', params).then(res => {
            if (res.Flag) {
              this.$alert('取消订单成功！', '提示')
                .then(() => {
                  this.getOrders()
                })
            } else {
              this.messageInfo(res.ErrInfo)
            }
          })
        })
      },
      searchTH (keyword) {
        let searchRegex = new RegExp(keyword.trim(), 'i')
        this.copyThData = this.thData.filter((item) => {
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
    activated () {
      this.getOrders()
    },
    watch: {
      'kpxxform.Arrival_Mode' (newVal, oldVal) {
        if (oldVal === 'A1') {
          this.dzxxform.thAddress_Id = ''
          this.dzxxform.thAddress = ''
          this.dzxxform.thInContact_Name = ''
          this.dzxxform.thInContact_Phone = ''
        }
      }
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
              .el-input {
                width: 55%;
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
