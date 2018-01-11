<template>
	<div class="detail">
		<div class="toolbar">
			<div class="btn-box">
				<el-button type="text" icon="mo-newlyAdded" @click.native="addFeeRuleStorage('form')">新增</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="mo-activateSave" @click.native="saveFeeRuleStorage('form')">保存</el-button>
			</div>
			<!-- <div class="btn-box">
				<el-button type="text" icon="mo-refresh" @click.native="refreshDetail('form')">刷新</el-button>
			</div> -->
		</div>
		<div class="common-condition-box">
			<el-form ref="form" :model="form" :rules="rules">
				<div class="condition-item">
					<label>规则对象</label>
					<common-row>
						<common-col>
							<span class="label required">运营商</span>
							<div class="content">
								<el-form-item prop="Operator_Name">
									<el-input placeholder="双击选择运营商" :disabled="true" @dblclick.native="openDialog('operator')" v-model="form.Operator_Name" @change.native="changeOperator"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">委托方</span>
							<div class="content">
								<el-form-item prop="Consignor_Name">
									<el-input placeholder="双击选择委托方" :disabled="true" icon="close" :on-icon-click="deleteConsignor" @dblclick.native="openDialog('consignor')" v-model="form.Consignor_Name"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">物流中心</span>
							<div class="content">
								<el-form-item prop="Ldc_Name">
									<el-input placeholder="双击选择物流中心" :disabled="true" icon="close" :on-icon-click="deleteLdc" @dblclick.native="openDialog('ldc')" v-model="form.Ldc_Name"></el-input>
								</el-form-item>
							</div>
						</common-col>
					</common-row>
				</div>
				<div class="condition-item">
					<label>规则类型</label>
					<common-row>
						<common-col>
							<span class="label required">业务模式</span>
							<div class="content">
								<el-form-item prop="Business_Model">
									<el-select v-model="form.Business_Model" placeholder="请选择业务模式" >
								    <el-option
								      v-for="item in FeeTypes" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">计划类型</span>
							<div class="content">
								<el-form-item prop="Fee_Category">
									<el-select v-model="form.Fee_Category" placeholder="请选择计划类型">
								    <el-option
								      v-for="item in fields.Fee_Categorys" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">费用类型</span>
							<div class="content">
								<el-form-item prop="Service_Type">
									<el-select v-model="form.Service_Type" placeholder="请选择费用类型" @change="changeServieType">
								    <el-option
								      v-for="item in ServiceTypes" :key="item.Ser_Id" :label="item.Service_Name" :value="item.Ser_Id">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">服务项目</span>
							<div class="content">
								<el-form-item prop="Service_Item">
									<el-select v-model="form.Service_Item" placeholder="请选择服务项目" >
								    <el-option
								      v-for="item in ServiceItemsDetail" :key="item.Ser_Id" :label="item.Service_Name" :value="item.Ser_Id">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">计算类型</span>
							<div class="content">
								<el-form-item prop="Charging_Type">
									<el-select v-model="form.Charging_Type" placeholder="请选择计算类型">
								    <el-option
								      v-for="item in fields.Charging_Types" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">计费方式</span>
							<div class="content">
								<el-form-item prop="Charging_Rule">
									<el-select v-model="form.Charging_Rule" placeholder="请选择计费方式">
								    <el-option
								      v-for="item in fields.Charging_Rules" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col :lot="2">
							<span class="label required">商品温层</span>
							<div class="content">
								<el-form-item prop="Refrigeration_Type">
									<el-select v-model="form.Refrigeration_Type" multiple placeholder="请选择商品温层">
								    <el-option
								      v-for="item in fields.Refrigeration_Types" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">结算周期</span>
							<div class="content">
								<el-form-item prop="SettleUp_Cycle">
									<el-select v-model="form.SettleUp_Cycle" placeholder="请选择结算周期">
								    <el-option
								      v-for="item in fields.SettleUp_Cycles" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">结算方式</span>
							<div class="content">
								<el-form-item prop="SettleUp_Way">
									<el-select v-model="form.SettleUp_Way" placeholder="请选择结算方式">
								    <el-option
								      v-for="item in fields.SettleUp_Ways" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">付款方</span>
							<div class="content">
								<el-form-item prop="Payer">
									<el-select v-model="form.Payer" placeholder="请选择付款方">
								    <el-option
								      v-for="item in fields.Payers" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
					</common-row>
				</div>
				<div class="condition-item">
					<label>规则费用</label>
					<common-row>
						<common-col>
							<span class="label required">协议价（元）</span>
							<div class="content">
								<el-form-item prop="Price_Agreement">
									<el-input placeholder="请输入协议价" type="number" min="0" v-model.number="form.Price_Agreement" auto-complete="off"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">起步价（元）</span>
							<div class="content">
								<el-form-item prop="Init_Price">
									<el-input placeholder="请输入起步价" type="number" min="0" v-model="form.Init_Price" auto-complete="off"></el-input>
								</el-form-item>
							</div>
						</common-col>
					</common-row>
				</div>
				<div class="condition-item">
					<label>扩展规则</label>
					<common-row>
						<common-col>
							<span class="label">规则开始时间</span>
							<div class="content">
								<el-form-item prop="Start_Time">
									<el-date-picker v-model="form.Start_Time" type="date" placeholder="选择日期">
						    	</el-date-picker>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">规则结束时间</span>
							<div class="content">
								<el-form-item prop="End_Time">
									<el-date-picker v-model="form.End_Time" type="date" placeholder="选择日期">
						    	</el-date-picker>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">计算方式</span>
							<div class="content">
								<el-form-item prop="Calculation_Mode">
									<el-select v-model="form.Calculation_Mode" placeholder="请选择计算方式">
								    <el-option
								      v-for="item in fields.Calculation_Modes" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<el-form-item prop="Is_Documentary">
								<el-checkbox v-model="form.Is_Documentary">是否跟单</el-checkbox>
							</el-form-item>
							<el-form-item prop="Is_Available">
								<el-checkbox v-model="form.Is_Available">是否活动</el-checkbox>
							</el-form-item>
						</common-col>
						<common-col :lot="3">
							<span class="label">扩展字段</span>
							<div class="content">
								<el-form-item prop="Extend_Field">
									<el-select v-model="form.Extend_Field" multiple placeholder="请选择扩展字段">
								    <el-option
								      v-for="item in fields.Extend_Fields" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
								    </el-option>
								  </el-select>
								</el-form-item>
							</div>
						</common-col>
						<common-col :lot="2">
							<span class="label">扩展条件</span>
							<el-button class="addRule" @click.native="addExtendCondition">新增</el-button>
							<el-button class="deleteRule" @click.native="deleteExtendCondition">删除</el-button>
							<div class="content">
								<el-form-item prop="Extend_Conditions">
									<el-table :data="form.Extend_Conditions" highlight-current-row @current-change="handleCurrentChange">
										<el-table-column label="字段">
								      <template slot-scope="scope">
								        <el-select v-model="scope.row.Name" placeholder="请选择" class="extendCon">
											    <el-option
											      v-for="item in form.Extend_Field" :key="item" :label="getExtendFieldDesc(item)" :value="item">
											    </el-option>
											  </el-select>
								      </template>
								    </el-table-column>
								    <el-table-column label="关系">
								      <template slot-scope="scope">
								        <el-select v-model="scope.row.Sign" placeholder="请选择" class="extendCon">
											    <el-option
											      v-for="item in fields.Extend_Signs" :key="item.Value_Data" :label="item.Value_Data" :value="item.Value_Data">
											    </el-option>
											  </el-select>
								      </template>
								    </el-table-column>
								    <el-table-column label="字段">
								      <template slot-scope="scope">
								        <el-input v-model="scope.row.Value1" class="extendCon"></el-input>
								      </template>
								    </el-table-column>
									</el-table>
								</el-form-item>
							</div>
						</common-col>
						<common-col :lot="2">
							<span class="label">计费规则</span>
							<el-button class="addRule" @click.native="addCalculationRule">新增</el-button>
							<el-button class="deleteRule" @click.native="deleteCalculationRule">删除</el-button>
							<div class="content">
								<el-form-item prop="Calculation_Rules">
									<el-table :data="form.Calculation_Rules" highlight-current-row @current-change="handleCalCurrentChange">
										<el-table-column label="计费规则">
								      <template slot-scope="scope">
								        <el-input v-model="scope.row.Value1"></el-input>
								      </template>
								    </el-table-column>
									</el-table>
								</el-form-item>
							</div>
						</common-col>
						<common-col :lot="4">
							<span class="label">备注</span>
							<div class="content">
								<el-form-item prop="remarks">
									<el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.remarks"></el-input>
								</el-form-item>
							</div>
						</common-col>
					</common-row>
				</div>
			</el-form>
		</div>
		<common-modal ref="OperatorDialog" DialogTitle="运营方" :isVisible.sync="dialogShow.operator" :TableHeader="Operator.TableHeader" :listData="Operator.copyDatas" @confirm="selectOperator" @search="searchOperator" :isPages="false"></common-modal>
		<common-modal ref="ConDialog" DialogTitle="委托方" :isVisible.sync="dialogShow.consignor" :TableHeader="Consignor.TableHeader" :listData="Consignor.copyDatas" @confirm="selectConsignor" @search="searchConsignor" :isPages="false"></common-modal>
		<!-- <ldc-modal :visible.sync="dialogShow.ldc" @change="selectLdc"></ldc-modal> -->
		<common-modal ref="LdcDialog" DialogTitle="物流中心" :isVisible.sync="dialogShow.ldc" :TableHeader="Ldc.TableHeader" :listData="Ldc.copyDatas" @confirm="selectLdc" @search="searchLdc" :isPages="false"></common-modal>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import Vue from 'vue'
	import {DateFtt} from '@/common/js/utils'
	import {Bus, Types} from '@/common/js/bus'
	import commonRow from '@/common/components/common-row'
	import commonCol from '@/common/components/common-col'
	import commonModal from '@/common/components/common-modal'
	import ldcModal from '@/common/service/modal/ldc-modal'
	export default {
		name: 'feeRuleStorageList',
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
			ServiceItemsDetail: {
				type: Array,
				default () {
					return []
				}
			},
			editFeeRuleStorageRow: {
				type: Object
			}
		},
		components: {
			commonRow,
			commonCol,
			commonModal,
			ldcModal
		},
		data () {
			let priceAgreement = (rule, value, callback) => {
				if (!value) {
					callback(new Error('请输入协议价'))
				} else if (!new RegExp(/^\d+(\.{0,1}\d{0,2})?$/).test(value)) {
					callback(new Error('协议价不能为负数且只允许输入两位小数'))
				} else {
					callback()
				}
			}
			let initPrice = (rule, value, callback) => {
				if (value) {
					if (!new RegExp(/^\d+(\.{0,1}\d{0,2})?$/).test(value)) {
						callback(new Error('起步价不能为负数且只允许输入两位小数'))
					} else {
						callback()
					}
				} else {
					callback()
				}
			}
			let calculationRules = (rule, value, callback) => {
				if (value) {
					let flag = true
					for (let i = 0; i < value.length; i++) {
						flag = this.validateCalculationRule(value[i].Value1)
						if (!flag) {
							break
						}
					}
					if (flag) {
						callback()
					} else {
						callback(new Error('计费规则错误，计费规则中的字段名必须为扩展字段中的字段名'))
					}
				} else {
					callback()
				}
			}
			return {
				form: {
					Rec_Id: '1',
					Operator_Id: '',
					Operator_Name: '',
					Consignor_Id: '',
					Consignor_Name: '',
					Ldc_Id: '',
					Ldc_Name: '',
					Business_Model: '',
					Fee_Category: '',
					Service_Type: '',
					Service_Item: '',
					Charging_Type: '',
					Charging_Rule: '',
					Refrigeration_Type: [],
					SettleUp_Cycle: '',
					SettleUp_Way: '',
					Payer: '',
					Price_Agreement: '',
					Init_Price: '',
					Start_Time: '',
					End_Time: '',
					Calculation_Mode: '',
					Extend_Field: [],
					remarks: '',
					Extend_Conditions: [],
					Calculation_Rules: [],
					Is_Documentary: true,
					Is_Available: true,
					Created_Time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date(), false),
					changetype: 'inserted'
				},
				fields: {
					Fee_Categorys: [],
					Charging_Types: [],
					Charging_Rules: [],
					Refrigeration_Types: [],
					SettleUp_Cycles: [],
					SettleUp_Ways: [],
					Payers: [],
					Calculation_Modes: [],
					Extend_Field: [],
					Extend_Signs: []
				},
				Operator: {
					TableHeader: [
						{
							field: 'Operator_Name',
							title: '运营方名称'
						},
						{
							field: 'Operator_No',
							title: '运营方编号'
						},
						{
							field: 'Mnemonic_Code',
							title: '助记码'
						}
					],
					datas: [],
					copyDatas: []
				},
				Consignor: {
					TableHeader: [
						{
							field: 'Con_Name',
							title: '委托方名称'
						},
						{
							field: 'Con_No',
							title: '委托方编号'
						},
						{
							field: 'Mnemonic_Code',
							title: '助记码'
						}
					],
					datas: [],
					copyDatas: []
				},
				Ldc: {
					TableHeader: [
						{
							field: 'All_Name',
							title: '物流中心'
						},
						{
							field: 'Address_Shortname',
							title: '地址简介'
						},
						{
							field: 'Contact_Name',
							title: '联系人'
						},
						{
							field: 'Contact_Phone',
							title: '联系人电话'
						},
						{
							field: 'Province_Name',
							title: '省'
						},
						{
							field: 'City_Name',
							title: '市'
						},
						{
							field: 'Area_Name',
							title: '县'
						},
						{
							field: 'Address',
							title: '详细地址'
						}
					],
					datas: [],
					copyDatas: []
				},
				extendFieldCurrentRow: null,
				calRuleCurrentRow: null,
				dialogShow: {
					ldc: false,
					operator: false,
					consignor: false
				},
				rules: {
					Operator_Name: [{ required: true, message: '请选择运营方', trigger: 'blur' }],
					Consignor_Name: [{ required: true, message: '请选择委托方', trigger: 'blur' }],
					Ldc_Name: [{ required: true, message: '请选择物流中心', trigger: 'blur' }],
					Business_Model: [{ required: true, message: '请选择业务模式', trigger: 'change' }],
					Fee_Category: [{ required: true, message: '请选择计划类型', trigger: 'change' }],
					Service_Type: [{ required: true, message: '请选择费用类型', trigger: 'change' }],
					Service_Item: [{ required: true, message: '请选择服务项目', trigger: 'change' }],
					Charging_Type: [{ required: true, message: '请选择计算类型', trigger: 'change' }],
					Charging_Rule: [{ required: true, message: '请选择运计费方式', trigger: 'change' }],
					Refrigeration_Type: [{ type: 'array', required: true, message: '请至少选择一个商品温层', trigger: 'blur' }],
					SettleUp_Cycle: [{ required: true, message: '请选择结算周期', trigger: 'change' }],
					SettleUp_Way: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
					Payer: [{ required: true, message: '请选择付款方', trigger: 'change' }],
					Calculation_Mode: [{ required: true, message: '请选择计算方式', trigger: 'change' }],
					Price_Agreement: [{ validator: priceAgreement, trigger: 'blur' }],
					Init_Price: [{ validator: initPrice, trigger: 'blur' }],
					Calculation_Rules: [{ validator: calculationRules, trigger: 'blur' }]
				}
			}
		},
		watch: {
			editFeeRuleStorageRow () {
				if (typeof (this.editFeeRuleStorageRow.Rec_Id) !== 'undefined') {
					this.setFeeRuleStorage(this.editFeeRuleStorageRow)
				} else {
					this.refreshDetail('form')
				}
			}
		},
		methods: {
			changeServieType () {
				this.$emit('service-type-change', this.form.Service_Type, 'detail')
			},
			loadField () {
				Api.get('Fd_Field_Dtl', { Field_Name: 'Fee_Category' }, true).then((res) => { // 计划类型
					if (res.Flag) {
						this.fields.Fee_Categorys = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Charging_Type' }, true).then((res) => { // 计算类型
					if (res.Flag) {
						this.fields.Charging_Types = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Charging_Rule' }, true).then((res) => { // 计费方式
					if (res.Flag) {
						this.fields.Charging_Rules = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Refrigeration_Type' }, true).then((res) => { // 商品温层
					if (res.Flag) {
						this.fields.Refrigeration_Types = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'SettleUp_Cycle' }, true).then((res) => { // 结算周期
					if (res.Flag) {
						this.fields.SettleUp_Cycles = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'SettleUp_Way' }, true).then((res) => { // 结算方式
					if (res.Flag) {
						this.fields.SettleUp_Ways = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Payer' }, true).then((res) => { // 付款方
					if (res.Flag) {
						this.fields.Payers = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Calculation_Mode' }, true).then((res) => { // 计算方式
					if (res.Flag) {
						this.fields.Calculation_Modes = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Extend_Field2' }, true).then((res) => { // 扩展字段
					if (res.Flag) {
						this.fields.Extend_Fields = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
				Api.get('Fd_Field_Dtl', { Field_Name: 'Extend_Sign' }, true).then((res) => { // 扩展条件关系
					if (res.Flag) {
						this.fields.Extend_Signs = res.MsgInfo
					} else {
						this.$alert(res.ErrInfo, '提示', {
							confirmButtonText: '确定'
						})
					}
				})
			},
			openDialog (val) { // 打开弹框
        this.dialogShow[val] = true
      },
      selectLdc (row) { // 物流中心选中数据
      	this.form.Ldc_Name = row.Ldc_Name
      	this.form.Ldc_Id = row.Ldc_Id
      },
      searchLdc (keyword) {
      	let searchRegex = new RegExp(keyword, 'i')
        this.Ldc.copyDatas = this.Ldc.datas.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
      },
      deleteLdc () { // 删除input框中的物流中心
      	this.form.Ldc_Name = ''
      	this.form.Ldc_Id = ''
      },
      selectOperator (row) { // 运营商选中数据
      	this.form.Operator_Name = row.Operator_Name
      	this.form.Operator_Id = row.Operator_Id
      },
      searchOperator (keyword) {
      	let searchRegex = new RegExp(keyword, 'i')
        this.Operator.copyDatas = this.Operator.datas.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
      },
      selectConsignor (row) {
      	this.form.Consignor_Id = row.Con_Id
      	this.form.Consignor_Name = row.Con_Name
      },
      searchConsignor (keyword) {
      	let searchRegex = new RegExp(keyword, 'i')
        this.Consignor.copyDatas = this.Consignor.datas.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
      },
      deleteConsignor () {
      	this.form.Consignor_Id = ''
      	this.form.Consignor_Name = ''
      },
      getOperator () { // 运营商
      	let params = {
      		userId: Api.userInfo.Staff_Id
      	}
      	Api.get('DS_FEERULE_FD_OPERATOR_ByuserId', params, true).then((res) => {
      		if (res.Flag) {
      			this.Operator.datas = res.MsgInfo
      			this.Operator.copyDatas = this.Operator.datas
      			if (this.Operator.datas.length === 1) {
      				this.form.Operator_Id = this.Operator.datas[0].Operator_Id
      				this.form.Operator_Name = this.Operator.datas[0].Operator_Name
      				this.changeOperator()
      			}
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      getConsignor () { // 委托方
      	if (this.form.Operator_Id === '') {
      		this.$alert('请先选择运营商', '提示', {
      			confirmButtonText: '确定'
      		})
      		return false
      	}
      	let params = {
      		Operator_Id: this.form.Operator_Id,
      		userId: Api.userInfo.Staff_Id
      	}
      	Api.get('DS_FEERULE_FD_CONSIGNOR_ByuserId', params, true).then((res) => {
      		if (res.Flag) {
      			this.Consignor.datas = res.MsgInfo
      			this.Consignor.copyDatas = this.Consignor.datas
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      changeOperator () { // 根据运营商带出委托方
      	this.getConsignor()
      	this.getLdc()
      },
      getLdc () { // 物流中心
      	Api.get('TMP_TransportTaskScheding_Yd_GetWlzxAddr', {}, true).then((res) => {
      		if (res.Flag) {
      			let data = res.MsgInfo
      			this.Ldc.datas = data.filter((item) => {
      				if (item.Operator_Id === this.form.Operator_Id) {
      					return true
      				}
      			})
      			this.Ldc.copyDatas = this.Ldc.datas
      		} else {
      			this.$alert(res.ErrInfo, '提示', {
      				confirmButtonText: '确定'
      			})
      		}
      	})
      },
      getExtendFieldDesc (fieldValue) { // 获取选中扩展字段的描述
      	if (typeof (this.fields.Extend_Fields) !== 'undefined') {
      		for (let i = 0; i < this.fields.Extend_Fields.length; i++) {
	      		if (this.fields.Extend_Fields[i].Value_Data === fieldValue) {
	      			return this.fields.Extend_Fields[i].Value_Desc
	      		}
	      	}
      	}
      },
      addExtendCondition () { // 新增扩展规则
      	if (this.form.Extend_Field.length > 0) {
      		// 新增
      		let obj = {}
      		obj.Name = ''
      		obj.Sign = ''
      		obj.Value1 = ''
      		this.form.Extend_Conditions.push(obj)
      	} else {
      		this.$alert('请先选择扩展字段', '提示', {
      			confirmButtonText: '确定'
      		})
      	}
      },
      handleCurrentChange (val) {
      	this.extendFieldCurrentRow = val
      },
      deleteExtendCondition () { // 删除扩展规则
      	if (this.extendFieldCurrentRow) {
      		for (let i = 0; i < this.form.Extend_Conditions.length; i++) {
      			if (this.form.Extend_Conditions[i] === this.extendFieldCurrentRow) {
      				this.form.Extend_Conditions.splice(i, 1)
      				break
      			}
      		}
      	} else {
      		this.$alert('请选择需要删除的数据', '提示', {
      			confirmButtonText: '确定'
      		})
      	}
      },
      addCalculationRule () { // 新增计费规则
      	if (this.form.Extend_Field.length > 0) {
      		// 新增
      		let obj = {}
      		obj.Value1 = ''
      		this.form.Calculation_Rules.push(obj)
      	} else {
      		this.$alert('请先选择扩展字段', '提示', {
      			confirmButtonText: '确定'
      		})
      	}
      },
      handleCalCurrentChange (val) {
      	this.calRuleCurrentRow = val
      },
      deleteCalculationRule () { // 删除计费规则
      	if (this.calRuleCurrentRow) {
      		for (let i = 0; i < this.form.Calculation_Rules.length; i++) {
      			if (this.form.Calculation_Rules[i] === this.calRuleCurrentRow) {
      				this.form.Calculation_Rules.splice(i, 1)
      				break
      			}
      		}
      	} else {
      		this.$alert('请选择需要删除的数据', '提示', {
      			confirmButtonText: '确定'
      		})
      	}
      },
      validateCalculationRule (val) { // 验证计费规则是否符合标准
      	let flag = true
      	if (val !== '') {
      		let calHzStr = val.trim().replace(/[^\u4e00-\u9fa5]/gi, '')
          for (let i = 0; i < this.form.Extend_Field.length; i++) {
            let newCalHzStr = calHzStr
            let index = newCalHzStr.indexOf(this.getExtendFieldDesc(this.form.Extend_Field[i]))
            if (index > -1) {
              calHzStr = newCalHzStr.replace(new RegExp(this.getExtendFieldDesc(this.form.Extend_Field[i]), 'g'), '')
            }
          }
          if (calHzStr !== '') {
            // this.$alert('计费规则错误，计费规则中的字段名必须为扩展字段中的字段名', '提示', {
            // 	confirmButtonText: '确定'
            // })
            flag = false
          }
      	}
      	return flag
      },
      setFeeRuleStorage (obj) { // 编辑仓储费用规则
      	let isAvailable = true
      	let isDocumentary = true
      	let calculationRules = []
      	if (obj.Is_Available === 'N') {
      		isAvailable = false
      	}
      	if (obj.Is_Documentary === 'N') {
      		isDocumentary = false
      	}
      	if (obj.Calculation_Rule !== '') {
      		let calculationRulesArr = obj.Calculation_Rule.split('@')
      		calculationRulesArr.forEach((item) => {
	      		let calRuleObj = {}
	      		calRuleObj.Value1 = item
	      		calculationRules.push(calRuleObj)
	      	})
      	}
      	this.form.Rec_Id = obj.Rec_Id
      	this.form.Operator_Id = obj.Operator_Id
      	this.form.Operator_Name = obj.Operator_Name
      	this.form.Consignor_Id = obj.Con_Id
      	this.form.Consignor_Name = obj.Con_Name
      	this.form.Ldc_Id = obj.Ldc_Id
      	this.form.Ldc_Name = obj.Ldc_Name
      	this.form.Business_Model = obj.Business_Model
      	this.form.Fee_Category = obj.Fee_Category
      	this.form.Service_Type = obj.Service_Type
      	this.form.Service_Item = obj.Service_Item
      	this.form.Charging_Type = obj.Charging_Type
      	this.form.Charging_Rule = obj.Charging_Rule
      	this.form.Refrigeration_Type = obj.Refrigeration_Type.split(',')
      	this.form.Init_Price = obj.Init_Price
      	this.form.Price_Agreement = obj.Price_Agreement
      	this.form.Extend_Field = (obj.Extend_Field !== '') ? obj.Extend_Field.split(',') : ''
      	this.form.Extend_Conditions = (obj.Extend_Condition.charAt(0) === '[' && obj.Extend_Condition.charAt(obj.Extend_Condition.length - 1) === ']') ? JSON.parse(obj.Extend_Condition) : []
      	this.form.Calculation_Rules = (obj.Calculation_Rule === '') ? [] : calculationRules
      	this.form.Calculation_Mode = obj.Calculation_Mode
      	this.form.Is_Available = isAvailable
      	this.form.SettleUp_Cycle = obj.SettleUp_Cycle
      	this.form.SettleUp_Way = obj.SettleUp_Way
      	this.form.Is_Documentary = isDocumentary
      	this.form.Payer = obj.Payer
      	this.form.remarks = obj.remarks
      	this.form.Start_Time = (obj.Start_Time === '0001-01-01 00:00:00') ? '' : obj.Start_Time
      	this.form.End_Time = (obj.End_Time === '0001-01-01 00:00:00') ? '' : obj.End_Time
      	this.form.Created_Time = obj.Created_Time
      	this.form.Creator = obj.Creator
      	this.form.changetype = 'updated'
      },
      addFeeRuleStorage (formName) { // 新增仓储费用规则
      	this.$refs[formName].resetFields()
      	if (this.Operator.datas.length === 1) {
  				this.form.Operator_Id = this.Operator.datas[0].Operator_Id
  				this.form.Operator_Name = this.Operator.datas[0].Operator_Name
  				this.changeOperator()
  			}
      },
      saveFeeRuleStorage (formName) { // 保存仓储费用规则
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	let calculationRule = ''
          	this.form.Calculation_Rules.forEach((item, index) => {
          		calculationRule += item.Value1
          		if (index !== this.form.Calculation_Rules.length - 1) {
          			calculationRule += '@'
          		}
          	})
            let obj = [{
            	Rec_Id: this.form.Rec_Id,
            	Operator_Id: this.form.Operator_Id,
            	Con_Id: this.form.Consignor_Id,
            	Ldc_Id: this.form.Ldc_Id,
            	Business_Model: this.form.Business_Model,
            	Fee_Category: this.form.Fee_Category,
            	Service_Type: this.form.Service_Type,
            	Service_Item: this.form.Service_Item,
            	Charging_Type: this.form.Charging_Type,
            	Charging_Rule: this.form.Charging_Rule,
            	Refrigeration_Type: (this.form.Refrigeration_Type === '') ? this.form.Refrigeration_Type : this.form.Refrigeration_Type.join(','),
            	Init_Price: this.form.Init_Price,
            	Price_Agreement: this.form.Price_Agreement,
            	Extend_Field: (this.form.Extend_Field === '') ? this.form.Extend_Field : this.form.Extend_Field.join(','),
            	Extend_Condition: JSON.stringify(this.form.Extend_Conditions).replace(/\+/g, '%2b'),
            	Calculation_Rule: calculationRule.replace(/\+/g, '%2b'),
            	Calculation_Mode: this.form.Calculation_Mode,
            	Is_Available: this.form.Is_Available ? 'Y' : 'N',
            	SettleUp_Cycle: this.form.SettleUp_Cycle,
            	SettleUp_Way: this.form.SettleUp_Way,
            	Is_Documentary: this.form.Is_Documentary ? 'Y' : 'N',
            	Payer: this.form.Payer,
            	remarks: this.form.remarks,
            	Start_Time: (typeof (this.form.Start_Time) === 'string') ? this.form.Start_Time : DateFtt('yyyy-MM-dd', this.form.Start_Time, false),
            	End_Time: (typeof (this.form.End_Time) === 'string') ? this.form.End_Time : DateFtt('yyyy-MM-dd', this.form.End_Time, false),
            	Created_Time: this.form.Created_Time,
            	Updated_Time: DateFtt('yyyy-MM-dd hh:mm:ss', new Date(), false),
            	Creator: Api.userInfo.Staff_Id,
            	changetype: this.form.changetype
            }]
            let params = {
          		list_fdfeerule: JSON.stringify(obj)
          	}
            Api.post('FdWarehouseFeeRuleSave', params).then((res) => {
            	if (res.Flag) {
            		this.$alert('保存成功！', '提示', {
            			confirmButtonText: '确定',
            			callback: action => {
            				this.refreshDetail('form')
            				this.$emit('active-name-change', 'list')
            				Bus.$emit(Types.refreshFeeRule)
            			}
            		})
            	} else {
            		this.$alert(res.ErrInfo, '提示', {
            			confirmButtonText: '确定'
            		})
            	}
            })
          } else {
            return false
          }
        })
      },
      refreshDetail (formName) { // 刷新明细
      	this.$refs[formName].resetFields()
      	if (this.Operator.datas.length === 1) {
  				this.form.Operator_Id = this.Operator.datas[0].Operator_Id
  				this.form.Operator_Name = this.Operator.datas[0].Operator_Name
  				this.changeOperator()
  			}
      },
			init () {
				this.loadField()
				this.getOperator()
				if (typeof (this.editFeeRuleStorageRow.Rec_Id) !== 'undefined') {
					this.setFeeRuleStorage(this.editFeeRuleStorageRow)
				}
			}
		},
		mounted () {
			this.init()
		}
	}
</script>

<style lang="less">
	.feeRuleStorage {
		.detail {
			.common-condition-box {
				border: none;
				padding-top: 0;
			}
			.common-row {
				overflow: visible;
				.common-col {
					margin-bottom: 12px;
					overflow: visible;
					position: relative;
					.addRule, .deleteRule {
						position: absolute;
						left: 50px;
						margin: 0;
						padding: 5px 12px;
					}
					.addRule {
						top: 35px;
					}
					.deleteRule {
						top: 65px;
					}
				}
			}
			.label.required:before {
				content: "*";
		    color: #ff4949;
		    margin-right: 4px;
			}
			.el-form-item {
				margin: 0;
			}
			.el-form-item__content{
				line-height: 24px;
				width: 100%;
			}
			table {
				width: 100%!important;
			}
		}
		.condition-item {
			border-bottom: 1px dotted #ccc;
			margin-bottom: 10px;
			padding-bottom: 5px;
			&:nth-last-of-type(1) {
				border: none;
				margin-bottom: 0;
			}
			.el-form-item {
				display: flex;
				.el-form-item__label {
					min-width: 95px;
				}
				.el-form-item__content {
					flex: 1;
				}
			}
		}
		.el-input input.el-input__inner {
			height: 100%!important;
		}
		.el-select__tags {
	    white-space: nowrap;
    	overflow: hidden;
		}
		.el-checkbox {
			margin-right: 10px;
		}
	}
</style>