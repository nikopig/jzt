<template>
    <div>
      <div class="toolbar">
        <div class="btn-box">
          <a id="export-btn">
            <el-button type="text" icon="mo-download" @click="exportExcel">导出excel</el-button>
          </a>
        </div>
      </div>
      <div class="common-condition-box">
        <el-form :inline="true" size="small" label-width="72px">
          <el-form-item label="查询类型">
            <el-select v-model="condition.type" @change="getData">
              <el-option v-for="(item, index) in queryType" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用状态">
            <el-select v-model="condition.choice" @change="getData">
              <el-option v-for="(item, index) in feeStates" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起始日期">
            <el-date-picker v-model="condition.startDate" @change="startDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker v-model="condition.endDate" @change="endDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="运营商">
            <el-input
              class="noselect"
              v-model="condition.Operator_Name"
              icon="close"
              :disabled="true"
              @dblclick.native="operVisible = true"
              placeholder="双击选择运营商"
              :on-icon-click="clearOper"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="对账单位">
            <el-input
              class="noselect"
              v-model="condition.SettleUp_Company_Name"
              icon="close"
              :disabled="true"
              @dblclick.native="isVisible = true"
              placeholder="双击选择对账单位"
              :on-icon-click="clearBalance"
            >
            </el-input>
          </el-form-item>
          <!--<el-form-item label="费用类型">-->
            <!--<select-service-type v-model="condition.selectType" @change="getData"></select-service-type>-->
          <!--</el-form-item>-->
          <el-form-item>
            <el-button size="small" type="primary" icon="search" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box">
        <el-table :data="origData" ref="excelTable">
          <el-table-column prop="Operator_Name" label="运营商" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Mon" label="月份"></el-table-column>
          <el-table-column prop="Sys_Name" label="对账单位" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Service_Type_Desc" label="费用类型"></el-table-column>
          <el-table-column prop="Reconciliation_Amount" :label="accountLabel"></el-table-column>
          <el-table-column prop="Invoice_Amount_Wcl" label="未开票金额" v-if="flag === 0 || flag === 4"></el-table-column>
          <el-table-column prop="Invoice_Amount_Ycl" label="已开票金额" v-if="flag === 1 || flag === 4"></el-table-column>
          <el-table-column prop="SettleUp_Amount_Wcl" label="未回款金额" v-if="flag === 2 || flag === 4"></el-table-column>
          <el-table-column prop="SettleUp_Amount_Ycl" label="已回款金额" v-if="flag === 3 || flag === 4"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="primary"
                type="text"
                size="small"
                @click="goDetail(scope.row)">查看明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          v-show="page.isShow"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
      <operator-modal :visible.sync="operVisible" @change="selectOperator"></operator-modal>
      <balance-modal :visible.sync="isVisible" :type="$route.params.diecType" @change="selectBalance"></balance-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt, formatJson } from '@/common/js/utils'
    import {json2excel} from '@/common/js/excel.js'
    import operatorModal from '@/common/service/modal/operator-modal'
    import balanceModal from '@/common/service/modal/balance-modal'
    import selectDictionary from '@/common/service/select/select-dictionary'
    import selectServiceType from '@/common/service/select/select-service-type'
    export default {
        name: 'queryMainList',
        props: [],
        components: {operatorModal, balanceModal, selectDictionary, selectServiceType},
        data () {
            return {
              currentPage: 1,
              flag: 0,
              operVisible: false, // 运营商弹窗是否显示
              isVisible: false, // 对账单位弹框是否显示
              feeStates: [
                {
                  label: '未开票',
                  value: 0
                },
                {
                  label: '已开票',
                  value: 1
                },
                {
                  label: '未回款',
                  value: 2
                },
                {
                  label: '已回款',
                  value: 3
                },
                {
                  label: '全部',
                  value: 4
                }
              ], // 费用状态
              page: {
                total: 0,  // 总条目数
                StartIndex: 0,
                PageSize: 10,
                isShow: false  // 总条数少于10，不显示分页项
              },
              condition: {
                type: 0, // 查询类型 0 应收应付 1 其他应收应付
                choice: 0, // 费用状态选择
                Operator_Name: '',  // 选择的运营商名称
                Operator_Id: '',  // 选择的运营商id
                SettleUp_Company_Id: '', // 选择的对账单位id
                SettleUp_Company_Name: '', // 选择的对账单位名称
                selectType: '', // 选择费用类型
                startDate: '', // 开始日期
                endDate: ''   // 结束日期
              }, // 过滤条件
              origData: []
            }
        },
        computed: {
          iterface () {
            let flag = this.condition.choice
            if (flag === 0) return 'BalQ_JlpFeeQueryWkpHz'
            if (flag === 1) return 'BalQ_JlpFeeQueryYkpHz'
            if (flag === 2) return 'BalQ_JlpFeeQueryWjsHz'
            if (flag === 3) return 'BalQ_JlpFeeQueryYjsHz'
            return 'BalQ_JlpFeeQueryAllHz'
          },
          tableOptions () {
            let options = {}
            let flag = this.condition.choice
            switch (flag) {
              case 0:
                options.titles = ['运营商', '月份', '对账单位', '费用类型', this.accountLabel, '未开票金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Type_Desc', 'Reconciliation_Amount', 'Invoice_Amount_Wcl']
                break
              case 1:
                options.titles = ['运营商', '月份', '对账单位', '费用类型', this.accountLabel, '已开票金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Type_Desc', 'Reconciliation_Amount', 'Invoice_Amount_Ycl']
                break
              case 2:
                options.titles = ['运营商', '月份', '对账单位', '费用类型', this.accountLabel, '未回款金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Type_Desc', 'Reconciliation_Amount', 'SettleUp_Amount_Wcl']
                break
              case 3:
                options.titles = ['运营商', '月份', '对账单位', '费用类型', this.accountLabel, '已回款金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Type_Desc', 'Reconciliation_Amount', 'SettleUp_Amount_Ycl']
                break
              default:
                options.titles = ['运营商', '月份', '对账单位', '费用类型', this.accountLabel, '未开票金额', '已开票金额', '未回款金额', '已回款金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Type_Desc', 'Reconciliation_Amount', 'Invoice_Amount_Wcl', 'Invoice_Amount_Ycl', 'SettleUp_Amount_Wcl', 'SettleUp_Amount_Ycl']
                break
            }
            return options
          },
          accountLabel () {
            return this.$route.params.diecType === '20' ? '应付账款' : '应收账款'
          },
          queryType () {
            return [
              {
                label: this.$route.params.diecType === '10' ? '应收账款' : '应付账款',
                value: 0
              },
              {
                label: this.$route.params.diecType === '10' ? '其他应收' : '其他应付',
                value: 1
              }
            ]
          },
          PaymentType () {
            if (this.$route.params.diecType === '10') {
              return this.condition.type === 0 ? '10' : '11'
            } else {
              return this.condition.type === 0 ? '20' : '21'
            }
          }
        },
        methods: {
          // 导出excel表格
          exportExcel () {
            if (this.origData.length === 0) {
              this.$alert('当前无数据，无法导出')
              return false
            }
            let jsonData = formatJson(this.origData, this.tableOptions.fields)
            json2excel(this.tableOptions.titles, jsonData)
          },
          stateChoose (lable) {   // 费用状态改变
            this.condition.choice = lable
          },
          startDate (val) {   // 开始日期改变
            this.condition.startDate = new Date(val)
          },
          endDate (val) {   // 结束日期改变
            this.condition.endDate = new Date(val)
          },
//          选择营业商
          selectOperator (row) {
            this.condition.Operator_Name = row.Operator_Name
            this.condition.Operator_Id = row.Operator_Id
          },
          // 选择对账单位
          selectBalance (row) {
            this.condition.SettleUp_Company_Name = row.MINGCHENG
            this.condition.SettleUp_Company_Id = row.SettleUp_Company_Id
          },
          // 清除运营商
          clearOper () {
            this.condition.Operator_Name = ''
            this.condition.Operator_Id = '%'
          },
          // 清除对账单位
          clearBalance () {
            this.condition.SettleUp_Company_Name = ''
            this.condition.SettleUp_Company_Id = '%'
          },
          // 查询数据
          searchData () {
            if (!(this.condition.startDate && this.condition.endDate)) {
              this.$alert('请填写相应的起止日期', '提示称', {
                  confirmButtonText: '确定',
                  callback: action => {}
                })
              return
            }
            this.getData()
          },
          handleCurrentChange () {  // 分页
            this.page.StartIndex = (this.currentPage - 1) * this.page.PageSize
            this.getData()
          },
          goDetail (row) {   // 向二级传递参数
            this.$router.push({
              name: 'foundDetailList',
              params: {
                arg: JSON.stringify({
                  flag: this.flag,
                  Operator_Id: row.Operator_Id,
                  Begin_Date: DateFtt('yyyy-MM-dd', this.condition.startDate),
                  End_Date: DateFtt('yyyy-MM-dd', this.condition.endDate, true),
                  SettleUp_Company_Id: row.SettleUp_Company_Id,
                  Payment_Type: this.PaymentType,
                  Mon: row.Mon,
                  Service_Type: row.Service_Type
                })
              }
            })
          },
          getData () {
            this.page.isShow = false
            let params = {}
            params.Operator_Id = this.condition.Operator_Id ? this.condition.Operator_Id : '%'
            params.Begin_Date = DateFtt('yyyy-MM-dd', this.condition.startDate)
            params.End_Date = DateFtt('yyyy-MM-dd', this.condition.endDate, true)
            params.SettleUp_Company_Id = this.condition.SettleUp_Company_Id ? this.condition.SettleUp_Company_Id : '%'
            params.Payment_Type = this.PaymentType
            params.StartIndex = this.page.StartIndex
            params.PageSize = this.page.PageSize
            this.loadingWait = this.showLoading('正在加载...')
            Api.get(this.iterface, params).then(res => {
              this.loadingWait.close()
              this.flag = this.condition.choice
              if (res.Flag) {
                this.origData = Object.freeze(res.MsgInfo)
                this.page.total = this.origData.length ? this.origData[0].Sum_Cnt : 0
                if (this.page.total > this.page.PageSize) {
                  this.page.isShow = true
                }
              } else {
                this.messageInfo(res.ErrInfo)
              }
            })
          },
          init () {      // 设置起止时间默认值
            this.condition.endDate = new Date()
            this.condition.startDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        },
        created () {
          this.init()
        },
        mounted () {
          this.getData()
        }
    }
</script>
<style lang="less" scoped>
  .table-box {
    margin-top: 20px;
  }
  .block {
    margin: 60px 0 30px;
    text-align: center;
  }
</style>
