<template>
	<div class="main-list transAging">
        <div class="toolbar" v-if="true">
          <div class="btn-box">
            <el-button type="text" icon="el-icon-mo-addDetail" @click="addData('formData')">新增</el-button>
          </div>
        </div>
        <div class="common-condition-box">
          <el-form :inline="true" :label-position="labelPosition" label-width="94px" :model="formData" ref="formData">
	          <el-form-item label="合同编号" :rules="[
                          { required: true, message: '请输入合同编号', trigger: 'change' }
                        ]">
	            <el-input v-model="formData.Operator_Id" placeholder="双击选择"
	                      icon="el-icon-close" 
	                      @click="deleteSelect('Operator_Id')"
	                      @dblclick.native="openDialog('Operator_Id')"
	                      :disabled="true"></el-input>
	          </el-form-item>
	          <el-form-item label="委托方" :rules="[
                          { required: true, message: '请输入委托方', trigger: 'change' }
                        ]">
	            <el-input v-model="formData.Con_Name" placeholder="双击选择"
	                      icon="el-icon-close"
	                      @click="deleteSelect('Con_Id')"
	                      @dblclick.native="openDialog('Con_Id')"
	                      :disabled="true"></el-input>
	          </el-form-item>
            <el-form-item  label="时效承诺方式" prop="AgingCommitWay" :rules="[
                          { required: true, message: '请输入时效承诺方式', trigger: 'blur' }
                        ]">
              <common-agingCommitWay-select field="AgingCommitWay" v-model="formData.AgingCommitWay"></common-agingCommitWay-select>
            </el-form-item>
            <el-form-item  label="起点省份" prop="Start_Region_Name" :rules="[
                          { required: true, message: '请输入起点省份', trigger: 'blur' }
                        ]">
              <el-input v-model="formData.Start_Region_Name" placeholder="双击选择"
	                      icon="el-icon-close"
	                      @click="deleteSelect('Start_Region_No')"
	                      @dblclick.native="openDialog('Start_Region_No')"
	                      :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="起点城市" prop="Start_City_Name" :rules="[
                          { required: true, message: '请输入起点城市', trigger: 'blur' }
                        ]">
              <el-input v-model="formData.Start_City_Name" placeholder="双击选择"
	                      icon="el-icon-close"
	                      @click="deleteSelect('Start_City_No')"
	                      @dblclick.native="openDialog('Start_City_No')"
	                      :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="收货省份" prop="End_Region_Name" :rules="[
                          { required: true, message: '请输入收货省份', trigger: 'blur' }
                        ]">
              <el-input v-model="formData.End_Region_Name" placeholder="双击选择"
	                      icon="el-icon-close"
	                      @click="deleteSelect('End_Region_No')"
	                      @dblclick.native="openDialog('End_Region_No')"
	                      :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="收货城市" prop="End_City_Name" :rules="[
                          { required: true, message: '请输入收货城市', trigger: 'blur' }
                        ]">
              <el-input v-model="formData.End_City_Name" placeholder="双击选择"
	                      icon="el-icon-close"
	                      @click="deleteSelect('End_City_No')"
	                      @dblclick.native="openDialog('End_City_No')"
	                      :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="产品大类" :rules="[
                          { required: true, message: '请输入产品大类', trigger: 'blur' }
                        ]">
              <common-multiGoodType-select field="MultiGoodType" v-model="formData.MultiGoodTypeNo"></common-multiGoodType-select>
            </el-form-item>
            <el-form-item  label="时效类型" 
                        :rules="[
                          { required: true, message: '请输入时效类型', trigger: 'blur' }
                        ]">
              <common-agingType-select field="Aging_Type" v-model="formData.Aging_Type"></common-agingType-select>
            </el-form-item>
            <!--
            <el-form-item label="到货时间"
                        prop="arrivedTime"
                        :rules="[
                          { required: true, message: '请输入到货时间', trigger: 'blur' }
                        ]">
	            <el-input v-model="formData.arrivedTime"></el-input>
	        </el-form-item>
	        -->
            <el-form-item label="到货时间(H)"
                        prop="arrivedTime"
                        :rules="[
                          { required: true, message: '请输入到货时间', trigger: 'blur' }
                        ]">
	            <el-input class="arrivedTime" v-model="formData.arrivedTime" placeholder="请输入到货时间" @click="deleteSelect('arrivedTime')">
              	</el-input>
	          </el-form-item>
          </el-form>
        </div>
		<div class='aging-footer'>
	      <div class='right'>
	        <el-button class='button' @click='save("formData")'>提交</el-button>
	      </div>
	    </div>
    	<operator-modal :visible.sync="dialogShow.Operator_Id" @change="selectOper"></operator-modal>
    	<consiNew-modal :visible.sync="dialogShow.Con_Id" :Operator_Id.sync="formData.Operator_Id" @change="selectCon"></consiNew-modal>
		<region-modal :visible.sync="dialogShow.Start_Region_No" DialogTitle="起点省份"  @change="selectStartRegion"></region-modal>
		<regionCity-modal :visible.sync="dialogShow.Start_City_No" :Region_No.sync="formData.Start_Region_No" DialogTitle="起点城市"  @change="selectStartRegionCity"></regionCity-modal>
    	<region-modal :visible.sync="dialogShow.End_Region_No" DialogTitle="收货省份"  @change="selectEndRegion"></region-modal>
		<regionCity-modal :visible.sync="dialogShow.End_City_No" :Region_No.sync="formData.End_Region_No" DialogTitle="收货城市"  @change="selectEndRegionCity"></regionCity-modal>
    </div>
