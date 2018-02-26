<template>
	<div>
		<div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
            <el-breadcrumb separator="/">
            	<el-breadcrumb-item @click.native="go(-2)">首页</el-breadcrumb-item>
              <el-breadcrumb-item @click.native="go(-1)">承运商回单汇总</el-breadcrumb-item>
              <el-breadcrumb-item>委托单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="common-condition-box">
    	<el-form :inline="true" label-width="60px">
    		<common-row type="flex">
					<common-col>
						<el-form-item label="电子回单回传状态">
		          <select-dictionary type="radio" field="Is_Receipt_Upload" v-model="filterCondition.Is_Receipt_Upload"></select-dictionary>
		        </el-form-item>
					</common-col>
				</common-row>
				<common-row type="flex">
					<common-col>
						<el-form-item label="纸质回单回传状态">
		          <el-radio-group v-model="filterCondition.Bill_TransportA_Dtl_State">
		          	<el-radio label="1">回单未回传</el-radio>
						    <el-radio v-for="(item, index) in Bill_TransportA_Dtl_States" :key="index" :label="item.Value_Data" v-if="item.Value_Data == 'T91' || item.Value_Data == 'T92' || item.Value_Data == 'T93' || item.Value_Data == '%'">{{item.Value_Desc}}</el-radio>
						  </el-radio-group>
		        </el-form-item>
					</common-col>
				</common-row>

				<el-form-item label="单据编号">
					<el-input placeholder="请输入单据编号" v-model="filterCondition.ConOrder_No"></el-input>
				</el-form-item>
				<el-form-item label="客户名称">
					<el-input placeholder="请输入客户名称、助记码、编号" v-model="filterCondition.Ssa_Name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="getData()">查询</el-button>
				</el-form-item>
    	</el-form>
    </div>
		<div class="table-box">
			<div class="toolbar">
				<div class="btn-box">委托单号：{{ params.TransportEntrust_No }}</div>
				<div class="btn-box">承运方：{{ params.Carrier_Name }}</div>
				<div class="btn-box">
					<el-button type="text" icon="el-icon-mo-submit" @click.native="showReceiptDialog">回单回传</el-button>
					<el-button type="text" icon="el-icon-mo-submit" @click.native="showUploadDialog">回单上传</el-button>
				</div>
			</div>
			<ul class="transEntrustInfo">
				<li>
					<span>运单运营方</span>
					<span :title="params.Operator_Name">{{ params.Operator_Name }}</span>
				</li>
				<li>
					<span>运输方式</span>
					<span :title="params.Transport_Mode_Name">{{ params.Transport_Mode_Name }}</span>
				</li>
				<li>
					<span>承运方联系人</span>
					<span :title="params.Contact_Name">{{ params.Contact_Name }}</span>
				</li>
				<li>
					<span>承运方联系电话</span>
					<span :title="params.Contact_Phone">{{ params.Contact_Phone }}</span>
				</li>
				<li>
					<span>司机</span>
					<span :title="params.Staff_Name">{{ params.Staff_Name }}</span>
				</li>
				<li>
					<span>司机电话</span>
					<span :title="params.Mobilephone">{{ params.Mobilephone }}</span>
				</li>
				<li>
					<span>司机身份ID</span>
					<span :title="params.Number_Id">{{ params.Number_Id }}</span>
				</li>
				<li>
					<span>车牌号</span>
					<span :title="params.Vehicle_No">{{ params.Vehicle_No}}</span>
				</li>
				<li>
					<span>温层</span>
					<span :title="params.Storage_Temp_Name">{{ params.Storage_Temp_Name }}</span>
				</li>
				<li>
					<span>车型</span>
					<span :title="params.Vehbrand_Model">{{ params.Vehbrand_Model }}</span>
				</li>
				<li>
					<span>车辆荷载件数</span>
					<span :title="params.Loading_Num">{{ params.Loading_Num }}</span>
				</li>
				<li>
					<span>车厢内尺寸</span>
					<span :title="params.Inside_Size">{{ params.Inside_Size }}</span>
				</li>
			</ul>
			<el-table :data="receiptData" @selection-change="getSelectData" :row-class-name="tableRowClassName">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column type="selection" label=""></el-table-column>
          <el-table-column prop="Con_Name" label="委托方"></el-table-column>
          <el-table-column prop="ConOrder_No" label="订单号"></el-table-column>
          <el-table-column prop="Bill_TransportA_Dtl_State_Name" label="回单状态"></el-table-column>
          <el-table-column prop="Is_Receipt_Upload_Name" label="是否上传"></el-table-column>
          <el-table-column prop="TransportPlan_Type_Name" label="运输计划类型"></el-table-column>
          <el-table-column prop="Transport_Type_Name" label="运输类别"></el-table-column>
          <el-table-column prop="Ssa_Name" label="客户名称"></el-table-column>
          <el-table-column prop="Start_Address" label="起点地址"></el-table-column>
          <el-table-column prop="End_Address" label="终点地址"></el-table-column>
          <el-table-column prop="TotalPcs_Num" label="总件数"></el-table-column>
          <el-table-column prop="Gross_Weight" label="总重量（KG）"></el-table-column>
          <el-table-column prop="Gross_Volume" label="总体积（m³）"></el-table-column>
          <el-table-column label="回单信息">
            <template slot-scope="scope">
              <el-button class="primary" type="text" size="small" @click="goReceiptDetial(scope.row)">回单信息</el-button>
            </template>
          </el-table-column>
          <el-table-column label="订单详情">
            <template slot-scope="scope">
              <el-button class="primary" type="text" size="small" @click="goOrderDetial(scope.row)">订单详情</el-button>
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

		<transfer-modal :visible.sync="dialogShow.transfer" @change="selectTransfer"></transfer-modal> <!-- 收件人弹框 -->
		
		<el-dialog title="回单上传" :visible.sync="dialogShow.receiptUpload" class="uploadDialog">
			<!-- <el-upload class="upload-receipt" ref="upload" action="/upload/DataToHisService/web/IndexController/picupload" :on-success="uploadSuccess" :on-error="uploadFail" :auto-upload="false">
			  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
			</el-upload> --><!-- 本地 -->
			<el-upload class="upload-receipt" ref="upload" action="http://10.2.57.90:8099/DataToHisService/web/IndexController/picupload" :on-success="uploadSuccess" :on-error="uploadFail" :auto-upload="false">
			  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
			  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
			</el-upload>
		</el-dialog><!-- 回单上传弹框 -->

    <el-dialog title="回单回传" :visible.sync="dialogShow.receiptBack" class="receiptDialog">
		  <el-form :rules="rules" :model="receiptInfo" ref="receiptInfo">
		  	<common-row>
		  		<common-col>
		  			<el-form-item label="回单接收方" prop="ComeBack_Sign">
				      <el-select v-model="receiptInfo.ComeBack_Sign" placeholder="请选择" @change="resetValidate('receiptInfo')">
						    <el-option
						      v-for="item in ComeBack_Signs"
						      :key="item.Value_Data"
						      :label="item.Value_Desc"
						      :value="item.Value_Data">
						    </el-option>
						  </el-select>
				    </el-form-item>
		  		</common-col>
		  		<common-col>
		  			<el-form-item label="返回方式" prop="ComeBack_Way">
				      <el-select v-model="receiptInfo.ComeBack_Way" placeholder="请选择" @change="resetValidate('receiptInfo')">
						    <el-option
						      v-for="item in ComeBack_Ways"
						      :key="item.Value_Data"
						      :label="item.Value_Desc"
						      :value="item.Value_Data">
						    </el-option>
						  </el-select>
				    </el-form-item>
		  		</common-col>
		  		<common-col v-if="receiptInfo.ComeBack_Way == 1">
		  			<el-form-item label="快递公司" prop="Courier_Company">
				      <el-input v-model="receiptInfo.Courier_Company" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col v-if="receiptInfo.ComeBack_Way == 1">
		  			<el-form-item label="快递单号" prop="Courier_Number">
				      <el-input v-model="receiptInfo.Courier_Number" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col>
		  			<el-form-item label="发件人姓名" prop="Sender_Name">
				      <el-input v-model="receiptInfo.Sender_Name" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col>
		  			<el-form-item label="发件人电话" prop="Sender_Tel">
				      <el-input v-model="receiptInfo.Sender_Tel" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col v-if="receiptInfo.ComeBack_Sign == 1">
		  			<el-form-item label="收件人姓名" prop="Transfer_Name">
				      <el-input placeholder="双击选择" v-model="receiptInfo.Transfer_Name" @dblclick.native="openDialog('transfer')"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col v-if="receiptInfo.ComeBack_Sign == 2">
		  			<el-form-item label="收件人姓名" prop="Transfer_Name">
				      <el-input v-model="receiptInfo.Transfer_Name" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col>
		  			<el-form-item label="收件人电话" prop="Transfer_Tel">
				      <el-input v-model="receiptInfo.Transfer_Tel" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col v-if="receiptInfo.ComeBack_Way != 1">
		  			<el-form-item label="接收人姓名" prop="Receipt_Name">
				      <el-input v-model="receiptInfo.Receipt_Name" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  		<common-col v-if="receiptInfo.ComeBack_Way != 1">
		  			<el-form-item label="接收人电话" prop="Receipt_Tel">
				      <el-input v-model="receiptInfo.Receipt_Tel" auto-complete="off"></el-input>
				    </el-form-item>
		  		</common-col>
		  	</common-row>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="resetForm('receiptInfo')">取 消</el-button>
		    <el-button type="primary" @click="receiptInfoSubmit('receiptInfo')">确 定</el-button>
		  </div>
		</el-dialog><!-- 回单回传弹框 -->
	</div>
