<template>
    <div>
      <common-time-table @point="onPoint" @changeDate="onChangeDate" :data="realData" :start="startDate" :section="section">
        <template slot="header" slot-scope="props">
          <span :title="props.row.name">{{props.row.name}}</span>
        </template>
        <template slot="body" slot-scope="props">
          <label @click="goDetail(props.row.id, props.detail.date, '1')">待配：<span>{{props.detail.outSend}}</span></label>
          <label @click="goDetail(props.row.id, props.detail.date, '2')">配送：<span>{{props.detail.outStay}}</span></label>
        </template>
      </common-time-table>
    </div>
</template>

<script>
    import {DateFtt} from '@/common/js/utils.js'
    import Api from '@/common/js/api.js'
    import commonTimeTable from '@/common/components/common-time-table'
    export default {
        name: 'auditAxis',
        props: [],
        components: {commonTimeTable},
        data () {
          return {
            startDate: DateFtt('yyyy-MM-dd', new Date()),
            section: 14,
            origData: []
          }
        },
        computed: {
          endDate () {
            // 结束时间戳
            let endTime = new Date(this.startDate).valueOf() + (this.section - 1) * 24 * 3600 * 1000
            return DateFtt('yyyy-MM-dd', new Date(endTime))
          },
          realData () {
            let rel = []
            let ConIds = []
            this.origData.forEach((item) => {
              let pos = ConIds.indexOf(item.Con_Id)
              if (pos === -1) {
                let temp = {}
                ConIds.push(item.Con_Id)
                temp.name = item.Con_Name
                temp.id = item.Con_Id
                temp.dataList = []
                temp.dateList = []
                console.log(item)
                temp.dateList.push(item.Delivery_Time)
                temp.dataList.push(this.createObj(item))
                rel.push(temp)
              } else {
                let dataList = rel[pos].dataList
                let dateList = rel[pos].dateList
                let pos1 = dateList.indexOf(item.Delivery_Time)
                if (pos1 === -1) {
                  dateList.push(item.Delivery_Time)
                  dataList.push(this.createObj(item))
                } else {
                  // 1 待货入库 2 提货入库
                  if (item.Outbound_Mode === '1') dataList[pos1].outSend = item.Cnt
                  if (item.Outbound_Mode === '2') dataList[pos1].outStay = item.Cnt
                }
              }
            })
            return rel
          }
        },
        methods: {
          computeStart () {
            let start = new Date(new Date().valueOf() - 1000 * 3600 * 24 * 3)
            this.startDate = DateFtt('yyyy-MM-dd', start)
//            let toYear = now.getFullYear()
//            let toMonth = now.getMonth() + 1
//            let today = now.getDate()
//            let dayNum = new Date(toYear, toMonth, 0).getDate()
//            if (today <= 5) {
//              this.startDate = DateFtt('yyyy-MM', now) + '-01'
//            } else if (today > 5 && today < (dayNum - 10)) {
//              let startDay = today - 5
//              let startDayStr = ((today - 5) >= 10) ? startDay : '0' + startDay
//              this.startDate = DateFtt('yyyy-MM', now) + '-' + startDayStr
//            } else {
//              this.startDate = DateFtt('yyyy-MM', now) + '-' + (dayNum - 15)
//            }
          },
          parentEvent () {  // 接收父组件传递过来的事件，调用时间轴事件
             this.getData()
          },
          // 获取最早审核列表时间
          getStartTime () {
            return Api.get('JlpGetOutBillFirst', {})
          },
          // 获取数据
          getData () {
            let params = {
              Begin_Date: this.startDate,
              End_Date: this.endDate
            }
            Api.get('JlpGetOutBillList', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.origData = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 组装数据
          createObj (item) {
            let tempObj = {
              outSend: 0,
              outStay: 0
            }
            tempObj.date = item.Delivery_Time
            // 1 待货入库 2 提货入库
            if (item.Outbound_Mode === '1') tempObj.outSend = item.Cnt
            if (item.Outbound_Mode === '2') tempObj.outStay = item.Cnt
            return tempObj
          },
          onChangeDate (startDate) {
            this.startDate = startDate
            this.getData()
          },
          onPoint (date) {
            this.$emit('viewDetail', {
              Con_Id: '%',
              Outbound_Mode: '%',
              Delivery_Time: date === 'hisdata' ? this.startDate : date,
              isHisData: date === 'hisdata'
            })
          },
          goDetail (id, date, type) {
            this.$emit('viewDetail', {
              Con_Id: id,
              Outbound_Mode: type,
              Delivery_Time: date === 'hisdata' ? this.startDate : date,
              isHisData: date === 'hisdata'
            })
          },
          // 初始化
          init () {
            this.computeStart()
            this.getData()
//            this.getStartTime()
//              .then((resp) => {
//                if (resp.Flag) {
//                  if (resp.MsgInfo.length > 0) {
//                    if (!resp.MsgInfo[0].Delivery_Time || resp.MsgInfo[0].Delivery_Time === '0001-01-01') {
//                      return false
//                    }
//                    this.startDate = resp.MsgInfo[0].Delivery_Time
//                  }
//                }
//                this.getData()
//              })
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
</style>
