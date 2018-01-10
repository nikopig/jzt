<template>
	<div class="detail">
		<div class="toolbar">
			<div class="btn-box">
				<el-button type="text" icon="mo-newlyAdded" @click.native="addRentStorage('form')">新增</el-button>
			</div>
			<div class="btn-box">
				<el-button type="text" icon="mo-activateSave" @click.native="saveRentStorage('form')">保存</el-button>
			</div>
		</div>
		<div class="common-condition-box">
			<el-form ref="form" :model="form" :rules="rules">
				<div class="condition-item">
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
							<span class="label">物流中心</span>
							<div class="content">
								<el-form-item prop="Ldc_Name">
									<el-input placeholder="双击选择物流中心" :disabled="true" icon="close" :on-icon-click="deleteLdc" @dblclick.native="openDialog('ldc')" v-model="form.Ldc_Name"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">租赁面积</span>
							<div class="content">
								<el-form-item prop="Rental_Area">
									<el-input placeholder="请输入租赁面积" v-model="form.Rental_Area"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label required">租赁仓库存储条件</span>
							<div class="content">
								<el-form-item prop="Refrigeration_Type">
									<!-- <el-select v-model="value" placeholder="请选择">
								    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
								  </el-select> -->
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">租赁托盘货位数(立库)</span>
							<div class="content">
								<el-form-item prop="Rental_Location_A">
									<el-input placeholder="请输入租赁托盘货位数" v-model="form.Rental_Location_A"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">租赁楼库货位数(整件)</span>
							<div class="content">
								<el-form-item prop="Rental_Location_B">
									<el-input placeholder="请输入租赁托盘货位数" v-model="form.Rental_Location_B"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">租赁楼库货位(零货)</span>
							<div class="content">
								<el-form-item prop="Rental_Location_C">
									<el-input placeholder="请输入租赁托盘货位数" v-model="form.Rental_Location_C"></el-input>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">租赁开始时间</span>
							<div class="content">
								<el-form-item prop="Start_Time">
									<el-date-picker v-model="form.Start_Time" type="date" placeholder="选择租赁开始时间"></el-date-picker>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<span class="label">租赁结束时间</span>
							<div class="content">
								<el-form-item prop="End_Time">
									<el-date-picker v-model="form.End_Time" type="date" placeholder="选择租赁结束时间"></el-date-picker>
								</el-form-item>
							</div>
						</common-col>
						<common-col>
							<el-form-item prop="Is_Active">
								<el-checkbox v-model="form.Is_Active">是否活动</el-checkbox>
							</el-form-item>
						</common-col>
					</common-row>
				</div>
			</el-form>
		</div>
		<!-- <common-modal ref="OperatorDialog" DialogTitle="运营方" :isVisible.sync="dialogShow.operator" :TableHeader="Operator.TableHeader" :listData="Operator.copyDatas" @confirm="selectOperator" @search="searchOperator" :isPages="false"></common-modal>
		<common-modal ref="ConDialog" DialogTitle="委托方" :isVisible.sync="dialogShow.consignor" :TableHeader="Consignor.TableHeader" :listData="Consignor.copyDatas" @confirm="selectConsignor" @search="searchConsignor" :isPages="false"></common-modal>
		<common-modal ref="LdcDialog" DialogTitle="物流中心" :isVisible.sync="dialogShow.ldc" :TableHeader="Ldc.TableHeader" :listData="Ldc.copyDatas" @confirm="selectLdc" @search="searchLdc" :isPages="false"></common-modal> -->
	</div>
</template>

<script>
	import commonRow from '@/common/components/common-row'
	import commonCol from '@/common/components/common-col'
	import commonModal from '@/common/components/common-modal'
	export default {
		name: 'detail',
		data () {
			return {
				form: {
					Operator_Id: '',
					Operator_Name: '',
					Consignor_Id: '',
					Consignor_Name: '',
					Ldc_Id: '',
					Ldc_Name: '',
					Refrigeration_Type: '',
					Rental_Area: '',
					Rental_Location_A: '',
					Rental_Location_B: '',
					Rental_Location_C: '',
					Start_Time: '',
					End_Time: '',
					Is_Active: true
				},
				rules: {}
			}
		},
		components: {
			commonRow,
			commonCol,
			commonModal
		},
		methods: {
			openDialog (val) { // 打开弹框
        this.dialogShow[val] = true
      },
      selectOperator (row) {
				this.form.Operator_Id = row.Operator_Id
				this.form.Operator_Name = row.Operator_Name
			},
			searchOperator (keyword) {},
			deleteOperator () {
				this.form.Operator_Id = ''
				this.form.Operator_Name = ''
			},
			selectConsignor (row) {
				this.form.Con_Id = row.Con_Id
				this.form.Con_Name = row.Con_Name
			},
			searchConsignor (keyword) {},
			deleteConsignor () {
				this.form.Con_Id = ''
				this.form.Con_Name = ''
			},
			selectLdc (row) {
				this.form.Ldc_Id = row.Ldc_Id
				this.form.Ldc_Name = row.Ldc_Name
			},
			searchLdc (keyword) {
			},
			deleteLdc () {
				this.form.Ldc_Id = ''
				this.form.Ldc_Name = ''
			},
			addRentStorage () {},
			saveRentStorage () {}
		}
	}
</script>

<style lang="less">
	.rentStorage {
		.detail {
			.common-condition-box {
				padding: 12px 10px 0 0;
			}
			.common-row {
				.common-col {
					margin-bottom: 12px;
					position: relative;
					.label {
						width: 116px;
					}
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