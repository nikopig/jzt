<template>
  <div class="common-tab-wraper common-container transAging">
    <div class="common-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="时效列表" name="first">
            <!--<list-data ref="list-data" @send="send" @toDetail="toDetail"></list-data>-->
            <div class="toolbar">
              <div class="btn-box">
                <el-button type="text" icon="el-icon-mo-addDetail" @click="addData('formData')">新增</el-button>
                <el-button type="text" icon="el-icon-mo-delete2" @click="deleteData" v-show="true">删除</el-button>
                <el-button type="text" icon="el-icon-mo-refresh" @click="refreshData" v-show="true">刷新</el-button>
              </div>
            </div>
            <div class="common-condition-box list" v-show="activeName==='first'">
              <el-form :inline="true">
                <el-form-item  label="时效类型">
                  <select-aging-type field="Aging_Type" v-model="filterCondition.Aging_Type"></select-aging-type>
                </el-form-item>
                <el-form-item class="KeyWords">
                  <el-input v-model="filterCondition.KeyWords" placeholder="合同编号，委托方名称、助记码检索"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="table-box">
              <el-table :data="origData" ref="origData" @selection-change="selectData" @row-dblclick='editCurData'>
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="Contract_Name" label="合同名称" width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Con_Name" label="委托方" width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Shipper_Provinces_Name" label="起点省份"></el-table-column>
                <el-table-column prop="Shipper_City_Name" label="起点城市"></el-table-column>
                <el-table-column prop="Receiving_Provinces_Name" label="收货省份"></el-table-column>
                <el-table-column prop="Receiving_City_Name" label="收货城市"></el-table-column>
                <el-table-column prop="Commitment_Aging" label="承诺到达时间(H)"></el-table-column>
                <el-table-column prop="Aging_Type_Name" label="时效类型"></el-table-column>
                <el-table-column prop="Goods_Type_Name" label="产品大类"></el-table-column>
              </el-table>
            </div>
            <el-pagination
              v-show="pages.isShow"
              layout="total, prev, pager, next, jumper"
              :page-size="pages.pageSize"
              :total="pages.total"
              :current-page.sync="pages.currentPage"
              @current-change="onPage"
            >
            </el-pagination>
        </el-tab-pane>
        <el-tab-pane :disabled="true"></el-tab-pane>
        <el-tab-pane label="时效详情" name="second">
            <!--<detail-data :selectObj.sync="selectObj" @toList="toList"></detail-data>-->
            <div class="main-list">
                <div class="toolbar">
                  <div class="btn-box">
                    <el-button type="text" icon="el-icon-mo-addDetail" @click="addData('formData')">新增</el-button>
                  </div>
                </div>
                <div class="common-condition-box">
                  <el-form :inline="true" :label-position="labelPosition" label-width="94px" :rules="rules2" :model="formData" ref="formData">
                      <el-form-item label="合同名称" prop="Contract_Name" :rules="[
                                  { required: true, message: '请输入合同名称', trigger: 'change' }
                                ]">
                        <el-tooltip class="item" effect="dark" :disabled="formData.Contract_Name ? isTooltipVisble : !isTooltipVisble" :content="formData.Contract_Name" placement="top-start">
                        <el-input v-model="formData.Contract_Name" placeholder="双击选择"
                                  icon="el-icon-close" 
                                  @click="deleteSelect('Operator_Id')"
                                  @dblclick.native="openDialog('Operator_Id')"
                                  :disabled="true"></el-input>
                        </el-tooltip>         
                      </el-form-item>
                      <el-form-item label="委托方" prop="Con_Name" :rules="[
                                  { required: true, message: '请输入委托方', trigger: 'change' }
                                ]">
                        <el-tooltip class="item" effect="dark" :disabled="formData.Con_Name ? isTooltipVisble : !isTooltipVisble" :content="formData.Con_Name" placement="top-start">
                        <el-input v-model="formData.Con_Name" placeholder="双击选择"
                                  icon="el-icon-close"
                                  @click="deleteSelect('Con_Id')"
                                  @dblclick.native="openDialog('Con_Id')"
                                  :disabled="true"></el-input>
                        </el-tooltip>         
                      </el-form-item>
                    <el-form-item  label="时效承诺方式" prop="AgingCommitWay" :rules="[
                                  { required: true, message: '请输入时效承诺方式', trigger: 'blur' }
                                ]">
                      <select-aging-commit-way field="AgingCommitWay" v-model="formData.AgingCommitWay"></select-aging-commit-way>
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
                    <el-form-item  label="产品大类" prop="MultiGoodTypeNo" :rules="[
                                  { required: true, type: 'array', message: '请输入产品大类', trigger: 'blur' }
                                ]">
                      <select-multi-good-type field="MultiGoodTypeNo" v-model="formData.MultiGoodTypeNo"></select-multi-good-type>
                    </el-form-item>
                    <el-form-item  label="时效类型" prop="Aging_Type"
                                :rules="[
                                  { required: true, message: '请输入时效类型', trigger: 'change' }
                                ]">
                      <select-aging-type field="Aging_Type" v-model="formData.Aging_Type"></select-aging-type>
                    </el-form-item>
                    <el-form-item label="到货时间(H)"
                                prop="arrivedTime"
                                >
                        <el-input class="arrivedTime" v-model="formData.arrivedTime" auto-complete="off" placeholder="请输入到货时间" @click="deleteSelect('arrivedTime')">
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
                <consiNew-modal :visible.sync="dialogShow.Con_Id" :Operator_Id="formData.Operator_Id" @change="selectCon"></consiNew-modal>
                <region-modal :visible.sync="dialogShow.Start_Region_No" DialogTitle="起点省份"  @change="selectStartRegion"></region-modal>
                <region-city-modal :visible.sync="dialogShow.Start_City_No" :Region_No="formData.Start_Region_No" DialogTitle="起点城市"  @change="selectStartRegionCity"></region-city-modal>
                <region-modal :visible.sync="dialogShow.End_Region_No" DialogTitle="收货省份"  @change="selectEndRegion"></region-modal>
                <region-city-modal :visible.sync="dialogShow.End_City_No" :Region_No="formData.End_Region_No" DialogTitle="收货城市"  @change="selectEndRegionCity"></region-city-modal>
            </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt, floatAdd } from '@/common/js/utils'
    import commonDialog from '@/common/components/common-dialog'
    import commonSelect from '@/common/service/select/select-service-type'
    import selectAgingType from '@/common/service/select/select-aging-type'
    import selectAgingCommitWay from '@/common/service/select/select-aging-commit-way'
    import selectMultiGoodType from '@/common/service/select/select-multi-good-type'
    import operatorModal from '@/common/service/modal/operator-modal'
    import consiNewModal from '@/common/service/modal/consiNew-modal'
    import regionModal from '@/common/service/modal/region-modal'
    import regionCityModal from '@/common/service/modal/region-city-modal'

    export default {
        name: 'transAging',
        components: {
            commonDialog,
            commonSelect,
            selectAgingType,
            selectAgingCommitWay,
            selectMultiGoodType,
            operatorModal,
            consiNewModal,
            regionModal,
            regionCityModal
        },
        data () {
            var checkArrivedTime = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('到货时间不能为空'))
                } else {
                  if (isNaN(value)) {
                    callback(new Error('请输入数字值'))
                  } else {
                    if (value < 0) {
                      callback(new Error('请输入大于0的数字值'))
                    } else {
                      callback()
                    }
                  }
                }
            }
            return {
                activeName: 'first',
                selectObj: [],
                isFirst: true, //按钮、保存显示/隐藏
                origData: [],
                selectTableData: [],
                filterCondition: {
                  Aging_Type: '',
                  KeyWords: ''
                },
                pages: {
                  currentPage: 1, // 当前页
                  pageSize: 10, // 每页条数
                  total: 0, // 总条数
                  isShow: false // 是否显示分页组件
                },
                labelPosition: 'right',
                dialogShow: {
                  Operator_Id: false,
                  Con_Id: false,
                  Start_Region_No: false,
                  Start_City_No: false,
                  End_Region_No: false,
                  End_City_No: false
                },
                rules2: {
                  // pass: [
                  //   { validator: validatePass, trigger: 'blur' }
                  // ],
                  arrivedTime: [
                    { required: true, validator: checkArrivedTime, trigger: 'blur' }
                  ]
                },
                formData: {
                  Operator_Id: '',
                  Contract_Name: '',
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
                isTooltipVisble: false
            }
        },
        methods: {
            handleClick (tab, event) {
                if (tab.name === 'second') {
                    if (this.selectObj.length > 1) {
                        this.$alert('只能选择1条数据，请重新选择后再执行！', '友情提示', {
                          confirmButtonText: '确定',
                          callback: () => {
                            this.activeName = 'first'
                          }
                        })
                    } else {
                        this.init2()
                    }
                } else {
                }
            },
            onPage () {
                this.getData()
            },
            deleteCon () {
                this.filterCondition.Con.MINGCHENG = ''
                this.filterCondition.Con.SettleUp_Company_Id = '%'
            },
            //获取表格数据
            getData () {
                this.origData = []
                this.loadingWait = this.showLoading('请稍候...')
                if (this.filterCondition.KeyWords || this.filterCondition.Aging_Type) {
                  this.pages.currentPage = 1
                }
                let dataObjStr = JSON.stringify({
                  KeyWords: this.filterCondition.KeyWords ? this.filterCondition.KeyWords : '',
                  AgingType: this.filterCondition.Aging_Type ? this.filterCondition.Aging_Type : '',
                  startIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
                  pageSize: this.pages.pageSize,
                  userId: Api.userInfo.USERID
                })
                let params = {
                    dataType: 'select',
                    data: dataObjStr
                }
                Api.yuyan('AgingApi', params)
                  .then((res) => {
                    this.loadingWait.close()
                    this.origData = res.MsgInfo
                    if (!res.Flag) {
                      this.messageInfo(this.ErrInfo)
                      return false
                    }
                    if (res.MsgInfo.length > 0) {
                      this.pages.total = res.MsgInfo[0].bigTotalItems
                    }
                    // 如果总条数不止一页，显示分页组件
                    if (this.pages.total > this.pages.pageSize) {
                      this.pages.isShow = true
                    }
                  })
            },
            //查询流水
            searchData () {
                this.getData()
            },
            //选择表格的多条记录
            selectData (val) {
                /*val.forEach((item) => {
                    item.isChecked = true
                })*/
                this.selectObj = val
            },
            //取消选择表格的多条记录
            toggleSelection (rows) {
                console.log(rows + '111')
                if (rows) {
                  rows.forEach(row => {
                    this.$refs['origData'].toggleRowSelection(row)
                  })
                } else {
                  this.$refs['origData'].clearSelection()
                }
            },
            editCurData (val) {
                // if (val.isChecked) {
                    this.selectObj[0] = val
                    this.init2()
                    this.activeName = 'second'
                // }
            },
            // 删除
            deleteData () {
                if (this.selectObj.length > 0) {
                    this.loadingWait = this.showLoading('请稍候...')
                    let RecIdArr = []
                    this.selectObj.forEach(item => {
                        RecIdArr.push(item.Rec_Id)
                    })
                    let dataObjStr = JSON.stringify({
                      Rec_Id: RecIdArr.join(',')
                    })
                    let params = {
                        dataType: 'delete',
                        data: dataObjStr
                    }
                    Api.yuyan('AgingApi', params)
                      .then((res) => {
                        this.loadingWait.close()
                        this.origData = res.MsgInfo
                        if (!res.Flag) {
                          this.messageInfo(this.ErrInfo)
                          return false
                        } else {
                            this.$alert('操作成功！', '友情提示')
                        }
                        this.getData()
                      })
                } else {
                    this.$alert('只能勾选列表数据后才能操作，请重新选择后再执行！', '友情提示')
                    return
                }
            },
            //刷新
            refreshData () {
                this.filterCondition.KeyWords = ''
                this.filterCondition.Aging_Type = ''
                this.getData()
            },
            //初始化
            init2 () {
                if (this.selectObj.length > 0) {
                    let selectObj = this.selectObj[0]
                    this.formData.Rec_Id = selectObj.Rec_Id
                    this.formData.Operator_Id = selectObj.Contract_Id  //合同编号
                    this.formData.Contract_Name = selectObj.Contract_Name
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
                this.formData.Contract_Name = row.Operator_Name
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
                  this.formData.Contract_Name = ''
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
                this.activeName = 'second'
                this.formData.Rec_Id = ''
                /*this.formData.Operator_Id = ''
                this.formData.Con_Name = ''
                this.formData.Con_Id = ''
                this.formData.Price = ''
                this.formData.Mileage = ''
                this.formData.AgingCommitWay = ''
                this.formData.Start_Region_Name = ''
                this.formData.Start_Region_No = ''
                this.formData.Start_City_Name = ''
                this.formData.Start_City_No = ''
                this.formData.End_Region_Name = ''
                this.formData.End_Region_No = ''
                this.formData.End_City_Name = ''
                this.formData.End_City_No = ''
                this.formData.MultiGoodType = []
                this.formData.MultiGoodTypeNo = []
                this.formData.Aging_Type = ''
                this.formData.arrivedTime = ''*/
            },
            //保存提交
            save (formName) {
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    if (!this.formData.Rec_Id) {
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
                      console.log(this.formData)
                      Api.yuyan('AgingApi', params2)
                      .then((res) => {
                        this.isLoaded = true
                        if (!res.Flag) {
                          this.messageInfo(res.ErrInfo)
                          return false
                        } else {
                          this.getData()
                          this.activeName = 'first'
                          this.$alert('操作成功！', '友情提示')
                          this.$refs['formData'].resetFields()
                          return
                        }
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
                      console.log(this.formData)
                      Api.yuyan('AgingApi', params2)
                      .then((res) => {
                        this.isLoaded = true
                        if (!res.Flag) {
                          this.messageInfo(res.ErrInfo)
                          return false
                        } else {
                          this.getData()
                          this.activeName = 'first'
                          this.$alert('操作成功！', '友情提示')
                          this.$refs['formData'].resetFields()
                          this.formData.Rec_Id = ''
                          return
                        }
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
        mounted () {
          this.getData()
        }
    }
</script>
<style lang="less">
    .KeyWords {
        width:20%;
        max-width:220px;
    }
    .el-form--inline .KeyWords .el-form-item__content{
        width:100%;
    }
    .transAging{
        .common-condition-box{
            border-bottom:0;
        }
        .common-condition-box.list{
          padding-top: 5px;
          margin-bottom: 0;
          .el-form-item {
            margin-bottom: 5px;
          }
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
