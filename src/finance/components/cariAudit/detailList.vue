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
    <div class="table-box">
      <el-table :data="origData" @selection-change="selectData">
        <el-table-column prop="Create_Time" label="日期" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Biz_Bill_Hdr_Id" label="订单号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Transport_Type" label="运输类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Total_Length" label="公里数"></el-table-column>
        <el-table-column prop="TotalBox_Num" label="总件数"></el-table-column>
        <el-table-column prop="Gross_Volume" label="总体积"></el-table-column>
        <el-table-column prop="Gross_Weight" label="总重量"></el-table-column>
        <el-table-column prop="Real_Amount" label="对账金额" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-input v-model="scope.row.Real_Amount" :disabled="scope.row.isDisabled"
                      v-if="!scope.row.isDisabled"></el-input>
            <span v-if="scope.row.isDisabled">{{scope.row.Real_Amount}}</span>
          </template>
        </el-table-column>
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
  import {DateFtt} from '@/common/js/utils'

  export default {
    name: 'detailList',
    props: {
      type: {
        default: 0
      }
    },
    data () {
      return {
        diecType: '', // 收支类型(recive:应收  meet:应付)
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        origData: [],
        selectTableData: [],
        param: {}
      }
    },
    computed: {},
    methods: {
      onPage () {
        this.getData()
      },
      viewDetail (index, row) {
        var to = {
          name: 'cariDetail'
        }
        this.$router.push(to)
        console.log(row)
      },
      goBack (i) {
        this.$router.go(i)
      },
      editData () {
        let that = this
        if (this.selectTableData.length === 0) {
          this.$alert('未选择，请选择一条记录再执行此操作！', '友情提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.selectTableData.forEach(item => {
            that.origData[item.$index].isDisabled = false
          })
        }
      },
      saveData () {
        let that = this
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
            that.origData[item.$index].isDisabled = false
            postData.Fee_Record_Id = that.origData[item.$index].Fee_Record_Id
            postData.Operator_Id = that.params.Operator_Id
            postData.SettleUp_Company_Id = that.params.SettleUp_Company_Id
            postData.Total_Pcs = that.origData[item.$index].TotalBox_Num
            postData.Real_Amount = that.origData[item.$index].Real_Amount
            postData.Add_Amount = that.origData[item.$index].Add_Amount
            postData.Payment_Type = that.params.Payment_Type
            postData.SettleUp_Remarks = that.origData[item.$index].Payment_Type ? that.origData[item.$index].Payment_Type : ''
            postData.Service_Type = that.params.Service_Type
            postData.Service_Item = that.params.Service_Item
            postData.Remarks = that.origData[item.$index].Remarks ? that.origData[item.$index].Remarks : ''
            tempList.push(postData)
          })
          param.list_params = tempList
          Api.post('JlpFeeRecordSave', param).then(res => {
            if (res.Flag === true) {
              this.$alert('保存成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                that.getData()
              })
            }
          })
        }
      },
      deleteData () {
        let that = this
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
            postData.Fee_Record_Id = that.origData[item.$index].Fee_Record_Id
            tempList.push(postData)
          })
          param.list_params = JSON.stringify(tempList)
          Api.post('RecFeeRecordRemove', param).then(res => {
            if (res.Flag === true) {
              this.$alert('删除成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                that.getData()
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
        this.getData()
      },
      getData () {
        this.loadingWait = this.showLoading('请稍候...')
        var params = {
          Payment_Record_Id: this.$route.params.Payment_Record_Id,
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        Api.get('JlpGetBalanceRecordSh', params)
          .then((res) => {
            this.loadingWait.close()
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
                this.$router.go(0)
              })
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
