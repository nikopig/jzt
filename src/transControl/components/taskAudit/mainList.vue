<template>
	<div class="taskAudit main-list">
		<div class="common-condition-box">
			<el-form :inline="true">
				<el-row :gutter="20">
				  <el-col :span="7">
				  	<el-form-item label="上级运营商">
							<el-input placeholder="双击选择" :disabled="true" icon="close" :on-icon-click="deleteSuper" v-model="filterCondition.Super_Operator_Name" @dblclick.native="showDialog('1', 'superOperator')"></el-input>
						</el-form-item>
				  </el-col>
				  <el-col :span="5">
				  	<el-form-item label="指派开始日期">
							<el-date-picker type="date" placeholder="选择日期" v-model="filterCondition.Start_Time"></el-date-picker>
						</el-form-item>
				  </el-col>
				  <el-col :span="5">
				  	<el-form-item label="指派结束日期">
							<el-date-picker type="date" placeholder="选择日期" v-model="filterCondition.End_Time"></el-date-picker>
						</el-form-item>
				  </el-col>
				  <el-col :span="6">
				  	<el-form-item>
							<el-button type="primary" size="small" @click="getData">查询</el-button>
						</el-form-item>
				  </el-col>
				</el-row>
			</el-form>
		</div>
		<div class="toolbar">
			<div class="btn-box">
				<el-button type="text" icon="mo-displayHiddendata" @click.native="crossAudit">审核进入调度</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="mo-submit" @click.native="rejectAudit">返回上级运营商</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="mo-transportationAudit" @click.native="enterRowCar">审核进入排车</el-button>
			</div>
		</div>
		<div class="table-box">
			<div class="common-collapse">
				<div class="summary" v-for="(o, index) in fieldData" :key="index">
					<el-card class="box-card">
					  <div slot="header" class="clearfix">
					    <el-checkbox v-model="o.checked" @change="single(o, fieldData)"></el-checkbox>
					    <span class="text">委托单号：{{ o.TransportEntrust_No }}</span>
					    <span class="text">上级运营商：{{ o.Superior_Operator_Name }}</span>
					  </div>
					  <div class="content">
					  	<commonPane :fieldName="fieldName[0].level_1" :paneData="o" :paneDataIndex="index" :detailShow="o.detailShow" @detail-statu-change="showDetail" :iconName="o.iconName" @pane-data-change="paneDataChange"></commonPane>
					  </div>
					</el-card>
					<div class="detail" v-if="o.detail && o.detail.length > 0" v-show="o.detailShow">
						<el-table :data="o.detail" style="width: 100%">
							<el-table-column type="index" width="50"></el-table-column>
				      <el-table-column v-for="(item, detailIndex) in fieldName[1].level_2" :key="detailIndex" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
				    </el-table>
				  </div>
				</div>
				<div class="block">
			    <el-pagination
			      @current-change="handleCurrentChange"
			      :current-page.sync="currentPage"
			      :page-size="pageSize"
			      layout="prev, pager, next, jumper"
			      :total="bigTotalItems">
			    </el-pagination>
			  </div>
			</div>
		</div>
		<common-modal ref="superOperator" DialogTitle="上级运营商信息" :isVisible.sync="showSuperOperator" :TableHeader="TableHeader" :listData="copyTableListData" :total="TableListData.length" @confirm="confirm" :isPages="isPages" @search="dialogSearch"></common-modal>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import {Bus, Types} from '@/common/js/bus'
	import {DateFtt} from '@/common/js/utils'
	import commonPane from './pane'
	import commonModal from '@/common/components/common-modal'
	import Vue from 'vue'
	export default {
		data () {
			return {
				filterCondition: {
					Super_Operator_Id: '%',
					Super_Operator_Name: '',
					Start_Time: GetBeforeDate(5),
					End_Time: DateFtt('yyyy-MM-dd', new Date(), false)
				},
				show: true,
				operatorId: '301748054417813',
				staffId: '90',
				fieldData: [],
				fieldName: [
					{
						level_1: [
							{
								label: '指定运营商',
								prop: 'AssignOperator_Name'
							},
							{
								label: '指定物流中心',
								prop: 'AssignLdc_Name'
							},
							{
								label: '物流中心地址',
								prop: 'AssignLdc_Addr_Name'
							},
							{
								label: '指派时间',
								prop: 'Assign_Time',
								width: 140
							},
							{
								label: '启运时间',
								prop: 'Departure_Time',
								width: 140
							},
							{
								label: '运输方式',
								prop: 'Transport_Mode_Desc',
								width: 100
							},
							{
								label: '总件数',
								prop: 'Actual_Gross_Pcs',
								width: 50
							},
							{
								label: '总体积(m³)',
								prop: 'Actual_Gross_Volume',
								width: 80
							},
							{
								label: '总重量(KG)',
								prop: 'Actual_Gross_Weight',
								width: 80
							}
						]
					},
					{
						level_2: [
							{
								label: '委托方名称',
								prop: 'Con_Name'
							},
							{
								label: '委托方订单号',
								prop: 'ConOrder_No'
							},
							{
								label: '客户名称',
								prop: 'Ssa_Name'
							},
							{
								label: '运输任务类型',
								prop: 'TransportPlan_Type_Desc',
								width: 120
							},
							{
								label: '配送起点',
								prop: 'Start_City',
								width: 100
							},
							{
								label: '配送终点',
								prop: 'End_City',
								width: 100
							},
							{
								label: '温层',
								prop: 'Refrigeration_Type_Desc',
								width: 120
							},
							{
								label: '总件数',
								prop: 'Actual_Gross_Pcs',
								width: 80
							},
							{
								label: '总体积(m³)',
								prop: 'Actual_Gross_Volume',
								width: 103
							},
							{
								label: '总重量(KG)',
								prop: 'Actual_Gross_Weight',
								width: 103
							},
							{
								label: '备注',
								prop: 'Remarks'
							},
							{
								label: '车辆要求',
								prop: 'Vehicle_Request_Desc',
								width: 100
							},
							{
								label: '车辆大小',
								prop: 'Vehicle_Size',
								width: 100
							}
						]
					}
				],
				currentPage: 1,
				pageSize: 10,
				bigTotalItems: 0,
				showSuperOperator: false,
				isPages: false,
				TableHeader: [
					{
						field: 'Operator_No',
						title: '运营商编号'
					},
					{
						field: 'Operator_Name',
						title: '运营商名称'
					}
				],
				DialogSelectRow: {},
				TableListData: [],
				copyTableListData: []
			}
		},
		components: {
			commonPane,
			commonModal
		},
		methods: {
			handleCurrentChange () { // 翻页
				this.getData()
			},
			showDialog (id, ref) { // 显示弹框
				this.$refs[ref].visible = true
        this.$refs[ref].currentId = id
			},
			confirm (row) { // 带出弹框中选择的数据
				for (let item in row) {
					this.DialogSelectRow = row[item]
				}
				this.filterCondition.Super_Operator_Id = this.DialogSelectRow.Operator_Id
				this.filterCondition.Super_Operator_Name = this.DialogSelectRow.Operator_Name
			},
			dialogSearch (keyword) { // 弹框搜索
				let searchRegex = new RegExp(keyword.trim(), 'i')
        this.copyTableListData = this.TableListData.filter((item) => {
          if (searchRegex.test(item.Operator_No) || searchRegex.test(item.Operator_Name) || searchRegex.test(item.Mnemonic_Code)) {
            return true
          }
        })
			},
			single (obj, arr) { // 单选
				arr.map((item) => {
					item.checked = false
				})
				obj.checked = true
			},
			deleteSuper () {
				this.filterCondition.Super_Operator_Id = '%'
				this.filterCondition.Super_Operator_Name = ''
			},
			showDetail (val, index) {
				this.fieldData.forEach((item, i) => {
        	if (index === i && val) {
        		this.resetDetailStatus()
        	}
        })
        if (val) {
					this.fieldData[index].iconName = 'mo-up2'
				} else {
					this.fieldData[index].iconName = 'mo-down2'
				}
				this.fieldData[index].detailShow = val
			},
			paneDataChange (val, index) {
				this.fieldData[index] = val
			},
			resetDetailStatus () { // 重置详情显示与否的状态
				this.fieldData.forEach((item, i) => {
        	item.detailShow = false
        	item.iconName = 'mo-down2'
        })
			},
			getSuperOperator () { // 获取上级运营商
				let params = {
					Operator_Id: Api.userInfo.Operator_Id ? Api.userInfo.Operator_Id : this.operatorId
				}
				Api.get('TMP_TransportTaskScheding_Wtd_GetOperator', params, true)
					.then((res) => {
						if (res.Flag) {
							this.TableListData = res.MsgInfo
							this.copyTableListData = this.TableListData
						} else {
							this.$alert(res.ErrInfo, '提示', {
								confirmButtonText: '确定'
							})
						}
					})
			},
			getData () { // 获取列表数据
				console.log(Api.userInfo)
				let params = {
					Operator_Id: Api.userInfo.Operator_Id ? Api.userInfo.Operator_Id : this.operatorId,
					Super_Operator_Id: this.filterCondition.Super_Operator_Id,
					Begin_Date: this.filterCondition.Start_Time,
					End_Date: this.filterCondition.End_Time,
					BeginIndex: (this.currentPage - 1) * this.pageSize,
					EndIndex: this.currentPage * this.pageSize
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('TMP_TransportTaskScheding_Rwsh_Hdr', params, true)
					.then((res) => {
						this.loadingWait.close()
						if (res.Flag) {
	            this.fieldData = res.MsgInfo
	            this.fieldData.forEach(item => {
	            	Vue.set(item, 'checked', false)
	            	Vue.set(item, 'detailShow', false)
	            })
	            if (this.fieldData.length === 0) {
	            	this.bigTotalItems = 0
	            } else {
	            	this.bigTotalItems = res.MsgInfo[0].Total
	            }
						} else {
							this.$alert(res.ErrInfo, '提示', {
								confirmButtonText: '确定'
							})
						}
					})
			},
			getSelectData (arr) { // 获取选中的数据
				let selectedData = {}
				for (let i = 0; i < arr.length; i++) {
					if (arr[i].checked) {
						selectedData = arr[i]
						return selectedData
					}
				}
				return selectedData
			},
			crossAudit () { // 审核通过
				let selectedData = this.getSelectData(this.fieldData)
				if (selectedData.TransportEntrust_Hdr_Id) {
					let params = {
						TransportEntrust_Hdr_Id: selectedData.TransportEntrust_Hdr_Id,
						Super_Operator_Id: selectedData.Superior_Operator_Id,
						Operator_Id: Api.userInfo.Operator_Id ? Api.userInfo.Operator_Id : this.operatorId,
						Auditor: Api.userInfo.Staff_Id ? Api.userInfo.Staff_Id : this.staffId
					}
					Api.post('TMP_TransportTaskWTD_WtdAudit', params)
						.then((res) => {
							if (res.Flag) {
								this.$alert('审核通过，可以到运单界面进行路线规划！', '友情提示', {
			            confirmButtonText: '确定',
			            callback: action => {
			            	this.fieldData = []
			          		this.getData()
			          		Bus.$emit(Types.refreshTransport)
			            }
			          })
							} else {
								this.$alert(res.ErrInfo, '友情提示', {
									confirmButtonText: '确定'
								})
							}
						})
				} else {
					this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
				}
			},
			rejectAudit () { // 打回
				let selectedData = this.getSelectData(this.fieldData)
				if (selectedData.TransportEntrust_Hdr_Id) {
					this.$prompt('请输入打回原因', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          inputErrorMessage: '打回原因不能为空',
	          inputValidator: (value) => {
	          	if (value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
	          		return false
	          	}
	          }
	        }).then(({ value }) => {
	        	let params = {
	        		TransportEntrust_Hdr_Id: selectedData.TransportEntrust_Hdr_Id,
	        		Remarks: value
	        	}
	        	Api.post('TMP_TransportTaskWTD_WtdAuditBack', params)
						.then((res) => {
							if (res.Flag) {
								this.$alert('打回成功！', '友情提示', {
			            confirmButtonText: '确定',
			            callback: action => {
			            	this.fieldData = []
			          		this.getData()
			            }
			          })
							} else {
								this.$alert(res.ErrInfo, '友情提示', {
									confirmButtonText: '确定'
								})
							}
						})
	        })
				} else {
					this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
				}
			},
			enterRowCar () { // 进入配送排车
				let selectedData = this.getSelectData(this.fieldData)
				if (selectedData.TransportEntrust_Hdr_Id) {
					let params = {
						TransportEntrust_Hdr_Id: selectedData.TransportEntrust_Hdr_Id,
						Super_Operator_Id: selectedData.Superior_Operator_Id,
						Operator_Id: Api.userInfo.Operator_Id ? Api.userInfo.Operator_Id : this.operatorId,
						Auditor: Api.userInfo.Staff_Id ? Api.userInfo.Staff_Id : this.staffId
					}
					Api.post('TMP_TransportTaskWTD_WtdAuditDistribute', params)
						.then((res) => {
							if (res.Flag) {
								this.$alert('排车任务生成，请到配送排车界面进行排车！', '友情提示', {
			            confirmButtonText: '确定',
			            callback: action => {
			            		this.fieldData = []
				          		this.getData()
				            }
			          })
							} else {
								this.$alert(res.ErrInfo, '友情提示', {
									confirmButtonText: '确定'
								})
							}
						})
				} else {
					this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
				}
			},
			init () { // 初始化
				this.getData()
				this.getSuperOperator()
			}
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.taskAudit{
		.el-card{
			position: relative;
			box-shadow: none;
			.el-card__header{
				padding: 10px 15px;
				span.text{
					line-height: 19px;
					margin-left: 15px;
					color: #000;
					font-weight: bold;
					font-size: 13px;
				}
			}
		}
		.el-form--inline .el-form-item{
			width: 100%;
			display: flex;
			.el-form-item__content{
				flex: 1;
				.el-date-editor.el-input{
					width: 100%;
				}
			}
		}
		.el-input.is-disabled .el-input__inner{
			color: #1f2d3d;
		}
		table{
			width: 100%!important;
		}
		td.el-table__expanded-cell{
			padding: 15px;
			.el-table{
				th{
					background-color: #fff;
					& > div{
						background-color: #fff;
					}
				}
			}
		}
	}
</style>

<style lang="less" scoped>
	.taskAudit{
		// padding: 211px 10px 10px;
		padding: 187px 10px 10px;
		.common-condition-box, .toolbar{
			margin-bottom: 15px;
	    position: fixed;
	    left: 25px;
	    right: 25px;
	    z-index: 10;
		}
		.common-condition-box{
	    top: 67px;
	    background-color: #fff;
	    margin-bottom: 0;
	    &:after{
	    	content: '';
	    	position: absolute;
	    	height: 15px;
	    	background-color: #fff;
	    	left: -1px;
	    	right: -1px;
	    	bottom: -16px;
	    }
		}
		.toolbar{
			width: auto;
			// top: 164px;
			top: 140px;
			&:after{
	    	content: '';
	    	position: absolute;
	    	height: 15px;
	    	background-color: #fff;
	    	left: -1px;
	    	right: -1px;
	    	bottom: -15px;
	    }
		}
		.table-box{
			position: relative;
			z-index: 9;
		}
		.summary{
			margin-bottom: 15px;
	    .detail{
				padding: 15px;
		    background-color: #fff;
		    overflow: hidden;
		    border-width: 0 1px 1px 1px;
		    border-style: solid;
		    border-color: #d1dbe5;
		    border-radius: 0 0 4px 4px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
			}
			.radiusSet{
				border-radius: 4px 4px 0 0;
			}
		}
	}
</style>
