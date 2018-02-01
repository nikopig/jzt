<template>
	<div class="common-container consignInfoManage">
		<div class="common-condition-box">
			<el-form :inline="true">
				<el-form-item label="发货日期">
					<el-date-picker v-model="filterCondition.rangeDate" type="daterange" placeholder="选择日期范围"></el-date-picker>
				</el-form-item>
				<el-form-item label="委托方">
					<el-input :disabled="true" v-model="filterCondition.Con_Name" placeholder="双击选择委托方" @dblclick.native="openDialog('consignor')" icon="close" :on-icon-click="deleteConsignor"></el-input>
				</el-form-item>
				<el-form-item label="承运方">
					<el-input :disabled="true" v-model="filterCondition.Carrier_Name" placeholder="双击选择承运方" icon="close" :on-icon-click="deleteCarrier" @dblclick.native="openDialog('carrier')"></el-input>
				</el-form-item>
				<el-form-item label="单位名称">
					<el-input v-model="filterCondition.Ssa_Name" placeholder="请输入单位名称、助记码、联系人、联系电话或地址"></el-input>
				</el-form-item>
				<el-form-item label="业务单据编号">
					<el-input v-model="filterCondition.Biz_Bill_No" placeholder="请输入业务单据编号"></el-input>
				</el-form-item>
				<el-form-item label="维护情况">
					<el-select v-model="filterCondition.State" clearable placeholder="请选择">
				    <el-option v-for="item in options" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click.native="searchData">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click.native="exportExcel">导出</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-box">
			<el-table :data="list">
	      <el-table-column type="index" label="序号" width="70"></el-table-column>
	      <el-table-column prop="Invoice_Time" label="发货日期" width="110"></el-table-column>
	      <el-table-column label="托运单号" width="160">
	      	<template slot-scope="scope">
		        <el-input v-model="scope.row.Consign_No" placeholder="请输入托运单号" @blur="save(scope.row)" :class="{'saveSuccess': scope.row.saveSuccess && (scope.row.Consign_No !== null) &&(scope.row.Consign_No.trim() !== '')}" @focus="scope.row.saveSuccess = false"></el-input>
		      </template>
	      </el-table-column>
	      <el-table-column prop="Carrier_Name" label="承运商" :show-overflow-tooltip="true" width="200"></el-table-column>
	      <el-table-column prop="Biz_Bill_No" label="业务单据编号" width="140"></el-table-column>
	      <el-table-column prop="Con_Name" label="委托方" :show-overflow-tooltip="true" width="200"></el-table-column>
	      <el-table-column prop="Ssa_Name" label="单位名称" width="180" :show-overflow-tooltip="true"></el-table-column>
	      <el-table-column prop="Contact_Name" label="联系人" width="120" :show-overflow-tooltip="true"></el-table-column>
	      <el-table-column prop="Contact_Phone" label="联系电话" width="140" :show-overflow-tooltip="true"></el-table-column>
	      <el-table-column prop="Address" label="联系地址" :show-overflow-tooltip="true" width="200"></el-table-column>
	      <el-table-column prop="TotalPcs_Num" label="件数" width="80"></el-table-column>
	      <el-table-column prop="Gross_Volume" label="体积(m³)" width="100"></el-table-column>
	      <el-table-column prop="Gross_Weight" label="重量(KG)" width="100"></el-table-column>
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
	  <consiModal :visible.sync="dialogShow.consignor" @change="selectConsi"></consiModal>
	  <common-modal ref="CarrierDialog" DialogTitle="承运商" :isVisible.sync="dialogShow.carrier" :TableHeader="Carrier.TableHeader" :listData="Carrier.datas" @confirm="selectCarrier" @search="searchCarrier" :total="Carrier.bigTotalItems"></common-modal>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Api from '@/common/js/api'
	import {DateFtt, formatJson, GetBeforeDate} from '@/common/js/utils'
	import {json2excel} from '@/common/js/excel.js'
	import consiModal from '@/common/service/modal/consi-modal'
	import commonModal from '@/common/components/common-modal'
	export default {
		name: 'consignInfoManage',
		data () {
			return {
				filterCondition: {
					rangeDate: [],
					Con_Id: '%',
					Con_Name: '',
					Carrier_Id: '%',
					Carrier_Name: '',
					Ssa_Name: '',
					Biz_Bill_No: '',
					State: ''
				},
				options: [
					{
						Value_Data: 0,
						Value_Desc: '未维护'
					},
					{
						Value_Data: 1,
						Value_Desc: '已维护'
					}
				],
				list: [],
				exportList: [],
				currentPage: 1,
				pageSize: 10,
				bigTotalItems: 0,
				dialogShow: {
					consignor: false,
					carrier: false
				},
				Carrier: {
					TableHeader: [
						{
							field: 'NAME',
							title: '承运商名称',
							width: 200
						},
						{
							field: 'NO',
							title: '承运商编号',
							width: 180
						},
						{
							field: 'Mnemonic_Code',
							title: '助记码',
							width: 140
						}
					],
					datas: [],
					Keywords: '%',
					currentPage: 1,
					pageSize: 10,
					bigTotalItems: 0
				},
				tableOptions: {
					titles: ['发货日期', '托运单号', '承运商', '业务单据编号', '委托方', '单位名称', '联系人', '联系电话', '联系地址', '件数', '体积(m³)', '重量(KG)'],
					fields: ['Invoice_Time', 'Consign_No', 'Carrier_Name', 'Biz_Bill_No', 'Con_Name', 'Ssa_Name', 'Contact_Name', 'Contact_Phone', 'Address', 'TotalPcs_Num', 'Gross_Volume', 'Gross_Weight']
				}
			}
		},
		components: {
			consiModal,
			commonModal
		},
		methods: {
			handleCurrentChange () {
				this.getData()
			},
			openDialog (val) {
        this.dialogShow[val] = true
      },
      selectConsi (row) {
      	this.filterCondition.Con_Id = row.Con_Id
      	this.filterCondition.Con_Name = row.Con_Name
      },
      deleteConsignor () {
      	this.filterCondition.Con_Id = '%'
      	this.filterCondition.Con_Name = ''
      },
      selectCarrier (row) {
      	this.filterCondition.Carrier_Id = row.Id
      	this.filterCondition.Carrier_Name = row.NAME
      },
      searchCarrier (keyword) {
      	if (keyword.trim() === '') {
      		this.Carrier.Keywords = '%'
      	} else {
      		this.Carrier.Keywords = keyword
      	}
      	this.getCarrier()
      },
      deleteCarrier () {
      	this.filterCondition.Carrier_Id = '%'
      	this.filterCondition.Carrier_Name = ''
      },
			getData () {
				let startTime = this.filterCondition.rangeDate[0]
				let endTime = this.filterCondition.rangeDate[1]
				let params = {
					Start_Date: (typeof (startTime) === 'string') ? startTime : DateFtt('yyyy-MM-dd', startTime),
					End_Date: (typeof (endTime) === 'string') ? endTime : DateFtt('yyyy-MM-dd', endTime),
					Operator_Id: Api.userInfo.Operator_Id,
					Con_Id: this.filterCondition.Con_Id,
					Carrier_Id: this.filterCondition.Carrier_Id,
					Ssa_Name: '%' + ((this.filterCondition.Ssa_Name === '') ? '%' : this.filterCondition.Ssa_Name) + '%',
					Biz_Bill_No: '%' + ((this.filterCondition.Biz_Bill_No === '') ? '%' : this.filterCondition.Biz_Bill_No) + '%',
					State: (this.filterCondition.State === '') ? '%' : this.filterCondition.State,
					startIndex: (this.currentPage - 1) * this.pageSize,
					pageSize: this.pageSize
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('TMP_TransportEntrust_Consign_Request', params, true).then((res) => {
					if (res.Flag) {
						this.list = res.MsgInfo
						if (this.list.length === 0) {
							this.bigTotalItems = 0
						} else {
							this.bigTotalItems = this.list[0].bigTotalItems
						}
						this.list.forEach((item) => {
							Vue.set(item, 'saveSuccess', true)
						})
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
					this.loadingWait.close()
				})
			},
			getExportData () {
				let startTime = this.filterCondition.rangeDate[0]
				let endTime = this.filterCondition.rangeDate[1]
				let params = {
					Start_Date: (typeof (startTime) === 'string') ? startTime : DateFtt('yyyy-MM-dd', startTime),
					End_Date: (typeof (endTime) === 'string') ? endTime : DateFtt('yyyy-MM-dd', endTime),
					Operator_Id: Api.userInfo.Operator_Id,
					Con_Id: this.filterCondition.Con_Id,
					Carrier_Id: this.filterCondition.Carrier_Id,
					Ssa_Name: '%' + ((this.filterCondition.Ssa_Name === '') ? '%' : this.filterCondition.Ssa_Name) + '%',
					Biz_Bill_No: '%' + ((this.filterCondition.Biz_Bill_No === '') ? '%' : this.filterCondition.Biz_Bill_No) + '%',
					State: (this.filterCondition.State === '') ? '%' : this.filterCondition.State
				}
				Api.get('TMP_TransportEntrust_Consign_Export', params, true).then((res) => {
					if (res.Flag) {
						this.exportList = res.MsgInfo
					}
				})
			},
			searchData () {
				this.getData()
				this.getExportData()
			},
			getCarrier () {
				let params = {
					Keywords: '%' + this.Carrier.Keywords + '%',
					Operator_Id: Api.userInfo.Operator_Id,
					startIndex: (this.Carrier.currentPage - 1) * this.Carrier.pageSize,
					pageSize: this.Carrier.pageSize
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('Fd_Carrier_BY_OPERATOR', params, true).then((res) => {
					if (res.Flag) {
						this.Carrier.datas = res.MsgInfo
						if (this.Carrier.datas.length === 0) {
							this.Carrier.bigTotalItems = 0
						} else {
							this.Carrier.bigTotalItems = this.Carrier.datas[0].bigTotalItems
						}
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
					this.loadingWait.close()
				})
			},
			save (obj) {
				let params = [{
					TransportEntrust_Dtl_Id: obj.TransportEntrust_Dtl_Id,
					Consign_No: obj.Consign_No,
					changetype: 'updated'
				}]
				Api.basePost('TMP_TransportTaskScheding_WtdDtl_Save', params).then((res) => {
					if (!res.Flag) {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
						return false
					}
					obj.saveSuccess = true
				})
			},
			exportExcel () {
				if (this.exportList.length === 0) {
          this.$alert('当前无数据，无法导出', '提示', {
          	confirmButtonText: '确定'
          })
          return false
        }
        let jsonData = formatJson(this.exportList, this.tableOptions.fields)
        json2excel(this.tableOptions.titles, jsonData)
			},
			init () {
				let startTime = GetBeforeDate(5)
				let endTime = DateFtt('yyyy-MM-dd', new Date())
				this.filterCondition.rangeDate.push(startTime)
				this.filterCondition.rangeDate.push(endTime)
				this.getData()
				this.getCarrier()
				this.getExportData()
			}
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.consignInfoManage {
		padding: 10px;
		.common-condition-box {
			.el-form-item {
				&:nth-of-type(4) {
					.el-form-item__content {
						width: 320px;
					}
				}
			}
		}
		.saveSuccess {
			.el-input__inner {
				background-color: #eef1f6;
			}
		}
	}
</style>