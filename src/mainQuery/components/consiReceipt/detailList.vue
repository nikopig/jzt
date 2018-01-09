<template>
	<div>
		<div class="headbar">
        <div class="common-row">
          <label>当前位置：</label>
          <div class="common-col">
              <el-breadcrumb separator="/">
                 <el-breadcrumb-item @click.native="go(-3)">首页</el-breadcrumb-item>
                 <el-breadcrumb-item @click.native="go(-2)">回单汇总</el-breadcrumb-item>
                 <el-breadcrumb-item @click.native="go(-1)">回单明细</el-breadcrumb-item>
                 <el-breadcrumb-item>回单详情</el-breadcrumb-item>
              </el-breadcrumb>
          </div>
        </div>
    </div>
		<div class="table-box">
            <el-table :data="origData" stripe>
              <el-table-column type="index" label="序号" width="80"></el-table-column>
              <el-table-column prop="Goods_No" label="商品编号"></el-table-column>
              <el-table-column prop="Goods_Name" label="商品名称"></el-table-column>
              <el-table-column prop="Actual_Pcs" label="件数"></el-table-column>
              <el-table-column prop="Planned_Volume" label="体积cm³"></el-table-column>
              <el-table-column prop="Planned_Weight" label="重量kg"></el-table-column>
              <el-table-column prop="Refrigeration_Type_Name" label="温层"></el-table-column>
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
				currentPage: 1,
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
			handleCurrentChange () {
	            this.page.startIndex = (this.currentPage - 1) * this.page.pageSize
	            this.getData()
	        },
			goBack (step) {
				this.$router.go(step)
			},
			getData () {
				let param = {}
				let params = this.$route.params
				param.Bill_Dtl_Id = params.Bill_Dtl_Id
				param.startIndex = this.page.startIndex
            	param.pageSize = this.page.pageSize
            	this.loadingWait = this.showLoading('加载中...')
				Api.get('TmpCSNGetBillReceiptRecordTwoMX', param, true).then(res => {
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
		activated () {
			this.init()
		}
	}
</script>

<style scoped>
	.block {
        margin: 60px 0 30px;
        text-align: center;
      }
</style>
