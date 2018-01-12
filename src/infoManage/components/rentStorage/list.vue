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
					<el-input placeholder="双击选择运营方" v-model="filterCondition.Operator_Name" :disabled="true" icon="close" :on-icon-click="deleteOperator" @dblclick.native="openDialog('operator')"></el-input>
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
				      v-for="item in emitRefrigerationTypes" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
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
        <el-table-column prop="RentTempData" label="租赁温度" width="120"></el-table-column>
        <el-table-column prop="Rental_Area" label="租赁面积" width="90"></el-table-column>
        <el-table-column prop="Staff_Name" label="创建人" width="90"></el-table-column>
        <el-table-column prop="Created_Time" label="创建时间" width="156"></el-table-column>
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
	  <common-modal ref="OperatorDialog" DialogTitle="运营方" :isVisible.sync="dialogShow.operator" :TableHeader="emitOperator.TableHeader" :listData="emitOperator.copyDatas" @confirm="selectOperator" @search="searchOperator" :isPages="false"></common-modal>
		<common-modal ref="ConDialog" DialogTitle="委托方" :isVisible.sync="dialogShow.consignor" :TableHeader="emitConsignor.TableHeader" :listData="emitConsignor.copyDatas" @confirm="selectConsignor" @search="searchConsignor" :isPages="false"></common-modal>
		<common-modal ref="LdcDialog" DialogTitle="物流中心" :isVisible.sync="dialogShow.ldc" :TableHeader="emitLdc.TableHeader" :listData="emitLdc.copyDatas" @confirm="selectLdc" @search="searchLdc" :isPages="false"></common-modal>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import {Bus, Types} from '@/common/js/bus'
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
				emitRefrigerationTypes: [],
				emitOperator: this.operator,
				emitConsignor: this.consignor,
				emitLdc: this.ldc,
				multipleSelection: null, // 选中的行
				currentPage: 1,
				pageSize: 10,
				bigTotalItems: 0
			}
		},
		props: {
			operator: {
				type: Object
			},
			consignor: {
				type: Object
			},
			ldc: {
				type: Object
			},
			refrigerationTypes: {
				type: Array
			}
		},
		components: {commonModal},
		watch: {
			emitRefrigerationTypes (val) {
				this.$emit('refrigeration-type-change', val)
			},
			emitOperator (val) {
				this.$emit('operator-change', val)
			}
		},
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
				this.$emit('operator-select', this.filterCondition.Operator_Id, 'list')
			},
			searchOperator (keyword) {
				let searchRegex = new RegExp(keyword, 'i')
        this.emitOperator.copyDatas = this.emitOperator.datas.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
			},
			deleteOperator () {
				this.filterCondition.Operator_Id = ''
				this.filterCondition.Operator_Name = ''
				this.emitConsignor.datas = []
				this.emitLdc.datas = []
			},
			selectConsignor (row) {
				this.filterCondition.Con_Id = row.Con_Id
				this.filterCondition.Con_Name = row.Con_Name
			},
			searchConsignor (keyword) {
				let searchRegex = new RegExp(keyword, 'i')
        this.emitConsignor.copyDatas = this.emitConsignor.datas.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
			},
			deleteConsignor () {
				this.filterCondition.Con_Id = ''
				this.filterCondition.Con_Name = ''
			},
			selectLdc (row) {
				this.filterCondition.Ldc_Id = row.Ldc_Id
				this.filterCondition.Ldc_Name = row.Ldc_Name
			},
			searchLdc (keyword) {
				let searchRegex = new RegExp(keyword, 'i')
        this.emitLdc.copyDatas = this.emitLdc.datas.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
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
					this.$confirm('此操作将永久删除该费用规则, 是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 删除
						let params = [{
							Lease_Id: this.multipleSelection.Lease_Id,
							Operator_Id: this.multipleSelection.Operator_Id,
							Con_Id: this.multipleSelection.Consignor_Id,
							Ldc_Id: this.multipleSelection.Ldc_Id,
							Refrigeration_Type: this.multipleSelection.Refrigeration_Type,
							Rental_Area: this.multipleSelection.Rental_Area,
							Rental_Location_A: this.multipleSelection.Rental_Location_A,
							Rental_Location_B: this.multipleSelection.Rental_Location_B,
							Rental_Location_C: this.multipleSelection.Rental_Location_C,
							Start_Time: this.multipleSelection.Start_Time,
							End_Time: this.multipleSelection.End_Time,
							Is_Active: this.multipleSelection.Is_Active,
							Creator: this.multipleSelection.Creator,
							Created_Time: this.multipleSelection.Created_Time,
							Updated_Time: this.multipleSelection.Updated_Time,
							changetype: 'deleted'
						}]
						Api.basePost('DS_FD_WAREHOUSE_LEASING', params, true).then((res) => {
							if (res.Flag) {
								this.$alert('删除成功！', '提示', {
            			confirmButtonText: '确定',
            			callback: action => {
            				this.refreshList()
            			}
            		})
							} else {
								this.$alert(res.ErrInfo, '提示', {
									confirmButtonText: '确定'
								})
							}
						})
					}).catch(() => {
						// 取消删除
					})
				} else {
					this.$alert('请选择要删除的数据！', '提示', {
						confirmButtonText: '确定'
					})
				}
			},
			refreshList () { // 刷新列表数据
				this.filterCondition.Operator_Id = ''
				this.filterCondition.Operator_Name = ''
				this.filterCondition.Con_Id = ''
				this.filterCondition.Con_Name = ''
				this.filterCondition.Ldc_Id = ''
				this.filterCondition.Ldc_Name = ''
				this.filterCondition.Refrigeration_Type = ''
				this.getData()
      },
      editRentStorage (row, event) { // 编辑仓储租赁
      	this.$emit('rent-storage-edit', row)
      	this.$emit('active-name-change', 'detail')
      },
      getOperator () { // 运营商
      	let params = {
      		userId: Api.userInfo.Staff_Id
      	}
      	Api.get('DS_FEERULE_FD_OPERATOR_ByuserId', params, true).then((res) => {
      		if (res.Flag) {
      			this.emitOperator.datas = res.MsgInfo
      			this.emitOperator.copyDatas = this.emitOperator.datas
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      getRefrigerationType () { // 租赁温度
      	Api.get('Fd_Field_Dtl', { Field_Name: 'Refrigeration_Type' }, true).then((res) => {
					if (res.Flag) {
						this.emitRefrigerationTypes = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
      },
      getData () { // 获取列表数据
      	let params = {
      		Operator_Id: this.filterCondition.Operator_Id,
      		Con_Id: this.filterCondition.Con_Id,
      		Ldc_Id: this.filterCondition.Ldc_Id,
      		Refrigeration_Type: this.filterCondition.Refrigeration_Type,
      		startIndex: (this.currentPage - 1) * this.pageSize,
      		pageSize: this.pageSize
      	}
      	// this.loadingWait = this.showLoading('请稍候...')
      	Api.get('DS_JLP_WAREHOUSE_LEASING', params, true).then((res) => {
      		if (res.Flag) {
      			this.list = res.MsgInfo
      			if (this.list.length === 0) {
      				this.bigTotalItems = 0
      			} else {
      				this.bigTotalItems = this.list[0].bigTotalItems
      			}
      			// this.loadingWait.close()
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      		// this.loadingWait.close()
      	})
      },
			init () {
				this.getOperator()
				this.getRefrigerationType()
				this.getData()
			}
		},
		created () {
			Bus.$on(Types.refreshRentStorage, (res) => {
				this.getData()
			})
		},
		mounted () {
			this.init()
			console.log(this.consignor)
			console.log(this.ldc)
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