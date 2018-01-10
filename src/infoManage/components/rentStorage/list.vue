<template>
	<div class="list">
		<div class="toolbar">
			<div class="btn-box">
				<el-button type="text" icon="mo-newlyAdded" @click.native="addRentStorage">新增</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="mo-delete2" @click.native="deleteRentStorage">删除</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="mo-refresh" @click.native="refreshList">刷新</el-button>
			</div>
		</div>
		<div class="common-condition-box">
			<el-form :inline="true" ref="filterForm">
				<el-form-item label="运营方">
					<el-input placeholder="双击选择运营方" v-model="filterCondition.Operator_Name" :disabled="true" icon="close" :on-icon-click="deleteOperator" @dblclick.native="openDialog('operator')" @change.native="changeOperator"></el-input>
				</el-form-item>
				<el-form-item label="委托方">
					<el-input placeholder="双击选择委托方" v-model="filterCondition.Con_Name" :disabled="true" icon="close" :on-icon-click="deleteConsignor" @dblclick.native="openDialog('consignor')"></el-input>
				</el-form-item>
				<el-form-item label="物流中心">
					<el-input placeholder="双击选择物流中心" v-model="filterCondition.Ldc_Name" :disabled="true" icon="close" :on-icon-click="deleteLdc" @dblclick.native="openDialog('ldc')"></el-input>
				</el-form-item>
				<el-form-item label="租赁温度">
					<el-select v-model="filterCondition.Refrigeration_Type" clearable placeholder="请选择">
				    <el-option
				      v-for="item in refrigerationTypes" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click.native="getData">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-box">
			<el-table :data="list" highlight-current-row @current-change="handleSelectionChange" @row-dblclick="editRentStorage">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="Operator_Name" label="运营方"></el-table-column>
        <el-table-column prop="Con_Name" label="委托方"></el-table-column>
        <el-table-column prop="Ldc_Name" label="物流中心"></el-table-column>
        <el-table-column prop="Refrigeration_Type" label="租赁温度"></el-table-column>
        <el-table-column prop="Rental_Area" label="租赁面积"></el-table-column>
        <el-table-column prop="Creator" label="创建人"></el-table-column>
        <el-table-column prop="Created_Time" label="创建时间"></el-table-column>
      </el-table>
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
	  <common-modal ref="OperatorDialog" DialogTitle="运营方" :isVisible.sync="dialogShow.operator" :TableHeader="operator.TableHeader" :listData="copyOperatorDatas" @confirm="selectOperator" @search="searchOperator" :isPages="false"></common-modal>
		<common-modal ref="ConDialog" DialogTitle="委托方" :isVisible.sync="dialogShow.consignor" :TableHeader="consignor.TableHeader" :listData="copyConsignorDatas" @confirm="selectConsignor" @search="searchConsignor" :isPages="false"></common-modal>
		<common-modal ref="LdcDialog" DialogTitle="物流中心" :isVisible.sync="dialogShow.ldc" :TableHeader="ldc.TableHeader" :listData="copyLdcDatas" @confirm="selectLdc" @search="searchLdc" :isPages="false"></common-modal>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import commonModal from '@/common/components/common-modal'
	export default {
		name: 'feeRuleStorageList',
		data () {
			return {
				list: [],
				filterCondition: { // 过滤条件
					Operator_Id: '',
					Operator_Name: '',
					Con_Id: '',
					Con_Name: '',
					Ldc_Id: '',
					Ldc_Name: '',
					Refrigeration_Type: ''
				},
				dialogShow: {
					operator: false,
					consignor: false,
					ldc: false
				},
				copyOperatorDatas: [],
				copyConsignorDatas: [],
				copyLdcDatas: [],
				refrigerationTypes: [],
				multipleSelection: null, // 选中的行
				currentPage: 1,
				pageSize: 10,
				bigTotalItems: 0
			}
		},
		props: {
			operator: {
				type: Object,
				default () {
					return {}
				}
			},
			consignor: {
				type: Object,
				default () {
					return {}
				}
			},
			ldc: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		components: {commonModal},
		methods: {
			handleCurrentChange () {
				this.getData()
			},
			handleSelectionChange (val) {
				this.multipleSelection = val
			},
			openDialog (val) { // 打开弹框
        this.dialogShow[val] = true
      },
			selectOperator (row) {
				this.filterCondition.Operator_Id = row.Operator_Id
				this.filterCondition.Operator_Name = row.Operator_Name
			},
			searchOperator (keyword) {},
			deleteOperator () {
				this.filterCondition.Operator_Id = ''
				this.filterCondition.Operator_Name = ''
			},
			selectConsignor (row) {
				this.filterCondition.Con_Id = row.Con_Id
				this.filterCondition.Con_Name = row.Con_Name
			},
			searchConsignor (keyword) {},
			deleteConsignor () {
				this.filterCondition.Con_Id = ''
				this.filterCondition.Con_Name = ''
			},
			selectLdc (row) {
				this.filterCondition.Ldc_Id = row.Ldc_Id
				this.filterCondition.Ldc_Name = row.Ldc_Name
			},
			searchLdc (keyword) {
			},
			deleteLdc () {
				this.filterCondition.Ldc_Id = ''
				this.filterCondition.Ldc_Name = ''
			},
			addRentStorage () { // 新增仓储费用规则
				this.$emit('active-name-change', 'detail', 'add')
			},
			deleteRentStorage () { // 删除仓储费用规则
				console.log(this.multipleSelection)
				if (this.multipleSelection !== null) {
					this.$alert('此操作将永久删除该费用规则, 是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 删除
					})
				} else {
					this.$alert('请选择要删除的数据！', '提示', {
						confirmButtonText: '确定'
					})
				}
			},
			refreshList () { // 刷新列表数据
				this.getData()
      },
      editRentStorage (row, event) { // 编辑仓储租赁
      },
      getData () { // 获取列表数据
      },
      changeOperator () {
      	this.$emit('operator-change', this.filterCondition.Operator_Id)
      },
			init () {
				this.copyOperatorDatas = this.operator.datas
				this.copyConsignorDatas = this.consignor.datas
				this.copyLdcDatas = this.ldc.datas
				this.getData()
			}
		},
		created () {},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.rentStorage {
		.list {
			.common-condition-box {
				position: fixed;
				left: 10px;
				right: 10px;
		    margin: 0;
    		top: 120px;
    		background-color: #fff;
			}
			.table-box {
				margin-top: 154px;
			}
		}
	}
</style>