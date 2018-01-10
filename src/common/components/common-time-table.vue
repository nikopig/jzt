<template>
    <div class="time-table-wraper">
      <div class="time-table-header">
        <div class="head-left">委托方</div>
        <div class="time-axis-wraper">
          <!--<div class="time-control-prev el-icon-arrow-left" @click="changeDate(-1)"></div>-->
          <div class="time-line-wraper" v-for="dateItem in dateList">
            <div class="time-line-item" @click.stop="goDate(dateItem)" :class="{todayStyle: isToday(dateItem), weekendStyle: !isToday(dateItem) && isWeekend(dateItem)}">
                <div class="time-day" v-if="dateItem !== 'hisdata'">{{getDay(dateItem)}}</div>
                <div class="time-week" v-if="dateItem !== 'hisdata'">{{getWeek(dateItem)}}</div>
                <div class="hisdata" v-if="dateItem === 'hisdata'">历史数据</div>
            </div>
          </div>
          <!--<div class="time-control-next el-icon-arrow-right" @click="changeDate(1)"></div>-->
        </div>
      </div>
      <div class="time-table-body">
        <div class="time-data-item" v-for="item in data">
          <div class="data-header">
            <slot name="header" :row="item"></slot>
          </div>
          <div class="data-detail">
            <div class="data-detail-item" v-for="dateItem in dateList">
              <div class="data-box" v-for="dItem in item.dataList" v-if="dItem.date.substring(0, 10) === dateItem">
                <slot name="body" :row="item" :detail="dItem"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="no-data" v-if="data.length === 0">暂无数据</div>
      </div>
    </div>
</template>

<script>
    import {getDateSection, DateFtt} from '@/common/js/utils.js'
    const WEEKS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    export default {
        name: 'commonTimeTable',
        props: {
          // 起始时间
          start: {
            type: String,
            default: '2017-09-25'
          },
          // 时间区间内有几天
          section: {
            type: Number,
            default: 14
          },
          // 源数据
          data: {
            type: Array,
            default () {
              return []
            }
          }
        },
        computed: {
          startDate: {
            get () {
              return this.start
            },
            set (val) {
              this.$emit('changeDate', val)
            }
          },
          yearMonth () {
            let now = new Date(this.startDate)
            return now.getFullYear() + '年' + (now.getMonth() + 1) + '月'
          },
          dateList () {
            let rel = getDateSection(this.startDate, 1, this.section)
            rel.unshift('hisdata')
            return rel
          },
          len () {
            let rel = this.dateList.length
            return rel
          }
        },
        methods: {
          // 获取日
          getDay (str) {
            return new Date(str).getDate()
          },
          // 获取星期几
          getWeek (str) {
            return WEEKS[new Date(str).getDay()]
          },
          // 是否是今天
          isToday (str) {
            return str === DateFtt('yyyy-MM-dd', new Date())
          },
          // 是否是周末
          isWeekend (str) {
            let weekNo = new Date(str).getDay()
            return weekNo === 0 || weekNo === 6
          },
          goDate (date) {
            this.$emit('point', date)
          },
          // 查询往前一周或者往后一周
          changeDate (flag) {
            // flag为-1标识前一周，1标识后一周
            let days = this.section * flag
            let endTime = new Date(this.startDate).valueOf() + days * 24 * 3600 * 1000
            this.startDate = DateFtt('yyyy-MM-dd', new Date(endTime))
          }
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
  @import '../style/less/primary.less';
  .time-table-wraper {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ddd;
    border: 1px solid #ddd;
    .time-table-header {
      height: 50px;
      background-color: #eee;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .head-left {
        width: 10%;
        float: left;
        line-height: 50px;
        text-align: center;
      }
      .time-line-item {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        .time-day, .time-week {
          height: 25px;
          line-height: 25px;
        }
      }
    }
    .time-table-body {
      .time-data-item {
        height: 84px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        border-top: 1px solid #ddd;
        background-color: #fff;
        .data-header  {
          width: 10%;
          line-height: 84px;
          text-align: center;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 0px 10px;
          overflow: hidden;
          white-space:nowrap;
          text-overflow: ellipsis;
        }
        .data-detail {
          -webkit-box-flex: 1;
          -ms-flex: 1;
          flex: 1;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          .data-detail-item {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            /*border-left: 1px solid #ddd;*/
            &:before {
              content: ' ';
              position: absolute;
              left: -1px;
              width: 1px;
              top: 0px;
              bottom: 0px;
              background-color: #ddd;
            }
            .data-box {
              height: 84px;
              text-align: center;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              label {
                display: block;
                height: 42px;
                line-height: 42px;
                font-size: 12px;
                cursor: pointer;
                span {
                  font-size: 14px;
                  color: #666;
                }
              }
            }
          }
        }
      }
      .no-data {
        width: 100%;
        height: 84px;
        line-height: 84px;
        border-top: 1px solid #ddd;
        background-color: #fff;
        text-align: center;
      }
    }
  }
  .time-axis-wraper {
    width: 90%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    float: right;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    .time-control-prev, .time-control-next {
      line-height: 80px;
      text-align: center;
      font-size: 24px;
      color: #9f9f9f;
      cursor: pointer;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
    .time-line-wraper {
      height: 50px;
      /*border-left: 1px solid #ddd;*/
      position: relative;
      -webkit-box-flex: 2;
      -ms-flex: 2;
      flex: 2;
      background-color: #f2f8ff;
      &:before {
        content: ' ';
        position: absolute;
        left: -1px;
        width: 1px;
        top: 0px;
        bottom: 0px;
        background-color: #ddd;
      }
      .time-line-item {
        position: relative;
        height: 50px;
        cursor: pointer;
        .time-tip {
          width: 18px;
          height: 18px;
          border-radius: 9px;
          background-color: @main-color;
          position: relative;
          left: -9px;
          top: -8px;
          cursor: pointer;
          .time-tip-inner {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            background-color: #fff;
            position: relative;
            top: 4px;
            left: 4px;
          }
          .time-tip-text {
            position: absolute;
            top: 25px;
            left: -30px;
            margin-left: 9px;
            display: inline-block;
            *display: inline-block;
            *zoom: 1;
            width: 100px;
          }
        }
      }
    }
  }
  .todayStyle {
    background-color: #1ABD9D;
    color: #fff;
  }
  .weekendStyle {
    background-color: #62BDFF;
    color: #fff;
  }
  .hisdata {
    line-height: 50px;
  }
</style>