</template>

<script type="text/javascript">
	import Api from '@/common/js/api'
	import {DateFtt} from '@/common/js/utils'
	import commonRow from '@/common/components/common-row/index.js'
  import commonCol from '@/common/components/common-col'
  import selectDictionary from '@/common/service/select/select-dictionary'
  import transferModal from '@/common/service/modal/transfer-modal'
	export default{
		name: 'carriItemList',
		props: [],
		components: {
			commonRow,
			commonCol,
			selectDictionary,
			transferModal
		},
		data () {
			return {
				params: {},                            // 路由接收参数
				currentPage: 1,                        // 分页-当前页
				pageSize: 10,                          // 分页-每页的数量
				receiptData: [],                       // 委托单详情数据
				Bill_TransportA_Dtl_States: [],        // 纸质回单回传状态
				ComeBack_Signs: [],                    // 回单回传-回传方式
				ComeBack_Ways: [],                     // 回单回传-返回方式
				selectDatas: [],                       // table选中数据
				filename: '',
				bigTotalItems: 0,
				fileName: '',                          // 图片路径
				filterCondition: {                     // 过滤条件
					Is_Receipt_Upload: '',
					Bill_TransportA_Dtl_State: '1',
					ConOrder_No: '',
					Ssa_Name: ''
				},
				receiptInfo: {                         // 回单回传数据
					ComeBack_Sign: '',
					ComeBack_Way: '',
					Transfer_Name: '',
					Sender_Tel: ''
				},
				dialogShow: {                         // 是否显示弹框
					transfer: false,
					receiptBack: false,
					receiptUpload: false
				},
				rules: {                              // 回单回传验证规则
					ComeBack_Sign: [
						{required: true, message: '请选择回单接收方', trigger: 'change'}
					],
					ComeBack_Way: [
						{required: true, message: '请选择返回方式', trigger: 'change'}
					],
					Courier_Company: [
						{required: true, message: '请输入快递公司', trigger: 'blur'}
					],
					Courier_Number: [
						{required: true, message: '请输入快递单号', trigger: 'blur'}
					],
					Sender_Name: [
						{required: true, message: '请输入发件人姓名', trigger: 'blur'}
					],
					Sender_Tel: [
						{required: true, message: '请输入发件人电话', trigger: 'blur'}
					],
					Transfer_Name: [
						{required: true, message: '请输入收件人姓名', trigger: 'blur'}
					],
					Transfer_Tel: [
						{required: true, message: '请输入收件人电话', trigger: 'blur'}
					],
					Receipt_Name: [
						{required: true, message: '请输入接收人姓名', trigger: 'blur'}
					],
					Receipt_Tel: [
						{required: true, message: '请输入接收人电话', trigger: 'blur'}
					]
				}
			}
		},
		computed: {},
		methods: {
			handleCurrentChange () {
				this.getData()
			},
			goBack (step) {
				this.$router.go(step)
			},
			tableRowClassName (row, rowIndex) {
				if (row.Is_Receipt_Upload === 'Y') {
          return 'on'
        }
        return ''
			},
			goReceiptDetial (row) {
				let params = {
			  	row: JSON.stringify(row)
			  }
				this.$router.push({
					name: 'receiptDetailList',
					params: params
				})
			},
			goOrderDetial (row) {
				let params = {
					summarizeRow: JSON.stringify(this.params),
			  	row: JSON.stringify(row)
			  }
				this.$router.push({
					name: 'orderDetailList',
					params: params
				})
			},
			getData () {
				let params = {
					TransportEntrust_Hdr_Id: this.params.TransportEntrust_Hdr_Id,
					Is_Receipt_Upload: this.filterCondition.Is_Receipt_Upload,
					Bill_TransportA_Dtl_State: this.filterCondition.Bill_TransportA_Dtl_State,
					ConOrder_No: this.filterCondition.ConOrder_No,
					Ssa_Name: this.filterCondition.Ssa_Name,
					startIndex: (this.currentPage - 1) * this.pageSize,
					pageSize: this.pageSize
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('TmpCYSGetBillReceiptRecordMX', params, true)
          .then((res) => {
            this.loadingWait.close()
            this.receiptData = res.MsgInfo

            if (this.receiptData.length === 0) {
            	this.bigTotalItems = 0
            } else {
            	this.bigTotalItems = res.MsgInfo[0].bigTotalItems
            }
          })
			},
			loadField () {
				// 纸质回单回传状态
				Api.get('FdGetFiledDtl', { Field_Name: 'Bill_TransportA_Dtl_State' })
          .then((resp) => {
            if (resp.Flag) {
              this.Bill_TransportA_Dtl_States = resp.MsgInfo
              // 如果以单选框类型展示，加入‘全部’选项
              this.Bill_TransportA_Dtl_States.push({
                Value_Data: '%',
                Value_Desc: '全部'
              })
            }
          })

        // 回单接收方
        Api.get('TMP_Fd_Field_Dtl', { Field_Name: 'ComeBack_Sign' })
          .then((resp) => {
            if (resp.Flag) {
              this.ComeBack_Signs = resp.MsgInfo
              if (this.ComeBack_Signs.length > 0) {
              	this.receiptInfo.ComeBack_Sign = this.ComeBack_Signs[0].Value_Data
              }
            }
          })

        // 回传方式
        Api.get('TMP_Fd_Field_Dtl', { Field_Name: 'ComeBack_Way' })
          .then((resp) => {
            if (resp.Flag) {
              this.ComeBack_Ways = resp.MsgInfo
              if (this.ComeBack_Ways.length > 0) {
              	this.receiptInfo.ComeBack_Way = this.ComeBack_Ways[0].Value_Data
              }
            }
          })
			},
			getSelectData (val) {
				this.selectDatas = val
			},
			showReceiptDialog () {
				if (this.selectDatas.length > 0) {
					for (let item of this.selectDatas) {
						if (item.Bill_TransportA_Dtl_State <= 'T63') {
							if (item.Bill_TransportA_Dtl_State !== 'T60' && item.Bill_TransportA_Dtl_State !== 'T62') {
								this.$alert('配送未完成，不能进行回单回传的操作！', '友情提示', {
			            confirmButtonText: '确定'
			          })
			          return false
							}
						}
						if (item.Bill_TransportA_Dtl_State === 'T91' || item.Bill_TransportA_Dtl_State === 'T92') {
							this.$alert('已经回单回传，不能再次进行回单回传！', '友情提示', {
		            confirmButtonText: '确定'
		          })
		          return false
						}
						if (item.Bill_TransportA_Dtl_State === 'ZZ' || item.Bill_TransportA_Dtl_State === 'T93') {
							this.$alert('回单状态为作业终止或者回单未确认的订单不能再次进行回单回传！', '友情提示', {
		            confirmButtonText: '确定'
		          })
		          return false
						}
					}
					this.dialogShow.receiptBack = true
				} else {
					this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
				}
			},
			resetForm (formName) {
				this.dialogShow.receiptBack = false
        this.$refs[formName].resetFields()
      },
      resetValidate (formName) {
      	let comeBackSign = this.receiptInfo.ComeBack_Sign
      	let comeBackWay = this.receiptInfo.ComeBack_Way
      	this.$refs[formName].resetFields()
      	this.receiptInfo.ComeBack_Sign = comeBackSign
      	this.receiptInfo.ComeBack_Way = comeBackWay
      },
      updateBillTransDtl (params) {
      	Api.basePost('TMP_Bill_TransportA_Dtl_Save', params, true)
					.then((res) => {
						if (res.Flag) {
							this.getData()
						}
					})
			},
			receiptInfoSubmit (formName) {
				let params = []
				let transDelParams = []
				let billTransportState = ''

				if (this.receiptInfo.ComeBack_Sign === '1') { // 运营方
          billTransportState = 'T91'
        } else { // 委托方
          billTransportState = 'T93'
        }

				this.$refs[formName].validate((valid) => {
          if (valid) {
            for (let item of this.selectDatas) {
							let obj = {}
							let transDtlObj = {}
							// 更新明细表参数
              transDtlObj = {
                Bill_Dtl_Id: item.BillTransportA_Dtl_Id,
                changetype: 'updated'
              }
              if (this.receiptInfo.ComeBack_Sign === '1') {
              	if (item.Bill_TransportA_Dtl_State === 'T92') {
              		this.$alert('已经回单签收的订单不能再次进行运营方的回单回单，回单回传时的回单接收方只能选择委托方！', '友情提示', {
				            confirmButtonText: '确定'
				          })
              	}
              }
              transDtlObj.Bill_TransportA_Dtl_State = billTransportState
							if (this.receiptInfo.ComeBack_Way === '1') {
								obj = {
									Receipt_Record_Id: this.createdGuid(5, 10),
		              BillTransportA_Hdr_Id: item.BillTransportA_Hdr_Id,
		              BillTransportA_Dtl_Id: item.BillTransportA_Dtl_Id,
		              Bill_TransportA_Dtl_State: billTransportState, // 回单已回传
		              ComeBack_Sign: this.receiptInfo.ComeBack_Sign,
		              ComeBack_Way: this.receiptInfo.ComeBack_Way,
		              Operator: Api.userInfo.Staff_Id,
		              //Operator: '123',
		              Operate_Time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date(), false),
		              Courier_Company: this.receiptInfo.Courier_Company,
		              Courier_Number: this.receiptInfo.Courier_Number,
		              Sender_Name: this.receiptInfo.Sender_Name,
		              Sender_Tel: this.receiptInfo.Sender_Tel,
		              Transfer_Name: this.receiptInfo.Transfer_Name,
		              Transfer_Tel: this.receiptInfo.Transfer_Tel,
		              Created_Time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date(), false),
		              changetype: 'inserted'
								}
							} else {
								let fhdh = ''
                Api.post('TMP_CreateNo', { NumType: 'FHD' }).then((res) => {
              		if (res.flag) {
              			//成功处理
                    fhdh = res.MsgInfo
              		} else {
              			//失败处理
                    this.$alert(res.ErrInfo, '提示', {
                    	confirmButtonText: '确定'
                    })
              		}
              	})
								obj = {
									Receipt_Record_Id: this.createdGuid(5, 10),
		              BillTransportA_Hdr_Id: item.BillTransportA_Hdr_Id,
		              BillTransportA_Dtl_Id: item.BillTransportA_Dtl_Id,
		              ComeBack_Sign: this.receiptInfo.ComeBack_Sign,
		              ComeBack_Way: this.receiptInfo.ComeBack_Way,
		              Bill_TransportA_Dtl_State: billTransportState, // 回单已回传
		              Operator: Api.userInfo.Staff_Id,
		              //Operator: '123',
		              Operate_Time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date(), false),
		              Courier_Number: '',
		              Sender_Name: this.receiptInfo.Sender_Name,
		              Sender_Tel: this.receiptInfo.Sender_Tel,
		              Receipt_Name: this.receiptInfo.Receipt_Name,
		              Receipt_Tel: this.receiptInfo.Receipt_Tel,
		              Created_Time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date(), false),
		              changetype: 'inserted'
								}
							}
							params.push(obj)
              transDelParams.push(transDtlObj)
						}
						Api.basePost('TMP_Bill_Receipt_Record_Save', params, true)
							.then((res) => {
								this.dialogShow.receiptBack = false
								this.$alert('保存成功！', '友情提示', {
			            confirmButtonText: '确定',
			            callback: action => {
										this.getData()
										this.resetForm(formName)
			            }
			          })
							})
						this.updateBillTransDtl(transDelParams)
          } else {
            return false
          }
        })
			},
			createdGuid (len, radix) {
				let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
		    let uuid = []
		    let i
		    radix = radix || chars.length
		    if (len) {
		        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
		    } else {
		        let r
		        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
		        uuid[14] = '4'
		        for (i = 0; i < 36; i++) {
		            if (!uuid[i]) {
		                r = 0 | Math.random() * 16
		                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
		            }
		        }
		    }
		    return uuid.join('')
			},
			openDialog (val) {
        this.dialogShow[val] = true
      },
			selectTransfer (Rows) {
				this.receiptInfo.Transfer_Name = Rows.Staff_Name
				this.receiptInfo.Transfer_Tel = Rows.Mobilephone
			},
			showUploadDialog () {
				if (this.selectDatas.length > 0) {
					if (this.selectDatas.length > 1) {
						this.$alert('回单上传操作不能选择多个！', '友情提示', {
	            confirmButtonText: '确定'
	          })
					} else {
						// 允许上传
						this.dialogShow.receiptUpload = true
					}
				} else {
					this.$alert('未选择数据，请选择后再执行！', '友情提示', {
						confirmButtonText: '确定'
					})
				}
			},
			submitUpload () {
        this.$refs.upload.submit()
      },
      uploadSuccess (res, file, fileList) {
      	if (res.Flag) {
      		let filesrc = res.MsgInfo.fileName
      		let filename = ''
      		if (filesrc.indexOf('/') > 0) {
		        filename = filesrc.substring(filesrc.lastIndexOf('/') + 1, filesrc.length)
			    } else {
		        filename = filesrc
			    }
			    console.log(filename)
			    let params = [{
			    	Bill_Dtl_Id: this.selectDatas[0].BillTransportA_Dtl_Id,
			    	Bill_Hdr_Id: this.selectDatas[0].BillTransportA_Hdr_Id,
			    	ReceiptImage_Name: filename,
			    	Is_Receipt_Upload: 'Y',
			    	changetype: 'updated'
			    }]
			    this.updateBillTransDtl(params)
			    this.dialogShow.receiptUpload = false
			  }
      },
      uploadFail (err, file, fileList) {
      	console.log('err')
      	console.log(err)
      },
			init () {
				this.params = JSON.parse(this.$route.params.row)
				this.loadField()
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

<style lang="less">
	.carriReceipt{
		.common-condition-box{
			.common-row{
				&:nth-of-type(1), &:nth-of-type(2){
					label{
						width: auto!important;
					}
				}
			}
		}
		.receiptDialog{
			.common-row{
				.common-col{
					width: 50%;
					.el-form-item{
						width: 100%;
					}
				}
				label{
					width: 82px!important;
					font-size: 12px!important;
				}
			}
		}
		.el-table {
			.on{
				td:nth-of-type(6){
					color: green;
					font-weight: bold;
				}
			}
		}
	}
</style>
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
	ul, li{
		list-style: none;
	}
	.transEntrustInfo{
		display: flex;
		flex-wrap: wrap;
		border-width: 1px 1px 0;
		border-style: solid;
		border-color: #dfe6ec;
		padding: 0;
		margin: 15px 0;
		li{
			width: 25%;
			line-height: 40px;
			display: flex;
			border-bottom: 1px solid #dfe6ec;
			span{
				display: inline-block;
				border-right: 1px solid #dfe6ec;
				padding: 0 10px;
				&:nth-of-type(1){
					color: #1f2d3d;
			    font-weight: bold;
			    width: 92px;
				}
				&:nth-last-of-type(1){
					flex: 1;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			&:nth-of-type(4n){
				span:nth-last-of-type(1){
					border-right: none;
				}
			}
		}
	}
	.block{
    margin: 60px 0 30px;
    text-align: center;
	}
</style>
