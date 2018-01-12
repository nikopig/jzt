<template>
	<div class="rentStorage common-tab-wraper common-container">
		<el-tabs v-model="activeName" @tab-click="handleclick">
	    <el-tab-pane label="仓储租赁列表" name="list">
	    	<rent-storage-list :operator="Operator" :consignor="Consignor" :ldc="Ldc" :refrigerationTypes="refrigerationTypes" @active-name-change="activeNameChange" @rent-storage-edit="rentStorageEdit" @refrigeration-type-change="refrigerationTypesChange" @operator-change="operatorChange" @operator-select="operatorSelect"></rent-storage-list>
	    </el-tab-pane>
	    <el-tab-pane :disabled="true"></el-tab-pane>
	    <el-tab-pane label="仓储租赁明细" name="detail">
	    	<rent-storage-detail :operator="Operator" :consignor="detailConsignor" :ldc="detailLdc" :refrigerationTypes="refrigerationTypes" :editRentStorageRow="editRentStorageRow" @active-name-change="activeNameChange" @operator-select="operatorSelect"></rent-storage-detail>
	    </el-tab-pane>
  	</el-tabs>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import rentStorageList from '../components/rentStorage/list'
	import rentStorageDetail from '../components/rentStorage/detail'
	export default {
		name: 'rentStorage',
		data () {
			return {
				activeName: 'list',
				editRentStorageRow: {},
				Operator: {
					TableHeader: [
						{
							field: 'Operator_Name',
							title: '运营方名称',
							width: 200
						},
						{
							field: 'Operator_No',
							title: '运营方编号',
							width: 200
						},
						{
							field: 'Mnemonic_Code',
							title: '助记码'
						}
					],
					datas: [],
					copyDatas: []
				},
				Consignor: {
					TableHeader: [
						{
							field: 'Con_Name',
							title: '委托方名称',
							width: 200
						},
						{
							field: 'Con_No',
							title: '委托方编号',
							width: 200
						},
						{
							field: 'Mnemonic_Code',
							title: '助记码'
						}
					],
					datas: [],
					copyDatas: []
				},
				Ldc: {
					TableHeader: [
						{
							field: 'All_Name',
							title: '物流中心',
							width: 250
						},
						{
							field: 'Address_Shortname',
							title: '地址简介',
							width: 260
						},
						{
							field: 'Contact_Name',
							title: '联系人'
						},
						{
							field: 'Contact_Phone',
							title: '联系人电话',
							width: 150
						},
						{
							field: 'Province_Name',
							title: '省'
						},
						{
							field: 'City_Name',
							title: '市'
						},
						{
							field: 'Area_Name',
							title: '县'
						},
						{
							field: 'Address',
							title: '详细地址',
							width: 260
						}
					],
					datas: [],
					copyDatas: []
				},
				detailConsignor: {},
				detailLdc: {},
				refrigerationTypes: []
			}
		},
		components: {
			rentStorageList,
			rentStorageDetail
		},
		methods: {
			handleclick () {
				window.scrollTo(0, 0)
			},
			activeNameChange (val, type) {
				if (val === 'list' || (val === 'detail' && type === 'add')) {
					this.editRentStorageRow = {}
				}
				this.activeName = val
			},
			rentStorageEdit (row) {
				this.editRentStorageRow = row
			},
			refrigerationTypesChange (val) {
				this.refrigerationTypes = val
			},
			operatorChange (val) {
				this.Operator.datas = val.datas
				this.Operator.copyDatas = val.copyDatas
			},
			getConsignor (operatorId, type) { // 委托方
      	if (operatorId === '') {
      		this.$alert('请先选择运营商', '提示', {
      			confirmButtonText: '确定'
      		})
      		return false
      	}
      	let params = {
      		Operator_Id: operatorId,
      		userId: Api.userInfo.Staff_Id
      	}
      	Api.get('DS_FEERULE_FD_CONSIGNOR_ByuserId', params, true).then((res) => {
      		if (res.Flag) {
      			if (type === 'list') {
      				this.Consignor.datas = res.MsgInfo
      				this.Consignor.copyDatas = this.Consignor.datas
      			} else {
      				this.detailConsignor.datas = res.MsgInfo
      				this.detailConsignor.copyDatas = this.detailConsignor.datas
      			}
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      getLdc (operatorId, type) { // 物流中心
      	Api.get('TMP_TransportTaskScheding_Yd_GetWlzxAddr', {}, true).then((res) => {
      		if (res.Flag) {
      			let data = res.MsgInfo
      			if (type === 'list') {
      				this.Ldc.datas = data.filter((item) => {
	      				if (item.Operator_Id === operatorId) {
	      					return true
	      				}
	      			})
	      			this.Ldc.copyDatas = this.Ldc.datas
      			} else {
      				this.detailLdc.datas = data.filter((item) => {
	      				if (item.Operator_Id === operatorId) {
	      					return true
	      				}
	      			})
	      			this.detailLdc.copyDatas = this.detailLdc.datas
      			}
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      operatorSelect (operatorId, type) {
      	this.getConsignor(operatorId, type)
      	this.getLdc(operatorId, type)
      },
      init () {
      	Object.assign(this.detailConsignor, this.Consignor)
				Object.assign(this.detailLdc, this.Ldc)
      }
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.rentStorage {
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