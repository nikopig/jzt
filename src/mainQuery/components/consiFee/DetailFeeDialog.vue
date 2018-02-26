<template>
    <div>
        <el-dialog class="Mydialog" :title="DialogTitle" :visible.sync="visible" size="large">
            <el-form :model="formSearchData" :inline="true" class="feeSearch">
                <!-- <div class='form-group'> -->
                    <el-form-item label="费用项目">
                        <!-- <el-input  v-model="formSearchData.Service_Name"></el-input> -->
                        <el-select v-model="formSearchData.Service_Name" placeholder="请选择" clearable >
                            <el-option
                              v-for="item in serviceName"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计费方式">
                        <!-- <el-input  v-model="formSearchData.Charging_Rule_Name"></el-input> -->
                        <el-select v-model="formSearchData.Charging_Rule_Name" placeholder="请选择" clearable >
                            <el-option
                              v-for="item in chargingRule"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单编号">
                        <el-input  v-model="formSearchData.ConOrder_no"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                    </el-form-item>
                  <!-- <el-input v-model="form.keyword" auto-complete="off" placeholder='输入关键字搜索' suffix-icon="el-icon-search" :on-icon-click="onSearch" @keyup.native.enter="onSearch"></el-input> -->
                <!-- </div> -->
            </el-form>
            <div class="feeNum">
                <div class="feestyle">
                    <span>费用条目计数：</span>
                    <span>{{feelistData.length}}</span>
                </div>
                <div class="feestyle">
                    <span>费用项目数：</span>
                    <span>{{serviceName.length}}</span>
                </div>
                <div class="feestyle">
                    <span>整单费用：</span>
                    <span>{{calculateSingle().single}}</span>
                </div>
                <div class="feestyle">
                    <span>明细费用：</span>
                    <span>{{calculateSingle().detail}}</span>
                </div>
                <div class="feestyle">
                    <span>总费用：</span>
                    <span>{{totalFee()}}</span>
                </div>
                <div class="feestyle">
                    <span>金额单位：</span>
                    <span>元</span>
                </div>
            </div>
            <div class='tabel-wrapper'>
                <el-table :data="copyfeelistData" height="300">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="Charging_Type_Name" label="计算方式" show-overflow-tooltip></el-table-column> 
                    <el-table-column prop="ConOrder_no" label="订单编号" show-overflow-tooltip width="250"></el-table-column>
                    <el-table-column prop="Ssa_Name" label="客户名称"  show-overflow-tooltip width="250"></el-table-column> 
                    <el-table-column prop="Service_Name" label="费用项目" show-overflow-tooltip></el-table-column> 
                    <el-table-column prop="Charging_Rule_Name" label="计费方式" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Payer_Name" label="付款方" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="Total_Amount" label="参考费用" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="Real_Amount" label="实际费用" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goBack">返 回</el-button>
            </div>
        </el-dialog> 
    </div>
