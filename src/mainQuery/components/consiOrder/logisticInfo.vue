<template>
    <div>
        <div class="logisit-main-order" ref="logisitMainOrderH">
            <div class="logisitMainFiexd" ref="logisitMainFiexdH">
                <div class="headbars">
                    <div class="common-row">
                        <label>当前位置：</label>
                        <div class="common-col">
                                <el-breadcrumb separator="/">
                                <el-breadcrumb-item  @click.native="goBack(-2)">首页</el-breadcrumb-item>
                                <el-breadcrumb-item  @click.native="goBack(-1)">订单汇总</el-breadcrumb-item>
                                <el-breadcrumb-item>物流详情</el-breadcrumb-item>
                                </el-breadcrumb>
                        </div>
                    </div>
                </div>
                <div class="main-logistics">
                    <div class="common-condition-box">
                        <common-row>
                            <common-col >
                                <span class="label">客户编号：</span>
                                <span class="content">{{logistiCustomer.Ssa_No}}</span>
                            </common-col>
                             <common-col>
                                <span class="label">委托单号：</span>
                                <span class="content">{{logistiCustomer.ConOrder_No}}</span>
                            </common-col>
                            <common-col>
                                <span class="label">启运时间：</span>
                                <span class="content">{{logistiCustomer.Departure_Time}}</span>
                            </common-col>
                             <common-col>
                                <span class="label">单据类型 ：</span>
                                <span class="content">{{logistiCustomer.TransportPlan_Type_Name}}</span>
                            </common-col>
                            <common-col>
                                <span class="label">总件数：</span>
                                <span class="content">{{logistiCustomer.Actual_Pcs_Num}}</span>
                            </common-col>
                             <common-col :lot="2">
                                <span class="label">客户名称：</span>
                                <span class="content">{{logistiCustomer.Ssa_Name}}</span>
                            </common-col>
                        </common-row>
                         <common-row>
                            <common-col :lot="2">
                                <span class="label">客户地址：</span>
                                <span class="content">{{logistiCustomer.Address_Shortname}}</span>
                            </common-col>
                        </common-row>
                    </div>
                </div> 
            </div>
            <div class="table-box" >
                <el-table :data="tableData">
                    <el-table-column prop="Serial_number" label="序号" width="72" type="index"></el-table-column>
                    <el-table-column prop="Operate_Time" label="更新时间"></el-table-column>
                    <el-table-column prop="Operate_State_Name" label="单据状态"  ></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import Api from '@/common/js/api'
import commonRow from '@/common/components/common-row/index.js'
import commonCol from '@/common/components/common-col'
    export default {
        // 物流详情
        name: 'orderDetail',
        props: [],
        components: {commonRow, commonCol},
        data () {
            return {
                tableData: [],
                isHeight: true,
                logistiCustomer: {
                    Con_Id: '',
                    Con_Name: '',
                    ConOrder_No: '',
                    Bill_Dtl_Id: '',
                    Address_Shortname: '',
                    Departure_Time: '',
                    Transport_Mode_Name: '',
                    TransportPlan_Type_Name: '',
                    Actual_Pcs_Num: '',
                    Ssa_Name: '',
                    Ssa_No: ''
                },
                page: {
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    startIndex: 0,
                    total: 0, // 总条数
                    isShow: false // 是否显示分页组件
                }
            }
        },
        computed: {},
        methods: {
            onPage (num) {
                this.page.currentPage = num
                this.page.StartIndex = (this.page.currentPage - 1) * this.page.PageSize
                this.getTableData()
            },
            goBack (num) {
                this.$router.go(num)
                this.isHeight = false
            },
            init () {
                console.log(2)
                let params = JSON.parse(this.$route.params.row)
                console.log(params)
                this.logistiCustomer.Con_Id = params.Con_Id
                this.logistiCustomer.Con_Name = params.Con_Name
                this.logistiCustomer.Bill_Dtl_Id = params.Bill_Dtl_Id //运输明细id
                this.logistiCustomer.ConOrder_No = params.ConOrder_No //业务单据号
                this.logistiCustomer.Address_Shortname = params.Address_Shortname //客户地址
                this.logistiCustomer.Departure_Time = params.Departure_Time //启运时间
                this.logistiCustomer.Ssa_Name = params.Ssa_Name // 客户名称
                this.logistiCustomer.Ssa_No = params.Ssa_No //客户编号
                this.logistiCustomer.Transport_Mode_Name = params.Transport_Mode_Name  // 运输方式
                this.logistiCustomer.TransportPlan_Type_Name = params.TransportPlan_Type_Name //单裤类型
                this.logistiCustomer.Actual_Pcs_Num = params.Actual_Pcs_Num  // 总件数
                this.getTableData()
            },
            getTableData () {
              let param = {}
              param.Bill_Dtl_Id = this.logistiCustomer.Bill_Dtl_Id
              console.log(param.Bill_Dtl_Id)
              Api.get('TmpCSNGetBillTransportADtlWL', param).then((res) => {
                if (res.Flag) {
                        this.tableData = res.MsgInfo
                    }
                if (res.MsgInfo.length > 0) {
                        this.page.isShow = true
                    }
                })
            },
            getMainHeight () {
                if (this.isHeight) {
                    let mainH = this.$refs.logisitMainFiexdH.offsetHeight
                    this.$refs.logisitMainOrderH.style.paddingTop = mainH + 'px'
                }
            }
        },
        activated () {
            this.init()
        },
        created () {
        },
        mounted () {
            window.addEventListener('resize', this.getMainHeight)
            this.getMainHeight()
        }
    }
</script>
<style lang="less">
    .logisit-main-order {
        padding:20px;
        .logisitMainFiexd {
            position: fixed;
            background-color: #fff;
            box-sizing: border-box;
            z-index:99;
            top:0px;
            left:0px;
            width:100%;
            padding-left:20px;
            padding-right:20px;             
            .headbars {
                margin-bottom: 10px;
                padding-top: 20px;
                label {
                line-height: 23px;
                }
            }
            .main-logistics {
                .common-condition-box {
                    padding:22px 15px;
                    .label {
                        width:100px;
                    }
                    span {
                        line-height: 24px;
                    }
                }
            } 
        }
       
         .table-box{
            .el-table {
                font-size: 12px;
                .cell {
                    padding-right: 6px;
                }
            }
        }
    }
</style>