<template>
	<div class="feeRuleStorage common-tab-wraper common-container">
		<el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane label="仓储费用规则列表" name="list">
	    	<fee-rule-storage-list :FeeTypes="fields.Fee_Types" :ServiceTypes="fields.Service_Types" :ServiceItemsList="fields.Service_Items_List" @service-type-change="serviceTypeChange" @active-name-change="activeNameChange" @fee-rule-storage-edit="feeRuleStorageEdit"></fee-rule-storage-list>
	    </el-tab-pane>
	    <el-tab-pane :disabled="true"></el-tab-pane>
	    <el-tab-pane label="仓储费用规则明细" name="detail">
	    	<fee-rule-storage-detail :FeeTypes="fields.Fee_Types" :ServiceTypes="fields.Service_Types" :ServiceItemsDetail="fields.Service_Items_Detail" @service-type-change="serviceTypeChange" @active-name-change="activeNameChange" :editFeeRuleStorageRow="editFeeRuleStorageRow"></fee-rule-storage-detail>
	    </el-tab-pane>
  	</el-tabs>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import feeRuleStorageList from '../components/feeRuleStorage/list'
	import feeRuleStorageDetail from '../components/feeRuleStorage/detail'
	export default {
		name: 'feeRuleStorage',
		data () {
			return {
				activeName: 'list',
				fields: {
					Fee_Types: [], // 业务模式
					Service_Types: [],
					Service_Items_List: [],
					Service_Items_Detail: []
				},
				editFeeRuleStorageRow: {}
			}
		},
		components: {
			feeRuleStorageList,
			feeRuleStorageDetail
		},
		methods: {
			handleClick () {
				window.scrollTo(0, 0)
			},
			loadField () {
				Api.get('Fd_Field_Dtl', { Field_Name: 'Business_Model' }, true).then((res) => { // 业务模式
					if (res.Flag) {
						this.fields.Fee_Types = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('DS_LIST_GetServiceType', {}, true).then((res) => { // 费用类型
					if (res.Flag) {
						this.fields.Service_Types = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			serviceTypeChange (serviceType, mark) { // 费用类型改变带出服务项目
				let params = {
					Ser_Id: serviceType
				}
				Api.get('DS_LIST_GetServiceItem', params, true).then((res) => {
					if (res.Flag) {
						let data = res.MsgInfo
						if (mark === 'list') {
							this.fields.Service_Items_List = data
						} else {
							this.fields.Service_Items_Detail = data
						}
					}
				})
			},
			activeNameChange (val, type) {
				console.log(val === 'detail' && type === 'add')
				if (val === 'list' || (val === 'detail' && type === 'add')) {
					this.editFeeRuleStorageRow = {}
				}
				this.activeName = val
			},
			feeRuleStorageEdit (row) {
				this.editFeeRuleStorageRow = row
			},
			init () {
				this.loadField()
			}
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.feeRuleStorage {
		padding: 10px;
		.el-tabs__header {
			position: fixed;
			left: 10px;
	    right: 10px;
	    top: 0;
	    background-color: #fff;
	    z-index: 10;
	    &:after {
	    	content: '';
	    	position: absolute;
	    	width: 100%;
	    	background-color: #fff;
	    	height: 21px;
	    	left: 0;
	    	bottom: -22px;
	    }
		}
		.el-tabs__content {
			padding-top: 53px;
			margin-top: 0;
		}
		.toolbar {
			position: fixed;
			left: 10px;
			right: 10px;
			top: 63px;
			z-index: 9;
			&:after {
				content: '';
	    	position: absolute;
	    	width: 100%;
	    	background-color: #fff;
	    	height: 15px;
	    	left: 0;
	    	bottom: -15px;
			}
		}
		.common-condition-box {
			margin-top: 57px;
			z-index: 8;
		}
	}
</style>