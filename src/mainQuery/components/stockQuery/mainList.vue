<template>
	<div class="stock main-list">
		<div class="common-condition-box" v-if="consTotal > 1">
			<el-form>
				<el-row>
				  <el-col :span="6">
				  	<el-form-item label="委托方">
							<el-input placeholder="双击选择" :disabled="true" @dblclick.native.prevent="showDialog('1', 'staffCons')" v-model="filterCondition.Con_Name"></el-input>
						</el-form-item>
			  	</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="counts">
			<div class="count-item">
				<el-card class="box-card">
					<div class="box-left">
						<img src="static/image/stockQuery/icon-1.png" alt="">
					</div>
					<div class="box-right">
						<p class="name">库存总件数</p>
						<p class="num">{{ kczjs }}</p>
						<p class="percent">环比上月<span :class="{'el-icon-mo-arrow-up': rate.kczjs > 0, 'el-icon-mo-arrow-down': rate.kczjs < 0}" v-if="rate.kczjs !== 0"></span>{{ rate.kczjs }}%</p>
					</div>
				</el-card>
				<div class="progressbar"></div>
			</div>
			<div class="count-item">
				<el-card class="box-card">
					<div class="box-left">
						<img src="static/image/stockQuery/icon-2.png" alt="">
					</div>
					<div class="box-right">
						<p class="name">库存总品规数</p>
						<p class="num">{{ kcpgs }}</p>
						<p class="percent">环比上月<span :class="{'el-icon-mo-arrow-up': rate.kcpgs > 0, 'el-icon-mo-arrow-down': rate.kcpgs < 0}" v-if="rate.kcpgs !== 0"></span>{{ rate.kcpgs }}%</p>
					</div>
				</el-card>
				<div class="progressbar"></div>
			</div>
			<div class="count-item">
				<el-card class="box-card">
					<div class="box-left">
						<img src="static/image/stockQuery/icon-3.png" alt="">
					</div>
					<div class="box-right">
						<p class="name">合作物流中心数</p>
						<p class="num">{{ hzwlzx }}</p>
						<p class="percent">环比上月<span :class="{'el-icon-mo-arrow-up': rate.hzwlzx > 0, 'el-icon-mo-arrow-down': rate.hzwlzx < 0}" v-if="rate.hzwlzx !== 0"></span>{{ rate.hzwlzx }}%</p>
					</div>
				</el-card>
				<div class="progressbar"></div>
			</div>
			<div class="count-item">
				<el-card class="box-card">
					<div class="box-left">
						<img src="static/image/stockQuery/icon-4.png" alt="">
					</div>
					<div class="box-right">
						<p class="name">库存周转天数</p>
						<p class="num">{{ kczzts }}</p>
						<p class="percent">环比上月<span :class="{'el-icon-mo-arrow-up': rate.kczzts > 0, 'el-icon-mo-arrow-down': rate.kczzts < 0}" v-if="rate.kczzts !== 0"></span>{{ rate.kczzts }}%</p>
					</div>
				</el-card>
				<div class="progressbar"></div>
			</div>
		</div>
		<div class="map">
			<div class="map-left">
				<div ref="chinaMap" class="china-map"></div>
			</div>
			<div class="map-right">
				<div ref="barGraph" class="bar-graph"></div>
				<p v-if="barLdcNames.length === 0"><span>{{ filterCondition.Con_Name }}</span><span>暂无库存数据</span></p>
			</div>
		</div>
		<common-modal ref="staffCons" DialogTitle="委托方信息" :isVisible.sync="showCons" :TableHeader="TableHeader" :listData="cons" :total="bigTotalItems" @confirm="confirm" @search="dialogSearch" @pageChange="consPageChange"></common-modal>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import echarts from 'echarts'
	import 'echarts/map/js/china'
	import commonModal from '@/common/components/common-modal'
	export default {
		name: 'stockMainList',
		data () {
			return {
				geoCoordMap: [], // 描点数据
				barLdcNames: [], // 委托方合作物流中心名称
				barLdcZjs: [], // 委托方合作物流中心总件数
				barLdcZpgs: [], // 委托方合作物流中心总品规数
				lcdCountZjs: [], // 物流中心总件数
				lcdCountZpgs: [], // 物流中心总品规数
				currentPage: 1, // 分页-当前页
				pageSize: 10, // 分页-每页显示数
				bigTotalItems: 0, // 数据总数
				cons: [], // 登录人员所属委托方
				consTotal: 0,
				showCons: false, // 是否现实委托方弹框
				filterCondition: { // 过滤条件
					Con_Id: '',
					Con_Name: ''
				},
				rate: { // 环比上月百分比
					kczjs: 0,
					kcpgs: 0,
					hzwlzx: 0,
					kczzts: 0
				},
				KeyWords: '%', // 委托方弹框搜索关键字
				TableHeader: [ // 委托方弹框
					{
						field: 'Con_No',
						title: '委托方编号'
					},
					{
						field: 'Con_Name',
						title: '委托方名称'
					},
					{
						field: 'Mnemonic_Code',
						title: '助记码'
					}
				],
				kczjs: 0, // 库存总件数
				kcpgs: 0, // 库存品规数
				hzwlzx: 0, // 合作物流中心
				kczzts: 0, // 库存周转天数
				echartObj: {
					mapChart: {},
					barGraphChart: {}
				},
				conStocks: []
			}
		},
		components: {
			commonModal
		},
		methods: {
			showDialog (id, ref) { // 显示弹框
				this.$refs[ref].visible = true
        this.$refs[ref].currentId = id
			},
			confirm (row) { // 带出弹框中选择的数据
				let DialogSelectRow = {}
				for (let item in row) {
					DialogSelectRow = row[item]
				}
				this.filterCondition.Con_Name = DialogSelectRow.Con_Name
				this.filterCondition.Con_Id = DialogSelectRow.Con_Id
				this.getConStock() // 委托方件数统计
				this.getSignPoint() // 委托方合作物流中心描点数据集
			},
			dialogSearch (keyword) { // 委托方弹框搜索
				this.KeyWords = keyword
				this.getCons(false)
			},
			consPageChange (pageNum) {
				this.currentPage = pageNum
				this.getCons(false)
			},
			initMap () { // 初始化中国地图
				this.echartObj.mapChart = echarts.init(this.$refs.chinaMap)
				let option = {
					tooltip: {
						show: false,
            trigger: 'item',
            triggerOn: 'click',
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
		      	itemStyle: {					// 定义样式
	            normal: {					// 普通状态下的样式
	              areaColor: '#e4efff',
	              borderColor: '#8fbcff'
	            },
	            emphasis: {					// 高亮状态下的样式
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
		    this.echartObj.mapChart.setOption(option, true)
		    this.echartObj.mapChart.on('click', (param) => {
		    	if (param.componentType === 'series') {
		    		if (param.seriesType === 'scatter') {
		    			this.barLdcNames = []
							this.barLdcZjs = []
							this.barLdcZpgs = []
							this.conStocks.forEach(item => {
								if (item.Ldc_Id === param.data.Ldc_Id) {
									this.barLdcNames.push(item.Ldc_Name)
									this.barLdcZjs.push(item.kczjs)
									this.barLdcZpgs.push(item.kcpgs)
								}
							})
							this.showTimeline = false
							this.grideBottom = 50
							if (this.barLdcNames.length > 0) {
								this.initBarGraph() // 柱状图
							}
		    		}
		    	}
		    })
		    this.echartObj.mapChart.on('dblclick', (param) => {
		    	if (param.componentType === 'series') {
		    		if (param.seriesType === 'scatter') {
		    			let params = {
						  	Ldc_Id: param.data.Ldc_Id,
						  	Con_Id: this.filterCondition.Con_Id,
						  	Con_Name: this.filterCondition.Con_Name,
						  	TableHeader: JSON.stringify(this.TableHeader)
						  }
			    		this.$router.push({
								name: 'stockItemList',
								params: params
							})
		    		}
		    	}
		    })
			},
			initBarGraph () {
      	this.echartObj.barGraphChart = echarts.init(this.$refs.barGraph)
				let seriesLabel = {
			    normal: {
		        show: true,
		        textBorderColor: '#333',
		        textBorderWidth: 2
			    }
				}
				let option = {
					title: {
				 		left: 10,
				 		top: 7,
		        text: (this.barLdcNames.length > 1) ? (this.filterCondition.Con_Name + '合作物流中心库存数') : (this.barLdcNames[0]),
		        textStyle: {
		        	color: '#999',
		        	fontWeight: 'normal'
		        }
			    },
			    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
	            type: 'shadow'
		        }
			    },
			    legend: {
			    	right: 10,
			    	top: 10,
		        data: ['总件数', '总品规数']
			    },
			    grid: {
		        left: 60,
		        bottom: 80
			    },
			    xAxis: {
		        type: 'category',
		        name: '物流中心',
		        nameLocation: 'start',
		        nameGap: 5,
		        inverse: true,
		        data: this.barLdcNames,
		        axisLabel: {
	            formatter: function (params) {
	            	if (params) {
	            		let newParamsName = ''
			            let paramsNameNumber = params.length
			            let provideNumber = 12
			            let rowNumber = Math.ceil(paramsNameNumber / provideNumber)
			            if (paramsNameNumber > provideNumber) {
		                for (let p = 0; p < rowNumber; p++) {
	                    let tempStr = ''
	                    let start = p * provideNumber
	                    let end = start + provideNumber
	                    if (p === rowNumber - 1) {
	                      tempStr = params.substring(start, paramsNameNumber)
	                    } else {
	                      tempStr = params.substring(start, end) + '\n'
	                    }
	                    newParamsName += tempStr
		                }
			            } else {
		                newParamsName = params
			            }
			            return newParamsName
	            	}
			        },
			        align: 'center',
	            lineHeight: 16,
	            rich: {
                value: {
                  lineHeight: 30
                }
	            }
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        },
		        axisTick: {
		        	length: 10
		        }
		    	},
			    yAxis: {
		        type: 'value',
		        name: '库存数',
		        nameGap: 10,
		        axisLabel: {
	            formatter: '{value}'
		        },
		        axisLine: {
		        	lineStyle: {
		        		color: '#aaa'
		        	}
		        }
			    },
		    	dataZoom: [
		    		{
              show: true,
              start: 1,
              end: 100,
              zoomLock: true
            },
            {
              type: 'inside',
              start: 1,
              end: 100
            },
            {
              show: true,
              xAxisIndex: 0,
              filterMode: 'empty',
              width: 30,
              height: 30,
              minValueSpan: 10,
              showDataShadow: false,
              left: '93%'
            }
        	],
		    	series: [
		    		{
	            name: '总品规数',
	            type: 'bar',
	            label: seriesLabel,
	            barMaxWidth: 80,
	            itemStyle: {
                normal: {
                  color: '#cc91ee'
                }
	            },
	            data: this.barLdcZpgs
		        },
		        {
	            name: '总件数',
	            type: 'bar',
	            label: seriesLabel,
	            barMaxWidth: 80,
	            itemStyle: {
                normal: {
                  color: '#78aeff'
                }
	            },
	            data: this.barLdcZjs
		        }
		    	]
				}
				this.echartObj.barGraphChart.setOption(option, true)
			},
			getSignPoint () {
				this.geoCoordMap = []
				let param = {
					CON_ID: this.filterCondition.Con_Id
				}
				if (this.filterCondition.Con_Id !== '') {
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
							this.initMap() // 地图
						} else {
							this.$alert(res.ErrInfo, '提示', {
								confirmButtonText: '确定'
							})
						}
					})
				} else {
					this.initMap()
				}
			},
			getConStock () {
				this.conStocks = []
				let param = {
					CON_ID: this.filterCondition.Con_Id
				}
				Api.get('DS_KC_GetConStocksByConId', param, true).then((res) => {
					if (res.Flag) {
						this.conStocks = res.MsgInfo
						let kczjs = 0
						let kcpgs = 0
						let hzwlzx = 0
						let kczzts = 0
						this.lcdCountZpgs = []
						this.lcdCountZjs = []
						this.barLdcNames = []
						this.barLdcZjs = []
						this.barLdcZpgs = []
						this.conStocks.forEach(item => {
							// 统计
							if (item.kczjs && item.kczjs != null) {
								kczjs += item.kczjs
							}
							if (item.kcpgs && item.kcpgs != null) {
								kcpgs += item.kcpgs
							}
							if (item.hzwlzx && item.hzwlzx != null) {
								hzwlzx += item.hzwlzx
							}
							if (item.kczzts && item.kczzts != null) {
								kczzts += item.kczzts
							}
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
							// 柱状图数据
							this.barLdcNames.push(item.Ldc_Name)
							this.barLdcZjs.push(item.kczjs)
							this.barLdcZpgs.push(item.kcpgs)
						})
						this.kczjs = kczjs
						this.kcpgs = kcpgs
						this.hzwlzx = hzwlzx
						this.kczzts = kczzts
						this.initBarGraph() // 柱状图
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			getCons (isSetDefaultValue) {
      	let params = {
      		KeyWords: this.KeyWords,
      		StartPage: (this.currentPage - 1) * this.pageSize,
      		EndPage: this.currentPage * this.pageSize
      	}
      	Api.get('DS_KC_GetConsByStaffId', params, false).then((res) => {
      		if (res.Flag) {
      			this.cons = res.MsgInfo
      			if (this.cons.length === 0) {
      				this.bigTotalItems = 0
      			} else {
      				this.bigTotalItems = this.cons[0].TotalPage
      				if (isSetDefaultValue) {
      					this.consTotal = this.cons[0].TotalPage
      					this.filterCondition.Con_Name = this.$route.params.Con_Name
								this.filterCondition.Con_Id = this.$route.params.Con_Id
      				}
      			}
      			this.getConStock() // 委托方件数统计
      			this.getSignPoint() // 委托方合作物流中心描点数据集
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
			init () {
				this.getCons(true) // 登录人员所属委托方
			}
		},
		mounted () {
			console.log(this.$route.params, '主界面传来的值')
			// 初始化
			this.init()
			// 窗口大小改变echarts重绘
			let _this = this
			window.onresize = function () {
        _this.echartObj.mapChart.resize()
        _this.echartObj.barGraphChart.resize()
      }
		}
	}
</script>

<style lang="less">
	.stock{
		.count-item{
			.el-card__body{
				padding: 10px 15px;
			}
		}
		.el-card__body{
			display: flex;
	    align-items: center;
	    height: 106px;
	    box-sizing: border-box;
		}
		.el-form-item{
			width: 100%;
			display: flex;
			margin: 0;
			.el-form-item__content{
				flex: 1;
			}
		}
		.el-select{
			width: 100%;
		}
	}
</style>
<style lang="less" scoped>
	.main-list{
    // height: 100%;
    // min-height: 720px;
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
		.common-condition-box{
			padding: 10px 15px;
			border-radius: 4px;
			box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
		}
		.counts{
			display: flex;
			flex-wrap: nowrap;
			margin-bottom: 20px;
			.count-item{
				&:nth-of-type(1){
					p.name:before{
						background-color: #78aeff;
					}
					p.num{
						color: #78aeff;
					}
				}
				&:nth-of-type(2){
					p.name:before{
						background-color: #cc91ee;
					}
					p.num{
						color: #cc91ee;
					}
				}
				&:nth-of-type(3){
					p.name:before{
						background-color: #f6aa50;
					}
					p.num{
						color: #f6aa50;
					}
				}
				&:nth-of-type(4){
					p.name:before{
						background-color: #7fcf87;
					}
					p.num{
						color: #7fcf87;
					}
				}
				flex: 1;
				margin: 0 10px;
				&:first-child{
					margin-left: 0;
				}
				&:last-child{
					margin-right: 0;
				}
				.box-left{
					flex: 1;
					max-width: 86px;
					img{
						display: block;
						// width: 86px;
						width: 100%;
					}
				}
				.box-right{
					flex: 2;
					padding-left: 30px;
				}
				p{
					margin: 0;
					line-height: 24px;
					&.name{
						padding-left: 18px;
						position: relative;
					}
					&.name:before{
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						margin-top: -4px;
						width: 8px;
						height: 8px;
						border-radius: 4px;
					}
					&.num{
						font-size: 24px;
						color: #489aff;
						margin: 5px 0;
					}
					&.percent{
						span{
					    // margin: 0 8px;
			        font-size: 28px;
    					vertical-align: middle;
					    &.el-icon-mo-arrow-up{
								color: #64d239;
					    }
					    &.el-icon-mo-arrow-down{
					    	color: #fb5c4c;
					    }
						}
					}
				}
			}
		}
		.map{
			display: flex;
			flex: 1;
			.map-left, .map-right{
				border: 1px solid #d1dbe5;
				border-radius: 4px;
				box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
				margin: 0 10px;
				position: relative;
				flex: 2;
			}
			.china-map, .bar-graph{
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
			}
			.map-left{
				margin-left: 0;
		    overflow: hidden;
			}
			.map-right{
				margin-right: 0;
				p{
					display: flex;
					flex-direction: column;
					margin: 0;
  				height: 100%;
			    align-items: center;
  				justify-content: center;
  				font-size: 24px;
  				color: #ccc;
  				line-height: 40px;
  				position: absolute;
  				left: 60px;
  				right: 20px;
  				top: 0;
  				span {
  					display: block;
  					text-align: center;
  				}
				}
			}
		}
	}
</style>
