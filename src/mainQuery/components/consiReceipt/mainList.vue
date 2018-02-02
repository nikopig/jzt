<template>
      <div class="containMain">
        <div class="headbar">
          <div class="common-row">
            <label>当前位置：</label>
            <div class="common-col">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item @click.native="go(-1)">首页</el-breadcrumb-item>
                <el-breadcrumb-item>回单汇总</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
        </div>
        <div class="common-condition-box">
          <el-form :inline="true" size="small" label-width="px">
              <el-form-item label="委托方：">
                <el-input v-model="condition.Con_Name" @dblclick.native="openDialog('consignor')" disabled placeholder="双击选择委托方"></el-input>
              </el-form-item>
              <el-form-item labelWidth="120px" label="下单或签收日期：">
                <el-date-picker
                  v-model="condition.timeData"
                  @change="timeData"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="收件人：">
                <el-input v-model="condition.Receipt_Name" placeholder="助记码、名字、编号"></el-input>
              </el-form-item>
              <el-form-item label="返回单号：">
                <el-input v-model="condition.Courier_Number"></el-input>
              </el-form-item>
              <el-form-item label="回单状态：">
                <el-radio-group v-model="condition.Is_Receipt_Upload">
                  <el-radio label="Y">回单已回</el-radio>
                  <el-radio label="N">回单未回</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="primary" icon="search" @click="search">查询</el-button>
              </el-form-item>
          </el-form>
        </div>
        <div class="toolbar">
          <div class="btn-box">
            总回单数：<span>{{HuiDan.HuiDan_Num}}</span>
          </div>
          <div class="btn-box">
            已回单数：<span>{{HuiDan.Yi_HuiDan_Num}}</span>
          </div>
          <div class="btn-box">
            未回单数：<span>{{HuiDan.Wei_HuiDan_Num}}</span>
          </div>
          <div class="btn-box">
            <el-button type="text" icon="mo-refresh" @click.native="init">刷新数据</el-button>
            <el-button type="text" icon="check" @click.native="receiptConfirm ">回单确认</el-button>
            <el-button type="text" icon="mo-download">导出明细</el-button>
          </div>
        </div>
        <div class="table-box">
            <el-table :data="origData" stripe @row-dblclick="goItem" @selection-change="selectData">
              <el-table-column type="selection" label="全选" width="40" class="number"></el-table-column>
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="Con_Name" label="委托方名称" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="ComeBack_Way_Name" label="返回方式" width="100"></el-table-column>
              <el-table-column prop="Courier_Number" label="返回单号" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Bill_TransportA_Dtl_State_Name" label="回单状态" width="100" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="ComeBack_Sign_Name" label="回单接收方" width="100"></el-table-column>
              <el-table-column prop="Sender_Name" label="发件人"></el-table-column>
              <el-table-column prop="Receipt_Name" label="收件人"></el-table-column>
              <el-table-column prop="Operate_Time" label="签收日期" width="160" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Remarks" label="备注"></el-table-column>
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
            v-show='page.isShow'
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total="page.bigTotalItems">
          </el-pagination>
        </div>
        <consi-modal :visible.sync="dialogShow.consignor" @change="selectconsignor" :showDefault="true"></consi-modal>
      </div>
</template>

