<template>
  <div class="main-list">
    <div class="toolbar">
      <div class="btn-box">
        <el-button type="text" icon="check" @click="confirmData">审核通过</el-button>
        <el-button type="text" icon="mo-beifen" @click="mergeBill">合并</el-button>
        <el-button type="text" icon="mo-beifen" @click="repulseData">打回</el-button>
        <el-button type="text" icon="mo-print" @click="printBill">打印对账单</el-button>
      </div>
      <div class="btn-box" style="float: right;line-height: 30px;margin-right: 25px;">
        总金额：{{tolMoney}}
      </div>
    </div>
    <div class="common-condition-box">
      <el-form :inline="true">
        <el-form-item label="对账单位">
          <el-input class="noselect" v-model="filterCondition.Con.MINGCHENG" placeholder="双击选择"
                    @dblclick.native="isVisible = true"
                    icon="close"
                    :on-icon-click="deleteCon"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item  label="费用类型">
          <common-select field="Service_Type" v-model="filterCondition.Service_Type"></common-select>
        </el-form-item>
        <el-form-item  label="开始日期">
          <el-date-picker v-model="filterCondition.Begin_Date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item  label="结束日期">
          <el-date-picker v-model="filterCondition.End_Date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="origData" ref="origData" @selection-change="selectData">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="Operator_Name" label="运营方" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Mon" label="月份"></el-table-column>
        <el-table-column prop="Con_Name" label="对账单位" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Service_Type_Desc" label="费用类型"></el-table-column>
        <el-table-column prop="Total_Amount" :label="acountText"></el-table-column>
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
    <el-pagination
      v-show="pages.isShow"
      layout="total, prev, pager, next, jumper"
      :page-size="pages.pageSize"
      :total="pages.total"
      :current-page.sync="pages.currentPage"
      @current-change="onPage"
    >
    </el-pagination>
    <balance-modal :visible.sync="isVisible" :type="diecType" @change="selectCon"></balance-modal>
    <el-dialog title="打回原因" :visible.sync="repulseDialog.dialogFormVisible">
      <el-form :model="repulseDialog.form" label-position="right" ref="retReason">
        <el-form-item prop="retReason" :rules="[{type: 'string', required: true, message: '请填写打回原因', trigger: 'blur'}]">
          <el-input type="textarea" v-model="repulseDialog.form.retReason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repulseDialog.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRepulse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import balanceModal from '@/common/service/modal/balance-modal'
  import commonSelect from '@/common/service/select/select-service-type'

  export default {
    name: 'mainList',
    props: {
      type: {
        default: 0
      }
    },
    components: {
      balanceModal,
      commonSelect
    },
    data () {
      return {
        isVisible: false, // 对账单位弹框显示与否
        diecType: '10', // 收支类型(10:应收  20:应付)
        origData: [],
        selectTableData: [],
        tolMoney: 0.0,  // 显示总金额
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        filterCondition: {
          Con: {
            SettleUp_Company_Id: '',
            MINGCHENG: ''
          },
          Service_Type: '',
          Begin_Date: new Date(),
          End_Date: new Date()
        },
        repulseDialog: {
          dialogFormVisible: false,
          form: {
            retReason: '' // 退回原因
          }
        }
      }
    },
    computed: {
      acountText () {
        return this.diecType === '20' ? '应付金额' : '应收金额'
      }
    },
    methods: {
      deleteCon () {
        this.filterCondition.Con.MINGCHENG = ''
        this.filterCondition.Con.SettleUp_Company_Id = '%'
      },
      // 翻页
      onPage () {
        this.getData()
      },
      goItem ($index, row) {
        this.$router.push({
          name: 'balanceItemList',
          params: {
            Operator_Id: row.Operator_Id,
            SettleUp_Company_Id: row.SettleUp_Company_Id,
            Con_Name: row.Con_Name,
            Service_Type: row.Service_Type,
            Mon: row.Mon,
            Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
            End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
            Payment_Type: this.$route.params.diecType
          }
        })
      },
      // 打回
      repulseData () {
        if (this.selectTableData.length > 0) {
          // 弹出退回理由弹框
          this.repulseDialog.dialogFormVisible = true
          this.repulseDialog.form.retReason = ''
        } else {
          this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
        }
      },
      // 确认打回
      confirmRepulse () {
        this.$refs.retReason.validate((flag) => {
          if (flag) {
            this.repulseDialog.dialogFormVisible = false
            this.submitData(false)
          }
        })
      },
      // 提交操作
      submitData (flag) {
        // flag为true 审核通过   为false 打回
        let OperatorType = flag ? 'submit' : 'cancel'
        let param = {
          Operator: Api.userInfo.USERID,
          list_params: ''
        }
        let tempList = []
        this.selectTableData.forEach(item => {
          let postData = {
            Operator_Id: '',
            SettleUp_Company_Id: '',
            Payment_Type: this.$route.params.diecType,
            Service_Type: '',
            Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
            End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
            Operate_State: '1',
            Payment_Record_Id: '%',
            Operator_Type: OperatorType,
            Payment_Operate_State: '2'
          }
          postData.Operator_Id = item.Operator_Id
          postData.SettleUp_Company_Id = item.SettleUp_Company_Id
          postData.Service_Type = item.Service_Type
          postData.Mon = item.Mon
          if (!flag) postData.Ret_Reason = this.repulseDialog.form.retReason
          tempList.push(postData)
        })
        param.list_params = JSON.stringify(tempList)
        this.loadingWait = this.showLoading('请稍候...')
        Api.post('FeeRecordsSubmit', param).then(res => {
          this.loadingWait.close()
          if (res.Flag === true) {
            this.$alert('执行成功！', '友情提示', {
              confirmButtonText: '确定'
            }).then(() => {
              this.getData()
            })
          }
        })
      },
      //提交
      confirmData () {
        if (this.selectTableData.length > 0) {
          let param = {
            Operator: Api.userInfo.USERID,
            list_params: ''
          }
          let tempList = []
          this.selectTableData.forEach(item => {
            let postData = {
              Operator_Id: '',
              SettleUp_Company_Id: '',
              Payment_Type: this.$route.params.diecType,
              Service_Type: '',
              Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
              End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
              Operate_State: '1',
              Payment_Record_Id: '%',
              Operator_Type: 'submit',
              Payment_Operate_State: '2'
            }
            postData.Operator_Id = item.Operator_Id
            postData.SettleUp_Company_Id = item.SettleUp_Company_Id
            postData.Service_Type = item.Service_Type
            postData.Mon = item.Mon
            tempList.push(postData)
          })
          param.list_params = JSON.stringify(tempList)
          this.loadingWait = this.showLoading('请稍候...')
          Api.post('FeeRecordsSubmit', param).then(res => {
            this.loadingWait.close()
            if (res.Flag === true) {
              this.$alert('执行成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                this.getData()
              })
            }
          })
        } else {
          this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
        }
      },
      //获取表格数据
      getData () {
        let params = {
          SettleUp_Company_Id: this.filterCondition.Con.SettleUp_Company_Id ? this.filterCondition.Con.SettleUp_Company_Id : '%',
          Service_Type: this.filterCondition.Service_Type ? this.filterCondition.Service_Type : '%',
          Payment_Type: this.$route.params.diecType,
          Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
          End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
          Operate_State: '1',
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpGetBalanceHzSh', params)
          .then((res) => {
            this.loadingWait.close()
            this.origData = res.MsgInfo
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
          })
      },
      //初始化
      init () {
        this.diecType = this.$route.params.diecType
        let nowDate = new Date()
        this.filterCondition.Begin_Date = new Date(nowDate.setDate(nowDate.getDate() - 30))
        this.filterCondition.End_Date = new Date()
      },
      //显示对账弹出框
      showDialog () {
        this.$refs.settleUpCompany.pihaoDialog = true
      },
      //查询流水
      searchData () {
        this.getData()
      },
      //对账单位弹出框选择
      selectCon (row) {
        this.filterCondition.Con.MINGCHENG = row.MINGCHENG
        this.filterCondition.Con.SettleUp_Company_Id = row.SettleUp_Company_Id
      },
      //选择表格的多条记录
      selectData (val) {
        let that = this
        that.tolMoney = 0
        this.selectTableData = val
        this.selectTableData.forEach(item => {
          that.tolMoney = floatAdd(item.Total_Amount, that.tolMoney)
        })
      },
      // 合并
      mergeBill () {},
      // 打印对账单
      printBill () {}
    },
    mounted () { //<keep-alive> 内切换时会被执行created内不行
      this.init()
    },
    activated () {
      this.getData()
    },
    // 切换应付应收tab时(从应收二级页面切换到应付一级页面)
    watch: {
      $route (val, oldVal) {
        if (val.params.diecType !== oldVal.params.diecType) {
          Object.assign(this.$data, this.$options.data())
          this.init()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .main-list {
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
    .table-box {
      margin-top: 20px;
    }
  }

  .order-sum-select {
    .el-select-dropdown__item {
      font-size: 12px;
      padding: 0 10px;
      height: 24px;
      line-height: 24px;
    }
  }
</style>
