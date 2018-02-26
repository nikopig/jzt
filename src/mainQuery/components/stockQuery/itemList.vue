<template>
	<div class="item-list">
		<div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item @click.native="goBack(-1)">首页</el-breadcrumb-item>
              <el-breadcrumb-item>详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      </div>
    </div>
		<div class="common-condition-box">
			<el-form :inline="true">
				<el-form-item label="物流中心">
					<el-input v-model="filterCondition.Ldc_Name" placeholder="双击选择" :disabled="true" suffix-icon="el-icon-close" :on-icon-click="deleteLdc" @dblclick.native="openDialog('ldc')"></el-input>
				</el-form-item>
				<el-form-item label="委托方">
					<el-input v-model="filterCondition.Con_Name" placeholder="双击选择" :disabled="true" @dblclick.native="openDialog('consignor')"></el-input>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="filterCondition.Goods_Name" placeholder="双击选择" :disabled="true" suffix-icon="el-icon-close" :on-icon-click="deleteGood" @dblclick.native="openDialog('goods')"></el-input>
				</el-form-item>
				<el-form-item label="库存状态">
					<el-select v-model="filterCondition.Stock_Status" clearable placeholder="请选择">
						<el-option v-for="item in stockStatus" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click.native="getData()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small">导出</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="table-box">
			<el-table :data="itemData">
				<!-- <el-table-column prop="Ldc_No" label="物流中心编号"></el-table-column> -->
				<el-table-column prop="Ldc_Name" label="物流中心名称"></el-table-column>
				<el-table-column prop="Goods_No" label="商品编号"></el-table-column>
				<el-table-column prop="Goods_Name" label="商品名称"></el-table-column>
				<el-table-column prop="Stock_Status" label="库存状态" width="84"></el-table-column>
				<el-table-column prop="Lot_No" label="批号"></el-table-column>
				<el-table-column prop="Production_Date" label="生产日期"></el-table-column>
				<el-table-column prop="Valid_Until" label="有效期至"></el-table-column>
				<el-table-column prop="Stock_Quantity" label="库存数量"></el-table-column>
				<el-table-column prop="Outbound_Quantity" label="正在出库数量" width="110"></el-table-column>
				<el-table-column prop="Inbound_Quantity" label="正在入库数量" width="110"></el-table-column>
				<el-table-column prop="In_Transit_Quantity" label="在途数量" width="84"></el-table-column>
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
	  <ldc-modal :visible.sync="dialogShow.ldc" @change="selectLdc" :ldcId="ldcId"></ldc-modal>
	  <goods-modal :visible.sync="dialogShow.goods" @change="selectGood" :transFields="transFields" :conId="goodsModalCon_Id"></goods-modal>
	  <common-modal ref="staffCons" DialogTitle="委托方信息" :isVisible.sync="dialogShow.consignor" :TableHeader="consignor.TableHeader" :listData="consignor.cons" :total="consignor.bigTotalItems" @confirm="selectConsignor" @search="searchConsignor" @pageChange="consPageChange"></common-modal>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import ldcModal from '@/common/service/modal/ldc-modal'
	import goodsModal from '@/common/service/modal/goods-modal'
	import commonModal from '@/common/components/common-modal'
	export default {
		name: 'stockItemList',
		data () {
			return {
				itemData: [],
				filterCondition: {
					Ldc_Id: '%',
					Ldc_Name: '',
					Con_Id: this.$route.params.Con_Id,
					Con_Name: this.$route.params.Con_Name,
					Goods_Id: '%',
					Goods_Name: '',
					Stock_Status: ''
				},
				stockStatus: [],
				ldcId: this.$route.params.Ldc_Id,
				currentPage: 1,
				pageSize: 10,
				bigTotalItems: 0,
				dialogShow: {
					ldc: false,
					goods: false,
					consignor: false
				},
				consignor: {
					TableHeader: [],
					cons: [],
					KeyWords: '%',
					bigTotalItems: 0,
					currentPage: 1,
					pageSize: 10
				},
				transFields: [
					{
            title: '商品名称',
            field: 'Goods_Name',
            width: 200
          },
          {
            title: '商品编号',
            field: 'Goods_No',
            width: 140
          },
          {
            title: '助记码',
            field: 'Mnemonic_Code'
          },
					{
						title: '药品规格',
            field: 'Drug_Spec'
					},
					{
						title: '厂家',
            field: 'Manufacturer',
            width: 200
					},
					{
						title: '包装数',
            field: 'Package_Qty'
					},
					{
						title: '包装单位',
            field: 'Package_Unit'
					}
				],
				goodsModalCon_Id: this.$route.params.Con_Id
			}
		},
		components: {
			ldcModal,
			goodsModal,
			commonModal
		},
		methods: {
			goBack (step) {
				this.$router.go(step)
			},
			handleCurrentChange () {
				this.getData()
			},
			deleteLdc () {
				this.filterCondition.Ldc_Id = '%'
				this.filterCondition.Ldc_Name = ''
			},
			deleteGood () {
				this.filterCondition.Goods_Id = '%'
				this.filterCondition.Goods_Name = ''
			},
			selectLdc (row) {
				if (row) {
					this.filterCondition.Ldc_Id = row.Ldc_Id
					this.filterCondition.Ldc_Name = row.Ldc_Name
				}
			},
			selectGood (row) {
				this.filterCondition.Goods_Id = row.Goods_Id
				this.filterCondition.Goods_Name = row.Goods_Name
			},
			openDialog (val) {
        this.dialogShow[val] = true
      },
      getStockStatus () {
      	let params = {}
      	Api.get('DS_KC_GetStockStatusFieldByFieldName', params, true).then((res) => {
      		if (res.Flag) {
      			this.stockStatus = res.MsgInfo
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      selectConsignor (row) {
      	this.filterCondition.Con_Id = row.Con_Id
      	this.filterCondition.Con_Name = row.Con_Name
      	this.goodsModalCon_Id = this.filterCondition.Con_Id
      },
      searchConsignor (keyword) {
      	this.consignor.KeyWords = keyword
      	this.getCons()
      },
      consPageChange (num) {
      	this.consignor.currentPage = num
      	this.getCons()
      },
      getCons () {
      	let params = {
      		KeyWords: this.consignor.KeyWords,
      		StartPage: (this.consignor.currentPage - 1) * this.consignor.pageSize,
      		EndPage: this.consignor.currentPage * this.consignor.pageSize
      	}
      	// this.loadingWait = this.showLoading('请稍候...')
      	Api.get('DS_KC_GetConsByStaffId', params, false).then((res) => {
      		// this.loadingWait.close()
      		if (res.Flag) {
      			this.consignor.cons = res.MsgInfo
      			if (this.consignor.cons.length === 0) {
      				this.consignor.bigTotalItems = 0
      			} else {
      				this.consignor.bigTotalItems = this.consignor.cons[0].TotalPage
      			}
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
			getData () {
				let params = {
					LDC_ID: this.filterCondition.Ldc_Id,
					Con_Id: this.filterCondition.Con_Id,
					Goods_Id: this.filterCondition.Goods_Id,
					Stock_Status: (this.filterCondition.Stock_Status === '') ? '%' : this.filterCondition.Stock_Status,
					StartPage: (this.currentPage - 1) * this.pageSize,
					EndPage: this.currentPage * this.pageSize
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('DS_KC_GetLdcStocksByLdcId', params, true).then((res) => {
					this.loadingWait.close()
					if (res.Flag) {
						this.itemData = res.MsgInfo
						if (this.itemData.length === 0) {
							this.bigTotalItems = 0
						} else {
							this.bigTotalItems = this.itemData[0].TotalPage
						}
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			init () {
				this.filterCondition.Ldc_Id = this.$route.params.Ldc_Id
				this.filterCondition.Con_Id = this.$route.params.Con_Id
				this.filterCondition.Con_Name = this.$route.params.Con_Name
				this.goodsModalCon_Id = this.filterCondition.Con_Id
				this.consignor.TableHeader = JSON.parse(this.$route.params.TableHeader)
				this.getStockStatus()
				this.getData()
				this.getCons()
			}
		},
		activated () {
			this.init()
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less" scoped>
	
</style>