<template>
    <div>
        <el-dialog class='Mydialog' :title="DialogTitle" :visible.sync="visible" size="large">
            <div class="header-wrapper">
                <ul class="detailInfor">
                    <li>
                        <span class="descrabname">客户名称：</span>
                        <span>{{orderDetail.Ssa_Name}}</span>
                    </li>
                    <li>
                        <span class="descrabname">开票员：</span>
                        <span>{{orderDetail.Invoice_Staff_Name}}</span>  
                    </li>
                </ul>
                <ul class="detailInfor">
                    <li>
                        <span class="descrabname">委托方订单号：</span>
                        <span>{{orderDetail.ConOrder_no}}</span> 
                    </li>
                    <li>
                        <span class="descrabname">提货方式：</span>
                        <span>{{orderDetail.Tdg_Mode_Name}}</span> 
                    </li>
                </ul>
                <ul class="detailInfor">
                    <li>
                        <span class="descrabname">开票时间：</span>
                        <span>{{orderDetail.Invoice_Time}}</span> 
                    </li>
                    <li>
                        <span class="descrabname">送货地址：</span>
                        <span>{{orderDetail.Address_Shortname}}</span>
                    </li>
                </ul>
            </div>
            <div class='tabel-wrapper'>
                <el-table :data="detailerData" height="300">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="Goods_No" label="商品编号" show-overflow-tooltip></el-table-column> 
                    <el-table-column prop="Goods_Name" label="商品名称" show-overflow-tooltip></el-table-column> 
                    <el-table-column prop="Invoice_Time" label="规格"  show-overflow-tooltip></el-table-column> 
                    <el-table-column prop="Actual_Pcs" label="件数" show-overflow-tooltip></el-table-column> 
                    <el-table-column prop="Planned_Volume" label="体积m³" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Planned_Weight" label="重量kg" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Lot_No" label="批号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Production_Date" label="生产日期" show-overflow-tooltip width="200"></el-table-column>
                    <el-table-column prop="Valid_Until" label="有效期" show-overflow-tooltip width="200"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goBack">关 闭</el-button>
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
            default: '查询详情界面'
        },
        rowData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
      return {
        visible: this.isVisible, //父组件不传visible过来，弹框默认是关闭
        detailerData: [],
        orderDetail: this.rowData  //命名一个变量接住传来的汇总那一行数据
      }
    },
    watch: {
       rowData (val) { //监听传来的汇总数据，变化了赋值给orderDetail，初始rowData是没数据的，所以只有监听有值变化了在调用数据请求
         this.orderDetail = val
         this.getInformation(this.orderDetail.ConOrder_no)
       }
    },
    methods: {
        goBack () {  //返回
            this.visible = false
        },
        getInformation (val) {  //请求明细详情
            let params = {
                ConOrder_no: val
            }
            Api.get('TmpWTFGetBillTransportAHdrTwoMX', params).then(res => {
                if (res.Flag) {
                    this.detailerData = res.MsgInfo
                    console.log(this.detailerData, '详情详情详情')
                } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                }
            })
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
    .header-wrapper{
        /* margin-bottom:20px; */
        display:flex;
        .detailInfor{
            flex:1;
            li{
                margin-bottom:20px;
                .descrabname{
                    font-weight: bold;
                }
            }
        }
    }
  }
</style>