</template>
<script type="text/javascript">
  import Api from '@/common/js/api.js'
  export default {
    name: 'DetailFeeDialog',
    props: {
        //是否打开弹框
        isVisible: {
            type: Boolean,
            default: false
        },
        //弹框的表头名字(title)
        DialogTitle: {
            type: String,
            default: '编辑页面'
        },
        rowData: {
            type: Object,
            default () {
                return {}
            }
        }
        /*//表头数据
        TableHeader: {
            type: Array,
            default () {
                return []
            }
        },
        //表格数据
        listData: {
            type: Array,
            default () {
                return []
            }
        }*/
    },
    data () {
      return {
        visible: this.isVisible, //父组件不传visible过来，弹框默认是关闭
        formSearchData: {
            Service_Name: '',
            Charging_Rule_Name: '',
            ConOrder_no: ''
        },
        feeDetail: this.rowData,  //取一个变量名把父组件传过来的数据赋值给这个变量
        feelistData: [],  //费用详情表格数据
        copyfeelistData: [],  //拷贝一份费用详情表格数据
        serviceName: [],  //费用项目数据
        chargingRule: []  //计费方式数据
      }
    },
    watch: {
        rowData (val) {
            //监听传来的汇总数据，变化了赋值给feeDetail，初始rowData是没数据的，所以只有监听有值变化了在调用数据请求
         this.feeDetail = val
         this.getFeeDetail(this.feeDetail.Fee_Record_Ids)
        }
    },
    methods: {
        searchData () { //查询
            this.copyfeelistData = this.feelistData.filter((item) => {
                if ((this.formSearchData.Service_Name === item.Service_Name || this.formSearchData.Service_Name === '') && (this.formSearchData.Charging_Rule_Name === item.Charging_Rule_Name || this.formSearchData.Charging_Rule_Name === '') && ((item.ConOrder_no).toUpperCase().indexOf((this.formSearchData.ConOrder_no).toUpperCase().trim()) !== -1)) {
                    return true
                }
            })
        },
        goBack () {  //返回
            this.visible = false
        },
        getFeeDetail (val) {  //请求详细费用
            let params = {
                Fee_Record_Ids: val
            }
            this.initAll() //清空表单数据
            Api.get('TmpWTFGetBillTransportAHdrFYMX', params).then(res => {
                if (res.Flag) {
                    this.feelistData = res.MsgInfo
                    this.copyfeelistData = this.feelistData
                    console.log(this.feelistData, '详细费用')
                    this.feelistData.forEach((item, index) => {
                        var repeat = true
                        var repeat1 = true
                        if (item.Service_Name) {
                            this.arrayRepeat(item.Service_Name, this.serviceName, repeat) //调用数据push到数组中并且去重
                            /*if (this.serviceName.length > 0) {
                                for (var i = 0; i < this.serviceName.length; i++) {
                                    if (item.Service_Name === this.serviceName[i]) {
                                        repeat = false
                                        break
                                    }
                                }
                                if (repeat) {
                                    this.serviceName.push(item.Service_Name)
                                }
                            } else {
                                this.serviceName.push(item.Service_Name)
                            }*/
                        }
                        if (item.Charging_Rule_Name) {
                            this.arrayRepeat(item.Charging_Rule_Name, this.chargingRule, repeat1) //调用数据push到数组中并且去重
                            //this.chargingRule.push(item.Charging_Rule_Name)
                        }
                    })
                    console.log(this.serviceName, '费用项目')
                    console.log(this.chargingRule, '计费方式')
                } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                }
            })
        },
        totalFee () {  //计算总费用
            var fee = 0
            this.feelistData.forEach((item, index) => {
                fee += item.Real_Amount
            })
            return fee
        },
        calculateSingle () { //整单费用和明细费用
            var Fee = {}
            var single = 0
            var detail = 0
            this.feelistData.forEach((item, index) => {
                if (item.Charging_Type_Name === '按整单计算') {
                    single += item.Real_Amount
                }
                if (item.Charging_Type_Name === '按明细计算') {
                    detail += item.Real_Amount
                }
            })
            Fee.single = single
            Fee.detail = detail
            console.log(Fee, 'ahdcoiasdh')
            return Fee
        },
        arrayRepeat (oldval, newdata, quantity) { // 数组去重
            if (newdata.length > 0) {
                for (var i = 0; i < newdata.length; i++) {
                    if (oldval === newdata[i]) {
                        quantity = false
                        break
                    }
                }
                if (quantity) {
                    newdata.push(oldval)
                }
            } else {
                newdata.push(oldval)
            }
        },
        initAll () { //清空表单数据
            this.formSearchData.Service_Name = ''
            this.formSearchData.Charging_Rule_Name = ''
            this.formSearchData.ConOrder_no = ''
            this.serviceName = []
            this.chargingRule = []
        }
    }
  }
</script>
<style lang="less">
    .Mydialog{
        font-family: "Microsoft YaHei";
        table{
          width:100% !important;
        }
        .feeSearch{
            .el-form-item{
                margin-bottom:10px;
            }
        }
        .el-input__icon{
          margin:0;
        }
        .el-dialog{
          border-radius: 4px;
          .el-dialog__header{
            background-color: #eef6f6;
            padding: 11px 13px;
            border-radius: 4px 4px 0 0;
            .el-dialog__title{
              font-size:16px;
              font-weight: 500;
            }
          }
          .el-dialog__body{
            padding:20px;
            .form-group{
              width: 400px;
              height:30px;
              margin-bottom:15px;
              .el-input{
                height:100%;
                border-radius: 0;
              }
            }
            .el-table{
              .el-table__header-wrapper{
                th{
                  height:32px;
                  .cell{
                    font-size: 12px;
                    font-weight: 600;
                  }
                }
              }
              .el-table__body-wrapper{
                td{
                  height:32px;
                  .cell{
                    line-height:16px;
                    font-size:12px;
                    white-space: nowrap;
                    .name-wrapper{
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                }
              }
            }
            .el-pagination{
              margin-top:15px;
            }
          }
        }
        .feeNum{
            margin-bottom:15px;
            .feestyle{
                display:inline-block;
                margin-right:30px;
                line-height:20px;
                span{
                    font-size:12px;
                    color:#FF6631;
                }
            }
        }
    }
</style>
