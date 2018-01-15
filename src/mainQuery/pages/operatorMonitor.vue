<!-- 运营方监控 -->
<template>
	<div class="operatorMonitor common-container">
		<div class="section">
			<div class="item">
				<el-card class="box-card">
				  <p class="title">订单数（个）</p>
				  <p class="count">{{ count.orderNumber.total }}</p>
				  <p class="sort">
				  	<span>自营：{{ count.orderNumber.selfSupport }}</span>
				  	<span>三方：{{ count.orderNumber.thirdParty }}</span>
				  </p>
				</el-card>
				<span class="icon el-icon-mo-orderNumber"></span>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <p class="title">未完成订单数（个）</p>
				  <p class="count">{{ count.unfinishedOrdernumber.total }}</p>
				  <p class="sort">
				  	<span>自营：{{ count.unfinishedOrdernumber.selfSupport }}</span>
				  	<span>三方：{{ count.unfinishedOrdernumber.thirdParty }}</span>
				  </p>
				</el-card>
				<span class="icon el-icon-mo-unfinishedOrdernumber"></span>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <p class="title">未调度订单数（个）</p>
				  <p class="count">{{ count.unscheduledOrdernumber.total }}</p>
				  <p class="sort">
				  	<span>自营：{{ count.unscheduledOrdernumber.selfSupport }}</span>
				  	<span>三方：{{ count.unscheduledOrdernumber.thirdParty }}</span>
				  </p>
				</el-card>
				<span class="icon el-icon-mo-unscheduledOrdernumber"></span>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <p class="title">运营车辆数（辆）</p>
				  <p class="count">{{ count.distributionOfTheCar.total }}</p>
				  <p class="sort">
				  	<span>自营：{{ count.distributionOfTheCar.selfSupport }}</span>
				  	<span>三方：{{ count.distributionOfTheCar.thirdParty }}</span>
				  </p>
				</el-card>
				<span class="icon el-icon-mo-distributionOf-the-car"></span>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <p class="title">总库存（件）</p>
				  <p class="count">{{ count.totalInventory.total }}</p>
				  <p class="sort">
				  	<span>三方：{{ count.totalInventory.thirdParty }}</span>
				  </p>
				</el-card>
				<span class="icon el-icon-mo-Total-inventory"></span>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <p class="title">紧急订单数（个）</p>
				  <p class="count">{{ count.emergencyOrdernumber.total }}</p>
				  <p class="sort">
				  	<span>自营：{{ count.emergencyOrdernumber.selfSupport }}</span>
				  	<span>三方：{{ count.emergencyOrdernumber.thirdParty }}</span>
				  </p>
				</el-card>
				<span class="icon el-icon-mo-emergencyOrdernumber"></span>
			</div>
		</div>
		<div class="section">
			<div class="item">
				<el-card class="box-card">
				  <div slot="header" class="clearfix">
				    <span>客服投诉TOP5</span>
				  </div>
				  <div class="graphContainer">
				  	<div ref="complaintCustomer" class="complaintCustomer"></div>
				  </div>
				  <div class="text item">
				  	<p v-for="item in echartData.complaintCustomer.outsideCircleData" :key="item.name"><span>{{ item.name }}</span><span>{{ item.value }}</span></p>
				  </div>
				</el-card>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <div slot="header" class="clearfix">
				    <span>配送未达标TOP10</span>
				  </div>
				  <div class="graphContainer">
				  	<div ref="notReachStandard" class="notReachStandard"></div>
				  	<p class="noDataStatus" v-if="echartData.notReachStandard.notReachStandardName.length === 0"><span>暂无配送未达标数据</span></p>
				  </div>
				</el-card>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <div slot="header" class="clearfix">
				    <span>冷链温度监控</span>
				  </div>
				  <div class="graphContainer">
				  	<div ref="cctsMonitor" class="cctsMonitor"></div>
				  	<p class="noDataStatus" v-if="echartData.cctsMonitor.name.length === 0"><span>暂无冷链温度数据</span></p>
				  </div>
				  
				</el-card>
			</div>
			<div class="item">
				<el-card class="box-card">
				  <div slot="header" class="clearfix">
				    <span>委托方订单数TOP5</span>
				  </div>
				  <div class="graphContainer">
				  	<div ref="consignorOrder" class="consignorOrder"></div>
				  	<p class="noDataStatus" v-if="echartData.consignorOrder.consignorName.length === 0"><span>暂无委托方订单数据</span></p>
				  </div>
				</el-card>
			</div>
		</div>
		<div class="section">
			<div class="item">
				<el-card class="box-card">
				  <div slot="header" class="clearfix">
				    <span>资源情况</span>
				  </div>
				  <div class="wrapper">
						<div class="item">
							 <div class="graphContainer">
						  	<div ref="vehicle" class="vehicle"></div>
						  	<p class="noDataStatus" v-if="echartData.vehicle.vehicleCount.length === 0"><span>暂无车辆情况数据</span></p>
						  </div>
						</div>
						<div class="item">
							<div class="graphContainer">
						  	<div ref="goodsAllocation" class="goodsAllocation"></div>
						  	<p class="noDataStatus" v-if="echartData.goodsAllocation.insideCircleData.length === 0"><span>暂无货位情况数据</span></p>
						  </div>
						</div>
						<div class="item">
							<div class="graphContainer">
						  	<div ref="stock" class="stock"></div>
						  	<!-- <p class="noDataStatus"><span>暂无库存情况数据</span></p> -->
						  </div>
						</div>
				  </div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import Api from '@/common/js/api'
	export default {
		name: 'operatorMonitor',
		components: {},
		data () {
			return {
				echartObj: {
					complaintCustomer: {},
					notReachStandard: {},
					cctsMonitor: {},
					consignorOrder: {},
					vehicle: {},
					goodsAllocation: {},
					stock: {}
				}, // echarts对象
				count: {
					orderNumber: {
						selfSupport: 0,
						thirdParty: 0,
						total: 0
					},
					unfinishedOrdernumber: {},
					unscheduledOrdernumber: {},
					distributionOfTheCar: {},
					emergencyOrdernumber: {},
					totalInventory: {}
				}, // 汇总数据
				echartData: {
					complaintCustomer: {
						insideCircleData: [
							{
            		value: 679,
            		name: '已处理',
            		itemStyle: {
            			normal: {
            				color: '#88ace8'
            			}
            		}
            	},
              {
              	value: 335,
              	name: '未处理',
              	itemStyle: {
              		normal: {
              			color: '#5884cf'
              		}
              	}
              }
            ],
						outsideCircleData: [
              {
              	value: 10,
              	name: '货物发混',
              	itemStyle: {
              		normal: {
              			color: '#fb9d9b'
              		}
              	}
              },
              {
              	value: 10,
              	name: '货物破损',
              	itemStyle: {
              		normal: {
              			color: '#aed280'
              		}
              	}
              },
              {
              	value: 20,
              	name: '地点送错',
              	itemStyle: {
              		normal: {
              			color: '#b996e3'
              		}
              	}
              },
              {
              	value: 5,
              	name: '单据漏开',
              	itemStyle: {
              		normal: {
              			color: '#8ad4e8'
              		}
              	}
              },
              {
              	value: 30,
              	name: '其它',
              	itemStyle: {
              		normal: {
              			color: '#88ace8'
              		}
              	}
              }
            ]
					},
					consignorOrder: {
						consignorName: [],
						ordersCount: []
					}, // 委托方订单数TOP5
					notReachStandard: {
						notReachStandardName: [],
						notReachStandardCount: []
					}, // 配送未达标TOP10
					totalStock: {
						stockName: [],
						stockCount: []
					}, // 库存情况
					vehicle: {
						vehicleCount: [],
						vehicleAssistCount: []
					}, // 车辆情况
					cctsMonitor: {
						firstOrder: [],
						secondOrder: [],
						thirdOrder: [],
						fourthOrder: [],
						name: [],
						time: []
					}, // 冷链温度监控
					goodsAllocation: {
						insideCircleData: [],
						insideCircleColor: ['#88ace8', '#aed280'],
						outsideCircleData: [],
						outsideCircleColor: ['#5884cf', '#88ace8', '#7ca942', '#aed280']
					} // 货位情况
				} // 图标数据
			}
		},
		computed: {},
		methods: {
			initComplaintCustomer () {
				this.echartObj.complaintCustomer = echarts.init(this.$refs.complaintCustomer)
				let option = {
					tooltip: {
		        trigger: 'item',
		        confine: true,
		        formatter: '{a} <br/>{b}: {c} ({d}%)'
			    },
			    series: [
		        {
	            name: '客服投诉TOP5',
	            type: 'pie',
	            selectedMode: 'single',
	            radius: [0, '50%'],
	            label: {
                normal: {
                  position: 'inner'
                }
	            },
	            labelLine: {
                normal: {
                  show: false
                }
	            },
	            data: this.echartData.complaintCustomer.insideCircleData
		        },
		        {
	            name: '客服投诉TOP5',
	            type: 'pie',
	            radius: ['70%', '85%'],
	            labelLine: {
	            	normal: {
	            		show: false
	            	}
	            },
	            label: {
	            	normal: {
	            		show: false
	            	}
	            },
	            data: this.echartData.complaintCustomer.outsideCircleData
		        }
			    ]
				}
				this.echartObj.complaintCustomer.setOption(option)
			},
			initNotReachStandard () {
				this.echartObj.notReachStandard = echarts.init(this.$refs.notReachStandard)
				let seriesLabel = {
			    normal: {
		        show: true,
		        color: '#fff'
			    }
				}
				let option = {
					color: ['#88ace8'],
					tooltip: {
		        trigger: 'axis',
		        confine: true,
		        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
			    },
					grid: {
		        left: (this.echartData.notReachStandard.notReachStandardName.length > 0) ? 75 : 20,
		        right: 30
			    },
			    xAxis: {
			    	name: '数量',
			    	nameGap: 5,
		        type: 'value',
		        axisLabel: {
	            formatter: '{value}'
		        },
		        splitLine: {
		        	show: false
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        }
			    },
			    yAxis: {
			    	name: '车牌号',
			    	nameGap: 10,
			    	nameLocation: 'start',
		        type: 'category',
		        inverse: true,
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        },
		        data: this.echartData.notReachStandard.notReachStandardName
			    },
			    series: [
		        {
	            name: '配送未达标数',
	            type: 'bar',
	            barWidth: '60%',
	            label: seriesLabel,
	            data: this.echartData.notReachStandard.notReachStandardCount
		        }
			    ]
				}
				this.echartObj.notReachStandard.setOption(option)
			},
			initCctsMonitor () {
				this.echartObj.cctsMonitor = echarts.init(this.$refs.cctsMonitor)
				let symbolSize = 6
				let option = {
					legend: {
		        data: this.echartData.cctsMonitor.name
			    },
			    tooltip: {
            trigger: 'axis',
            confine: true
	        },
	        dataZoom: [
		        {
	            show: true,
	            start: 0,
	            end: 100
		        },
		        {
	            type: 'inside',
	            start: 0,
	            end: 100
		        }
			    ],
					xAxis: {
						name: '时间',
						nameGap: 5,
		        type: 'category',
		        boundaryGap: false,
		        axisLabel: {
		        	formatter: function (params, index) {
                return params.substring(11)
              }
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        },
		        data: this.echartData.cctsMonitor.time
			    },
			    yAxis: {
			    	name: '温度',
			    	nameGap: 5,
		        type: 'value',
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        }
			    },
			    series: [
		        {
		        	name: this.echartData.cctsMonitor.name[0],
	            type: 'line',
	            smooth: true,
	            symbolSize: symbolSize,
	            lineStyle: {
	            	normal: {
	            		color: '#87b4ff'
	            	}
	            },
	            itemStyle: {
	            	normal: {
	            		color: '#87b4ff'
	            	}
	            },
	            data: this.echartData.cctsMonitor.firstOrder
		        },
		        {
		        	name: this.echartData.cctsMonitor.name[1],
	            type: 'line',
	            smooth: true,
	            symbolSize: symbolSize,
	            lineStyle: {
	            	normal: {
	            		color: '#fb9d9b'
	            	}
	            },
	            itemStyle: {
	            	normal: {
	            		color: '#fb9d9b'
	            	}
	            },
	            data: this.echartData.cctsMonitor.secondOrder
		        },
		        {
		        	name: this.echartData.cctsMonitor.name[2],
	            type: 'line',
	            smooth: true,
	            symbolSize: symbolSize,
	            lineStyle: {
	            	normal: {
	            		color: '#9bbb59'
	            	}
	            },
	            itemStyle: {
	            	normal: {
	            		color: '#9bbb59'
	            	}
	            },
	            data: this.echartData.cctsMonitor.thirdOrder
		        },
		        {
		        	name: this.echartData.cctsMonitor.name[3],
	            type: 'line',
	            smooth: true,
	            symbolSize: symbolSize,
	            lineStyle: {
	            	normal: {
	            		color: '#b996e3'
	            	}
	            },
	            itemStyle: {
	            	normal: {
	            		color: '#b996e3'
	            	}
	            },
	            data: this.echartData.cctsMonitor.fourthOrder
		        }
			    ]
				}
				this.echartObj.cctsMonitor.setOption(option)
			},
			initConsignorOrder () {
				this.echartObj.consignorOrder = echarts.init(this.$refs.consignorOrder)
				let option = {
					color: ['#88ace8'],
					tooltip: {
		        trigger: 'axis',
		        confine: true,
		        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
			    },
					grid: {
		        left: (Math.max.apply(null, this.echartData.consignorOrder.ordersCount).toString().length > 2) ? (Math.max.apply(null, this.echartData.consignorOrder.ordersCount).toString().length * 6 + 20) : 25,
		        right: 40
			    },
			    yAxis: {
			    	name: '订单数',
			    	nameGap: 10,
		        type: 'value',
		        axisLabel: {
	            formatter: '{value}'
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        }
			    },
			    xAxis: {
			    	name: '委托方',
			    	nameGap: 5,
		        type: 'category',
		        axisLabel: {
		        	formatter: function (params, index) {
                // return params.substring(0, 2) + '\r\n' + params.substring(2, 4)
                return params.substring(0, 2)
              }
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        },
		        data: this.echartData.consignorOrder.consignorName
			    },
			    series: [
		        {
	            name: '订单数',
	            type: 'bar',
	            barWidth: '60%',
	            data: this.echartData.consignorOrder.ordersCount
		        }
			    ]
				}
				this.echartObj.consignorOrder.setOption(option)
			},
			initVehicle () {
				this.echartObj.vehicle = echarts.init(this.$refs.vehicle)
				let option = {
					title: {
		        text: '车辆情况',
		        textStyle: {
		        	color: '#666',
							fontSize: 12,
							fontWeight: 'normal'
						},
						left: 0,
						top: 0
		    	},
			    tooltip: {
		        trigger: 'axis',
		        confine: true,
		        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        },
		        formatter: function (params) {
	            let tar = params[1]
	            return tar.name + ' : ' + tar.value
		        }
			    },
			    grid: {
		        left: 20,
		        right: 50,
		        top: 30,
		        bottom: 10,
		        containLabel: true
			    },
			    xAxis: {
			    	name: '数量',
		        type: 'value',
		        splitLine: {
		        	show: false
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#666'
		        	}
		        }
			    },
			    yAxis: {
			    	name: '分类',
			    	nameGap: 0,
		        type: 'category',
		        splitLine: {show: false},
		        axisLine: {
		        	lineStyle: {
		        		color: '#666'
		        	}
		        },
		        data: ['空闲车辆', '排车', '在途', '总车辆']
			    },
			    series: [
			    	{
	            type: 'bar',
	            stack: '数量',
	            itemStyle: {
	                normal: {
	                    barBorderColor: 'rgba(0,0,0,0)',
	                    color: 'rgba(0,0,0,0)'
	                },
	                emphasis: {
	                    barBorderColor: 'rgba(0,0,0,0)',
	                    color: 'rgba(0,0,0,0)'
	                }
	            },
	            data: this.echartData.vehicle.vehicleAssistCount
	            // data: [0, 87, 133, 0]
		        },
		        {
	            type: 'bar',
	            stack: '数量',
	            label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
	            },
	            itemStyle: {
                normal: {
                  color: '#88ace8'
                }
	            },
	            data: this.echartData.vehicle.vehicleCount
		        }
			    ]
				}
				this.echartObj.vehicle.setOption(option)
			},
			initGoodsAllocation () {
				this.echartObj.goodsAllocation = echarts.init(this.$refs.goodsAllocation)
				let option = {
					title: {
		        text: '货位情况',
		        textStyle: {
		        	color: '#666',
							fontSize: 12,
							fontWeight: 'normal'
						},
						left: 0,
						top: 0
		    	},
					tooltip: {
		        trigger: 'item',
		        confine: true,
		        formatter: '{a} <br/>{b}: {c} ({d}%)'
			    },
			    series: [
		        {
	            name: '货位情况',
	            type: 'pie',
	            selectedMode: 'single',
	            radius: [0, '45%'],
	            center: ['55%', '52%'],
	            label: {
                normal: {
                  position: 'inner',
                  show: true
                }
	            },
	            labelLine: {
                normal: {
                  show: true
                }
	            },
	            data: this.echartData.goodsAllocation.insideCircleData
		        },
		        {
	            name: '货位情况',
	            type: 'pie',
	            radius: ['65%', '80%'],
	            center: ['55%', '52%'],
	            labelLine: {
	            	normal: {
	            		show: true,
	            		length: 10,
	            		length2: 5,
	            		lineStyle: {
	            			color: '#666'
	            		}
	            	}
	            },
	            label: {
	            	normal: {
	            		show: true,
	            		color: '#666'
	            	}
	            },
	            data: this.echartData.goodsAllocation.outsideCircleData
		        }
			    ]
				}
				this.echartObj.goodsAllocation.setOption(option)
			},
			initstock () {
				this.echartObj.stock = echarts.init(this.$refs.stock)
				let option = {
					title: {
						text: '库存情况',
						textStyle: {
							color: '#666',
							fontSize: 12,
							fontWeight: 'normal'
						},
						left: 0,
						top: 0
					},
					color: ['#88ace8'],
					tooltip: {
		        trigger: 'axis',
		        confine: true,
		        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
			    },
					grid: {
		        left: 90,
		        right: 30,
		        top: 30,
		        bottom: 30
			    },
			    yAxis: {
			    	name: '库存数',
			    	nameGap: 5,
		        type: 'value',
		        axisLabel: {
	            formatter: '{value}'
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#666'
		        	}
		        }
			    },
			    xAxis: {
			    	name: '仓库',
			    	nameGap: 5,
		        type: 'category',
		        axisLine: {
		        	lineStyle: {
		        		color: '#666'
		        	}
		        },
		        data: this.echartData.totalStock.stockName
			    },
			    series: [
		        {
	            name: '库存',
	            type: 'bar',
	            barWidth: '60%',
	            data: this.echartData.totalStock.stockCount
		        }
			    ]
				}
				this.echartObj.stock.setOption(option)
			},
			getBillCount () {
				let params = {
					Operator_Id: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_ONE', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						let index = 0
						for (let field in this.count) {
							for (let i = index; i < data.length; i++) {
								if (data[i].Bill_Identify === '1') {
									this.count[field].selfSupport = data[i].Bill_Count
								} else if (data[i].Bill_Identify === '2') {
									this.count[field].thirdParty = data[i].Bill_Count
								}
								if (i % 2 === 1) {
									if (typeof (this.count[field].selfSupport) !== 'undefined' && typeof (this.count[field].thirdParty) !== 'undefined') {
										this.count[field].total = this.count[field].selfSupport + this.count[field].thirdParty
									}
									index = i + 1
									break
								}
							}
						}
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getTotalStock () {
				let params = {
					Operator_Id: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_TWO', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						this.count.totalInventory.total = this.count.totalInventory.thirdParty = data[0].Total_Stock
						this.echartData.totalStock.stockCount.push(data[0].Total_Stock)
						this.echartData.totalStock.stockName.push(data[0].Ldc_Name)
						this.initstock()
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getConsignorOrder () {
				let params = {
					Operator_Id: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_THREE', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						data.forEach((item) => {
							this.echartData.consignorOrder.consignorName.push(item.Con_Name)
							this.echartData.consignorOrder.ordersCount.push(item.Bill_Count)
						})
						this.initConsignorOrder() // 初始化委托方订单数TOP5
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getVehicle () {
				let params = {
					Operator_ID: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_FORE', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						this.echartData.vehicle.vehicleCount[0] = data[0].FreeCar_Num
						this.echartData.vehicle.vehicleCount[1] = data[0].TransitCar_Num
						this.echartData.vehicle.vehicleCount[2] = data[0].LineCar_Num
						this.echartData.vehicle.vehicleCount[3] = data[0].TotalCar_Num
						this.echartData.vehicle.vehicleAssistCount[0] = 0
						this.echartData.vehicle.vehicleAssistCount[1] = data[0].FreeCar_Num
						this.echartData.vehicle.vehicleAssistCount[2] = data[0].FreeCar_Num + data[0].TransitCar_Num
						this.echartData.vehicle.vehicleAssistCount[3] = 0
						this.initVehicle()
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getGoodsAllocation () {
				let params = {
					Operator_Id: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_FIVE', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						data.forEach((item, index) => {
							let insideObj = {
								value: item.KXS + item.ZYS,
								name: item.HW_TYPE,
								itemStyle: {
            			normal: {
            				color: this.echartData.goodsAllocation.insideCircleColor[index]
            			}
            		}
							}
							this.echartData.goodsAllocation.insideCircleData.push(insideObj)
							let i = index
							if (index !== 0) {
								i = i + 1
							}
							for (let key in item) {
								if (key !== 'HW_TYPE' && key !== 'Ldc_Name') {
									let outsideObj = {
										value: item[key],
										name: (key === 'KXS') ? (item.HW_TYPE + '空闲') : (item.HW_TYPE + '占用货位'),
										itemStyle: {
	                		normal: {
	                			color: this.echartData.goodsAllocation.outsideCircleColor[i]
	                		}
	                	}
									}
									this.echartData.goodsAllocation.outsideCircleData.push(outsideObj)
									i = i + 1
								}
							}
						})
						this.initGoodsAllocation()
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getCctsMonitorOrder () {
				let params = {
					OPERATOR_ID: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_SIX', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						let index = 0
						for (let key in this.echartData.cctsMonitor) {
							for (let i = index; i < data.length; i++) {
								let tempParams = {
									SB_ID: data[i].SB_ID,
									CT_START_DATE: data[i].CT_START_DATE,
									CT_END_DATE: data[i].CT_END_DATE
								}
								this.echartData.cctsMonitor.name.push(data[i].YEWDJ_NO)
								this.getCctsMonitorTemp(tempParams, key)
								index = i + 1
								break
							}
						}
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getCctsMonitorTemp (params, key) {
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_SEVEN', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						let flag = true
						if (this.echartData.cctsMonitor.time.length > 0) {
							flag = false
						}
						data.forEach((item) => {
							this.echartData.cctsMonitor[key].push(item.WD_DATA_UPT)
							if (flag) {
								this.echartData.cctsMonitor.time.push(item.CJ_DATE)
							}
						})
						this.initCctsMonitor()
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getNotReachStandard () {
				let params = {
					Operator_Id: Api.userInfo.Operator_Id
				}
				Api.get('DS_JLP_OPERATORMONITOR_GETMAINDATA_EIGHT', params, false).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						data.forEach((item) => {
							this.echartData.notReachStandard.notReachStandardName.push(item.Vehicle_No)
							this.echartData.notReachStandard.notReachStandardCount.push(item.dif)
						})
						console.log(this.echartData.notReachStandard.notReachStandardName)
						this.initNotReachStandard()
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			init () {
				this.initComplaintCustomer()
				// 汇总数据
				this.getBillCount()
				this.getTotalStock()
				// 配送未达标TOP10
				this.getNotReachStandard()
				// 冷链温度监控
				this.getCctsMonitorOrder()
				// 委托方订单数TOP5
				this.getConsignorOrder()
				// 车辆情况
				this.getVehicle()
				// 货位情况
				this.getGoodsAllocation()
			}
		},
		created () {
		},
		mounted () {
			this.init()
			// 窗口大小改变echarts重绘
			let _this = this
			window.onresize = function () {
				if (_this.echartObj.complaintCustomer.id) {
					_this.echartObj.complaintCustomer.resize()
				}
        if (_this.echartObj.notReachStandard.id) {
        	_this.echartObj.notReachStandard.resize()
        }
        if (_this.echartObj.cctsMonitor.id) {
        	_this.echartObj.cctsMonitor.resize()
        }
        if (_this.echartObj.consignorOrder.id) {
        	_this.echartObj.consignorOrder.resize()
        }
        if (_this.echartObj.vehicle.id) {
        	_this.echartObj.vehicle.resize()
        }
        if (_this.echartObj.goodsAllocation.id) {
        	_this.echartObj.goodsAllocation.resize()
        }
        if (_this.echartObj.stock.id) {
        	_this.echartObj.stock.resize()
        }
      }
		}
	}
</script>

<style lang="less" scoped>
	.operatorMonitor {
		padding: 10px 5px;
		display: flex;
		flex-direction: column;
		p {
			margin: 0;
			line-height: 22px;
		}
		.section {
			display: flex;
			margin-bottom: 10px;
			.item {
				flex: 1;
				margin: 0 5px;
				position: relative;
				p {
					&.title {
						color: #333;
					}
					&.count {
						font-size: 18px;
						line-height: 34px;
						height: 34px;
					}
					&.sort {
						overflow: hidden;
						span:nth-of-type(1) {
							float: left;
						}
						span:nth-of-type(2) {
							float: right;
						}
					}
				}
				.icon {
					position: absolute;
					font-size: 32px;
					right: 15px;
					top: 18px;
				}
				&:nth-of-type(1) {
					p {
						&.count {
							color: #9e74d1;
						}
					}
					.icon {
						color: #9e74d1;
					}
				}
				&:nth-of-type(2) {
					p {
						&.count {
							color: #eaad08;
						}
					}
					.icon {
						color: #eaad08;
					}
				}
				&:nth-of-type(3) {
					p {
						&.count {
							color: #23b691;
						}
					}
					.icon {
						color: #23b691;
					}
				}
				&:nth-of-type(4) {
					p {
						&.count {
							color: #80af43;
						}
					}
					.icon {
						&:before {
							color: #80af43;
						}
					}
				}
				&:nth-of-type(5) {
					p {
						&.count {
							color: #489aff;
						}
					}
					.icon {
						top: 13px;
						color: #489aff;
					}
				}
				&:nth-of-type(6) {
					p {
						&.count {
							color: #eb8684;
						}
					}
					.icon {
						color: #eb8684;
					}
				}
			}
			&:nth-last-of-type(1) {
				margin-bottom: 0;
			}
		}
		.graphContainer {
			position: relative;
			width: 100%;
			height: 100%;
			& > div {
				position: absolute!important;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
			}
		}
	}
</style>

<style lang="less">
	.operatorMonitor {
		.el-card {
			height: 100%;
		}
		.el-card__header {
			font-size: 14px;
			padding: 0 10px;
			line-height: 28px;
			color: #333;
			background-color: #f0f5fe;
		}
		.el-card__body {
			padding: 10px;
			position: relative;
		}
		.section {
			&:nth-of-type(2) {
				// flex: 1;
				height: 388px;
				.el-card {
					display: flex;
					flex-direction: column;
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
				}
				.el-card__body {
					flex: 1;
					.graphContainer { 
						.complaintCustomer {
							position: absolute!important;
							left: 0;
							top: 0;
							right: 0;
							bottom: 0;
						}
						& + div {
							p {
								display: inline-block;
								width: 49%;
								color: #333;
								line-height: 30px;
								text-align: center;
								span {
									margin-right: 10px;
									display: inline-block;
									&:nth-of-type(1) {
										text-align: right;
										min-width: 48px;
									}
								}
							}
						}
					}
					.notReachStandard, .consignorOrder, .cctsMonitor {
						height: 100%;
						position: absolute!important;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
					}
				}
				& > .item:nth-of-type(1) {
					.graphContainer {
						height: 70%;
						position: absolute!important;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
					}
					.el-card__body > div:nth-of-type(2) {
						top: 70%;
					}
				}
			}
			&:nth-of-type(3) {
				// height: 200px;
				flex: 1;
				.el-card {
					display: flex;
					flex-direction: column;
					position: absolute!important;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
				}
				.el-card__body {
					flex: 1;
					padding: 0 10px;
				}
				.wrapper {
					display: flex;
					height: 100%;
					position: absolute!important;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					.item {
						&:nth-of-type(1) {
							flex: 3;
						}
						&:nth-of-type(2) {
							flex: 2;
						}
						&:nth-of-type(3) {
							flex: 3;
						}
						.vehicle, .goodsAllocation, .stock {
							height: 100%;
							position: absolute!important;
							left: 0;
							right: 0;
							top: 0;
							bottom: 0;
						}
					}
				}
			}
		}
		.noDataStatus {
			display: flex;
			flex-direction: column;
			margin: 0;
			height: 100%;
	    align-items: center;
			justify-content: center;
			font-size: 20px;
			color: #ccc;
			line-height: 40px;
			position: absolute;
			left: 20px;
			right: 20px;
			top: 0;
			span {
				display: block;
				text-align: center;
			}
		}
	}
</style>