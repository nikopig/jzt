<template>
	<div>
		<div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
            <el-breadcrumb separator="/">
            	<el-breadcrumb-item @click.native="go(-3)">首页</el-breadcrumb-item>
              <el-breadcrumb-item @click.native="go(-2)">承运商回单汇总</el-breadcrumb-item>
              <el-breadcrumb-item @click.native="go(-1)">委托单详情</el-breadcrumb-item>
              <el-breadcrumb-item>回单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      </div>
    </div>
		<div class="toolbar">
			<div class="btn-box">委托方订单号：{{ params.ConOrder_No }}</div>
			<div class="btn-box">客户名称：{{ params.Ssa_Name }}</div>
			<div class="btn-box">起点地址：{{ params.Start_Address }}</div>
			<div class="btn-box">终点地址：{{ params.End_Address }}</div>
		</div>
		<div class="receipt-detail-box">
			<el-card class="box-card" v-for="(item, index) in receiptDetailData" :key="index">
			  <el-row :gutter="20">
				  <el-col :span="4">
				  	<div class="grid-content"><span>日期：</span><span>{{ item.Operate_Time }}</span></div>
			  	</el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>单据状态：</span><span>{{ item.Bill_TransportA_Dtl_State_Name }}</span></div>
			  	</el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>快递公司：</span><span>{{ item.Courier_Company }}</span></div>
			  	</el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>发件人姓名：</span><span>{{ item.Sender_Name }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>收件人姓名：</span><span>{{ item.Transfer_Name }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>接收人姓名：</span><span>{{ item.Receipt_Name }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>快递单号：</span><span>{{ item.Courier_Number }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>返回方式：</span><span>{{ item.ComeBack_Way_Name }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>回单接收方：</span><span>{{ item.ComeBack_Sign_Name }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>发件人电话：</span><span>{{ item.Sender_Tel }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>收件人电话：</span><span>{{ item.Transfer_Tel }}</span></div>
				  </el-col>
				  <el-col :span="4">
				  	<div class="grid-content"><span>接收人电话：</span><span>{{ item.Receipt_Tel }}</span></div>
				  </el-col>
				</el-row>
			</el-card>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Api from '@/common/js/api'
	export default{
		name: 'receiptDetailList',
		props: [],
		components: {},
		data () {
			return {
				params: {},
				receiptDetailData: []
			}
		},
		computed: {},
		methods: {
			goBack (step) {
				this.$router.go(step)
			},
			getData () {
				let params = {
					BillTransportA_Dtl_Id: this.params.BillTransportA_Dtl_Id
				}
				console.log(params)
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('TMP_Bill_Receipt_Record', params)
          .then((res) => {
            this.loadingWait.close()
            this.receiptDetailData = res.MsgInfo
            this.receiptDetailData.sort((a, b) => {
					    return Date.parse(b.Operate_Time) - Date.parse(a.Operate_Time) //时间正序
						})
            console.log(res.MsgInfo)
          })
			},
			init () {
				this.params = JSON.parse(this.$route.params.row)
				this.getData()
			}
		},
		created () {},
		mounted () {
		},
		activated () {
			this.init()
		}
	}
</script>

<style lang="less" scoped>
	.toolbar{
		line-height: 42px;
		margin: 15px 0;
		.btn-box{
			padding-top: 0;
			padding-bottom: 0;
		}
	}
	.receipt-detail-box{
		line-height: 24px;
		.grid-content{
			display: flex;
			span{
				display: inline-block;
				&:nth-of-type(1){
					width: 74px;
					text-align: right;
				}
				&:nth-last-of-type(1){
					flex: 1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
	.box-card{
		margin-bottom: 15px;
	}
</style>
