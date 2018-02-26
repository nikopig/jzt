<template>
    <div class="common-tab-wraper common-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="时效列表" name="first">
                // 列表起
                  <div class="main-list">
                    <div class="toolbar" v-if="true">
                      <div class="btn-box">
                        <el-button type="text" icon="el-icon-mo-beifen" @click="addData">新增</el-button>
                        <el-button type="text" icon="el-icon-check" @click="deleteData">删除</el-button>
                        <el-button type="text" icon="el-icon-mo-print" @click="refreshData">刷新</el-button>
                      </div>
                    </div>
                    <div class="common-condition-box">
                      <el-form :inline="true">
                          <common-row>
                                <el-form-item  label="时效类型">
                                  <common-select field="TimeLimit_Type" v-model="filterCondition.TimeLimit_Type"></common-select>
                                </el-form-item>
                                <el-form-item>
                                  <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                                </el-form-item>
                          </common-row>
                      </el-form>
                    </div>
                    <div class="table-box">
                      <el-table :data="origData" ref="origData" @selection-change="selectData">
                      <el-table-column type="index" :index="indexMethod"></el-table-column>
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="Contract_No" label="合同编号"></el-table-column>
                        <el-table-column prop="Con_Name" label="委托方"></el-table-column>
                        <el-table-column prop="startProvince" label="起点省份"></el-table-column>
                        <el-table-column prop="startCity" label="起点城市"></el-table-column>
                        <el-table-column prop="receiveProvince" label="收货省份"></el-table-column>
                        <el-table-column prop="receiveCity" label="收货城市"></el-table-column>
                        <el-table-column prop="commitArriveTime" label="承诺到达时间"></el-table-column>
                        <el-table-column prop="TimeLimit_Type" label="时效类型"></el-table-column>
                        <el-table-column prop="refreginType" label="温层"></el-table-column>
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
                // 列表止
            </el-tab-pane>
            <el-tab-pane label="时效详情" name="second">
                // 详情起
                  <div class="main-list">
                    <div class="toolbar" v-if="true">
                      <div class="btn-box">
                        <el-button type="text" icon="el-icon-mo-beifen" @click="addData">新增</el-button>
                      </div>
                    </div>
                    <div>
                        <el-form :inline="true" :model="formSearchData">
                          <el-form-item label="运营方">
                            <el-input v-model="formSearchData.Operator_Name" placeholder="双击选择"
                                      suffix-icon="el-icon-close"
                                      @click="deleteSelect('Operator_Id')"
                                      @dblclick.native="openDialog('Operator_Id')"
                                      :disabled="true"></el-input>
                          </el-form-item>
                          <el-form-item label="结算单位">
                            <el-input v-model="formSearchData.Ssa_Name" placeholder="双击选择"
                                      suffix-icon="el-icon-close"
                                      @click="deleteSelect('SettleUp_Company_Id')"
                                      @dblclick.native="openDialog('SettleUp_Company_Id')" :disabled="true"></el-input>
                          </el-form-item>
                          <el-form-item label="开始日期">
                            <el-date-picker
                              v-model="formSearchData.Begin_Date"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker>
                          </el-form-item>
                          <el-form-item label="结束日期">
                            <el-date-picker
                              v-model="formSearchData.End_Date"
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker>
                          </el-form-item>
                          <el-form-item label="费用类型">
                            <select-service-type @change="changeServiceType"
                                                 v-model="formSearchData.Service_Type"></select-service-type>
                          </el-form-item>
                          <el-form-item label="单据状态" v-if="isHandle!=='otherHandle'">
                            <el-select v-model="formSearchData.Payment_Operate_State" placeholder="请选择" @change="changePayment">
                              <el-option
                                v-for="item in Payment_Operate_State.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-form>
                    </div>
                  </div>
                // 详情止
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import commonDialog from '@/common/components/common-dialog'
  import balanceModal from '@/common/service/modal/balance-modal'
  import commonSelect from '@/common/service/select/select-service-type'

  export default {
    name: 'transTimeLimit',
    props: {
      type: {
        default: 0
      }
    },
    components: {
      commonDialog,
      balanceModal,
      commonSelect
    },
    data () {
      return {
        isVisible: false, // 对账单位弹窗是否显示
        diecType: '10', // 收支类型(10:应收  20:应付)
        origData: [],
        activeName: 'first',
        selectTableData: [],
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
        },
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        tolMoney: 0.0
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
      deleteCon () {
        this.filterCondition.Con.MINGCHENG = ''
        this.filterCondition.Con.SettleUp_Company_Id = '%'
      },
      goItem ($index, row) {
        this.$router.push({
          name: 'cariItemList',
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
      //获取表格数据
      getData () {
        this.loadingWait = this.showLoading('请稍候...')
        let params = {
          SettleUp_Company_Id: this.filterCondition.Con.SettleUp_Company_Id ? this.filterCondition.Con.SettleUp_Company_Id : '%',
          Service_Type: this.filterCondition.Service_Type ? this.filterCondition.Service_Type : '%',
          Payment_Type: this.$route.params.diecType,
          Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
          End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
          Operate_State: this.$route.params.isAudit,
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        Api.get('JlpGetBalanceHzSh2', params)
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
        this.tolMoney = 0
        this.selectTableData = val
        this.selectTableData.forEach(item => {
          this.tolMoney = floatAdd(item.Total_Amount, this.tolMoney)
        })
      },
      // 提交操作
      submitData (flag) {
        // flag为true 审核通过   为false 打回
        this.loadingWait = this.showLoading('请稍候...')
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
            Payment_Operate_State: '3'
          }
          postData.Operator_Id = item.Operator_Id
          postData.SettleUp_Company_Id = item.SettleUp_Company_Id
          postData.Service_Type = item.Service_Type
          postData.Mon = item.Mon
          if (!flag) {
            postData.Ret_Reason = this.repulseDialog.form.retReason
          }
          tempList.push(postData)
        })
        param.list_params = JSON.stringify(tempList)
        Api.post('FeeRecordsSubmit', param).then(res => {
          this.loadingWait.close()
          if (res.Flag === true) {
            this.$alert('执行成功！', '友情提示', {
              confirmButtonText: '确定'
            }).then(() => {
              this.repulseDialog.form.retReason = ''
              this.getData()
            })
          }
        })
      }
    },
    activated () {
      this.getData()
    },
    mounted () {
      this.init()
    },
    // 切换应付应收tab时(从应收二级页面切换到应付一级页面)
    watch: {
      $route (val, oldVal) {
        if (val.params.isAudit !== oldVal.params.isAudit) {
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