<template>
  <div class="main_wrapper">
    <div class="headerSearch_wrapper">
      <el-form :inline="true" size="small">
        <el-form-item label="承运方名称：" label-width="85px">
          <el-input class="noselect" v-model="condition.Carrier_Name" placeholder="双击选择"
                    @dblclick.native="showConDialog('Carrier')"
                    icon="el-icon-close"
                    :on-icon-click="deleteCon"
          ></el-input>
        </el-form-item>
        <el-form-item label="起始时间：" label-width="85px">
          <el-date-picker type="date" v-model="condition.startDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="终止时间：" label-width="85px">
          <el-date-picker type="date" v-model="condition.endDate" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" class="search_Btn" @click="init"><i class='el-icon-mo-query'></i>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="headtitle">
      <!--<el-card>-->

      <!--</el-card>-->
      <div class="datahead">
        <el-card @click.native="goAmount">
          <p>总金额（元）</p>
          <p class="f1">{{TotalCustomer.Total_Amount}}</p>
          <div class="el-icon-mo-Sales-volume img f1"></div>
          <div class="progressbar3 breathborder"></div>
          <div class="refreshbar3"></div>
          <div class="grantMsg">
            <div class="textOverflow"><span>已结算：</span><span>{{TotalCustomer.YJS_Total_Amount}}</span></div>
            <div class="textOverflow"><span class="gN">未结算：</span><span>{{TotalCustomer.WJS_Total_Amount}}</span></div>
          </div>
        </el-card>
      </div>
      <div class="datahead">
        <el-card @click.native="goConsiOrder">
          <p>委托单数</p>
          <p class="f2">{{TotalOrder.WTD_Num}}</p>
          <div class="el-icon-mo-equipmentSupplier img f5"></div>
          <div class="progressbar3 breathborder"></div>
          <div class="refreshbar3"></div>
          <div class="grantMsg">
            <div class="textOverflow"><span>已完成：</span><span>{{TotalOrder.YWTD_Num}}</span></div>
            <div class="textOverflow"><span class="gN">未完成：</span><span>{{TotalOrder.WWTD_Num}}</span></div>
          </div>
        </el-card>
      </div>
      <div class="datahead">
        <el-card @click.native="goReceipt">
          <p>总回单数</p>
          <p class="f3">{{TotalReceipt.HuiDan_Num}}</p>
          <div class="el-icon-mo-Number-of-entries img f3"></div>
          <div class="progressbar3 breathborder"></div>
          <div class="refreshbar3"></div>
          <div class="grantMsg">
            <div class="textOverflow"><span>已回单：</span><span>{{TotalReceipt.Yi_HuiDan_Num}}</span></div>
            <div class="textOverflow"><span class="gN">未回单：</span><span>{{TotalReceipt.Wei_HuiDan_Num}}</span></div>
          </div>
        </el-card>
      </div>
      <div class="datahead">
        <el-card>
          <a :href="excepSrc" target="_blank">
            <p>异常订单</p>
            <p class="f4">{{AbnormalOrder.YCDD_Num}}</p>
            <div class="el-icon-mo-warehouseNumber img f4"></div>
            <div class="progressbar3 breathborder"></div>
            <div class="refreshbar3"></div>
            <div class="grantMsg">
              <div class="textOverflow"><span>已完成：</span><span></span>{{AbnormalOrder.YYCDD_Num}}</div>
              <div class="textOverflow"><span class="gN">未完成：</span><span>{{AbnormalOrder.WYCDD_Num}}</span></div>
            </div>
          </a>
        </el-card>
      </div>
    </div>
    <div class="contentbody">
      <el-row class="chart-box">
        <el-col :span="16">
          <!-- 账款情况 -->
          <div class="account_situation">
            <el-card>
              <div class="paneltitle">
                <span>账款情况</span>
                <!--<span class="ordertotal">订单总数：12312</span>-->
              </div>
              <div class="account_wrapper" ref="accountwrapper" @click="goAmount">
              <div ref="histogram" class="histogram"></div>
              <div class="accounttable">
                <el-table :data="accountData" class="countable" :max-height="140">
                  <el-table-column prop="Mon" label="月份"></el-table-column>
                  <el-table-column prop="YHK_Total_Amount" label="已回款" :render-header="renderHeader"></el-table-column>
                  <el-table-column prop="YKP_Total_Amount" label="已开票未回款" :render-header="renderHeader"></el-table-column>
                  <el-table-column prop="YDZ_Total_Amount" label="已对账未开票" :render-header="renderHeader"></el-table-column>
                  <el-table-column prop="WDZ_Total_Amount" label="未对账" :render-header="renderHeader"></el-table-column>
                </el-table>
              </div>
            </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8" class="right-chart">
          <!-- 回单情况 -->
          <div class="slips_situation">
            <el-card>
              <div class="paneltitle">
                <span>回单情况</span>
                <div slot="header" class="header">
                  <el-select v-model="currentDate" @change="selectDate">
                    <el-option v-for="(item, index) in reciepData" :label="item.Mon" :value="index" :key="index"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="slips_wrapper" @click="goReceipt">
                <div ref="ordertop" class="ordertop"></div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--运行中车辆-->
    <div class="table-box">
      <el-table :data="carData">
        <el-table-column prop="Departure_Time" label="时间"></el-table-column>
        <el-table-column prop="Vehicle_No" label="车牌号"></el-table-column>
        <el-table-column prop="DD_Num" label="订单数"></el-table-column>
        <el-table-column prop="YWCDD_Num" label="已完成订单数"></el-table-column>
        <el-table-column prop="JXZDD_Num" label="进行中订单数"></el-table-column>
        <el-table-column prop="JJKSDD_Num" label="即将开始"></el-table-column>
        <el-table-column prop="YCDD_Num" label="异常运单数"></el-table-column>
      </el-table>
      <div class="foot-box" v-show="pages.show">
        <el-pagination
          layout="total, prev, pager, next"
          :total="pages.total"
          :current-page.sync="pages.currentPage"
          @current-change="onPage"
        ></el-pagination>
      </div>
    </div>
    <!-- 委托方弹框组件 -->
    <carri-modal :visible.sync="dialogShow.Carrier" @change="selectCons"></carri-modal>
  </div>
