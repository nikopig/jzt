<template>
    <div>
       <div class="consi-order-Detail" ref="consiOrderDetailH">
            <div class="consi-order-Detail-main-fiexd" ref="DetailMainFiexdH">
                <div class="headbars">
                <div class="common-row">
                    <label>当前位置：</label>
                    <div class="common-col">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item  @click.native="goBack(-2)">首页</el-breadcrumb-item>
                            <el-breadcrumb-item  @click.native="goBack(-1)">订单汇总</el-breadcrumb-item>
                            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                </div>
                </div>
                <div class="ssa-main">
                    <div class="common-condition-box">
                            <common-row>
                                <common-col >
                                    <span class="label">业务单据编号：</span>
                                    <span class="content">{{Customer.ConOrder_No}}</span>
                                </common-col>
                                 <common-col>
                                    <span class="label">下单日期：</span>
                                    <span class="content">{{Customer.Invoice_Time}}</span>
                                </common-col>
                                <common-col>
                                    <span class="label">订单状态：</span>
                                    <span class="content">{{Customer.Bill_TransportA_Dtl_State_Name}}</span>
                                </common-col>
                                 <common-col>
                                    <span class="label">单据类型 ：</span>
                                    <span class="content">{{Customer.TransportPlan_Type_Name}}</span>
                                </common-col>
                                <common-col>
                                    <span class="label">总件数：</span>
                                    <span class="content">{{Customer.Actual_Pcs_Num}}</span>
                                </common-col>
                                 <common-col>
                                    <span class="label">总金额 ：</span>
                                    <span class="content">{{Customer.Settleup_Amount}}元</span>
                                </common-col>
                                <common-col :lot="2">
                                    <span class="label">客户名称：</span>
                                    <span class="content">{{Customer.Ssa_Name}}</span>
                                </common-col>
                            </common-row>
                            <common-row>
                                <common-col :lot="2">
                                    <span class="label">客户地址：</span>
                                    <span class="content">{{Customer.Address_Shortname}}</span>
                                </common-col>
                            </common-row>
                    </div>
                </div>
            </div>
            <div class="table-box">
                <el-table :data="tableData">
                    <el-table-column prop="setIndex" label="序号" width="55"></el-table-column>
                    <el-table-column prop="Goods_No" label="商品编号" show-overflow-tooltip ></el-table-column>
                    <el-table-column prop="Goods_Name" label="商品名称" show-overflow-tooltip width="180"></el-table-column>
                    <el-table-column prop="Planned_Pcs" label="计划件数"></el-table-column>
                    <el-table-column prop="Actual_Pcs" label="实际件数"></el-table-column>
                    <el-table-column prop="Planned_Volume" label="体积cm³"></el-table-column>、
                    <el-table-column prop="Planned_Weight" label="重量kg"></el-table-column>
                    <el-table-column prop="Refrigeration_Type_Name" label="温层" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Lot_No" label="批号"></el-table-column>
                    <el-table-column prop="Production_Date" label="生产日期" width="150" show-overflow-tooltip ></el-table-column>
                    <el-table-column prop="Valid_Until" label="有效日期" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Remarks" label="备注" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="blockPage">
                <el-pagination
                v-show="page.isShow"
                layout="total, prev, pager, next, jumper"
                :page-size="page.pageSize"
                :total="page.total"
                @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    export default {
        // 订单详情
        name: 'orderDetail',
        props: [],
        components: {commonRow, commonCol},
        data () {
            return {
                    tableData: [],
                    listData: [],
                    isHeight: true,
                    Customer: {
                        Company_Id: '',
                        Con_Id: '',
                        Con_Name: '',
                        Address_Shortname: '',
                        Business_numbers: '',
                        Company_Name: '',
                        billNumbers: '',
                        ConOrder_No: '',
                        Invoice_Time: '',
                        TransportPlan_Type_Name: '',
                        Actual_Pcs_Num: '0',
                        Bill_TransportA_Dtl_State_Name: '0',
                        Settleup_Amount: '0'
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
        methods: {
            handleCurrentChange (num) {
                this.page.currentPage = num
                this.page.startIndex = (this.page.currentPage - 1) * this.page.pageSize
                console.log(this.page.StartIndex)
                console.log(this.page.pageSize)
                this.getTableData()
            },
            goBack (num) {
                this.$router.go(num)
                this.isHeight = false
            },
            init () {
                let params = JSON.parse(this.$route.params.row)
                this.Customer.Con_Id = params.Con_Id
                this.Customer.Ssa_Name = params.Ssa_Name
                this.Customer.Address_Shortname = params.Address_Shortname
                this.Customer.ConOrder_No = params.ConOrder_No
                this.Customer.Invoice_Time = params.Invoice_Time
                this.Customer.TransportPlan_Type_Name = params.TransportPlan_Type_Name
                this.Customer.Actual_Pcs_Num = params.Actual_Pcs_Num
                this.Customer.Bill_TransportA_Dtl_State_Name = params.Bill_TransportA_Dtl_State_Name
                this.Customer.Settleup_Amount = params.Settleup_Amount
                this.getTableData()
            },
            getTableData () {
                this.page.isShow = false
                let param = {}
                param.ConOrder_No = this.Customer.ConOrder_No
                param.startIndex = this.page.startIndex
                param.pageSize = this.page.pageSize
                Api.get('TmpCSNGetBillTransportADtlMX', param).then((res) => {
                    if (res.Flag) {
                        this.listData = res.MsgInfo
                        this.getIndex()
                    }
                    if (res.MsgInfo.length > 0) {
                        this.page.total = this.tableData[0].bigTotalItems
                        this.page.isShow = true
                    }
                })
            },
            getIndex () {
               for (let i = 0; i < this.listData.length; i++) {
                   this.listData[i].setIndex = i + 1 + this.page.startIndex
               }
               this.tableData = this.listData
            },
            getMainHeight () {
              if (this.isHeight) {
                    let mainH = this.$refs.DetailMainFiexdH.offsetHeight
                    this.$refs.consiOrderDetailH.style.paddingTop = mainH + 'px'
                }
            }
        },
        activated () {
          this.init()
        },
        created () {
        },
        mounted () {
            this.getMainHeight()
            window.addEventListener('resize', this.getMainHeight)
        }
    }
</script>
<style lang="less">
    .consi-order-Detail {
        padding:20px;
        padding-bottom:48px;
        .consi-order-Detail-main-fiexd {
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
            .ssa-main {
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
        .blockPage {
            position: fixed;
            bottom: 0px;
            left: 50%;
            box-sizing: border-box;
            transform: translate(-50%,0);
            background-color: #fff;
            width:100%;
            height: 48px;
            .el-pagination {
                 margin:10px;
            }
        }
    }
</style>

