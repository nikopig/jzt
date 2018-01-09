<template>
    <div class="datePickerLh" ref="datePickerLh">
        <div class="head clearfix">
            <div class="form">
                <div class="block2">
                  <!--<span class="demonstration">月</span>-->
                  <el-date-picker
                    v-model="datePickerMonth"
                    type="month"
                    placeholder="选择年月" @change="selectTime">
                  </el-date-picker>
                </div>
            </div>
            <div class="tip">
                <div class="totle">总订单数</div>
                <div class="done">已完成</div>
            </div>
        </div>
        <div class="main">
            <div class="gridHead">
                <div class="grid" ref="headGrid">周一</div>
                <div class="grid">周二</div>
                <div class="grid">周三</div>
                <div class="grid">周四</div>
                <div class="grid">周五</div>
                <div class="grid rest">周六</div>
                <div class="grid rest">周日</div>
            </div>
            <div class="gridMiddle" ref="gridMiddle">
                <div class="grid" v-for="item in initialData" :class="{gray: item.isLastMonth,activeP:item.Invoice_Time === getNowDate(), rest:!!item.isWeek?item.isWeek:''}"  :style="{width: gridWidth2 +'px'}">
                <!-- :class="{gray: item.isLastMonth,activeP:item.date==='29',rest:!!item.isRest?item.isRest:''}" -->
                <!--, maxWidth: maxWidth2===420}-->
                    <span class="date" :class="{active:item.Invoice_Time === getNowDate()}">{{item.Day}}</span>
                    <div class="order">
                        <el-popover
                            placement="bottom-start"
                            width="260"
                            trigger="hover">
                            <div class="histogram">
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.ZDD_TH_Num<10}" :style="{bottom:(item.ZDD_TH_Num + 3) + 'px'}">{{item.ZDD_TH_Num}}</p>
                                        <div :style="{height:item.ZDD_TH_Num + 'px'}" style="background:#DAE5FF"></div>
                                    </div>
                                    <div class="type">提货</div>
                                </div>
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.ZDD_PS_Num<10}" :style="{bottom:(item.ZDD_PS_Num + 3) + 'px'}">{{item.ZDD_PS_Num}}</p>
                                        <div :style="{height:item.ZDD_PS_Num + 'px'}" style="background:#FDB44D"></div>
                                    </div>
                                    <div class="type">配送</div>
                                </div>
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.ZDD_GX_Num<10}" :style="{bottom:(item.ZDD_GX_Num + 3) + 'px'}">{{item.ZDD_GX_Num}}</p>
                                        <div :style="{height:item.ZDD_GX_Num + 'px'}" style="background:#4786FF"></div>
                                    </div>
                                    <div class="type">干线</div>
                                </div>
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.ZDD_YC_Num<10}" :style="{bottom:(item.ZDD_YC_Num + 3) + 'px'}">{{item.ZDD_YC_Num}}</p>
                                        <div :style="{height:item.ZDD_YC_Num + 'px'}" style="background:#FA607E"></div>
                                    </div>
                                    <div class="type">异常</div>
                                </div>
                            </div>
                            <el-button v-if="item.ZDD_Num !== undefined" :style="{width:item.ZDD_Num + 'px', paddingRight:(item.ZDD_Num +10) + 'px'}" class="totle2" slot="reference">{{item.ZDD_Num}}</el-button>
                        </el-popover>
                        <el-popover
                            placement="bottom-start"
                            width="260"
                            trigger="hover">
                            <div class="histogram">
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.YWC_TH_Num<10}" :style="{bottom:(item.YWC_TH_Num + 3) + 'px'}">{{item.YWC_TH_Num}}</p>
                                        <div :style="{height:item.YWC_TH_Num + 'px'}" style="background:#DAE5FF"></div>
                                    </div>
                                    <div class="type">提货</div>
                                </div>
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.YWC_PS_Num<10}" :style="{bottom:(item.YWC_PS_Num + 3) + 'px'}">{{item.YWC_PS_Num}}</p>
                                        <div :style="{height:item.YWC_PS_Num + 'px'}" style="background:#FDB44D"></div>
                                    </div>
                                    <div class="type">配送</div>
                                </div>
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.YWC_GX_Num<10}" :style="{bottom:(item.YWC_GX_Num + 3) + 'px'}">{{item.YWC_GX_Num}}</p>
                                        <div :style="{height:item.YWC_GX_Num + 'px'}" style="background:#4786FF"></div>
                                    </div>
                                    <div class="type">干线</div>
                                </div>
                                <div class="col">
                                    <div class="gram">
                                        <p class="num" :class="{one:item.YWC_YC_Num<10}" :style="{bottom:(item.YWC_YC_Num + 3) + 'px'}">{{item.YWC_YC_Num}}</p>
                                        <div :style="{height:item.YWC_YC_Num + 'px'}" style="background:#FA607E"></div>
                                    </div>
                                    <div class="type">异常</div>
                                </div>
                            </div>
                            <el-button v-if="item.YWC_Num !== undefined" :style="{width:item.YWC_Num + 'px', paddingRight:(item.YWC_Num +10) + 'px'}" class="done2" slot="reference">{{item.YWC_Num}}</el-button>
                        </el-popover>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt, floatAdd } from '@/common/js/utils'

    export default {
        name: 'datePicker',
        props: {
            conId: {
                type: String,
                default: '023750b4baafe711b639000c29d6c8f4'
            }
        },
        components: {},
        data () {
            return {
                consignor: this.conId,
                nowDate: new Date(),
                datePickerMonth: new Date(),
                gridWidth: '',
                maxWidth: '',
                initialData: [],
                startTime: '',
                endTime: '',
                weekData: [6, 0, 1, 2, 3, 4, 5],
                workOrderData: []
                /*workOrderData: [
                    {
                        index: 1,
                        date: '27',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: true,
                        isRest: false,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ],
                        doneItem: [
                            {
                                type: '提货',
                                num: 2,
                                color: '#DAE5FF',
                                totle: 12,
                                percentage: 2
                            },
                            {
                                type: '干线',
                                num: 6,
                                color: '#FDB44D',
                                totle: 12,
                                percentage: 6
                            },
                            {
                                type: '配送',
                                num: 3,
                                color: '#4786FF',
                                totle: 12,
                                percentage: 3
                            },
                            {
                                type: '异常',
                                num: 1,
                                color: '#FA607E',
                                totle: 12,
                                percentage: 1
                            }
                        ]
                    },
                    {
                        index: 2,
                        date: '28',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: true,
                        isRest: false,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ],
                        doneItem: [
                            {
                                type: '提货',
                                num: 2,
                                color: '#DAE5FF',
                                totle: 12,
                                percentage: 2
                            },
                            {
                                type: '干线',
                                num: 6,
                                color: '#FDB44D',
                                totle: 12,
                                percentage: 6
                            },
                            {
                                type: '配送',
                                num: 3,
                                color: '#4786FF',
                                totle: 12,
                                percentage: 3
                            },
                            {
                                type: '异常',
                                num: 1,
                                color: '#FA607E',
                                totle: 12,
                                percentage: 1
                            }
                        ]
                    },
                    {
                        index: 3,
                        date: '29',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: true,
                        isRest: false,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ]
                    },
                    {
                        index: 4,
                        date: '30',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: true,
                        isRest: false,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ],
                        doneItem: [
                            {
                                type: '提货',
                                num: 2,
                                color: '#DAE5FF',
                                totle: 12,
                                percentage: 2
                            },
                            {
                                type: '干线',
                                num: 6,
                                color: '#FDB44D',
                                totle: 12,
                                percentage: 6
                            },
                            {
                                type: '配送',
                                num: 3,
                                color: '#4786FF',
                                totle: 12,
                                percentage: 3
                            },
                            {
                                type: '异常',
                                num: 1,
                                color: '#FA607E',
                                totle: 12,
                                percentage: 1
                            }
                        ]
                    },
                    {
                        index: 5,
                        date: '1',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: false,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ],
                        doneItem: [
                            {
                                type: '提货',
                                num: 2,
                                color: '#DAE5FF',
                                totle: 12,
                                percentage: 2
                            },
                            {
                                type: '干线',
                                num: 6,
                                color: '#FDB44D',
                                totle: 12,
                                percentage: 6
                            },
                            {
                                type: '配送',
                                num: 3,
                                color: '#4786FF',
                                totle: 12,
                                percentage: 3
                            },
                            {
                                type: '异常',
                                num: 1,
                                color: '#FA607E',
                                totle: 12,
                                percentage: 1
                            }
                        ]
                    },
                    {
                        index: 6,
                        date: '2',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ],
                        doneItem: [
                            {
                                type: '提货',
                                num: 2,
                                color: '#DAE5FF',
                                totle: 12,
                                percentage: 2
                            },
                            {
                                type: '干线',
                                num: 6,
                                color: '#FDB44D',
                                totle: 12,
                                percentage: 6
                            },
                            {
                                type: '配送',
                                num: 3,
                                color: '#4786FF',
                                totle: 12,
                                percentage: 3
                            },
                            {
                                type: '异常',
                                num: 1,
                                color: '#FA607E',
                                totle: 12,
                                percentage: 1
                            }
                        ]
                    },
                    {
                        index: 7,
                        date: '3',
                        totleOrders: 100,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true,
                        totleItem: [
                            {
                                type: '提货',
                                num: 50,
                                color: '#DAE5FF',
                                totle: 100,
                                percentage: 50
                            },
                            {
                                type: '干线',
                                num: 15,
                                color: '#FDB44D',
                                totle: 100,
                                percentage: 15
                            },
                            {
                                type: '配送',
                                num: 30,
                                color: '#4786FF',
                                totle: 100,
                                percentage: 30
                            },
                            {
                                type: '异常',
                                num: 5,
                                color: '#FA607E',
                                totle: 100,
                                percentage: 5
                            }
                        ],
                        doneItem: [
                            {
                                type: '提货',
                                num: 2,
                                color: '#DAE5FF',
                                totle: 12,
                                percentage: 2
                            },
                            {
                                type: '干线',
                                num: 6,
                                color: '#FDB44D',
                                totle: 12,
                                percentage: 6
                            },
                            {
                                type: '配送',
                                num: 3,
                                color: '#4786FF',
                                totle: 12,
                                percentage: 3
                            },
                            {
                                type: '异常',
                                num: 1,
                                color: '#FA607E',
                                totle: 12,
                                percentage: 1
                            }
                        ]
                    },
                    {
                        index: 8,
                        date: '4',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 9,
                        date: '5',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 10,
                        date: '6',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 11,
                        date: '7',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 12,
                        date: '8',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 13,
                        date: '9',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 14,
                        date: '10',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 15,
                        date: '11',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 16,
                        date: '12',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '13',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '14',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '15',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '16',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 17,
                        date: '17',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 17,
                        date: '18',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '19',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '20',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '21',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '22',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '23',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 17,
                        date: '24',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 17,
                        date: '25',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '26',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '27',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '28',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '29',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false
                    },
                    {
                        index: 17,
                        date: '30',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    },
                    {
                        index: 17,
                        date: '31',
                        totleOrders: 123,
                        doneOrders: 12,
                        isLastMonth: false,
                        isRest: true
                    }
                ]*/
            }
        },
        watch: {
            conId (val) {
                this.consignor = val
                this.getDatePicker()
            }
        },
        methods: {
            getNowDate () {  //获取当前年月日
                let nowyear = this.nowDate.getFullYear()
                let nowmonth = this.nowDate.getMonth() + 1
                let nowdate = this.nowDate.getDate()
                if (nowmonth < 10) {
                    nowmonth = '0' + nowmonth
                }
                if (nowdate < 10) {
                    nowdate = '0' + nowdate
                }
                return nowyear + '-' + nowmonth + '-' + nowdate
            },
            selectTime () {
                console.log(this.datePickerMonth.getMonth() + 1, '选择框选中的数据的月份')
                let year = this.datePickerMonth.getFullYear()
                let mon = this.datePickerMonth.getMonth() + 1
                this.getCalemder(year, mon)
            },
            getDatePicker (dataArry) {
                console.log(dataArry, '何承熹')
                let params = {
                    Con_Id: this.conId ? this.conId : '%',
                     //Con_Id: '%',
                    StartTime: this.startTime,
                    EndTime: this.endTime
                }
                Api.get('TmpWTFGetBillTransportADtlZYZHZ', params).then(res => {
                  if (res.Flag) {
                    this.workOrderData = res.MsgInfo
                    console.log(this.workOrderData, '接口请求到的数据')
                    this.workOrderData.forEach((itme) => {
                        itme.Day = dataArry[itme.Invoice_Time].Day
                        itme.isLastMonth = dataArry[itme.Invoice_Time].isLastMonth
                        itme.isWeek = dataArry[itme.Invoice_Time].isWeek
                        dataArry[itme.Invoice_Time] = itme
                    })
                    for (let key in dataArry) {
                        dataArry[key].Invoice_Time = key
                        this.initialData.push(dataArry[key])
                    }
                    this.$emit('grossData', this.workOrderData)
                    console.log(this.initialData, '页面上展示的日历数据')
                  } else {
                    for (let key in dataArry) {
                        this.initialData.push(dataArry[key])
                    }
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            getCalemder (year, mon) {
                this.initialData = []
                this.startTime = ''
                this.endTime = ''
                var TheMon = {'Year': year, 'Mon': mon} //当月
                var LastMon = this.getLastMon(TheMon) //上一个月
                var NextMon = this.getNextMon(TheMon)  //下个月
                var TheMonDay = this.getDateMonDay(TheMon)  //当月多少天
                var LastMonDay = this.getDateMonDay(LastMon) //上个月多少天
                var theMonWeek = this.weekData[new Date(TheMon.Year + '-' + TheMon.Mon + '-01').getDay()] //判断属于星期几，然后获取当月的1号是在date数组中，下标是多少
                var EndDayNum = TheMonDay + theMonWeek
                var dataArry = []
                for (var i = 0; i < 42; i++) {
                    var data = ''
                    var isLastMonth = true //判断是上月或下月就为true，是当月就为false
                    var isWeek = false  //判断是不是周末，是周末就为true，不是就为false
                    var day = i + 1 //因为数组从0 开始,为了对应天数，所以需要加1
                    if (i < theMonWeek) {
                        day = LastMonDay - theMonWeek + day
                        data = this.getDateString(LastMon, day)
                        isLastMonth = true
                        isWeek = false
                    } else if (theMonWeek <= i && i < EndDayNum) {
                        day = day - theMonWeek
                        data = this.getDateString(TheMon, day)
                        isLastMonth = false
                        if (new Date(data).getDay() === 6 || new Date(data).getDay() === 0) {
                            isWeek = true
                        }
                    } else if (EndDayNum <= i) {
                        day = day - EndDayNum
                        data = this.getDateString(NextMon, day)
                        this.endTime = data
                        isLastMonth = true
                        isWeek = false
                    }
                    dataArry[data] = {'Day': day, 'isLastMonth': isLastMonth, 'isWeek': isWeek}
                    // this.initialData[data] = {'Day': day}
                }
                this.startTime = LastMon.Year + '-' + LastMon.Mon + '-' + (LastMonDay - theMonWeek + 1)
                // this.endTime = NextMon.Year + '-' + NextMon.Mon + '-' + dataArry[41]
                this.getDatePicker(dataArry)
            },
            getDateString (date, day) {
                var nweDay = day
                var nweMon = date.Mon
                if (day < 10) {
                    nweDay = '0' + day
                }
                if (date.Mon < 10) {
                    nweMon = '0' + date.Mon
                }
                return date.Year + '-' + nweMon + '-' + nweDay
            },
            getLastMon (TheMon) { //上一个月
                var reult = {}
                var month = TheMon.Mon - 1
                var year = TheMon.Year
                if (TheMon.Mon > 1 && TheMon.Mon <= 12) {
                    month = TheMon.Mon - 1
                } else if (TheMon.Mon === 1) {
                    year = TheMon.Year - 1
                    month = 12
                }
                reult.Mon = month
                reult.Year = year
                return reult
            },
            getNextMon (TheMon) {  //下一个月
                var reult = {}
                var month = TheMon.Mon + 1
                var year = TheMon.Year
                if (TheMon.Mon > 1 && TheMon.Mon < 12) {
                    month = TheMon.Mon + 1
                } else if (TheMon.Mon === 12) {
                    year = TheMon.Year + 1
                    month = 1
                }
                reult.Mon = month
                reult.Year = year
                return reult
            },
            getDateMonDay (curDate) {  //一个月有多少天
                var monthDay = new Date(curDate.Year, curDate.Mon, 0)
                /* 返回当月的天数 */
                return monthDay.getDate()
            },
            init () {
                let year = this.datePickerMonth.getFullYear()
                let mon = this.datePickerMonth.getMonth() + 1
                this.getCalemder(year, mon)
            }
        },
        created () {
        },
        mounted () {
            this.gridWidth = this.$refs.headGrid.getBoundingClientRect().width
            this.maxWidth = this.$refs.datePickerLh.getBoundingClientRect().width
            const that = this
            window.onresize = () => {
                return (() => {
                    that.gridWidth = that.$refs.headGrid.getBoundingClientRect().width
                    that.maxWidth = that.$refs.datePickerLh.getBoundingClientRect().width
                })()
            }
            this.init()
        },
        computed: {
            gridWidth2 () {
                return this.gridWidth - 0.1
            },
            maxWidth2 () {
                return this.maxWidth
            }
        }
    }
</script>
<style lang="less" scoped>
    .clearfix:after{
        content:".";
        display:block;
        height:0;
        clear:both;
        visibility:hidden
    }
    .datePickerLh{
        min-width: 400px;
        //overflow-x: scroll;
        padding:10px;
        background:#F4F6F9;
        .block2{
            display:inline-block;
            margin-right: 10px;
            .demonstration{
                font-size:14px;
            }
        }
        .form{
            float:left;
        }
        .totle:before, .done:before{
            content:'';
            display:inline-block;
            position:relative;
            top:3px;
        }
        .totle:before{
            background:#DAE7FF;
            border-left:1px solid #548FFF;
        }
        .done:before{
            background:#FDC5D0;
            border-left:1px solid #F9859C;
        }
        .tip{
            float:right;
            font-size: 12px;
            color: #656567;
            .totle, .done{
                display:inline-block;
            }
           .totle {
                margin-right:20px;
           }
           .totle:before, .done:before{
                width:15px;
                height:15px;
                margin-right:10px;
                border-radius:0 3px 3px 0;
           }
        }
        .main{
            margin-top:10px;
            background-color: #fff;
            border:1px solid #ddd;
            .gridHead, .gridMiddle{
                // width:1000px;
                display: flex;
                align-items:center;
            }
            .gridHead{
                height:24px;
                // line-height:50px;
                text-align:center;
                .grid{
                    flex: 1;
                }
                .rest{
                    color:red;
                }
            }
            .gridMiddle{
                flex-wrap: wrap;
                .grid{
                    height:62px;
                    position:relative;
                    border:1px solid #ddd;
                    border-width:1px 1px 0 0;
                    flex: 0 1 auto;
                    box-sizing: border-box;
                    align-items:center;
                    display:flex;
                }
                .grid:nth-of-type(7n){
                    border-right:0;
                }
                .order{
                    align-items:center;
                    justify-content: center;
                    margin: auto 0;
                }
                .activeP{
                    background:#EEF1F6;
                }
                .gray{
                    // opacity:0.6;
                    background:transparent;
                    color: #ccc;
                    .order{
                        //display:none;
                    }
                    .active{
                        background:transparent;
                    }
                }
                .rest{
                    .date{
                        color:red;
                    }
                }
                .maxWidth{
                    max-width:56.85px;
                }
                .date{
                    width: 14px;
                    height: 14px;
                    line-height: 14px;
                    text-align: center;
                    padding:3px;
                    position:absolute;
                    right:3px;
                    top:0;
                    border-radius:50%;
                }
                .active{
                    // background:#4786FF;
                    // color:#fff;
                }
                .totle2, .done2{
                    display: block;
                    width:auto;
                    padding:0 10px 0 5px;
                    height:16px;
                    line-height:16px;
                    border-radius:0 3px 3px 0;
                    border-width: 0 0 0 1px;
                }
                .totle2{
                    margin:0 0 5px 10px;
                    border-left:1px solid #548FFF;
                    background:#DAE7FF;
                    color:#6094FF;
                }
                .done2{
                    margin:0 0 0 10px;
                    border-left:1px solid #F9859C;
                    background:#FDC5D0;
                    color:#FA758E;
                }
            }
        }
    }
    .histogram{
        display:flex;
        .col{
            margin: 0 20px;
            flex: 1;
            align-items: flex-end;
            .num{
                position:absolute;
                // line-height: 0;
            }
            .one{
                left: 5px;
            }
            .gram{
                width: 20px;
                height:100px;
                margin-bottom:5px;
                position:relative;
                div{
                    position:absolute;
                    bottom:0;
                    left:0;
                    width: 20px;
                }
            }
        }
    }
</style>