</template>

<script>
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import commonDialog from '@/common/components/common-dialog'
  import commonSelect from '@/common/service/select/select-service-type'
  import commonAgingTypeSelect from '@/common/service/select/select-aging-type'
  import commonAgingCommitWaySelect from '@/common/service/select/select-agingCommitWay'
  import commonMultiGoodTypeSelect from '@/common/service/select/select-multiGoodType'
  import operatorModal from '@/common/service/modal/operator-modal'
  import consiNewModal from '@/common/service/modal/consiNew-modal'
  import regionModal from '@/common/service/modal/region-modal'
  import regionCityModal from '@/common/service/modal/regionCity-modal'

    export default {
    name: 'listData',
    props: {
      type: {
        default: 0
      },
      selectObj: {
        type: Array,
        default: []
      }
      // params: {
      //   type: Object,
      //   default () {
      //     return {}
      //   }
      // }
    },
    components: {
      commonDialog,
      commonSelect,
      commonAgingTypeSelect,
      commonAgingCommitWaySelect,
      commonMultiGoodTypeSelect,
      operatorModal,
      consiNewModal,
      regionModal,
      regionCityModal
    },
    data () {
      return {
      	labelPosition: 'right',
      	dialogShow: {
          Operator_Id: false,
          Con_Id: false,
          Start_Region_No: false,
          Start_City_No: false,
          End_Region_No: false,
          End_City_No: false
        },
        selectTableData: [],
        formData: {
          Operator_Id: '',
          Con_Name: '',
          Con_Id: '',
          AgingCommitWay: '',
	      Start_Region_Name: '',
	      Start_Region_No: '',
          Start_City_Name: '',
          Start_City_No: '',
	      End_Region_Name: '',
	      End_Region_No: '',
          End_City_Name: '',
          End_City_No: '',
          MultiGoodType: [],
          MultiGoodTypeNo: [],
          Aging_Type: '',
          arrivedTime: ''
        },
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        }
      }
    },
    computed: {
    },
    methods: {
      //初始化
      init () {
      	this.formData = {}
      	if (this.selectObj.length > 0) {
	        let selectObj = this.selectObj[0]
	        this.formData.Rec_Id = selectObj.Rec_Id
	        this.formData.Operator_Id = selectObj.Operator_Id
	        this.formData.Con_Name = selectObj.Con_Name
	        this.formData.Con_Id = selectObj.Con_Id
	        this.formData.Price = selectObj.Price
	        this.formData.Mileage = selectObj.Mileage
	        this.formData.AgingCommitWay = selectObj.Commitment_Way
	        this.formData.Start_Region_Name = selectObj.Shipper_Provinces_Name
	        this.formData.Start_Region_No = selectObj.Shipper_Provinces
	        this.formData.Start_City_Name = selectObj.Shipper_City_Name
	        this.formData.Start_City_No = selectObj.Shipper_City
	        this.formData.End_Region_Name = selectObj.Receiving_Provinces_Name
	        this.formData.End_Region_No = selectObj.Receiving_Provinces
	        this.formData.End_City_Name = selectObj.Receiving_City_Name
	        this.formData.End_City_No = selectObj.Receiving_City
	        this.formData.MultiGoodType = selectObj.Goods_Type_Name.split(',')
	        this.formData.MultiGoodTypeNo = selectObj.Goods_Type.split(',')
	        this.formData.Aging_Type = selectObj.Aging_Type
	        this.formData.arrivedTime = selectObj.Commitment_Aging
        }
      },
      openDialog (val) {
        if (val === 'Start_City_No') {
          if (!this.formData.Start_Region_No) {
            this.$alert('只能选择起点省份后才能选择起点城市，请重新选择后再执行！', '友情提示')
        	return
          }
        }
        if (val === 'End_City_No') {
          if (!this.formData.End_Region_No) {
            this.$alert('只能选择收货省份后才能选择收货城市，请重新选择后再执行！', '友情提示')
        	return
          }
        }
        this.dialogShow[val] = true
      },
      selectOper (row) {
        this.formData.Operator_Id = row.Operator_Id
        this.formData.Contract_Id = row.Contract_Id
      },
      selectCon (row) {
        this.formData.Con_Id = row.Con_Id
        this.formData.Con_Name = row.Con_Name
      },
      selectStartRegion (row) {
        this.formData.Start_Region_No = row.Region_No
        this.formData.Start_Region_Name = row.Region_Name
      },
      selectStartRegionCity (row, province) {
        this.formData.Start_City_No = row.Region_No
        this.formData.Start_City_Name = row.Region_Name
        this.formData.Start_Region_No = province
        this.formData.Start_Region_Name = row.Province_Region_Name
      },
      selectEndRegion (row) {
        this.formData.End_Region_No = row.Region_No
        this.formData.End_Region_Name = row.Region_Name
      },
      selectEndRegionCity (row, province) {
        this.formData.End_City_No = row.Region_No
        this.formData.End_City_Name = row.Region_Name
        this.formData.End_Region_No = province
        this.formData.End_Region_Name = row.Province_Region_Name
      },
      deleteSelect (val) {
        if (val === 'Operator_Id') {
          this.formData.Operator_Id = ''
          this.formData.Operator_Name = ''
        }
        if (val === 'Con_Id') {
          this.formData.Con_Id = ''
          this.formData.Con_Name = ''
        }
        if (val === 'Start_Region_No') {
          this.formData.Start_Region_No = ''
          this.formData.Start_Region_Name = ''
        }
        if (val === 'End_Region_No') {
          this.formData.End_Region_No = ''
          this.formData.End_Region_Name = ''
        }
        if (val === 'Start_City_No') {
          this.formData.Start_City_No = ''
          this.formData.Start_City_Name = ''
        }
        if (val === 'End_City_No') {
          this.formData.End_City_No = ''
          this.formData.End_City_Name = ''
        }
      },
      // 新增
      addData (formName) {
		this.$refs[formName].resetFields()
		this.formData.Operator_Id = ''
		this.formData.Operator_Name = ''
		this.formData.Con_Id = ''
		this.formData.Con_Name = ''
		this.formData.MultiGoodType = []
		this.formData.MultiGoodTypeNo = []
		this.formData.Aging_Type = ''
      },
      //保存提交
      save (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	console.log(this.formData)
          	if (this.selectObj.length < 1) {
          	  //新增详情
	          let dataObjStr = JSON.stringify({
	            Con_Id: this.formData.Con_Id ? this.formData.Con_Id : '',
	            Contract_Id: this.formData.Operator_Id ? this.formData.Operator_Id : '',
	            Shipper_Provinces: this.formData.Start_Region_No ? this.formData.Start_Region_No : '',
	            Shipper_City: this.formData.Start_City_No ? this.formData.Start_City_No : '',
	            Receiving_Provinces: this.formData.End_Region_No ? this.formData.End_Region_No : '',
	            Receiving_City: this.formData.End_City_No ? this.formData.End_City_No : '',
	            Commitment_Aging: this.formData.arrivedTime ? this.formData.arrivedTime : '',
	            Commitment_Way: this.formData.AgingCommitWay ? this.formData.AgingCommitWay : '',
	            Price: 0,
	            Mileage: 0,
	            Goods_Type: this.formData.MultiGoodTypeNo ? this.formData.MultiGoodTypeNo.join(',') : '',
	            Aging_Type: this.formData.Aging_Type ? this.formData.Aging_Type : ''
	          })
	          let params2 = {
	            dataType: 'insert',
	            data: dataObjStr
	          }
	          Api.yuyan('AgingApi', params2)
	          .then((res) => {
	            this.isLoaded = true
	        	this.$emit('toList')
	            this.$alert('操作成功！', '友情提示')
	            this.addData('formData')
        		return
	          })
    		} else {
			  //列表带过来的详情更新
	          let dataObjStr = JSON.stringify({
	          	Rec_Id: this.formData.Rec_Id ? this.formData.Rec_Id : '',
	            Con_Id: this.formData.Con_Id ? this.formData.Con_Id : '',
	            Contract_Id: this.formData.Operator_Id ? this.formData.Operator_Id : '',
	            Shipper_Provinces: this.formData.Start_Region_No ? this.formData.Start_Region_No : '',
	            Shipper_City: this.formData.Start_City_No ? this.formData.Start_City_No : '',
	            Receiving_Provinces: this.formData.End_Region_No ? this.formData.End_Region_No : '',
	            Receiving_City: this.formData.End_City_No ? this.formData.End_City_No : '',
	            Commitment_Aging: this.formData.arrivedTime ? this.formData.arrivedTime : '',
	            Commitment_Way: this.formData.AgingCommitWay ? this.formData.AgingCommitWay : '',
	            Price: this.formData.AgingCommitWay ? this.formData.AgingCommitWay : '',
	            Mileage: this.formData.AgingCommitWay ? this.formData.AgingCommitWay : '',
	            Goods_Type: this.formData.MultiGoodTypeNo ? this.formData.MultiGoodTypeNo.join(',') : '',
	            Aging_Type: this.formData.Aging_Type ? this.formData.Aging_Type : ''
	          })
	          let params2 = {
	            dataType: 'update',
	            data: dataObjStr
	          }
	          Api.yuyan('AgingApi', params2)
	          .then((res) => {
	            this.isLoaded = true
	        	this.$emit('toList')
	            this.$alert('操作成功！', '友情提示')
	            this.addData('formData')
        		return
	          })
    		}
          } else {
            return false
          }
        })
      }
    },
    activated () {
      this.getData()
    },
    created () {
    },
    mounted () {
    },
    watch: {
    	'selectObj' () {
    		if (this.selectObj.length < 2) {
    			this.init()
    		}
    	}
    }
  }
</script>

<style lang="less">
	.transAging{
		.common-condition-box{
			border-bottom:0;
		}
		.aging-footer {
	      position:fixed;
	      bottom:0;
	      left:0;
	      width:100%;
	      height:70px;
	      line-height:70px;
	      border:1px solid #ddd;
	      background-color:#fff;
	      z-index: 99;
	      .right{
	      	float:right;
	      	margin-right:60px;
	        .button{
	          display: inline-block;
	          height:36px;
	          background-color: #00a8ff;
	          color:#fff;
	          border:0;
	          font-size:12px;
	        }
	        .button:hover{
	          background-color: #00baff
	        }
	      }
	    }
	    .arrivedTime input{
		    padding-right: 35px;
	    }
    }
</style>