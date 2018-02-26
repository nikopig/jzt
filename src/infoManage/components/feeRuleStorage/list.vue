<template>
	<div class="list">
		<div class="toolbar">
			<div class="btn-box">
				<el-button type="text" icon="el-icon-mo-newlyAdded" @click.native="addFeeRuleStorage">新增</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="el-icon-mo-delete2" @click.native="deleteFeeRuleStorage">删除</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="el-icon-mo-download">导出</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="el-icon-mo-refresh" @click.native="refreshList">刷新</el-button>
			</div>
		</div>
		<div class="common-condition-box">
			<el-form :inline="true" ref="filterForm">
				<el-form-item label="业务模式" prop="Business_Model">
					<el-select v-model="filterCondition.Business_Model" clearable placeholder="请选择">
				    <el-option
				      v-for="item in FeeTypes" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="费用类型" prop="Service_Type">
					<el-select v-model="filterCondition.Service_Type" clearable placeholder="请选择" @change="changeServieType">
				    <el-option
				      v-for="item in ServiceTypes" :key="item.Ser_Id" :label="item.Service_Name" :value="item.Ser_Id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="服务项目" prop="Service_Item">
					<el-select v-model="filterCondition.Service_Item" clearable placeholder="请选择">
				    <el-option
				      v-for="item in ServiceItemsList" :key="item.Ser_Id" :label="item.Service_Name" :value="item.Ser_Id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item prop="keyword">
					<el-input placeholder="请输入运营商、委托方、物流中心名称或助记码" v-model="filterCondition.keyword"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click.native="getData">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-box">
			<el-table :data="list"highlight-current-row @current-change="handleSelectionChange" @row-dblclick="editFeeRuleStorage">
				<!-- <el-table-column type="selection" label=""></el-table-column> -->
        <el-table-column type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="Operator_Name" label="运营方"></el-table-column>
        <el-table-column prop="Con_Name" label="委托方"></el-table-column>
        <el-table-column prop="Ldc_Name" label="物流中心"></el-table-column>
        <el-table-column prop="Business_Model_Desc" label="业务模式" width="100"></el-table-column>
        <el-table-column prop="Service_Type_Desc" label="费用类型" width="90"></el-table-column>
        <el-table-column prop="Service_Item_Desc" label="服务项目" width="120"></el-table-column>
        <el-table-column prop="Price_Agreement" label="协议价(元)" width="102"></el-table-column>
        <el-table-column prop="Created_Time" label="创建时间" width="155"></el-table-column>
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
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import {Bus, Types} from '@/common/js/bus'
	export default {
		name: 'feeRuleStorageList',
		data () {
			return {
				list: [],
				filterCondition: { // 过滤条件
					Business_Model: '',
					Service_Type: '',
					Service_Item: '',
					keyword: ''
				},
				multipleSelection: null, // 选中的行
				currentPage: 1,
				pageSize: 10,
				bigTotalItems: 0
			}
		},
		props: {
			FeeTypes: {
				type: Array,
				default () {
					return []
				}
			},
			ServiceTypes: {
				type: Array,
				default () {
					return []
				}
			},
			ServiceItemsList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		methods: {
			handleCurrentChange () {
				this.getData()
			},
			handleSelectionChange (val) {
				this.multipleSelection = val
			},
			changeServieType () {
				this.$emit('service-type-change', this.filterCondition.Service_Type, 'list')
			},
			addFeeRuleStorage () { // 新增仓储费用规则
				this.$emit('active-name-change', 'detail', 'add')
			},
			deleteFeeRuleStorage () { // 删除仓储费用规则
				console.log(this.multipleSelection)
				if (this.multipleSelection !== null) {
					this.$alert('此操作将永久删除该费用规则, 是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 删除
						let obj = [{
          	Rec_Id: this.multipleSelection.Rec_Id,
          	Operator_Id: this.multipleSelection.Operator_Id,
          	Con_Id: this.multipleSelection.Con_Id,
          	Ldc_Id: this.multipleSelection.Ldc_Id,
          	Business_Model: this.multipleSelection.Business_Model,
          	Fee_Category: this.multipleSelection.Fee_Category,
          	Service_Type: this.multipleSelection.Service_Type,
          	Service_Item: this.multipleSelection.Service_Item,
          	Charging_Type: this.multipleSelection.Charging_Type,
          	Charging_Rule: this.multipleSelection.Charging_Rule,
          	Refrigeration_Type: this.multipleSelection.Refrigeration_Type,
          	Init_Price: this.multipleSelection.Init_Price,
          	Price_Agreement: this.multipleSelection.Price_Agreement,
          	Extend_Field: this.multipleSelection.Extend_Field,
          	Extend_Condition: this.multipleSelection.Extend_Condition,
          	Calculation_Rule: this.multipleSelection.Calculation_Rule,
          	Calculation_Mode: this.multipleSelection.Calculation_Mode,
          	Is_Available: this.multipleSelection.Is_Available,
          	SettleUp_Cycle: this.multipleSelection.SettleUp_Cycle,
          	SettleUp_Way: this.multipleSelection.SettleUp_Way,
          	Is_Documentary: this.multipleSelection.Is_Documentary,
          	Payer: this.multipleSelection.Payer,
          	remarks: this.multipleSelection.remarks,
          	Start_Time: this.multipleSelection.Start_Time,
          	End_Time: this.multipleSelection.End_Time,
          	Created_Time: this.multipleSelection.Created_Time,
          	Updated_Time: this.multipleSelection.Updated_Time,
          	Creator: this.multipleSelection.Creator,
          	changetype: 'deleted'
          }]
          let params = {
        		list_fdfeerule: JSON.stringify(obj)
        	}
          Api.post('FdWarehouseFeeRuleSave', params).then((res) => {
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
				this.filterCondition.keyword = ''
				this.filterCondition.Service_Type = ''
				this.filterCondition.Service_Item = ''
				this.filterCondition.Business_Model = ''
				this.getData()
      },
      editFeeRuleStorage (row, event) { // 编辑仓储费用规则
      	this.$emit('fee-rule-storage-edit', row)
      	this.$emit('active-name-change', 'detail')
      },
      getData () { // 获取列表数据
      	let params = {
      		iv_rec_id: (this.filterCondition.keyword === '') ? '%' : this.filterCondition.keyword,
      		iv_service_type: (this.filterCondition.Service_Type === '') ? '%' : this.filterCondition.Service_Type,
      		iv_service_item: (this.filterCondition.Service_Item === '') ? '%' : this.filterCondition.Service_Item,
      		iv_business_model: (this.filterCondition.Business_Model === '') ? '%' : this.filterCondition.Business_Model,
      		i_begin_page: (this.currentPage - 1) * this.pageSize,
      		i_end_page: this.currentPage * this.pageSize,
      		userId: Api.userInfo.Staff_Id
      	}
      	this.loadingWait = this.showLoading('请稍候...')
      	Api.post('Web_FdWarehouseFeeRuleRequest', params).then((res) => {
      		if (res.Flag) {
      			this.list = JSON.parse(res.MsgInfo)
      			console.log(this.list)
      			if (this.list.length === 0) {
      				this.bigTotalItems = 0
      			} else {
      				this.bigTotalItems = this.list[0].Total_Page
      			}
      			this.loadingWait.close()
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
			init () {
				this.getData()
			}
		},
		created () {
			Bus.$on(Types.refreshFeeRule, (res) => {
				this.init()
			})
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.feeRuleStorage {
		.list {
			.common-condition-box {
				position: fixed;
				left: 10px;
				right: 10px;
		    margin: 0;
    		top: 120px;
    		background-color: #fff;
    		.el-form-item:nth-last-of-type(2) {
    			width: 22%;
    			max-width: 300px;
    			.el-form-item__content {
    				width: 100%;
    			}
    		}
			}
			.table-box {
				margin-top: 154px;
			}
		}
	}
</style>