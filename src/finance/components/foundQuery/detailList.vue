<template>
    <div>
      <div class="toolbar">
        <div class="btn-box">
          <el-button type="text" icon="mo-download" @click="exportExcel">导出excel</el-button>
        </div>
      </div>
      <div class="headbar">
        <div class="common-row">
          <label>当前位置：</label>
          <div class="common-col">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item @click.native="goBack(-1)">{{crumbLabel}}汇总</el-breadcrumb-item>
              <el-breadcrumb-item>{{crumbLabel}}明细</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      <div class="table-box">
        <el-table :data="origData">
          <el-table-column prop="Operator_Name" label="运营商" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Mon" label="月份"></el-table-column>
          <el-table-column prop="Sys_Name" label="对账单位" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Service_Item_Desc" label="费用项目"></el-table-column>
          <el-table-column prop="Reconciliation_Amount" :label="accountLabel"></el-table-column>
          <el-table-column prop="Invoice_Amount_Wcl" label="未开票金额" v-if="params.flag === 0 || params.flag === 4"></el-table-column>
          <el-table-column prop="Invoice_Amount_Ycl" label="已开票金额" v-if="params.flag === 1 || params.flag === 4"></el-table-column>
          <el-table-column prop="SettleUp_Amount_Wcl" label="未回款金额" v-if="params.flag === 2 || params.flag === 4"></el-table-column>
          <el-table-column prop="SettleUp_Amount_Ycl" label="已回款金额" v-if="params.flag === 3 || params.flag === 4"></el-table-column>
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
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { formatJson } from '@/common/js/utils'
    import {json2excel} from '@/common/js/excel.js'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    export default {
        name: 'queryDetailList',
        props: [],
        components: {commonRow, commonCol},
        data () {
            return {
              currentPage: 1,
              params: {},
              page: {
                StartIndex: 0,
                PageSize: 10,
                total: 0,
                isShow: false  // 总条数少于10，不显示分页项
              },
              origData: []
            }
        },
        computed: {
          accountLabel () {
            return this.$route.params.diecType === '20' ? '应付账款' : '应收账款'
          },
          tableOptions () {
            let options = {}
            let flag = this.params.flag
            switch (flag) {
              case 0:
                options.titles = ['运营商', '月份', '对账单位', '费用项目', this.accountLabel, '未开票金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Item_Desc', 'Reconciliation_Amount', 'Invoice_Amount_Wcl']
                break
              case 1:
                options.titles = ['运营商', '月份', '对账单位', '费用项目', this.accountLabel, '已开票金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Item_Desc', 'Reconciliation_Amount', 'Invoice_Amount_Ycl']
                break
              case 2:
                options.titles = ['运营商', '月份', '对账单位', '费用项目', this.accountLabel, '未回款金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Item_Desc', 'Reconciliation_Amount', 'SettleUp_Amount_Wcl']
                break
              case 3:
                options.titles = ['运营商', '月份', '对账单位', '费用项目', this.accountLabel, '已回款金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Item_Desc', 'Reconciliation_Amount', 'SettleUp_Amount_Ycl']
                break
              default:
                options.titles = ['运营商', '月份', '对账单位', '费用项目', this.accountLabel, '未开票金额', '已开票金额', '未回款金额', '已回款金额']
                options.fields = ['Operator_Name', 'Mon', 'Sys_Name', 'Service_Item_Desc', 'Reconciliation_Amount', 'Invoice_Amount_Wcl', 'Invoice_Amount_Ycl', 'SettleUp_Amount_Wcl', 'SettleUp_Amount_Ycl']
                break
            }
            return options
          },
          crumbLabel () {
            if (this.params.Payment_Type === '10') {
              return '应收账款'
            }
            if (this.params.Payment_Type === '11') {
              return '其他应收'
            }
            if (this.params.Payment_Type === '20') {
              return '应付账款'
            }
            if (this.params.Payment_Type === '21') {
              return '其他应付'
            }
          },
          iterface () {
            let flag = this.params.flag
            if (flag === 0) return 'BalQ_JlpFeeQueryWkpMx'
            if (flag === 1) return 'BalQ_JlpFeeQueryYkpMx'
            if (flag === 2) return 'BalQ_JlpFeeQueryWjsMx'
            if (flag === 3) return 'BalQ_JlpFeeQueryYjsMx'
            return 'BalQ_JlpFeeQueryAllMx'
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
          handleCurrentChange () {  // 分页
            this.page.StartIndex = (this.currentPage - 1) * this.page.PageSize
            this.getData()
          },
          getData () {
            this.page.isShow = false
            let param = {}
            param.Begin_Date = this.params.Begin_Date
            param.End_Date = this.params.End_Date
            param.Mon = this.params.Mon
            param.Operator_Id = this.params.Operator_Id
            param.SettleUp_Company_Id = this.params.SettleUp_Company_Id
            param.Payment_Type = this.params.Payment_Type
            param.Service_Type = this.params.Service_Type
            param.StartIndex = this.page.StartIndex
            param.PageSize = this.page.PageSize
            this.loadingWait = this.showLoading('正在加载...')
            Api.get(this.iterface, param).then(res => {
              this.loadingWait.close()
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
          init () {
            this.getData()
          }
        },
        activated () {
          this.params = JSON.parse(this.$route.params.arg)
          this.init()
        },
        mounted () {
        }
    }
</script>
<style lang="less">
  .foundQuery {
    .headbar {
      margin-top: 15px;
    }
    .block {
      margin: 60px 0 30px;
      text-align: center;
    }
  }

</style>
