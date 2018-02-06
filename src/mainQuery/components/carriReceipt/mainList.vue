<!-- 承运商查询 -->
<template>
	<div class="main-list">
		<div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
            <el-breadcrumb separator="/">
            	<el-breadcrumb-item @click.native="go(-1)">首页</el-breadcrumb-item>
            	<el-breadcrumb-item>承运商回单汇总</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      </div>
    </div>
		<div class="common-condition-box">
			<el-form :inline="true" label-width="60px">
				<el-form-item label="承运商">
					<el-input placeholder="双击选择" :disabled="true" v-model="filterCondition.Carrier_Name" @dblclick.native="openDialog('carrier')" icon="close" :on-icon-click="deleteCarrier"></el-input>
				</el-form-item>
				<el-form-item label="开始日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="filterCondition.Start_Time"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束日期">
					<el-date-picker type="date" placeholder="选择日期" v-model="filterCondition.End_Time"></el-date-picker>
				</el-form-item>
				<el-form-item label="委托单号">
					<el-input placeholder="请输入委托单号" v-model="filterCondition.TransportEntrust_No"></el-input>
				</el-form-item>
				<el-form-item label="车牌号">
					<el-input placeholder="请输入车牌号" v-model="filterCondition.Vehicle_No"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="carrierSearch">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-box">
			<div class="toolbar">
				<div class="btn-box" v-if="filterCondition.Carrier_Name !== ''">承运商：{{ filterCondition.Carrier_Name }}</div>
				<div class="btn-box">总回单数：<span v-if="receiptSumm && receiptSumm.HuiDan_Num">{{ receiptSumm.HuiDan_Num }}</span><span v-else>0</span></div>
				<div class="btn-box">已回回单数：<span v-if="receiptSumm && receiptSumm.Wei_HuiDan_Num">{{ receiptSumm.Wei_HuiDan_Num }}</span><span v-else>0</span></div>
				<div class="btn-box">未回单数：<span v-if="receiptSumm && receiptSumm.Yi_HuiDan_Num">{{ receiptSumm.Yi_HuiDan_Num }}</span><span v-else>0</span></div>
				<div class="btn-box">
					<el-button type="text" icon="mo-refresh" @click="refresh">刷新</el-button>
					<el-button type="text" icon="mo-download">导出数据</el-button>
				</div>
			</div>
      <el-table :data="summarizeData">
        <el-table-column type="index" prop="Operator_Name" label="序号" width="70"></el-table-column>
        <!-- <el-table-column type="selection" prop="" label=""></el-table-column> -->
        <el-table-column prop="Departure_Time" label="接单日期" width="170"></el-table-column>
        <el-table-column prop="TransportEntrust_No" label="委托单号" width="150"></el-table-column>
        <el-table-column prop="Vehicle_No" label="车牌号"></el-table-column>
        <el-table-column prop="TotalPcs_Nums" label="总件数"></el-table-column>
        <el-table-column prop="Is_Chillcar" label="是否冷藏"></el-table-column>
        <el-table-column prop="DingDan_Num" label="订单数"></el-table-column>
        <el-table-column prop="Ssa_Num" label="客户数"></el-table-column>
        <el-table-column prop="Wei_HuiDan_Num" label="未回单数"></el-table-column>
        <el-table-column prop="Gross_Volume_Nums" label="总体积(m³)"></el-table-column>
        <el-table-column prop="Gross_Weight_Nums" label="总重量(KG)"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="primary" type="text" size="small" @click="goItem(scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
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

		<carrier-modal :visible.sync="dialogShow.carrier" @change="selectCarri" :isSetDefaultValue="false"></carrier-modal><!-- 承运商弹框 -->
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import commonRow from '@/common/components/common-row/index.js'
  import commonCol from '@/common/components/common-col'
  import commonSelect from '@/common/service/select/select-service-type'
  import carrierModal from '@/common/service/modal/carri-modal'
	export default {
		name: 'carriMainList',
		props: [],
		components: {
			commonRow,
			commonCol,
			commonSelect,
			carrierModal
		},
		data () {
				return {
					summarizeData: [],         // 委托单汇总数据
					receiptSumm: {},           // 回单汇总
					currentPage: 1,            // 分页-当前页
					pageSize: 10,              // 分页-每页的数量
					bigTotalItems: 0,          // 委托单汇总数据总数量
					filterCondition: {         // 过滤条件
						// Carrier_Id: '274cf35ecaace711b639000c29d6c8f4',
						Carrier_Id: this.$route.params.Carrier_Id || '%',
						Carrier_Name: this.$route.params.Carrier_Name || '',
						TransportEntrust_No: '',
						Vehicle_No: '',
						Start_Time: (this.$route.params.startDate === '%') ? (new Date().getFullYear() + '-01-01') : this.$route.params.startDate,
						End_Time: (this.$route.params.endDate === '%') ? (new Date().getFullYear() + '-12-30') : this.$route.params.endDate
					},
					dialogShow: {
						carrier: false
					}
				}
		},
		computed: {},
		methods: {
			handleCurrentChange () {
				this.getData()
			},
			openDialog (val) {
        this.dialogShow[val] = true
      },
			selectCarri (Rows) {
				if (Rows) {
					this.filterCondition.Carrier_Name = Rows.Carrier_Name
					this.filterCondition.Carrier_Id = Rows.Carrier_Id || '%'
					this.init()
				}
			},
			deleteCarrier () {
				this.filterCondition.Carrier_Id = '%'
				this.filterCondition.Carrier_Name = ''
			},
			goItem (row) {
			  let params = {
			  	row: JSON.stringify(row)
			  }
				this.$router.push(
					{
						name: 'carriItemList',
						params: params
					}
				)
			},
			getData () {
				console.log(Api.userInfo)
				let params = {
					Carrier_Id: (this.filterCondition.Carrier_Id === '%') ? this.filterCondition.Carrier_Id : (',' + this.filterCondition.Carrier_Id + ','),
					TransportEntrust_No: this.filterCondition.TransportEntrust_No,
					Vehicle_No: this.filterCondition.Vehicle_No,
					Start_Departure_Time: this.filterCondition.Start_Time,
					End_Departure_Time: this.filterCondition.End_Time,
					startIndex: (this.currentPage - 1) * this.pageSize,
					pageSize: this.pageSize
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('TmpCYSGetBillReceiptRecordHZ', params)
          .then((res) => {
            this.loadingWait.close()
            this.summarizeData = res.MsgInfo
            if (this.summarizeData.length === 0) {
            	this.bigTotalItems = 0
            } else {
            	this.bigTotalItems = res.MsgInfo[0].bigTotalItems
            }
          })
			},
			carrierSearch () {
				this.getData()
				this.getReceiptSumm()
			},
			getReceiptSumm () {
				let params = {
					Carrier_Id: (this.filterCondition.Carrier_Id === '%') ? this.filterCondition.Carrier_Id : (',' + this.filterCondition.Carrier_Id + ','),
					TransportEntrust_No: this.filterCondition.TransportEntrust_No,
					Vehicle_No: this.filterCondition.Vehicle_No,
					Start_Departure_Time: this.filterCondition.Start_Time,
					End_Departure_Time: this.filterCondition.End_Time
				}
				this.loadingWait = this.showLoading('请稍后...')
				Api.get('TmpCYSGetBillReceiptRecordTB', params)
					.then((res) => {
						this.loadingWait.close()
						this.receiptSumm = res.MsgInfo[0]
					})
			},
			init () {
				this.getData()
				this.getReceiptSumm()
			},
			refresh () {
				this.getData()
				this.getReceiptSumm()
			}
		},
		created () {
		},
		mounted () {
		},
		activated () {
			if (this.filterCondition.Carrier_Id !== '') {
				this.init()
			}
		}
	}
</script>
<style lang="less" scoped>
	.toolbar{
		line-height: 42px;
		margin: 15px 0;
		.btn-box{
			&:nth-last-of-type(1){
				float: right;
				button{
					margin: 0 15px;
				}
			}
		}
	}
	.block{
    margin: 60px 0 30px;
    text-align: center;
	}
</style>
