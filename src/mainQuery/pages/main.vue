<template>
    <div class="main_wrapper">
        <div class="headerSearch_wrapper">
            <el-form :inline="true" size="small">
                <el-form-item  label="委托方名称：" label-width="85px"><!-- v-if="pageType === '1'" -->
                    <!-- <el-input v-model="condition.Con_Name" placeholder="双击带出委托方" disabled></el-input> -->
                    <el-input  class="noselect"  v-model="condition.Con_Name" placeholder="双击选择"
                    @dblclick.native="showConDialog('Consignor')"
                    icon="close"
                    :on-icon-click="deleteCon"
                    :disabled="true"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item label="九州通对接人：" label-width="85px">
                    <el-input v-model="condition.jztdjr" placeholder="例如:业务员张三"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" label-width="85px">
                    <el-input v-model="condition.tellepone"></el-input>
                </el-form-item> -->
                <el-form-item label="客服电话：" label-width="85px">
                    <el-input v-model="condition.tellepone" disabled></el-input>
                </el-form-item>
                <el-form-item label="起始时间：" label-width="85px">
                    <el-date-picker type="date" v-model="condition.startDate" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="终止时间：" label-width="85px">
                    <el-date-picker type="date" v-model="condition.endDate" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="search_Btn" @click="searchButtom"><i class='el-icon-mo-query'></i>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="headtitle">
            <div class="datahead" @click="goAmount">
                <p>总金额（元）</p>
                <p>{{TotalCustomer.Total_Amount}}</p>
                <div class="el-icon-mo-Sales-volume img f1"></div>
                <div class="progressbar3 breathborder"></div>
                <div class="refreshbar3"></div>
                <div class="grantMsg">
                    <div class="textOverflow"><span>已结算：</span><span>{{TotalCustomer.YJS_Total_Amount}}</span></div>
                    <div class="textOverflow"><span class="gN">未结算：</span><span>{{TotalCustomer.WJS_Total_Amount}}</span></div>
                </div>
            </div>
            <div class="datahead" @click="goOrder">
                <p>总订单数</p>
                <p style="color:#AED17D;">{{TotalOrder.DD_Num}}</p>
                <div class="el-icon-mo-Outbound-order img f2"></div>
                <div class="progressbar3 breathborder"></div>
                <div class="refreshbar3"></div>
                <div class="grantMsg">
                    <div class="textOverflow"><span>已完成：</span><span>{{TotalOrder.YWCDD_Num}}</span></div>
                    <div class="textOverflow"><span class="gN">未完成：</span><span>{{TotalOrder.WWCDD_Num}}</span></div>
                </div>
            </div>
            <div class="datahead" @click="goReceipt">
                <p>总回单数</p>
                <p style="color:#88ACE8;">{{TotalReceipt.HuiDan_Num}}</p>
                <div class="el-icon-mo-Number-of-entries img f3"></div>
                <div class="progressbar3 breathborder"></div>
                <div class="refreshbar3"></div>
                <div class="grantMsg">
                    <div class="textOverflow"><span>已回单：</span><span>{{TotalReceipt.Yi_HuiDan_Num}}</span></div>
                    <div class="textOverflow"><span class="gN">未回单：</span><span>{{TotalReceipt.Wei_HuiDan_Num}}</span></div>
                </div>
            </div>
            <div class="datahead">
              <a href="http://10.3.87.201:8890/HtmlPages/TMP/ExceptionAudit.html" target="_blank">
                <p>异常订单</p>
                <p style="color:#FD9D9B;">{{AbnormalOrder.YCDD_Num}}</p>
                <div class="el-icon-mo-warehouseNumber img f4"></div>
                <div class="progressbar3 breathborder"></div>
                <div class="refreshbar3"></div>
                <div class="grantMsg">
                    <div class="textOverflow"><span>已审核：</span><span></span>{{AbnormalOrder.YYCDD_Num}}</div>
                    <div class="textOverflow"><span class="gN">未审核：</span><span>{{AbnormalOrder.WYCDD_Num}}</span></div>
                </div>
              </a>
            </div>
            <div class="datahead_last">
                <div class="tempDownload"><a target="_blank" href="http://www.jzt56.com/orderSearch_National.html ">温度下载</a></div>
                <div class="tempDownload" @click="goTemperature">电子锁温度查看</div>
                <div><span class="el-icon-mo-addTemperature temp_img"></span></div>
            </div>
        </div>
        <div class="contentbody">
            <!-- 作业中订单 -->
            <div class="work_order">
                <div class="paneltitle">
                    <span v-if="condition.Business_Model === 3">作业中订单</span>
                    <span v-if="condition.Business_Model !== 3">库存情况</span>
                    <span class="ordertotal" v-if="condition.Business_Model === 3">订单总数：{{workOrderTotal}}</span>
                </div>
                <div class="ordertable">
                    <div style="height:470px;">
                        <!-- 当状态为3的时候显示日历 -->
                        <div v-show="condition.Business_Model === 3" style="overflow-x: auto;">
                            <date-picker :conId='condition.Con_Id' @grossData="pickerData"></date-picker>
                        </div>
                        <!-- 当状态不为3的时候显示地图 -->
                        <div class="map" v-show="condition.Business_Model !== 3" style="height:100%;">
                            <div class="map-left" style="height:100%;">
                                <div ref="chinaMap" class="china-map"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 账款情况 -->
            <div class="account_situation">
                <div class="paneltitle">
                    <span>账款情况</span>
                    <!-- <span class="ordertotal">订单总数：12312</span> -->
                </div>
                <div class="account_wrapper">
                    <div ref="histogram" class="histogram"></div>
                    <div class="accounttable">
                        <el-table :data="accountData" border class="countable">
                            <el-table-column prop="h" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :class="colorstyle[scope.row.n]" style="display:inline-block;width:10px;height:10px;background:scope.row.n;"></span>
                                    <span  style="margin-left: 3px">{{ scope.row.h }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="110" v-for='(item, $index) in TableHeader' :property="item.field" :label="item.title" :key='$index' style="white-space:nowrap;">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <!-- 回单情况 -->
            <div class="slips_situation">
                <div class="paneltitle">
                    <span>回单情况</span>
                    <span class="ordertotal">订单总数：{{receiptTotal}}</span>
                </div>
                <div class="slips_wrapper">
                    <div slot="header" class="header">
                      <el-select v-model="currentDate" @change="selectDate">
                            <el-option v-for="(item, index) in receiptSituation" :label="item.Mon" :value="index" :key="index"></el-option>
                            <!-- <el-option label="一月至二月" value="01,02" ></el-option>
                             <el-option label="二月至三月" value="02,03" ></el-option>
                            <el-option label="三月至四月" value="03,04" ></el-option>
                             <el-option label="四月至五月" value="04,05" ></el-option>
                            <el-option label="五月至六月" value="05,06"></el-option>
                             <el-option label="六月至七月" value="06,07" ></el-option>
                            <el-option label="七月至八月" value="07,08" ></el-option>
                             <el-option label="八月至九月" value="08,09" ></el-option>
                            <el-option label="九月至十月" value="09,10" ></el-option>
                            <el-option label="十月至十一月" value="10,11" ></el-option>
                            <el-option label="十一月至十二月" value="11,12" ></el-option> -->
                      </el-select>
                    </div>
                    <div ref="ordertop" class="ordertop"></div>
                    <!-- <div ref="orderbottom" class="orderbottom"></div> -->
                </div>
            </div>
        </div>
        <!-- 委托方弹框组件 -->
        <consignor-modal :visible.sync="dialogShow.Consignor" @change="selectCons" @loaded="loadedCons"></consignor-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Api from '@/common/js/api'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    import consignorModal from '@/common/service/modal/consi-modal'
    import datePicker from './datePicker'
    import { DateFtt } from '@/common/js/utils'
    import eCharts from 'echarts'
    import 'echarts/map/js/china'
    export default {
        name: 'main',
        props: {},
        components: {commonRow, commonCol, consignorModal, datePicker},
        data () {
            return {
                TableHeader: [],
                condition: {
                    Business_Model: '',
                    Con_Name: '',     // 委托方
                    Con_Id: '',
                    tellepone: '',
                    startDate: new Date(new Date().valueOf() - 365 * 24 * 3600 * 1000),   //开始日期
                    endDate: new Date()      //结束日期
                },
                TotalCustomer: {}, //请求到总金额
                TotalOrder: {},  //请求到总订单数
                TotalReceipt: {},  //请求到总回单数
                AbnormalOrder: {}, //请求到异常订单数
                geoCoordMap: [], // 描点数据
                lcdCountZpgs: [], // 物流中心总品规数
                lcdCountZjs: [], // 物流中心总件数
                conStocks: [],
                accountsReceivable: [],  //账款情况柱状图数据
                baryhk: [],  //已回款总数据
                barykpwhk: [], //已开票未回款总数据
                barydzwkp: [], //已对账未开票总数据
                barwdz: [],  //未对账总数据
                barMon: [],  //月份
                receiptSituation: [],  //回单情况饼状图数据
                startInvoiceTime: this.getDate(2), //上月日期
                endInvoiceTime: this.getDate(1),   //当月日期
                //startData: {},   //上月数据
                //endData: {},     //当月数据
                mon: {'01': '一月', '02': '二月', '03': '三月', '04': '四月', '05': '五月', '06': '六月', '07': '七月', '08': '八月', '09': '九月', '10': '十月', '11': '十一月', '12': '十二月'},
                currentDate: 0,
                /*workOrderData: [
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '0'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '1'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '2'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '3'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '4'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '5'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '6'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '7'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '8'
                    },
                    {
                        a: '2013-2-9',
                        b: '已完成3340',
                        c: '提货34',
                        d: '干线23',
                        e: '配送23',
                        f: '异常5',
                        g: '总订单数32394',
                        o: '9'
                    }
                ],*/
                accountData: this.accountInit(),  //账款情况表格组装数据
                workOrderTotal: 0,  //作业中订单的订单总数
                receiptTotal: 0,  //账款情况的订单总数
                dialogShow: { //委托方打开弹框
                    Consignor: false
                },
                chartData: {},
                pageType: ''  //判断是委托方还是承运方
            }
        },
        computed: {
            reciepChart () {
                return this.receiptSituation.length > 0 ? this.receiptSituation[this.currentDate] : {}
            }
        },
        methods: {
            searchButtom () { //查询按钮
                this.init()
            },
            getDate (falge) {
                 var Nowdate = new Date()
                 var vYear = Nowdate.getFullYear()
                 var vMon = Nowdate.getMonth() + 1
                 var vDay = '01'
                 if (falge === 2) {
                    if (vMon > 1 && vMon <= 12) {
                        vMon = vMon - 1
                    }
                 }
                 return vYear + '-' + vMon + '-' + vDay
            },
            goAmount () {  //点击总金额跳转到委托方应付账款查询页面
                switch (this.$route.params.type) {
                    case '1':
                        //this.$router.push('/consiFee')  //委托方应付账款查询
                        this.$router.push({
                            name: 'feeMainList',
                            params: {
                                Con_Id: this.condition.Con_Id,
                                Con_Name: this.condition.Con_Name,
                                StartTime: this.condition.startDate,
                                EndTime: this.condition.endDate
                            }
                        })
                        break
                    case '2':
                        //this.$router.push('/consiFee')  //委托方应付账款查询
                        break
                }
            },
            goReceipt () {
              switch (this.$route.params.type) {
                case '1':
                  let params = {
                    Con_Id: this.condition.Con_Id,
                    Con_Name: this.condition.Con_Name,
                    startDate: DateFtt('yyyy-MM-dd', this.condition.startDate),
                    endDate: DateFtt('yyyy-MM-dd', this.condition.endDate)
                  }
                  this.$router.push({
                    name: 'consiMainList',
                    params: params
                  })
                  // this.$router.push('/consiReceipt')  //委托方回单
                  break
                case '2':
                  this.$router.push('/carriReceipt')   //承运方回单
                  break
              }
            },
            goOrder () {
              switch (this.$route.params.type) {
                case '1':
                  let params = {
                    Con_Id: this.condition.Con_Id,
                    Con_Name: this.condition.Con_Name,
                    startDate: DateFtt('yyyy-MM-dd', this.condition.startDate),
                    endDate: DateFtt('yyyy-MM-dd', this.condition.endDate)
                  }
                  this.$router.push({
                    name: 'orderList',
                    params: params
                  })
                  // this.$router.push('/consiOrder')  //委托方订单
                  break
                case '2':
                  //this.$router.push('/carriReceipt')  //承运方回单
                  break
              }
            },
            goTemperature () {
              this.$router.push('/temperatureDownload')
            },
            loadedCons (val) {  //初始化委托方
                console.log(val, '初始的委托方')
                this.condition.Business_Model = val.Business_Model
                this.condition.Con_Id = val.Con_Id
                this.condition.Con_Name = val.Con_Name
                this.condition.tellepone = val.Customer_Service_No
                this.init()
            },
            showConDialog (val) {  //双击打开委托方弹框
                this.dialogShow[val] = true
            },
            selectCons (row) {
                console.log(row, '委托方双击带出来的一行数据')
                this.condition.Business_Model = row.Business_Model
                this.condition.Con_Id = row.Con_Id
                this.condition.Con_Name = row.Con_Name
                this.condition.tellepone = row.Customer_Service_No
                this.init()
            },
            deleteCon () {
                this.condition.Con_Id = '%'
                this.condition.Con_Name = ''
                this.condition.tellepone = ''
            },
            getTotalFee () {  //获取总金额
                this.getHeadTotal('TmpWTFGetRecFeeRecordTB', '1')
            },
            getOrderNum () {  //获取总订单数
                this.getHeadTotal('TmpWTFGetBillTransportADtlTB', '2')
            },
            getReceipt () {   //获取总回单数
                this.getHeadTotal('TmpWTFGetBillReceiptRecordHDTB', '3')
            },
            getAbnormalOrder () { //获取异常订单
                this.getHeadTotal('TmpWTFGetBillReceiptRecordYCTB', '4')
            },
            getHeadTotal (URL, total) {
                let params = {
                    Con_Id: this.condition.Con_Id ? this.condition.Con_Id : '%',
                    StartTime: DateFtt('yyyy-MM-dd', this.condition.startDate),
                    EndTime: DateFtt('yyyy-MM-dd', this.condition.endDate)
                }
                Api.get(URL, params).then(res => {
                  if (res.Flag) {
                    if (total === '1') {
                        this.TotalCustomer = res.MsgInfo[0]
                    }
                    if (total === '2') {
                        this.TotalOrder = res.MsgInfo[0]
                    }
                    if (total === '3') {
                        this.TotalReceipt = res.MsgInfo[0]
                    }
                    if (total === '4') {
                        this.AbnormalOrder = res.MsgInfo[0]
                    }
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            pickerData (data) {  //从时间插件传过来的数据
                console.log(data, '从时间插件传过来的数据')
                if (data.length > 0) {
                    data.forEach((item) => {
                        this.workOrderTotal = this.workOrderTotal + item.ZDD_Num
                    })
                }
            },
            /*作业订单中地图数据开始*/
            getSignPoint () {   //描点数据
                this.geoCoordMap = []
                let param = {
                    CON_ID: this.condition.Con_Id
                }
                if (this.condition.Con_Id !== '') {
                    Api.get('DS_KC_GetLdcAddrSignPointByConId', param, true).then((res) => {
                        if (res.Flag) {
                            let data = res.MsgInfo
                            data.forEach(item => {
                                if (item.Longitude !== null && item.Latitude !== null) {
                                    // 描点数据
                                    let obj = {}
                                    obj.name = item.Ldc_Name
                                    obj.Ldc_Id = item.Ldc_Id
                                    obj.value = []
                                    obj.value.push(item.Longitude)
                                    obj.value.push(item.Latitude)
                                    this.geoCoordMap.push(obj)
                                }
                            })
                            this.ChartPicture() // 地图
                        } else {
                            this.$alert(res.ErrInfo, '提示', {
                                confirmButtonText: '确定'
                            })
                        }
                    })
                } else {
                    this.ChartPicture()
                }
            },
            getConStock () {
                this.conStocks = []
                let param = {
                    CON_ID: this.condition.Con_Id
                }
                Api.get('DS_KC_GetConStocksByConId', param, true).then((res) => {
                    if (res.Flag) {
                        this.conStocks = res.MsgInfo
                        this.lcdCountZpgs = []
                        this.lcdCountZjs = []
                        this.conStocks.forEach(item => {
                            // 品规数
                            let pgsParam = {}
                            pgsParam.name = item.Ldc_Name
                            pgsParam.Ldc_Id = item.Ldc_Id
                            pgsParam.value = item.kcpgs
                            this.lcdCountZpgs.push(pgsParam)
                            // 总件数
                            let zjsParam = {}
                            zjsParam.name = item.Ldc_Name
                            zjsParam.Ldc_Id = item.Ldc_Id
                            zjsParam.value = item.kczjs
                            this.lcdCountZjs.push(zjsParam)
                        })
                        this.ChartPicture()
                    } else {
                        this.$alert(res.ErrInfo, '提示', {
                            confirmButtonText: '确定'
                        })
                    }
                })
            },
            /*作业订单中地图数据结束*/
            getAccountsReceivable () {  //获取账款情况柱状图数据
                let params = {
                    Con_Id: this.condition.Con_Id ? this.condition.Con_Id : '%',
                    StartTime: DateFtt('yyyy-MM-dd', this.condition.startDate),
                    EndTime: DateFtt('yyyy-MM-dd', this.condition.endDate)
                }
                console.log(params, '账款情况柱状图参数')
                this.TableHeader = []
                this.accountData = this.accountInit() //账款情况表格组装数据初始化
                Api.get('TmpWTFGetRecFeeRecordDZHZ', params).then(res => {
                  if (res.Flag) {
                    this.accountsReceivable = res.MsgInfo
                    this.baryhk = []
                    this.barykpwhk = []
                    this.barydzwkp = []
                    this.barwdz = []
                    this.barMon = []
                    this.accountsReceivable.forEach((item) => {
                        console.log(item.Mon, '月份')
                        //Vue.set(item, 'month', this.mon[item.Mon])
                        this.baryhk.push(item.YHK_Total_Amount)
                        this.barykpwhk.push(item.YKP_Total_Amount)
                        this.barydzwkp.push(item.YDZ_Total_Amount)
                        this.barwdz.push(item.WDZ_Total_Amount)
                        //this.barMon.push(item.month)
                        this.barMon.push(item.Mon)
                        let monthObj = {}
                        monthObj.title = item.Mon
                        monthObj.field = item.Mon
                        this.TableHeader.push(monthObj)
                        this.accountData[0][item.Mon] = item.YHK_Total_Amount
                        this.accountData[1][item.Mon] = item.YKP_Total_Amount
                        this.accountData[2][item.Mon] = item.YDZ_Total_Amount
                        this.accountData[3][item.Mon] = item.WDZ_Total_Amount
                    })
                    console.log(this.baryhk)
                    console.log(this.barykpwhk)
                    console.log(this.barydzwkp)
                    console.log(this.barwdz)
                    console.log(this.accountData, '账款情况柱状图拼凑数据')
                    console.log(this.accountsReceivable, '账款情况柱状图数据')
                    this.ChartPicture()
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            getReceiptSituation () {   //获取回单情况饼状图数据
                let params = {
                    Con_Id: this.condition.Con_Id ? this.condition.Con_Id : '%',
                    StartTime: DateFtt('yyyy-MM-dd', this.condition.startDate),
                    EndTime: DateFtt('yyyy-MM-dd', this.condition.endDate)
                }
                console.log(params, '获取回单情况饼状图参数')
                this.receiptTotal = 0
                Api.get('TmpWTFGetBillReceiptRecordHDHZ', params).then(res => {
                  if (res.Flag) {
                    this.receiptSituation = res.MsgInfo
                    this.receiptSituation.forEach((item) => {
                        Vue.set(item, 'monthTotal', item.Mon + '总订单数：' + item.HuiDan_Num)
                        this.receiptTotal = this.receiptTotal + item.HuiDan_Num
                    })
                    //this.startData = this.receiptSituation[0]
                   // this.endData = this.receiptSituation[1]
                    console.log(this.receiptSituation, '回单情况饼状图数据')
                    this.drawReciepte()
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            selectDate (val) {
                console.log(typeof val, '下拉框选中的日期数据')
                /*val = val.split(',')
                this.transDate(val)
                this.getReceiptSituation()
                this.ChartPicture()*/
                this.drawReciepte()
                //console.log(this.startInvoiceTime, this.endInvoiceTime, 'hxoaishdoadfsfcds')
            },
            transDate (data) {
                var nowDate = new Date()
                var Year = nowDate.getFullYear()
                var Day = '01'
                this.startInvoiceTime = Year + '-' + data[0] + '-' + Day
                this.endInvoiceTime = Year + '-' + data[1] + '-' + Day
            },
            accountInit () {  //账款情况表格组装数据初始化
                return [
                        {
                            h: '已回款',
                            n: 0
                        },
                        {
                            h: '已开票未回款',
                            n: 1
                        },
                        {
                            h: '已对账未开票',
                            n: 2
                        },
                        {
                            h: '未对账',
                            n: 3
                        }
                    ]
            },
            ChartPicture () {
                this.chartData.myChart = eCharts.init(this.$refs.histogram)  //柱状图
                //this.chartData.myChart2 = eCharts.init(this.$refs.orderbottom)  //饼状图
                this.chartData.mapChart = eCharts.init(this.$refs.chinaMap)   //地图
                //柱状图
                let option = {
                        title: {
                            left: 'center',
                            top: '6%',
                            text: '账款情况'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line'直线指示器 | 'shadow'阴影指示器
                            }
                        },
                        grid: {
                            left: '4%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {  //x轴
                            type: 'value',
                            /*min: 0,
                            max: 600,
                            interval: 100,*/
                            axisTick: {show: false},  //是否显示坐标轴刻度
                            splitLine: {  //坐标轴在 grid 区域中的分隔线
                                show: true,
                                lineStyle: {
                                    color: '#858585'
                                }
                            },
                            axisLine: { //坐标轴线相关的
                                lineStyle: {  //设置x轴线的颜色
                                    color: '#858585'
                                }
                            }
                        },
                        yAxis: {  //y轴
                            type: 'category',
                            axisTick: {show: false},  //是否显示坐标轴刻度
                            data: this.barMon,
                            axisLine: {  //坐标轴线相关的
                                lineStyle: {  //设置y轴线的颜色
                                    color: '#858585'
                                }
                            }
                        },
                        series: [
                            {
                                name: '已回款',
                                type: 'bar',
                                barMaxWidth: 30,
                                stack: '总量',
                                itemStyle: {
                                    normal: { color: '#AED17D' } //#63A0F1
                                },
                                data: this.baryhk
                            },
                            {
                                name: '已开票未回款',
                                type: 'bar',
                                barMaxWidth: 30,
                                stack: '总量',
                                itemStyle: {
                                    normal: { color: '#88ACE8' }  //#F59390
                                },
                                data: this.barykpwhk
                            },
                            {
                                name: '已对账未开票',
                                type: 'bar',
                                barMaxWidth: 30,
                                stack: '总量',
                                itemStyle: {
                                    normal: { color: '#89D4E7' }  //#96E093
                                },
                                data: this.barydzwkp
                            },
                            {
                                name: '未对账',
                                type: 'bar',
                                barMaxWidth: 30,
                                stack: '总量',
                                itemStyle: {
                                    normal: { color: '#FD9D9B' }  //#B176F6
                                },
                                data: this.barwdz
                            }
                        ]
                    }
                //饼状图
                /*let option2 = {
                        animation: false,
                        textStyle: {
                            color: '#666',
                            fontSize: '12'
                        },
                        title: {
                            text: (this.endData === undefined) ? '' : (this.endData.monthTotal),
                            left: 'center',
                            bottom: '10%',
                            textStyle: {
                                color: '#333',
                                fontSize: '12'
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        series: [
                            {
                                name: '回单情况',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [0, '30%'],

                                label: {
                                    normal: {
                                        position: 'inner',
                                        color: '#fff'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {
                                        value: (this.endData === undefined) ? '' : (this.endData.Wei_HuiDan_Num),
                                        name: '未上传',
                                        itemStyle: {normal: { color: '#2E4553' }}
                                    },
                                    {
                                        value: (this.endData === undefined) ? '' : (this.endData.Yi_HuiDan_Num),
                                        name: '已上传',
                                        itemStyle: {normal: { color: '#61A0A9' }}
                                    }
                                ]
                            },
                            {
                                name: '回单情况',
                                type: 'pie',
                                radius: ['40%', '55%'],
                                label: {
                                    normal: {
                                        show: true,
                                        color: '#111'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {
                                        value: (this.endData === undefined) ? '' : (this.endData.WQR_HuiDan_Num),
                                        name: '未确认',
                                        itemStyle: {normal: { color: '#EA967B' }}
                                    },
                                    {
                                        value: (this.endData === undefined) ? '' : (this.endData.YQR_HuiDan_Num),
                                        name: '已确认',
                                        itemStyle: {normal: { color: '#91C7AF' }}
                                    }
                                ]
                            }
                        ]
                    }*/
                let option3 = {
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        triggerOn: 'mousemove',
                        backgroundColor: 'rgba(120, 174, 255, 1)',
                        formatter: function (params) {
                          let res = params.name + '<br/>'
                          let myseries = option.series
                          for (let i = 1; i < myseries.length; i++) {
                            for (let j = 0; j < myseries[i].data.length; j++) {
                              if (myseries[i].data[j].Ldc_Id === params.data.Ldc_Id) {
                                res += myseries[i].name + ' : ' + myseries[i].data[j].value + '</br>'
                              }
                            }
                          }
                          return res
                        }
                      },
                    geo: {
                        show: true,
                        map: 'china',
                        selectedMode: 'single',
                        roam: true, // 是否开启鼠标缩放和平移漫游
                        zoom: 1.2, // 当前视角的缩放比例
                        itemStyle: {                    // 定义样式
                            normal: {                   // 普通状态下的样式
                                areaColor: '#e4efff',
                                borderColor: '#8fbcff'
                            },
                            emphasis: {                 // 高亮状态下的样式
                              areaColor: '#aeceff'
                            }
                        },
                        label: {
                            normal: {
                                show: false,
                                color: '#666'
                            },
                            emphasis: {
                                show: false,
                                color: '#333'
                            }
                        }
                    },
                    backgroundColor: '#fff',
                    series: [
                        {
                            name: '物流中心', // series名称
                            type: 'scatter', // series图表类型
                            coordinateSystem: 'geo', // series坐标系类型
                            itemStyle: {
                                normal: {
                                    color: '#ff8400'
                                }
                            },
                            data: this.geoCoordMap
                        },
                        {
                            name: '总件数', // series名称
                            type: 'scatter', // series图表类型
                            coordinateSystem: 'geo', // series坐标系类型
                            data: this.lcdCountZjs
                        },
                        {
                            name: '总品规数', // series名称
                            type: 'scatter', // series图表类型
                            coordinateSystem: 'geo', // series坐标系类型
                            data: this.lcdCountZpgs
                        }
                    ]
                }
                this.chartData.myChart.setOption(option)
                //this.chartData.myChart2.setOption(option2)
                this.chartData.mapChart.setOption(option3)
                this.chartData.mapChart.on('click', (param) => {
                    console.log(param, '地图点击跳转')
                    this.$router.push({
                        name: 'stockMainList'
                    })
                })
            },
            drawReciepte () { //绘制饼状图
                this.chartData.myChart1 = eCharts.init(this.$refs.ordertop)  //饼状图
                //饼状图
                let option1 = {
                        animation: false,
                        textStyle: {
                            color: '#666',
                            fontSize: '12'
                        },
                        title: {
                            text: this.reciepChart.monthTotal,
                            /*top: 'bottom',*/
                            left: 'center',
                            bottom: '20%',
                            textStyle: {
                                color: '#333',
                                fontSize: '12'
                            }
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                        },
                        series: [
                            {
                                name: '回单情况',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: [0, '30%'],

                                label: {
                                    normal: {
                                        position: 'inner',
                                        color: '#fff'
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {
                                        value: this.reciepChart.Wei_HuiDan_Num,
                                        name: '未上传',  /*(this.startData.Wei_HuiDan_Num === 0) ? '' : ('未上传')*/
                                        itemStyle: {normal: { color: '#AED17D' }}  //#2E4553
                                    },
                                    {
                                        value: this.reciepChart.Yi_HuiDan_Num,
                                        name: '已上传',
                                        itemStyle: {normal: { color: '#88ACE8' }}  //#61A0A9
                                    }
                                ]
                            },
                            {
                                name: '回单情况',
                                type: 'pie',
                                radius: ['40%', '55%'],
                                label: {
                                    normal: {
                                        show: true,
                                        color: '#111'
                                    }
                                },
                                 labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: [
                                    {
                                        value: this.reciepChart.WQR_HuiDan_Num,
                                        name: '未确认',
                                        itemStyle: {normal: { color: '#89D4E7' }}  //#EA967B
                                    },
                                    {
                                        value: this.reciepChart.YQR_HuiDan_Num,
                                        name: '已确认',
                                        itemStyle: {normal: { color: '#FD9D9B' }}  //#91C7AF
                                    }
                                ]
                            }
                        ]
                    }
                this.chartData.myChart1.setOption(option1)
            },
            init () {
                //this.initALLData() //初始化的时候清空所有表单，以免委托方与承运方页面切换时还存在数据
                this.getTotalFee() //调用总金额数据
                this.getOrderNum() //调用总订单数
                this.getReceipt()  //调用总回单数
                this.getAbnormalOrder()  //调用异常订单
                this.getSignPoint()  //调用描点
                this.getConStock()  //调用总规数，总件数
                this.getAccountsReceivable()  //调用账款情况柱状图
                this.getReceiptSituation()  //调用回单情况饼状图
                this.ChartPicture()
                this.drawReciepte() //调用饼状图
                this.pageType = this.$route.params.type //如果type是1就是委托方，是2就是承运方
                if (this.pageType === '1') {
                    this.pageType = '1'
                } else if (this.pageType === '2') {
                    this.pageType = '2'
                }
            }
            /*,
            initALLData () {
                this.condition.Con_Id = ''
                this.condition.Con_Name = ''
                this.condition.tellepone = ''
                this.condition.startDate = new Date()
                this.condition.endDate = new Date()
            }*/
        },
        created () {
            this.colorstyle = ['yhk', 'whk', 'wkp', 'wdz']
        },
        mounted () {
            //this.init()
            let a = this
            window.onresize = function () {
                a.chartData.myChart.resize()
                a.chartData.myChart1.resize()
                //a.chartData.myChart2.resize()
                a.chartData.mapChart.resize()
            }
        }
    }
</script>
<style lang="less">
 *{
    margin: 0;
    padding: 0;
 }
 html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-size: 12px;
 }
 /* #app{
    height:100%;
 } */
 .main_wrapper {
    /* height:100%; */
    padding:10px 8px 8px 8px;
    background:#F3F3F3;
    box-sizing: border-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    min-height: 643px;
    .headerSearch_wrapper {
        -webkit-flex: 0 0 54px;
        flex: 0 0 54px;
        padding-left:10px;
       // height:54px ;
       // line-height: 54px;
        background:#fff;
        .search_Btn {
            position: relative;
            top: 2px;
            width:78px;
            height:30px;
            line-height:30px;
            padding:0;
            [class^="el-icon-mo-"], [class*=" el-icon-mo-"]{
                top:0;
                left:-4px;
            }
        }
    }
    .headtitle {
        -webkit-flex: 0 0 135px;
        flex: 0 0 135px;
        display: -webkit-flex;
        display: flex;
        background-color: #fff;
        margin: 10px 0;
        padding-right:18px;
        height: 135px;
        .datahead {
            margin:8px 0 8px 18px;
            -webkit-flex: 1;
            flex: 1;
            position: relative;
            padding: 10px 10px 0;
            cursor: pointer;
            background-color: #fff;
            line-height: 21px;
            border-radius: 2px;
            border:1px solid #ddd;
            overflow: hidden;
            p:first-of-type {
                color: #333;
            }
            p:last-of-type {
                font-size: 18px;
                height: 50px;
                line-height: 50px;
                overflow: hidden;
                text-indent: 1px;
                color: #ebcc5e;
            }
            .img {
                z-index: 2;
                position: absolute;
                top: 20px;
                right: 23px;
                font-size: 50px;
            }
            .f1{
                color:#E8B909;
            }
            .f2{
                color:#AED17D; //#66C10E
            }
            .f3{
                color:#88ACE8;  //#5D9EEE
            }
            .f4{
                color:#FD9D9B;  //#FF7673
            }
            .f5{
                color:#C47FFF;
            }
            .grantMsg {
                div{
                    float: left;
                    width: 50%;
                }
            }
        }
        .datahead_last {
            margin:8px 0 8px 18px;
            -webkit-flex: 1;
            flex: 1;
            position: relative;
            padding: 25px 10px 0;
            cursor: pointer;
            background-color: #D0E6FD;
            line-height: 21px;
            border-radius: 2px;
            border:1px solid #BDD2E5;
            overflow: hidden;
            .temp_img {
                z-index: 2;
                position: absolute;
                top: 28px;
                right: 26px;
                font-size: 50px;
                color:#6B8FB3;
            }
            .tempDownload {
                padding-left:20px;
                font-size:18px;
                font-weight: bold;
                color:#6786A3;
                line-height:30px;
                a{
                    color:#6786A3;
                }
            }
            .tempDownload:first-child{
                margin-bottom:10px;
            }
        }
    }
    .contentbody {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        -webkit-flex: 1;
        flex: 1;
        padding: 6px 18px;
        background:#fff;
        overflow: hidden;
        .work_order {
            -webkit-flex:2;
            flex:2;
            overflow:hidden;
            /* width: 306px; */
            border: 1px solid #ddd;
            border-radius: 2px;
            .ordertable{
                margin:5px;
                /* min-height:470px; */
                .worktable .el-table__body-wrapper{
                    overflow-y: hidden;
                    table{
                        width:auto !important;
                        /* height:400px; */
                        /* max-height: 410px; */
                        tr td .cell{
                            white-space: nowrap;
                            overflow: hidden;
                            max-width:140px;
                        }
                    }
                }
                .block{
                    text-align: center;
                    margin-top:10px;
                }
                .map-left{
                    border: 1px solid #d1dbe5;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
                    //margin:10px;
                    overflow: hidden;
                    .china-map{
                        height: 100%;
                    }
                }
            }
        }
        .account_situation {
            overflow:hidden;
            -webkit-flex:2;
            flex:2;
            display: -webkit-flex;
            display: flex;
            flex-direction: column;
            margin: 0 18px;
            border: 1px solid #ddd;
            border-radius: 2px;
            .account_wrapper{
                display: -webkit-flex;
                display: flex;
                flex-direction:column;
                -webkit-flex: 1;
                flex: 1;
            }
            .histogram{
                -webkit-flex: 1;
                flex: 1;
                /* width:600px; */
                /* height:270px;
                box-sizing:border-box; */
            }
            .accounttable{
                -webkit-flex: 1;
                flex: 1;
                margin:30px 5px 0 5px;
                box-sizing:border-box;
                .countable{
                    .el-table__body-wrapper{
                        overflow-y: hidden;
                        table{
                            /* width:auto !important; */
                            tr td .cell{
                                white-space: nowrap;
                                overflow: hidden;
                                /* max-width:140px; */
                            }
                            tr td:first-of-type .cell{
                                text-align: left;
                                padding:0 0 0 7px;
                            }
                        }
                    }
                    .yhk{
                        background:#AED17D;  /* #63A0F1 */
                    }
                    .whk{
                        background:#88ACE8;  /* #F59390 */
                    }
                    .wkp{
                        background:#89D4E7;   /* #96E093 */
                    }
                    .wdz{
                        background:#FD9D9B;   /* #B176F6 */
                    }
                }
               .el-table th{
                    background:#fff !important;
                    .cell{
                        text-align:center;
                        background:#fff;
                    }
               }
            }
        }
        .slips_situation {
            overflow:hidden;
            -webkit-flex:1;
            flex:1;
            display: -webkit-flex;
            display: flex;
            flex-direction: column;
            border: 1px solid #ddd;
            border-radius: 2px;
            .slips_wrapper{
                display: -webkit-flex;
                display: flex;
                flex-direction:column;
                -webkit-flex: 1;
                flex: 1;
                .header{
                    margin-top: 10px;
                    text-align: center;
                }
                .ordertop{
                    -webkit-flex: 1;
                    flex: 1;
                    /* width:auto;
                    height:240px;
                    box-sizing:border-box; */
                }
                .orderbottom{
                    -webkit-flex: 1;
                    flex: 1;
                    /* width:auto;
                    height:240px;
                    box-sizing:border-box; */
                }
            }
        }
        .paneltitle {
            padding: 0 8px;
            color: #333;
            background-color: #F1F5FE;
            font-size: 14px;
            height: 34px;
            line-height: 34px;
            border-bottom: 1px solid #ddd;
            .ordertotal {
                margin-left:16px;
                font-size:12px;
                color:#656567;
            }
        }
    }
    .el-form-item {
        margin-bottom:0;
    }
    .el-input__inner{
        height:24px;
        border-radius:0;
        font-size: 12px;
    }
    .el-form-item__content{
        line-height:54px;
    }
    .el-form-item__label{
        padding:0;
        line-height: 54px;
    }
    .common-row .common-col .el-form-item .el-form-item__label{
        width:85px;
        text-align: right;
    }
    col{
        width:auto;
    }
    .el-table td, .el-table th{
        height:35px !important;
        .cell{
            font-size:12px;
            color:#565656;
            font-weight: normal;
            text-align: center;
        }
    }
 }

</style>
