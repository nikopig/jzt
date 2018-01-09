<template>
    <div class="consifree_wrapper">
        <div class="headbar">
            <div class="common-row">
                <label>当前位置：</label>
                <div class="common-col">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/main/1' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>委托方应付账款查询</el-breadcrumb-item>
                </el-breadcrumb>
                </div>
            </div>
        </div>
        <!-- 按钮 -->
        <div class="toolbar" v-show="!showRoute">
            <div class="btn-box titleStyle">
                <span>总金额：</span>
                <span>{{TotalCustomer.Real_Amount_Total}}</span>
            </div>
            <div class="btn-box titleStyle">
                <span>总客户数：</span>
                <span>{{TotalCustomer.Ssa_Total}}</span>
            </div>
            <div class="btn-box titleStyle">
                <span>金额单位：</span>
                <span>元</span>
            </div>
            <div class="btn-box right-fixed">
              <el-switch v-model="showRoute" off-color="#20a0ff" on-color="#13ce66" off-text="月度账单" on-text="订单账页" :width="90"></el-switch>
            </div>
        </div>
        <div class="toolbar" v-show="showRoute">
            <div class="btn-box titleStyle">
                <span>总金额：</span>
                <span>{{orderTotal.Total_Amount}}</span>
            </div>
            <div class="btn-box titleStyle">
                <span>金额单位：</span>
                <span>元</span>
            </div>
            <div class="btn-box right-fixed">
              <el-switch v-model="showRoute" off-color="#20a0ff" on-color="#13ce66" off-text="月度账单" on-text="订单账页" :width="90"></el-switch>
            </div>
        </div>
        <!-- 查询条件 -->
        <div class="common-condition-box">
            <!-- 汇总账单查询 -->
            <el-form :inline="true" v-show="!showRoute" :model="filterCondition">
                <el-form-item label="对账单位">
                    <!-- <el-input class="noselect" v-model="filterCondition.Con_Name" @dblclick.native="showDialog('Consignor')" placeholder="双击选择"
                            :disabled="true"></el-input> -->

                    <el-input class="noselect" v-model="filterCondition.Con_Name" placeholder="双击选择"
                    @dblclick.native="showDialog('Consignor')"
                    icon="close"
                    :on-icon-click="deleteCon"
                    :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker v-model="filterCondition.Start_Invoice_Time" placeholder="选择开始日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker v-model="filterCondition.End_Invoice_Time" placeholder="选择结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="对账情况">
                    <el-select v-model="filterCondition.Payment_Operate_State" placeholder="请选择" clearable >
                            <el-option label="待审核" value="2" ></el-option>
                            <el-option label="已对账" value="3" ></el-option>
                            <el-option label="已开发票" value="K"></el-option>
                            <el-option label="已结算" value="J" ></el-option>
                            <el-option label="刚生成" value="1" ></el-option>
                    </el-select>
                    {{filterCondition.Payment_Operate_State}}
                </el-form-item>
                <el-form-item label="计划单号">
                    <el-input  v-model="filterCondition.Biz_Bill_No"></el-input>
                </el-form-item>
                <el-form-item label="单据编号">
                    <el-input  v-model="filterCondition.ConOrder_No"></el-input>
                </el-form-item>
                <el-form-item label="客户名称">
                    <el-input  v-model="filterCondition.Ssa_Name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="search" @click="searchData">查询</el-button>
                </el-form-item>
            </el-form>
            <!-- 订单账页查询 -->
            <el-form :inline="true" v-show="showRoute">
                <el-form-item label="对账单位">
                    <el-input class="noselect" v-model="searchCondition.MINGCHENG" placeholder="双击选择"
                    @dblclick.native="isVisible = true"
                    icon="close"
                    :on-icon-click="deleteBalance"
                    :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="费用类型">
                    <common-select field="Service_Type" v-model="searchCondition.Service_Type"></common-select>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker v-model="searchCondition.Begin_Date" placeholder="选择开始日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker v-model="searchCondition.End_Date" placeholder="选择结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="search" @click="searchOrderData">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 汇总账页数据 -->
        <div class="HZtable" v-show="!showRoute">
            <!-- 表格数据 -->
            <div class="HZtable_box" v-for="(o, index) in HZfieldData">
                <div class="hzdata">
                    <ul style="display:flex; line-height:30px;">
                        <li style="flex:1;flex-grow:1.5"><span>结算单位：{{o.Con_Name}}</span></li>
                        <li style="flex:1"><span>计划单号：{{o.Biz_Bill_No}}</span></li>
                        <li style="flex:1"><span>生成时间：{{o.Invoice_Time}}</span></li>
                        <li style="flex:1"><span>总金额：{{o.Real_Amount}}</span></li>
                        <li style="flex:1"><el-button type="text"  @click.native="DetailedFee(o, 'detailFee')" style=" color:#20A0FF;">查看详细费用</el-button></li>
                        <li style="flex:1"><el-button type="text"  @click.native="Derivation" style=" color:#20A0FF;">导出明细</el-button></li>
                    </ul>
                    <el-button type="text" :icon="o.iconName" class="icon"  @click.native="showDetail(o,index)"></el-button>
                </div>
                <div class="detail" v-if="o.detailChildren && o.detailChildren.length>0"  v-show="o.detailShow">
                    <el-table :data="o.detailChildren" style="width: 100%">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column prop="ConOrder_no" label="业务单据编号" width="150" show-overflow-tooltip></el-table-column> 
                        <el-table-column prop="TransportPlan_Type_Name" label="运输任务类型" width="150"show-overflow-tooltip></el-table-column> 
                        <!-- <el-table-column prop="Invoice_Time" label="开票时间" width="200" show-overflow-tooltip></el-table-column> --> 
                        <el-table-column prop="Temper_Request_Name" label="温层要求" show-overflow-tooltip></el-table-column> 
                        <el-table-column prop="Vehicle_Size" label="车辆大小" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Invoice_Staff_Name" label="开票员" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Actual_Pcs" label="件数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Planned_Volume" label="体积m³" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Planned_Weight" label="重量kg" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Transport_Mode_Name" label="运输方式" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Ssa_Name" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column fixed="right" label="详情" width="60">
                            <template slot-scope="scope">
                                <el-button class="primary" @click.native.prevent="showInformation(scope.row, 'detailInformation')"
                                type="text" size="small">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 订单账页数据 -->
        <div class="Ordertable" v-show="showRoute">
            <!-- 表格数据 -->
            <div class="table_box">
                <el-table :data="balanceData" ref="origData" >
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="Operator_Name" label="运营方" :show-overflow-tooltip="true" width="300px"></el-table-column>
                    <el-table-column prop="Mon" label="月份"></el-table-column>
                    <el-table-column prop="Con_Name" label="对账单位" :show-overflow-tooltip="true" width="300px"></el-table-column>
                    <el-table-column prop="Service_Type_Desc" label="费用类型"></el-table-column>
                    <el-table-column prop="Total_Amount" label="应收金额"></el-table-column>
                    <el-table-column prop="Remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="操作" fixed="right" width="80">
                      <template slot-scope="scope">
                        <el-button
                          class="primary"
                          type="text"
                          size="small"
                          @click="goItem(scope.$index, scope.row)">查看明细
                        </el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination
              v-show="pages.isShow"
              layout="total, prev, pager, next, jumper"
              :page-size="pages.pageSize"
              :total="pages.total"
              :current-page="pages.currentPage"
              @current-change="onPage"
            >
            </el-pagination>
        </div>
        <!-- 委托方弹框组件 -->
        <consignor-modal :visible.sync="dialogShow.Consignor" @change="selectCons" @loaded="loadedCons"></consignor-modal>
        <!-- 详细费用弹框组件 -->
        <detail-pane ref="detailFee" DialogTitle="费用详情" :rowData="feehzRowData"></detail-pane>
        <!-- 汇总明细详情弹框组件 -->
        <detail-model ref="detailInformation" :rowData="HzRowData"></detail-model>
        <!-- 订单账页对账单位弹窗组件 -->
        <!-- <balance-modal :visible.sync="isVisible"  @change="selectCon"></balance-modal> -->
        <consignor-modal :visible.sync="isVisible" @change="selectCon" @loaded="orderLoadedCons"></consignor-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Api from '@/common/js/api.js'
    import { DateFtt } from '@/common/js/utils'
    import consignorModal from '@/common/service/modal/consi-modal'
    import detailPane from './DetailFeeDialog'
    import detailModel from './detailDialog'
    import commonSelect from '@/common/service/select/select-service-type'
    import balanceModal from '@/common/service/modal/balance-modal'
    export default {
        name: 'consiFee',
        props: [],
        components: {consignorModal, detailPane, detailModel, commonSelect, balanceModal},
        data () {
            return {
                showRoute: false, // 是否切换到汇总账单tab
                filterCondition: {  //汇总账页查询条件初始化
                    Con_Id: '',
                    Con_Name: '',
                    Start_Invoice_Time: new Date(),
                    End_Invoice_Time: new Date(),
                    Payment_Operate_State: '',
                    Biz_Bill_No: '',
                    ConOrder_No: '',
                    Ssa_Name: ''
                },
                searchCondition: {  //订单账页查询条件初始化
                    SettleUp_Company_Id: '',
                    MINGCHENG: '',
                    Service_Type: '',
                    Begin_Date: new Date(),
                    End_Date: new Date()
                },
                pages: {
                  currentPage: 1, // 当前页
                  pageSize: 10, // 每页条数
                  total: 0, // 总条数
                  isShow: false // 是否显示分页组件
                },
                TotalCustomer: {}, //请求到汇总页总金额，总客户数
                orderTotal: {},  //请求到订单也总金额
                HZfieldData: [],  //汇总数据
                HzRowData: {},  //保存点击那一行的汇总数据
                feehzRowData: {}, //保存点击那一行的汇总数据
                balanceData: [], //订单账页汇总数据
                dialogShow: { //委托方打开弹框
                    Consignor: false
                },
                isVisible: false // 对账单位弹框是否显示
            }
        },
        computed: {},
        methods: {
            onPage () {  //点击分页
                this.getOrderData()
              },
            searchData () {  //汇总账页查询
                this.getTotal() //调用一遍请求总金额，总客户数，因为委托方变了总金额，总客户数也要变
                this.getHZData() //调用汇总数据
            },
            searchOrderData () { //订单账页查询
                this.getOrderData() //调用订单页数据
                this.getOrderTotal() // 调用订单页总金额
            },
            showDialog (val) {  //双击带出委托方
                this.dialogShow[val] = true
            },
            loadedCons (row) {  //初始化委托方
                console.log(row, '初始的委托方')
                this.filterCondition.Con_Id = row.Con_Id
                this.filterCondition.Con_Name = row.Con_Name
            },
            selectCons (row) { //双击委托方中的数据带出委托方
                this.filterCondition.Con_Id = row.Con_Id
                this.filterCondition.Con_Name = row.Con_Name
            },
            deleteCon () {  //点击委托方X,清空
                this.filterCondition.Con_Name = ''
                this.filterCondition.Con_Id = '%'
            },
            orderLoadedCons (row) {  //初始化委托方
                console.log(row, '初始的委托方')
                this.searchCondition.MINGCHENG = row.Con_Name
                this.searchCondition.SettleUp_Company_Id = row.Con_Id
            },
            //对账单位弹出框选择
            selectCon (row) {
                console.log(row, '对账单位选中一行带出的数据')
                this.searchCondition.MINGCHENG = row.Con_Name
                this.searchCondition.SettleUp_Company_Id = row.Con_Id
            },
            deleteBalance () {  //点击对账单位X,清空
                this.searchCondition.MINGCHENG = ''
                this.searchCondition.SettleUp_Company_Id = '%'
            },
            DetailedFee (val, ref) { // 查看详细费用
                this.feehzRowData = val //把点击汇总的那行数据赋值给feehzRowData然后传到详细费用弹框组件中
                this.$refs[ref].visible = true
                /*this.getFeeDetail(val)*/
            },
            Derivation () {  //导出明细
                alert('123')
            },
            showDetail (val, index) { //点击显示明细
                console.log(val)
                this.getDetailData(val)  //调用汇总明细数据
                /*console.log(val.detailShow, 'ahhhahahahahahahahhaha')
                if (val.detailShow) {
                    this.HZfieldData[index].iconName = 'mo-up2'
                } else {
                    this.HZfieldData[index].iconName = 'mo-down2'
                }*/
            },
            showInformation (val, ref) {  //点击明细显示详情
                this.HzRowData = val
                this.$refs[ref].visible = true
            },
            getHZData () {  //请求汇总数据
                let params = {
                    Con_Id: this.filterCondition.Con_Id ? this.filterCondition.Con_Id : '%',
                    Start_Invoice_Time: DateFtt('yyyy-MM-dd', this.filterCondition.Start_Invoice_Time),
                    End_Invoice_Time: DateFtt('yyyy-MM-dd', this.filterCondition.End_Invoice_Time),
                    Payment_Operate_State: this.filterCondition.Payment_Operate_State ? this.filterCondition.Payment_Operate_State : '%',
                    Biz_Bill_No: this.filterCondition.Biz_Bill_No ? this.filterCondition.Biz_Bill_No : '%',
                    ConOrder_No: this.filterCondition.ConOrder_No ? this.filterCondition.ConOrder_No : '%',
                    Ssa_Name: this.filterCondition.Ssa_Name ? this.filterCondition.Ssa_Name : '%'
                }
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('TmpWTFGetBillTransportAHdrHZ', params).then(res => {
                    this.loadingWait.close()
                  if (res.Flag) {
                    this.HZfieldData = res.MsgInfo.map(item => {  //通过map方法在请求到页面初始的时候给对象添加字段且赋值
                        item.iconName = 'mo-down2'
                        item.detailShow = false
                        item.detailChildren = []
                        return item
                    })
                    /*this.HZfieldData.forEach((item, $index) => {  //通过Vue.set给对象添加字段且赋值
                        Vue.set(item, 'iconName', 'mo-down2')
                        Vue.set(item, 'detailShow', false)
                        Vue.set(item, 'detailChildren', [])
                    })*/
                    console.log(this.HZfieldData, '汇总数据')
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            getTotal () { //请求汇总页总金额，总客户数
                let params = {
                    Con_Id: this.filterCondition.Con_Id ? this.filterCondition.Con_Id : '%'
                }
                Api.get('TmpWTFGetBillTransportAHdrTB', params).then(res => {
                  if (res.Flag) {
                    this.TotalCustomer = res.MsgInfo[0]
                    console.log(this.TotalCustomer, '总金额总客户数')
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            getOrderTotal () {
                let params = {
                    SettleUp_Company_Id: this.searchCondition.SettleUp_Company_Id ? this.searchCondition.SettleUp_Company_Id : '%'
                }
                Api.get('JlpWTFGetBalanceTB', params).then(res => {
                  if (res.Flag) {
                    this.orderTotal = res.MsgInfo[0]
                    if (this.orderTotal.Total_Amount === null) {
                        this.orderTotal.Total_Amount = 0
                    }
                    console.log(this.orderTotal, '订单页总金额')
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            getDetailData (val) {  //请求汇总明细
                console.log(val)
                let params = {
                    Biz_Bill_No: val.Biz_Bill_No,
                    ConOrder_no: this.filterCondition.ConOrder_No ? this.filterCondition.ConOrder_No : '%',
                    Ssa_Name: this.filterCondition.Ssa_Name ? this.filterCondition.Ssa_Name : '%'
                }
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('TmpWTFGetBillTransportAHdrOneMX', params).then(res => {
                    this.loadingWait.close()
                  if (res.Flag) {
                    if (res.MsgInfo.length === 0) {
                        this.$alert('没有详情！', '友情提示', {
                            confirmButtonText: '确定'
                        })
                    } else {
                        val.detailChildren = res.MsgInfo
                        if (val.detailChildren && val.detailChildren !== 0) {
                            val.detailShow = !val.detailShow
                            if (val.detailShow) {
                                val.iconName = 'mo-up2'
                            } else {
                                val.iconName = 'mo-down2'
                            }
                            console.log(val.detailShow, 'hhhhhhhhhhhhhhhhhhh')
                        }
                        console.log(val.detailChildren, '汇总明细数据')
                    }
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            getOrderData () {  //请求订单账页汇总数据
                let params = {
                  SettleUp_Company_Id: this.searchCondition.SettleUp_Company_Id ? this.searchCondition.SettleUp_Company_Id : '%',
                  Service_Type: this.searchCondition.Service_Type ? this.searchCondition.Service_Type : '%',
                  Begin_Date: DateFtt('yyyy-MM-dd', this.searchCondition.Begin_Date),
                  End_Date: DateFtt('yyyy-MM-dd', this.searchCondition.End_Date, true),
                  StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
                  PageSize: this.pages.pageSize
                }
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('JlpWTFGetBalanceHz', params)
                  .then((res) => {
                    this.loadingWait.close()
                    this.balanceData = res.MsgInfo
                    if (!res.Flag) {
                      this.messageInfo(this.ErrInfo)
                      return false
                    }
                    if (res.MsgInfo.length > 0) {
                      this.pages.total = res.MsgInfo[0].Sum_Cnt
                    }
                    // 如果总条数不止一页，显示分页组件
                    if (this.pages.total > this.pages.pageSize) {
                      this.pages.isShow = true
                    }
                })
            },
            goItem ($index, row) {
                this.$router.push({
                  name: 'feeOrderList',
                  params: {
                    Operator_Id: row.Operator_Id,
                    SettleUp_Company_Id: row.SettleUp_Company_Id,
                    Con_Name: row.Con_Name,
                    Service_Type: row.Service_Type,
                    Mon: row.Mon,
                    Begin_Date: DateFtt('yyyy-MM-dd', this.searchCondition.Begin_Date),
                    End_Date: DateFtt('yyyy-MM-dd', this.searchCondition.End_Date, true),
                    Payment_Type: this.$route.params.diecType
                  }
                })
            },
            init () {
                this.getHZData() //调用汇总数据
                this.getTotal()  //调用汇总页总金额，总客户数
                this.getOrderData() //调用订单账页汇总数据
                this.getOrderTotal() // 调用订单页总金额
            }
        },
        created () {
        },
        mounted () {
            this.init()
        }
    }
</script>
<style lang="less" scoped>
    .consifree_wrapper {
        .toolbar{
            margin-bottom:15px;
        }
        .titleStyle{
            display:inline-block;
            line-height:30px;
            span {
                color:#FF6631;
            }
        }
        .right-fixed {
          position: absolute;
          top: 1px;
          right: 15px;
        }
        .HZtable_box{
            margin-bottom:15px;
            .hzdata{
                position: relative;
                border:1px solid #d1dbe5;
                padding:15px;
               /*  display: flex; */
               .icon{
                    font-size: 32px;
                    position: absolute;
                    right: 10px;
                    bottom: 0;
                    color: #cfcfcf;
                    transition: all 0.5s;
                    &:hover{
                        bottom: -5px;
                    }
                }
            }
            .detail{
                border: 1px solid #d1dbe5;
                border-top: none;
                padding: 10px;
            }
        }
    }
</style>