</template>

<script>
  import config from '@/common/js/config'
  import Vue from 'vue'
  import Api from '@/common/js/api'
  import {DateFtt} from '@/common/js/utils.js'
  import commonRow from '@/common/components/common-row/index.js'
  import commonCol from '@/common/components/common-col'
  import carriModal from '@/common/service/modal/carri-modal'
  import eCharts from 'echarts'

  export default {
    name: 'carriMain',
    props: {},
    components: {commonRow, commonCol, carriModal},
    data () {
      return {
        excepSrc: config.packgeType === 'test' ? 'http://10.3.87.201:8890/HtmlPages/TMP/ExceptionAudit.html' : 'http://10.3.87.27:8896/HtmlPages/TMP/ExceptionAudit.html',
        TableHeader: [],
        condition: {
          Carrier_Name: '',     // 委托方
          Carrier_Id: '',
          tellepone: '',
//          startDate: '2015-01-01',   //开始日期
          startDate: new Date(new Date().valueOf() - 365 * 24 * 3600 * 1000),   //开始日期
          endDate: new Date()      //结束日期
        },
        TotalCustomer: {}, //请求到总金额
        TotalOrder: {},  //请求到总订单数
        TotalReceipt: {},  //请求到总回单数
        AbnormalOrder: {}, //请求到异常订单数
        accountsReceivable: [],  //账款情况柱状图数据
        baryhk: [],  //已回款总数据
        barykpwhk: [], //已开票未回款总数据
        barydzwkp: [], //已对账未开票总数据
        barwdz: [],  //未对账总数据
        barMon: [],  //月份
        carData: [], // 运行中车辆数据
        reciepData: [],   //回单情况饼状图数据
        mon: {
          '01': '一月',
          '02': '二月',
          '03': '三月',
          '04': '四月',
          '05': '五月',
          '06': '六月',
          '07': '七月',
          '08': '八月',
          '09': '九月',
          '10': '十月',
          '11': '十一月',
          '12': '十二月'
        },
        currentDate: 0,
        workOrderData: [
          /*{
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
          }*/
        ],
        accountData: [],  //账款情况表格组装数据
        dialogShow: { //委托方打开弹框
          Carrier: false
        },
        pages: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          show: false
        },
        chartData: {},
        pageType: ''  //判断是委托方还是承运方
      }
    },
    computed: {
      reciepChart () {
        return this.reciepData.length > 0 ? this.reciepData[this.currentDate] : {}
      }
    },
    methods: {
//      渲染表头
      renderHeader (h, {column, index}) {
        switch (column.label) {
          case '已回款':
            column.bgColor = '#AED17D'
            break
          case '已开票未回款':
            column.bgColor = '#88ACE8'
            break
          case '已对账未开票':
            column.bgColor = '#89D4E7'
            break
          case '未对账':
            column.bgColor = '#FD9D9B'
            break
        }
        let tipStyle = {backgroundColor: column.bgColor}
        return (
          <div style={{backgroundColor: '#fff'}}>
            <span style={tipStyle} class="color-tip"></span>
            <span style="margin-left: 10px">{ column.label }</span>
          </div>
        )
      },
      // 饼状图高度与左侧账款区域高度实时保持一致
      setHeight () {
        this.$refs.ordertop.style.height = this.$refs.accountwrapper.clientHeight + 'px'
        if (this.chartData.myChart1) this.chartData.myChart1.resize()
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
      goAmount () {
        this.$router.push('/carriFee')
      },
      goConsiOrder () {
        this.$router.push('/carriSearch')
      },
      goReceipt () {
        let params = {
          Carrier_Id: this.condition.Carrier_Id || '%',
          Carrier_Name: this.condition.Carrier_Name || '',
          startDate: DateFtt('yyyy-MM-dd', this.condition.startDate),
          endDate: DateFtt('yyyy-MM-dd', this.condition.endDate)
        }
        this.$router.push({
          name: 'carriMainList',
          params: params
        })
        // this.$router.push('/carriReceipt')   //承运方回单
      },
      showConDialog (val) {  //双击打开委托方弹框
        this.dialogShow[val] = true
      },
      selectCons (row) {
        this.condition.Carrier_Id = row.Carrier_Id || '%'
        this.condition.Carrier_Name = row.Carrier_Name || ''
        this.init()
      },
      deleteCon () {
        this.condition.Carrier_Id = '%'
        this.condition.Carrier_Name = ''
      },
      getTotalFee () {  //获取总金额
        this.getHeadTotal('TmpCYFGetRecFeeRecordTB', '1')
      },
      getOrderNum () {  //获取委托单数
        this.getHeadTotal('TmpCYFGetBillTransportEntrustHdrTB', '2')
      },
      getReceipt () {   //获取总回单数
        this.getHeadTotal('TmpCYFGetBillReceiptRecordHDTB', '3')
      },
      getAbnormalOrder () { //获取异常订单
        this.getHeadTotal('TmpCYFGetBillReceiptRecordYCTB', '4')
      },
      getHeadTotal (URL, total) {
        let params = {
          Carrier_Id: this.condition.Carrier_Id ? this.condition.Carrier_Id : '%',
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
            this.$alert(res.ErrInfo)
          }
        })
      },
      getAccountsReceivable () {  //获取账款情况柱状图数据
        let params = {
          Carrier_Id: this.condition.Carrier_Id ? this.condition.Carrier_Id : '%',
          StartTime: DateFtt('yyyy-MM-dd', this.condition.startDate),
          EndTime: DateFtt('yyyy-MM-dd', this.condition.endDate)
        }
        this.TableHeader = []
        Api.get('TmpCYFGetRecFeeRecordDZHZ', params).then(res => {
          if (res.Flag) {
            this.accountData = res.MsgInfo
            this.baryhk = this.accountData.map(item => item.YHK_Total_Amount)
            this.barykpwhk = this.accountData.map(item => item.YKP_Total_Amount)
            this.barydzwkp = this.accountData.map(item => item.YDZ_Total_Amount)
            this.barwdz = this.accountData.map(item => item.WDZ_Total_Amount)
            this.barMon = this.accountData.map(item => item.Mon)
            this.$nextTick(this.setHeight)
            this.drawAccount()
          } else {
            this.$alert(res.ErrInfo)
          }
        })
      },
      getReceiptSituation () {   //获取回单情况饼状图数据
        let params = {
          Carrier_Id: this.condition.Carrier_Id ? this.condition.Carrier_Id : '%',
          StartTime: DateFtt('yyyy-MM-dd', this.condition.startDate),
          EndTime: DateFtt('yyyy-MM-dd', this.condition.endDate)
        }
        Api.get('TmpCFYGetBillReceiptRecordHDHZ', params).then(res => {
          if (res.Flag) {
            this.reciepData = res.MsgInfo.map(item => {
              item.monthTotal = item.Mon + '总订单数：' + item.HuiDan_Num
              return item
            })
            this.drawReciepte()
          } else {
            this.$alert(res.ErrInfo)
          }
        })
      },
      // 获取运行中车辆
      getCarData () {
        let params = {
          Carrier_Id: this.condition.Carrier_Id ? this.condition.Carrier_Id : '%',
          StartTime: DateFtt('yyyy-MM-dd', this.condition.startDate),
          EndTime: DateFtt('yyyy-MM-dd', this.condition.endDate),
          startIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          pageSize: this.pages.pageSize
        }
        Api.get('TmpCYFGetBillTransportEntrustHdrZYZHZ', params)
          .then((res) => {
            if (res.Flag) {
              this.carData = res.MsgInfo
              if (this.carData.length >= this.pages.pageSize) {
                this.pages.show = true
                this.pages.total = this.carData[0].bigTotalItems
              } else {
                this.pages.show = false
              }
            } else {
              this.$alert(res.ErrInfo)
            }
          })
      },
      onPage () {
        this.getCarData()
      },
      selectDate (val) {
        this.drawReciepte()
      },
      // 绘制账款柱状图
      drawAccount () {
        this.chartData.myChart = eCharts.init(this.$refs.histogram)
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line'直线指示器 | 'shadow'阴影指示器
            }
          },
          yAxis: {  //y轴
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            axisTick: {show: false},  //是否显示坐标轴刻度
            splitLine: {show: false}  //是否显示坐标轴刻度
          },
          xAxis: {  //x轴
            type: 'category',
            axisTick: {show: false},  //是否显示坐标轴刻度
            splitLine: {show: false},  //是否显示坐标轴刻度
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            data: this.barMon
          },
          series: [
            {
              name: '已回款',
              type: 'bar',
//              stack: '总量',
              itemStyle: {
                normal: {color: '#AED17D'}
              },
              barGap: 0,
              barMaxWidth: 50,
              data: this.baryhk
            },
            {
              name: '已开票未回款',
              type: 'bar',
//              stack: '总量',
              itemStyle: {
                normal: {color: '#88ACE8'}
              },
              barGap: 0,
              barMaxWidth: 50,
              data: this.barykpwhk
            },
            {
              name: '已对账未开票',
              type: 'bar',
//              stack: '总量',
              itemStyle: {
                normal: {color: '#89D4E7'}
              },
              barGap: 0,
              barMaxWidth: 50,
              data: this.barydzwkp
            },
            {
              name: '未对账',
              type: 'bar',
//              stack: '总量',
              itemStyle: {
                normal: {color: '#FD9D9B'}
              },
              barGap: 0,
              barMaxWidth: 50,
              data: this.barwdz
            }
          ]
        }
        this.chartData.myChart.setOption(option)
      },
      // 绘制回单饼状图
      drawReciepte () {
        this.chartData.myChart1 = eCharts.init(this.$refs.ordertop)
        var option1 = {
          animation: false,
          textStyle: {
            color: '#666',
            fontSize: '12'
          },
          title: {
            text: this.reciepChart.monthTotal,
            /*top: 'bottom',*/
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
                  value: this.reciepChart.Wei_HuiDan_Num,
                  name: '未上传', /*(this.startData.Wei_HuiDan_Num === 0) ? '' : ('未上传')*/
                  itemStyle: {normal: {color: '#AED17D'}}
                },
                {
                  value: this.reciepChart.Yi_HuiDan_Num,
                  name: '已上传',
                  itemStyle: {normal: {color: '#88ACE8'}}
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
                  itemStyle: {normal: {color: '#89D4E7'}}
                },
                {
                  value: this.reciepChart.YQR_HuiDan_Num,
                  name: '已确认',
                  itemStyle: {normal: {color: '#FD9D9B'}}
                }
              ]
            }
          ]
        }
        this.chartData.myChart1.setOption(option1)
      },
      init () {
        this.getTotalFee() //调用总金额数据
        this.getOrderNum() //调用总订单数
        this.getReceipt()  //调用总回单数
        this.getAbnormalOrder()  //调用异常订单
        this.getAccountsReceivable()  //调用账款情况柱状图
        this.getReceiptSituation()  //调用回单情况饼状图
        this.getCarData() // 运行中车辆
        this.drawAccount()
        this.drawReciepte()
        this.pageType = this.$route.params.type //如果type是1就是委托方，是2就是承运方
      }
    },
    created () {},
    mounted () {
      this.setHeight()
      window.onresize = () => {
        if (this.chartData.myChart) this.chartData.myChart.resize()
        if (this.chartData.myChart1) this.chartData.myChart1.resize()
      }
    }
  }
