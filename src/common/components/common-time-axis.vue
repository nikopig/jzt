<template>
    <div class="time-table-wraper">
      <div class="time-table-header">
        <div class="time-axis-wraper">
          <div class="time-control-prev el-icon-arrow-left" @click="changeDate(-1)"></div>
          <div class="time-line-wraper" v-for="dateItem in dateList">
            <div class="time-line-item">
              <div class="time-tip" @click.stop="goDate(dateItem)">
                <div class="time-tip-inner"></div>
                <div class="time-tip-text">{{dateItem}}</div>
              </div>
            </div>
          </div>
          <div class="time-control-next el-icon-arrow-right" @click="changeDate(1)"></div>
        </div>
      </div>
      <div class="time-table-body">
        <div class="time-data-item" v-for="item in data">
          <div class="data-header">
            <slot name="header" :row="item"></slot>
          </div>
          <div class="data-detail">
            <div class="data-detail-item" v-for="dateItem in dateList">
              <div class="data-box" v-for="dItem in item.dataList" v-if="dItem.date == dateItem">
                <slot name="body" :row="item" :detail="dItem"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {getDateSection, DateFtt} from '@/common/js/utils.js'
    export default {
        name: 'commonTimeAxis',
        props: {
          // 起始时间
          start: {
            type: String,
            default: '2017-09-25'
          },
          // 时间区间内有几天
          section: {
            type: Number,
            default: 7
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
          dateList () {
            return getDateSection(this.startDate)
          },
          len () {
            let rel = this.dateList.length
            return rel
          }
        },
        methods: {
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
    border: 1px solid #ddd;
    .time-table-header {
      height: 80px;
      background-color: #eee;
    }
    .time-table-body {
      .time-data-item {
        height: 60px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        border-top: 1px solid #ddd;
        &:nth-child(odd) {
          background-color: #f6f6f6;
        }
        .data-header  {
          width: 10%;
          border-right: 1px solid #ddd;
          line-height: 60px;
          text-align: center;
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
            .data-box {
              width: 70%;
              position: relative;
              left: 15%;
              height: 60px;
              background-color: @main-color;
              text-align: center;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              padding: 10px 0;
              span {
                color: #fff;
                display: block;
                line-height: 1.8;
                font-size: 12px;
                cursor: pointer;
                &:hover {
                  color: #f8f8f8
                }
              }
            }
          }
        }
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
      height: 80px;
      &:not(:nth-last-child(2)) {
        -webkit-box-flex: 2;
        -ms-flex: 2;
        flex: 2;
      }
      &:nth-last-child(2) {
        width: 0px;
      }
      .time-line-item {
        position: relative;
        top: 50%;
        height: 3px;
        background-color: @main-color;
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

</style>