<script>
  import Api from '@/common/js/api'
  import { DateFtt } from '@/common/js/utils'
  import consiModal from '@/common/service/modal/consiNew-modal'
  export default {
    name: 'consiMainList',
    props: [],
    components: {consiModal},
    data () {
        return {
          selectTableData: [],    // 全选数据
          currentPage: 1,
          page: {
            startIndex: 0,
            pageSize: 10,
            bigTotalItems: 0,
            isShow: false
          },
          condition: {
            Con_Name: '',     // 委托方
            Con_Id: '',
            Courier_Number: '',        // 返回单号
            Receipt_Name: '',   // 收件人
            timeData: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],             // 日期
            Start_Operate_Time: '',   // 起始时间
            End_Operate_Time: '',     // 截止时间
            Is_Receipt_Upload: ''  // 是否回单
          },
          HuiDan: {},
          origData: [],
          dialogShow: {
            consignor: false
          }
        }
    },
    methods: {
      timeData () {       // 起始日期
        this.condition.Start_Operate_Time = DateFtt('yyyy-MM-dd', this.condition.timeData[0])
        this.condition.End_Operate_Time = DateFtt('yyyy-MM-dd', this.condition.timeData[1], true)
      },
      search () {       // 查询
        this.getData()
      },
      openDialog (val) {
        this.dialogShow[val] = true
      },
      selectconsignor (row) {   // 弹窗双击确认
        this.condition.Con_Name = row.Con_Name
        this.condition.Con_Id = row.Con_Id
        this.getData()
      },
      selectData (val) {     // 全选
        this.selectTableData = val
      },
      updateTransReceipt (param) { // 更新运输任务明细和异常状态
        return Api.basePost('TMP_Bill_Receipt_Record_Save_New', param, true)
      },
      getTranHdrList (originalDtlIds) { // 获取汇总数据
        let params = {
          OriginalBill_Dtl_Id: ',' + originalDtlIds.join(',') + ','
        }
        Api.get('TmpBillTransportADtlGetillHdrIdAll', params, true).then((res) => {
          if (res.Flag) {
            console.log('获取汇总数据')
            console.log(res.MsgInfo)
            let arr = res.MsgInfo
            let transHdrIds = ''
            arr.forEach((item, index) => {
              if (item.Bill_TransportA_Dtl_State === 'TRUE') {
                transHdrIds += item.Bill_Hdr_Id
                if (index !== arr.length - 1) {
                  transHdrIds += ','
                }
              }
            })
            this.updateTransHdrStatus(transHdrIds)
          } else {
            this.$alert(res.ErrInfo, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      updateTransHdrStatus (str) { // 修改汇总状态
        let arr = str.split(',')
        let params = []
        arr.forEach(item => {
          let param = {
            Bill_Hdr_Id: item,
            Bill_TransportA_Hdr_State: 'ZZ',
            changetype: 'updated'
          }
          params.push(param)
        })
        Api.basePost('TMP_Bill_TransportA_Hdr_Save', params).then((res) => {
          if (!res.Flag) {
            this.$alert(res.ErrInfo, '提示', {
              confirmButtonText: '确定'
            })
          }
        })
      },
      receiptConfirm () { // 回单确认
        let params = {}
        if (this.selectTableData.length > 0) {
          let transDtlArry = []
          let receiptRecordArry = []
          let originalDtlArry = []
          this.selectTableData.forEach(item => {
            // 运输任务明细参数
            let transDtlIds = item.BillTransportA_Dtl_Ids.split(',')
            transDtlIds.forEach(transDtlId => {
                let transDtlParam = {
                Bill_Dtl_Id: transDtlId,
                Bill_TransportA_Dtl_State: 'ZZ',
                changetype: 'updated'
              }
              transDtlArry.push(transDtlParam)
            })
            // 异常参数
            let reciptRecordIds = item.Receipt_Record_Ids.split(',')
            reciptRecordIds.forEach(receiptRecordId => {
              let receiptRecordParam = {
                Receipt_Record_Id: receiptRecordId,
                Bill_TransportA_Dtl_State: 'ZZ',
                changetype: 'updated'
              }
              receiptRecordArry.push(receiptRecordParam)
            })
            // 原始单据明细ID
            originalDtlArry.push(item.OriginalBill_Dtl_Ids)
          })
          params.TMP_Bill_TransportA_Dtl_Save = JSON.stringify(transDtlArry)
          params.TMP_Bill_Receipt_Record_Save = JSON.stringify(receiptRecordArry)
          this.updateTransReceipt(params).then((res) => { // 更新运输任务明细和异常状态
            if (res.Flag) {
              this.$alert('保存成功！', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.getTranHdrList(originalDtlArry) // 获取汇总数据
                  this.getData()
                }
              })
            } else {
              this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        } else {
          this.$alert('请选择要操作的行', '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleCurrentChange () {    // 分页
        this.page.startIndex = (this.currentPage - 1) * this.page.pageSize
        this.getData()
      },
      goItem (index, row) {      // 向二级跳转传参
        this.$router.push({
          name: 'consiItemList',
          params: {
            Courier_Number: row.Courier_Number
          }
        })
      },
      getHdNum () {       //  回单数量
        let param = {}
        param.Con_Id = this.condition.Con_Id
        Api.get('TmpCSNGetBillReceiptRecordTB', param, true).then(res => {
          if (res.Flag) {
            this.HuiDan = res.MsgInfo[0]
          }
        })
      },
      getData () {    // 获取数据
        this.getHdNum()
        if (!this.condition.timeData) {
          this.$alert('请填写下单或签收日期', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
          return
        }
        let param = {}
        param.Con_Id = ',' + this.condition.Con_Id + ','
        param.Courier_Number = this.condition.Courier_Number ? this.condition.Courier_Number : '%'
        param.Receipt_Name = this.condition.Receipt_Name ? this.condition.Receipt_Name : '%'
        param.Is_Receipt_Upload = this.condition.Is_Receipt_Upload ? this.condition.Is_Receipt_Upload : '%'
        param.Start_Operate_Time = this.condition.Start_Operate_Time ? this.condition.Start_Operate_Time : '%'
        param.End_Operate_Time = this.condition.End_Operate_Time ? this.condition.End_Operate_Time : '%'
        param.startIndex = this.page.startIndex
        param.pageSize = this.page.pageSize
        this.loadingWait = this.showLoading('加载中...')
        Api.get('TmpCSNGetBillReceiptRecordHZ', param, true).then(res => {
          this.loadingWait.close()
          if (res.Flag) {
            this.origData = res.MsgInfo
            if (this.origData.length > 0 && this.origData[0].bigTotalItems > this.page.pageSize) {
                this.page.isShow = true
            }
            this.page.bigTotalItems = this.origData.length ? this.origData[0].bigTotalItems : 0
          }
        })
      },
      init () {
        // this.condition.timeData = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()]  // 设置默认下单签收日期
        this.$nextTick(() => {
          this.getData()
        })
      }
    },
    activated () {
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .containMain {
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }
      .toolbar {
        margin-bottom: 15px;
        .btn-box:nth-child(-n + 3) {
          line-height: 30px;
        }
        .btn-box:nth-child(4) {
          float: right;
          margin-right: 50px;
        }
      }
      .block {
        margin: 60px 0 30px;
        text-align: center;
      }
  }
</style>
