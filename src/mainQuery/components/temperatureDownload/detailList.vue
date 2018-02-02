<template>
    <div class="temperatureDetail">
      <div class="headbar">
        <div class="common-row">
          <label>当前位置：</label>
          <div class="common-col">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item @click.native="go(-2)">首页</el-breadcrumb-item>
              <el-breadcrumb-item @click.native="go(-1)">温度下载</el-breadcrumb-item>
              <el-breadcrumb-item>温度详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      <div class="toolbar">
        <div class="btn-box">
          <el-button type="text" icon="mo-download" @click="print">温度下载</el-button>
        </div>
        <div class="text-box">
          <div class="text">
            <span>电子锁编号：</span>
            <span>{{shebei.no}}</span>
          </div>
          <div class="text">
            <span>电子锁id：</span>
            <span>{{shebei.id}}</span>
          </div>
          <div class="text">
            <span>电子锁电量：</span>
            <span>{{shebei.power}}</span>
          </div>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="16">
          <div class="chart-box" ref="chart-box"></div>
        </el-col>
        <el-col :span="8">
          <el-card class="data-box">
            <div slot="header">
              <el-select v-model="currentDate">
                <el-option v-for="date in dates" :value="date"></el-option>
              </el-select>
            </div>
            <div class="temp-list">
              <div class="temp-item" v-for="(item, index) in currentTemp" :key="index">
                <div class="left">{{item.CJ_DATE}}</div>
                <div class="right">{{item.WD_DATA_UPT}}℃</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import Echart from 'echarts'
    import Api from '@/common/js/api.js'
    import {DateFtt, createReapteArray, groupBy} from '@/common/js/utils.js'
    export default {
        name: 'tempDetailList',
        props: {},
        components: {},
        data () {
            return {
              shebei: {
                id: '',
                no: '',
                power: ''
              },
              origData: [], // 数据源
              currentDate: '' // 当前日期
            }
        },
        computed: {
          len () {
            return this.dateTimes.length
          },
          xStart () { // datazoom横轴时间起点
            return this.len > 0 ? this.dateTimes[0] : ''
          },
          xEnd () { // datazoom横轴时间终点
            if (this.len !== 0) {
              return this.dateTimes[this.len - 1]
            } else {
              return ''
            }
          },
          groupData () { // 分组分度数据
            return groupBy(this.origData, 'CJ_DATE_RQ')
          },
          dates () { // 日期数组
            return Object.keys(this.groupData)
          },
          dateTimes () { // 采集时间
            return this.origData.map(item => item.CJ_DATE)
          },
          tempData () { // 温度数据
            return this.origData.map(item => item.WD_DATA_UPT)
          },
          currentTemp () { // 当前日期内的温度数据
            return this.groupData[this.currentDate]
          }
        },
        methods: {
          print () {
            let queryStr = 'http://10.2.65.120:8080/test-yu/PrintTemperature.html?Hanghao=' + this.$router.params.HANGHAO + '&Ct_Start_Date=' + this.$router.params.beginDate + '&Ct_End_Date=' + this.$router.params.endDate + '&Danj_No=' + this.$router.params.DANJ_NO + '&Vehicle_No=' + this.$router.params.CHEPAI_NO + '&Sb_Id=' + this.$router.params.sid + '&TemTop=' + this.$router.params.High_Temp + '&TemLow=' + this.$router.params.Low_Temp
            window.top.Myhome.addTabEx('温度打印', queryStr)
          },
          getData () {
            let interFace = this.$route.params.flag === '0' ? 'DS_APP_JLP_ELECTRONICLOCK_TEMPATA_OLD' : 'DS_APP_JLP_ELECTRONICLOCK_TEMPATA'
            let params = {
              SB_ID: this.$route.params.sid,
              BEGIN_DATE: this.$route.params.beginDate,
              END_DATE: this.$route.params.endDate
            }
            Api.get(interFace, params)
              .then(res => {
                if (res.Flag) {
                  this.origData = res.MsgInfo
                  if (this.origData.length > 0) {
                    this.currentDate = this.origData[0].CJ_DATE_RQ
                    this.shebei.id = this.origData[0].SB_ID
                    this.shebei.no = this.origData[0].SB_NO
                    this.shebei.power = this.origData[0].SB_POWER
                  }
                  this.drawLine()
                } else {
                  this.messageInfo(res.ErrInfo)
                }
              })
          },
          init () {
            this.getData()
          },
          drawLine () {
            let options = {
              legend: {
                data: ['上限', '温度', '下限']
              },
              tooltip: {
                trigger: 'axis'
              },
              dataZoom: [
                {
                  type: 'slider',
                  startValue: this.xStart,
                  endValue: this.xEnd
                },
                {
                  type: 'inside',
                  startValue: this.xStart,
                  endValue: this.xEnd
                }
              ],
                xAxis: {
                type: 'category',
                  boundaryGap: false,
                  data: this.dateTimes
              },
              yAxis: {
                type: 'value',
                  axisLabel: {
                  formatter: '{value} °C'
                }
              },
              series: [
                {
                  name: '上限',
                  type: 'line',
                  data: createReapteArray(this.$route.params.High_Temp, this.len)
                },
                {
                  name: '温度',
                  type: 'line',
                  data: this.tempData
                },
                {
                  name: '下限',
                  type: 'line',
                  data: createReapteArray(this.$route.params.Low_Temp, this.len)
                }
              ]
            }
            this.tempChart.setOption(options)
          }
        },
        created () {
        },
        mounted () {
          this.tempChart = Echart.init(this.$refs['chart-box'])
          window.onresize = this.tempChart.resize
//          document.addEventListener('resize', this.drawLine)
        },
        activated () {
          this.getData()
        }
    }
</script>
<style lang="less">
  .temperatureDetail {
    .chart-box {
      margin-top: 15px;
      width: 100%;
      height: 500px;
    }
    .data-box {
      height: 500px;
      .el-card__header {
        padding: 5px;
      }
      .el-card__body {
        height: 450px;
        overflow-y: auto;
      }
      .el-input {
        width: 112px;
        input {
          outline: none;
          border: none;
        }
      }
      .temp-list {
        .temp-item {
          display: flex;
          padding: 10px;
          .left, .right {
            flex: 1;
          }
        }
      }
    }
  }
</style>
