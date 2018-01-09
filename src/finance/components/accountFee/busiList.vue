<template>
    <div class="receiptList">
        <div class="headbar">
            <div class="common-row">
                <label>当前位置：</label>
                <div class="common-col">
                    <el-breadcrumb separator="/">
                       <el-breadcrumb-item @click.native="goBack(-1)">仓储费用管理汇总</el-breadcrumb-item>
                       <el-breadcrumb-item>回单明细</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
        </div>
        <!-- <el-tabs v-model="activeName">
            <el-tab-pane label="业务数据" name="first">
                <div class="table-box">
                  <el-table :data="transactionData" style="width: 100%">
                    <el-table-column prop="kctotal" label="库存总件数"></el-table-column>
                    <el-table-column prop="rknumber" label="入库件数"></el-table-column>
                    <el-table-column prop="rktps" label="入库托盘数"></el-table-column>
                    <el-table-column prop="rkitem" label="入库条目数"></el-table-column>
                    <el-table-column prop="outnumber" label="出库件数"></el-table-column>
                    <el-table-column prop="outtps" label="出库托盘数"></el-table-column>
                    <el-table-column prop="outitem" label="出库条目数"></el-table-column>
                    <el-table-column prop="Scans" label="扫码数(总)"></el-table-column>
                    <el-table-column prop="Scanz" label="扫码数(整)"></el-table-column>
                    <el-table-column prop="Scanl" label="扫码数(零)"></el-table-column>
                    <el-table-column fixed="right" label="每日详细业务数据" width="140">
                        <template slot-scope="scope">
                          <el-button 
                            @click.native.prevent="toTransactionList(scope.row.ywid)"
                            type="text"
                            size="small">
                            查看明细
                          </el-button>
                        </template>
                    </el-table-column>
                  </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane :disabled="true"></el-tab-pane>
            <el-tab-pane label="库存数据" name="second">
                <div class="table-box">
                  <el-table :data="stockData" style="width: 100%">
                    <el-table-column prop="kfwc" label="库房温度"></el-table-column>
                    <el-table-column prop="kfnumber" label="库房件数"></el-table-column>
                    <el-table-column prop="zyhwz" label="占用货位(整)"></el-table-column>
                    <el-table-column prop="zyhwl" label="占用货位(零)"></el-table-column>
                    <el-table-column prop="lkhw" label="立库货位"></el-table-column>
                    <el-table-column fixed="right" label="每日库存详情" width="120">
                        <template slot-scope="scope">
                          <el-button 
                            @click.native.prevent="toStockList(scope.row.kcid)"
                            type="text"
                            size="small">
                            查看明细
                          </el-button>
                        </template>
                    </el-table-column>
                  </el-table>
                </div>
            </el-tab-pane>
        </el-tabs> -->
        <div class="table-box">
            <el-table :data="tableData" style="width: 100%" :show-summary="true">
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="Created_Time" label="日期" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Bill_Type" label="业务类型" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Refrigeration_Type" label="温层" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Businessbill_No" label="业务单号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Ldc_Name" width="180" label="物流中心名称" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Data_Num" label="数量" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Data_Unit" label="单位" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="Data_Type" width="180" label="描述" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
        </div>
        <el-pagination
            @current-change="pageChange"
            :current-page.sync="pages.currentPage"
            :page-size="pages.pageSize"
            layout="total, prev, pager, next"
            :total="pages.totalItems">
        </el-pagination>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt } from '@/common/js/utils'
    export default {
        name: 'busiList',
        props: [],
        components: {},
        data () {
            return {
                //activeName: 'first',  //tab页的名字
                Rec_Id: '',
                Operator_Id: '', // 运营方id
                SettleUp_Company_Id: '', // 结算单位id
                Service_Type: '',  // 费用类型
                Service_Item: '',
                Begin_Date: '', // 开始时间
                End_Date: '', // 结束时间
                pages: {
                  currentPage: 1,
                  pageSize: 10,
                  totalItems: 1
                },
                tableData: [  //业务数据
                ]
            }
        },
        computed: {},
        methods: {
            goBack (step) {     // 回退
                this.$router.go(step)
            },
            /*toTransactionList (id) { //业务数据查看详情跳转
                this.$router.push({
                    name: 'busiDetailList',
                    params: {seq_no: id, activeName: this.activeName}
                })
                console.log(this.activeName)
            },
            toStockList (id) {
                this.$router.push({
                    name: 'busiDetailList',
                    params: {seq_no: id, activeName: this.activeName}
                })
                console.log(this.activeName)
            },*/
             pageChange () {
                this.getItemData()
            },
            getItemData () {
                let params = {
                  Rec_Id: this.Rec_Id,
                  Operator_Id: this.Operator_Id,
                  SettleUp_Company_Id: this.SettleUp_Company_Id,
                  Service_Type: this.Service_Type,
                  Service_Item: this.Service_Item,
                  Begin_Date: this.Begin_Date,
                  End_Date: this.End_Date,
                  StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
                  PageSize: this.pages.pageSize
                }
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('Bal_JlpStoreFeeMx', params).then(res => {
                    this.loadingWait.close()
                  if (res.Flag) {
                    this.tableData = res.MsgInfo
                    this.pages.totalItems = res.MsgInfo[0] ? res.MsgInfo[0].Sum_Cnt : 0
                    console.log(this.tableData, '明细数据')
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            // 初始化
            init () {
                let params = this.$route.params
                this.Rec_Id = params.Rec_Id
                this.Operator_Id = params.Operator_Id
                this.SettleUp_Company_Id = params.SettleUp_Company_Id
                this.Service_Type = params.Service_Type
                this.Service_Item = params.Service_Item
                this.Begin_Date = params.Begin_Date
                this.End_Date = params.End_Date
                this.getItemData()
            }
        },
        watch: {
          /*'$route' (val) {
             this.activeName = val.params.activeName
          },*/
          /*activeName (val) {
            console.log(val, 'tab页')
          }*/
        },
        created () {
        },
        mounted () {
            //this.init()
        },
        activated () { //<keep-alive> 内切换时会被执行created内不行
          this.init()
        }
    }
</script>
<style lang="less" scoped>
    .receiptList{
        padding:40px 10px 10px;
        .headbar {
            margin-bottom:15px;
            position: fixed;
            left: 25px;
            right: 25px;
            z-index: 10;
            top: 10px;
            background-color: #fff;
            &:after{
                content: '';
                position: absolute;
                height: 15px;
                background-color: #fff;
                left: -1px;
                right: -1px;
                bottom: -15px;
            }
            &:before{
                content: '';
                position: absolute;
                height: 10px;
                background-color: #fff;
                left: -1px;
                right: -1px;
                top: -10px;
            }
        }
    }
</style>