</script>
<style lang="less">
  * {
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
    /*padding: 10px;*/
    /*background: #F3F3F3;*/
    box-sizing: border-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    min-height: 643px;
    .headerSearch_wrapper {
      margin-top: 10px;
      -webkit-flex: 0 0 54px;
      flex: 0 0 54px;
      padding-left: 10px;
      // height:54px ;
      // line-height: 54px;
      background: #fff;
      .search_Btn {
        position: relative;
        top: 0px;
        padding: 5px 9px;
        [class^="el-icon-mo-"], [class*=" el-icon-mo-"] {
          top: 0;
          left: -4px;
        }
      }
    }
    .headtitle {
      -webkit-flex: 0 0 135px;
      flex: 0 0 155px;
      display: -webkit-flex;
      display: flex;
      background-color: #fff;
      margin: 10px 0;
      padding-right: 18px;
      height: 155px;
      .datahead {
        margin: 0px 0px 0px 18px;
        -webkit-flex: 1;
        flex: 1;
        position: relative;
        cursor: pointer;
        background-color: #fff;
        line-height: 21px;
        border-radius: 2px;
        overflow: hidden;
        .el-card {
          .el-card__body {
            overflow: hidden;
          }
        }
        p:first-of-type {
          color: #333;
        }
        p:last-of-type {
          font-size: 18px;
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          text-indent: 1px;
        }
        .img {
          z-index: 2;
          position: absolute;
          top: 20px;
          right: 23px;
          font-size: 50px;
        }
        .f1 {
          color: #AED17D;
        }
        .f2 {
          color: #88ACE8;
        }
        .f3 {
          color: #89D4E7;
        }
        .f4 {
          color: #FD9D9B;
        }
        .f5 {
          color: #C47FFF;
        }
        .grantMsg {
          div {
            float: left;
            width: 50%;
          }
        }
      }
      .datahead_last {
        margin: 8px 0 8px 18px;
        -webkit-flex: 1;
        flex: 1;
        position: relative;
        padding: 25px 10px 0;
        cursor: pointer;
        background-color: #D0E6FD;
        line-height: 21px;
        border-radius: 2px;
        border: 1px solid #BDD2E5;
        overflow: hidden;
        .temp_img {
          z-index: 2;
          position: absolute;
          top: 28px;
          right: 26px;
          font-size: 50px;
          color: #6B8FB3;
        }
        .tempDownload {
          padding-left: 20px;
          font-size: 18px;
          font-weight: bold;
          color: #6786A3;
          line-height: 30px;
        }
      }
    }
    .contentbody {
      /*display: -webkit-flex;*/
      /*display: flex;*/
      /*flex-direction: row;*/
      /*-webkit-flex: 1;*/
      /*flex: 1;*/
      .account_wrapper {
        /*height: 450px;*/
      }
      .chart-box {
        width: 100%;
        .right-chart {
          padding-left: 20px;
        }
        .el-card {
          .el-card__body {
            padding: 0px;
          }
        }
      }
      padding: 6px 18px;
      background: #fff;
      overflow: hidden;
      .work_order {
        -webkit-flex: 2;
        flex: 2;
        overflow: hidden;
        /* width: 306px; */
        border: 1px solid #ddd;
        border-radius: 2px;
        .ordertable {
          margin: 5px;
          /* min-height:470px; */
          .worktable .el-table__body-wrapper {
            overflow-y: hidden;
            table {
              width: auto !important;
              /* height:400px; */
              /* max-height: 410px; */
              tr td .cell {
                white-space: nowrap;
                overflow: hidden;
                max-width: 140px;
              }
            }
          }
          .block {
            text-align: center;
            margin-top: 10px;
          }
        }
      }
      .account_situation {
        /*overflow: hidden;*/
        -webkit-flex: 2;
        flex: 2;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        /*border: 1px solid #ddd;*/
        border-radius: 2px;
        .color-tip {
          display: inline-block;
          width: 10px;
          height: 10px;
        }
        .account_wrapper {
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          -webkit-flex: 1;
          flex: 1;
        }
        .histogram {
          height:270px;
          box-sizing:border-box;
        }
        .accounttable {
          -webkit-flex: 1;
          flex: 1;
          box-sizing: border-box;
          .el-table::before {
            height: 0px;
          }
          .el-table::after {
            width: 0px;
          }
          .el-table {
            border: none;
            border-top: 1px solid #dfe6ec;
            .el-table__body-wrapper {
              .el-table__row:last-child {
                td {
                  border: none;
                }
              }
            }
          }
          .countable {
            .el-table__body-wrapper {
              overflow-y: hidden;
              table {
                /* width:auto !important; */
                tr td .cell {
                  white-space: nowrap;
                  overflow: hidden;
                  /* max-width:140px; */
                }
              }
            }
            .yhk {
              background: #63A0F1;
            }
            .whk {
              background: #F59390;
            }
            .wkp {
              background: #96E093;
            }
            .wdz {
              background: #B176F6;
            }
          }
          .el-table th {
            background: #fff !important;
            .cell {
              text-align: center;
              background: #fff;
            }
          }
        }
      }
      .slips_situation {
        /*overflow: hidden;*/
        -webkit-flex: 1;
        flex: 1;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        /*border: 1px solid #ddd;*/
        border-radius: 2px;
        .slips_wrapper {
          height: 100%;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          -webkit-flex: 1;
          flex: 1;
          .ordertop {
            -webkit-flex: 1;
            flex: 1;
          }
          .orderbottom {
            -webkit-flex: 1;
            flex: 1;
          }
        }
      }
      .paneltitle {
        padding: 0 8px;
        color: #333;
        background-color: #f1f5fe;
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        border-bottom: 1px solid #ddd;
        .header {
          float: right;
          .el-select {
            input {
              text-align: right;
              outline: none;
              border: none;
              background-color: transparent;
            }
          }
        }
        .ordertotal {
          margin-left: 16px;
          font-size: 12px;
          color: #656567;
        }
      }
    }
    .table-box {
      margin-top: 10px;
      padding: 10px 18px;
      background-color: #fff;
      .el-table {
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
        th {
          background-color: #f1f5fe;
        }
        .el-table__header-wrapper thead div {
          background-color: #f1f5fe;
        }
      }
    }
    .foot-box {
      padding-bottom: 20px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__content {
      line-height: 54px;
    }
    .el-form-item__label {
      padding: 0;
      line-height: 54px;
    }
    .common-row .common-col .el-form-item .el-form-item__label {
      width: 85px;
      text-align: right;
    }
    col {
      width: auto;
    }
    .el-table td, .el-table th {
      height: 35px !important;
      .cell {
        font-size: 12px;
        color: #565656;
        font-weight: normal;
        text-align: center;
      }
    }
  }

</style>
