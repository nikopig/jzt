<template>
	<div>
		<div class="headbar">
	        <div class="common-row">
		        <label>当前位置：</label>
		        <div class="common-col">
		            <el-breadcrumb separator="/">
                   <el-breadcrumb-item @click.native="go(-2)">首页</el-breadcrumb-item>
		               <el-breadcrumb-item @click.native="go(-1)">回单汇总</el-breadcrumb-item>
		               <el-breadcrumb-item>回单明细</el-breadcrumb-item>
		            </el-breadcrumb>
		        </div>
	        </div>
	    </div>
    <div class="common-condition-box">
	    <el-form :inline="true" size="small" label-width="px">
        <el-form-item label="客户名称：">
            <el-input placeholder="助记码、名字、编号" v-model="Ssa_Name"></el-input>
        </el-form-item>
        <el-form-item label="单据编号：">
            <el-input v-model="ConOrder_No"></el-input>
        </el-form-item>
	    </el-form>
    </div>
		<div class="table-box">
            <el-table :data="origData" stripe @selection-change="selectData">
              <el-table-column type="index" label="序号" width="60" class="number"></el-table-column>
              <el-table-column prop="Invoice_Time" label="下单日期" width="120" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="ConOrder_No" label="委托方单号" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="TransportPlan_Type_Name" label="运输类型" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Ssa_Name" label="客户名称" width="150" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Contact_Name" label="联系人" width="80" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Contact_Phone" label="联系方式" width="120" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Refrigeration_Type_Name" label="温层" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Bill_TransportA_Dtl_State_Name" label="订单状态" width="110" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Operate_Time " label="签收日期" width="110" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="回单照片查看" width="110">
                <template slot-scope="scope">
                  <el-button
                    class="primary"
                    type="text"
                    size="small"
                    @click="goPhoto(scope.$index, scope.row)">查看
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    class="primary"
                    type="text"
                    size="small"
                    @click="goItem(scope.$index, scope.row)">查看明细
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="block">
          <el-pagination
          	v-show="page.isShow"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="page.bigTotalItems">
          </el-pagination>
        </div>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	export default {
		name: 'consiItemList',
		data () {
			return {
				selectTableData: [],
				currentPage: 1,
				ConOrder_No: '',
				receiptImg: '',
				Ssa_Name: '',
	            page: {
	                startIndex: 0,
	                pageSize: 10,
	                bigTotalItems: 0,
	                isShow: false
	            },
				origData: []
			}
		},
		methods: {
			selectData (val) {		// 全选框
				this.selectTableData = val
				console.log(this.selectTableData)
			},
			handleCurrentChange () {		// 分页
	            this.page.startIndex = (this.currentPage - 1) * this.page.pageSize
	            this.getData()
	        },
			goBack (step) {		// 回退
				this.$router.go(step)
			},
			goPhoto (index, row) {
				let param = {
					Bill_Dtl_Id: row.Bill_Dtl_Id
				}
				Api.get('TMP_Bill_TransportA_Dtl_Get_ImgUrl', param).then(res => {
					console.log(res)
					if (res.Flag) {
						let data = res.MsgInfo[0].Bill_TransportA_Dtl
						if (res.MsgInfo[0].Bill_TransportA_Dtl !== null && res.MsgInfo[0].Bill_TransportA_Dtl !== '') {
					    this.receiptImg = 'ftp://ftpuser:Jztftp321@10.3.87.38/tmp/imagebill/' + data.substring(data.lastIndexOf('\\') + 1)
					    let tempwindow = window.open('_blank')
							tempwindow.location = this.receiptImg
						} else {
							this.$alert('未上传回单', '提示', {
								confirmButtonText: '确定'
							})
						}
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			goItem (index, row) {	// 传递到三级
				this.$router.push({
					name: 'consiDetailList',
					params: {
						Bill_Dtl_Id: row.Bill_Dtl_Id
					}
				})
			},
			getData () {	// 获取数据
				// {'Ssa_Name':'13','Bill_Dtl_Id','123'}
				let param = {}
				param.Courier_Number = this.$route.params.Courier_Number
				param.Ssa_Name = this.Ssa_Name ? this.Ssa_Name : '%'
				param.ConOrder_No = this.ConOrder_No ? this.ConOrder_No : '%'
				param.startIndex = this.page.startIndex
            	param.pageSize = this.page.pageSize
            	this.loadingWait = this.showLoading('加载中...')
				Api.get('TmpCSNGetBillReceiptRecordOneMX', param, true).then(res => {
					this.loadingWait.close()
					if (res.Flag) {
						this.origData = res.MsgInfo
						if (this.origData[0].bigTotalItems > this.page.pageSize) {
		                    this.page.isShow = true
		                }
						this.page.bigTotalItems = this.origData.length ? this.origData[0].bigTotalItems : 0
					}
				})
			},
			init () {
				this.getData()
			}
		},
		watch: {
			ConOrder_No () {
				this.getData()
			},
			Ssa_Name () {
				this.getData()
			}
		},
		activated () {
			this.init()
		}
	}
</script>

<style lang="less" scoped>
	.table-box {
		.number {
			padding: 0 5px !important;
		}
	}
	.block {
    margin: 60px 0 30px;
    text-align: center;
  }
</style>
