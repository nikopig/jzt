<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="goBack(-2)">费用汇总</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="goBack(-1)">费用项目</el-breadcrumb-item>
            <el-breadcrumb-item>费用明细</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <!-- <div class="btn-box">
         <el-button type="text" icon="plus" @click="addInsert">追加收入</el-button>
       </div>-->
      <div class="btn-box">
        <el-button type="text" icon="check" @click="confirmData">对账确认</el-button>
      </div>
      <div class="btn-box">
        <el-button type="text" icon="edit" @click="editData">编辑</el-button>
      </div>
      <div class="btn-box">
        <el-button type="text" @click="saveData"><i class="el-icon-mo-activateSave"></i>&nbsp;保存</el-button>
      </div>
      <div class="btn-box">
        <el-button type="text" icon="delete" @click="deleteData">删除</el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table :data="origData" @selection-change="selectData">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="Create_Time" label="日期" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Biz_Bill_Hdr_Id" label="订单号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Transport_Type" label="运输类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Total_Length" label="公里数"></el-table-column>
        <el-table-column prop="TotalBox_Num" label="总件数"></el-table-column>
        <el-table-column prop="Gross_Volume" label="总体积"></el-table-column>
        <el-table-column prop="Gross_Weight" label="总重量"></el-table-column>
        <el-table-column prop="Real_Amount" label="实际金额" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Real_Amount" :disabled="scope.row.isDisabled"
                      v-if="!scope.row.isDisabled"></el-input>
            <span v-if="scope.row.isDisabled">{{scope.row.Real_Amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Add_Amount" label="追加金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Add_Amount" :disabled="scope.row.isDisabled"
                      v-if="!scope.row.isDisabled"></el-input>
            <span v-if="scope.row.isDisabled">{{scope.row.Add_Amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Takecharge_Amount" label="托收提取费" v-if="serviceItem === 4"></el-table-column>
        <el-table-column prop="Goods_Value" label="商品总价值" v-if="serviceItem === 3"></el-table-column>
        <el-table-column prop="Bill_Status" label="订单状态"></el-table-column>
        <!--<el-table-column label="操作">-->
        <!--<template scope="scope">-->
        <!--<el-button class="primary" type="text" size="small" @click="viewDetail(scope.$index, scope.row)">详情-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <el-pagination
      v-show="pages.isShow"
      layout="total, prev, pager, next, jumper"
      :page-size="pages.pageSize"
      :total="pages.total"
      :current-page="pages.currentPage"
      @current-change="onPage"
    >
    </el-pagination>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Api from '@/common/js/api'
  import { DateFtt } from '@/common/js/utils'

  export default {
    name: 'detailList',
    props: {
      type: {
        default: 0
      }
    },
    data () {
      return {
        serviceItem: '', // 服务项目
        diecType: '', // 收支类型(recive:应收  meet:应付)
        origData: [],
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        selectTableData: [],
        param: {}
      }
    },
    computed: {
      acountText () {
        return this.diecType === '20' ? '应付金额' : '应收金额'
      }
    },
    methods: {
      onPage () {
        this.getData()
      },
      viewDetail (index, row) {
        var to = {
          name: 'detail'
        }
        this.$router.push(to)
        console.log(row)
      },
      goBack (i) {
        this.$router.go(i)
      },
      editData () {
        if (this.selectTableData.length === 0) {
          this.$alert('未选择，请选择一条记录再执行此操作！', '友情提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.selectTableData.forEach(item => {
            this.origData[item.$index].isDisabled = false
          })
        }
      },
      saveData () {
        if (this.selectTableData.length === 0) {
          this.$alert('未选择，请选择一条记录再执行此操作！', '友情提示', {
            confirmButtonText: '确定'
          })
        } else {
          let param = {
            Operator: Api.userInfo.USERID,
            list_params: []
          }
          let tempList = []
          this.selectTableData.forEach(item => {
            let postData = {
              Fee_Record_Id: '',
              Operator_Id: '',
              SettleUp_Company_Id: '',
              Total_Pcs: '',
              Real_Amount: '',
              Add_Amount: '',
              Payment_Type: '',
              SettleUp_Remarks: '',
              Service_Type: '',
              Service_Item: '',
              Remarks: ''
            }
            this.origData[item.$index].isDisabled = false
            postData.Fee_Record_Id = this.origData[item.$index].Fee_Record_Id
            postData.Operator_Id = this.params.Operator_Id
            postData.SettleUp_Company_Id = this.params.SettleUp_Company_Id
            postData.Total_Pcs = this.origData[item.$index].TotalBox_Num
            postData.Real_Amount = this.origData[item.$index].Real_Amount
            postData.Add_Amount = this.origData[item.$index].Add_Amount
            postData.Payment_Type = this.params.Payment_Type
            postData.SettleUp_Remarks = this.origData[item.$index].Payment_Type ? this.origData[item.$index].Payment_Type : ''
            postData.Service_Type = this.params.Service_Type
            postData.Service_Item = this.params.Service_Item
            postData.Remarks = this.origData[item.$index].Remarks ? this.origData[item.$index].Remarks : ''
            tempList.push(postData)
          })
          param.list_params = JSON.stringify(tempList)
          this.loadingWait = this.showLoading('请稍候...')
          Api.post('JlpFeeRecordSave', param).then(res => {
            this.loadingWait.close()
            if (res.Flag === true) {
              this.$alert('保存成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                this.getData()
              })
            }
          })
        }
      },
      deleteData () {
        if (this.selectTableData.length === 0) {
          this.$alert('未选择，请选择一条记录再执行此操作！', '友情提示', {
            confirmButtonText: '确定'
          })
        } else {
          let param = {
            Operator: Api.userInfo.USERID,
            list_params: []
          }
          let tempList = []
          this.selectTableData.forEach(item => {
            let postData = {
              Fee_Record_Id: ''
            }
            postData.Fee_Record_Id = this.origData[item.$index].Fee_Record_Id
            tempList.push(postData)
          })
          param.list_params = JSON.stringify(tempList)
          Api.post('RecFeeRecordRemove', param).then(res => {
            if (res.Flag === true) {
              this.$alert('删除成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                this.getData()
              })
            }
          })
        }
      },
      addInsert () {
        this.addDialog.dialogFormVisible = true
      },
      //选择哪一条记录
      selectData (val) {
        this.selectTableData = val
      },
      init () {
        this.params = this.$route.params
        this.params.StartIndex = (this.pages.currentPage - 1) * this.pages.pageSize
        this.params.PageSize = this.pages.pageSize
        this.flowType = this.params ? this.params.flowType : ''
        this.diecType = this.params ? this.params.diecType : ''
        this.getData()
      },
      getData () {
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpGetBalanceRecord', this.params)
          .then((res) => {
            this.loadingWait.close()
            this.serviceItem = res.MsgInfo.length > 0 ? res.MsgInfo[0].Service_Item : ''
            if (!res.Flag) {
              this.messageInfo(this.ErrInfo)
              return false
            }
            if (res.MsgInfo.length > 0) {
              this.pages.total = res.MsgInfo[0].Sum_Cnt
            }
            // 如果总条数不止一页，显示分页组件
            if (this.pages.total > this.pages.pageSize) {
              this.pages.isShow = true
            }
            this.origData = res.MsgInfo
            this.origData.forEach((item, index) => {
              item.Create_Time = DateFtt('yyyy-MM-dd', new Date(item.Create_Time.replace(/-/g, '/')))
              Vue.set(item, 'isDisabled', true)
              Vue.set(item, '$index', index)
            })
          })
      },
      confirmData () {
        if (this.selectTableData.length > 0) {
          let param = {
            Operator: Api.userInfo.USERID,
            list_params: ''
          }
          let tempList = []
          this.selectTableData.forEach(item => {
            let postData = {
              Operator_Id: this.params.Operator_Id,
              SettleUp_Company_Id: this.params.SettleUp_Company_Id,
              PrintReconciliation_Record_Id: this.params.PrintReconciliation_Record_Id,
              Payment_Type: this.$route.params.diecType,
              Service_Type: this.params.Service_Type,
              Service_Item: this.params.Service_Item,
              Fee_Record_Id: item.Fee_Record_Id,
              Begin_Date: this.params.Begin_Date,
              End_Date: this.params.End_Date
            }
            tempList.push(postData)
          })
          param.list_params = JSON.stringify(tempList)
          Api.post('FeeRecordsNode1', param).then(res => {
            if (res.Flag === true) {
              this.$alert('执行成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                this.getData()
              })
            } else {
              this.messageInfo(res.ErrInfo)
            }
          })
        } else {
          this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
        }
      }
    },
    created () {},
    mounted () {},
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .headbar {
    margin-bottom: 10px;
  }

  .toolbar {
    width: 100%;
    height: 42px;
    background-color: #EBEEF5;
    .el-button--text {
      color: #666;
    }
    .btn-box {
      display: inline-block;
      *display: inline-block;
      zoom: 1;
      padding: 5px 15px;
    }
  }

  .condition-box {
    margin-top: 20px;
    border: 1px solid #EBEEF5;
    padding: 15px;
    .label-input {
      label {
        padding-right: 8px;
      }
      .el-input {
        width: auto;
      }
    }
  }

  .table-box {
    margin-top: 20px;
  }

  .selectChange {
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
</style>
