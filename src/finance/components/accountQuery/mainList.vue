<template>
    <div>
      <div class="common-condition-box">
        <el-form :inline="true" size="small" label-width="72px">
          <el-form-item label="费用状态">
            <select-dictionary type="radio" field="Fee_State" v-model="condition.choice" @change="stateChoose"></select-dictionary>
          </el-form-item>
          <div>
            <el-form-item label="起始日期">
              <el-date-picker v-model="condition.startDate" @change="startDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker v-model="condition.endDate" @change="endDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="对账单位">
              <el-input
                class="noselect"
                v-model="condition.SettleUp_Company_Name"
                icon="el-icon-close"
                :disabled="true"
                @dblclick.native="isVisible = true"
                placeholder="双击选择对账单位"
                :on-icon-click="clearBalance"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="费用类型">
              <select-service-type v-model="condition.selectType"></select-service-type>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="table-box">
        <el-table :data="origData">
          <el-table-column prop="Operator_Name" label="运营商" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Mon" label="月份"></el-table-column>
          <el-table-column prop="Settle_Danw" label="对账单位" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Service_Type_Desc" label="费用类型"></el-table-column>
          <el-table-column prop="Real_Amount" label="总金额"></el-table-column>
          <el-table-column prop="Fee_State_Desc" label="费用状态"></el-table-column>
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
          v-show="page.isShow"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
      <balance-modal :visible.sync="isVisible" :type="$route.params.diecType" @change="selectBalance"></balance-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt } from '@/common/js/utils'
    import balanceModal from '@/common/service/modal/balance-modal'
    import selectDictionary from '@/common/service/select/select-dictionary'
    import selectServiceType from '@/common/service/select/select-service-type'
    export default {
        name: 'queryMainList',
        props: [],
        components: {balanceModal, selectDictionary, selectServiceType},
        data () {
            return {
              currentPage: 1,
              isVisible: false, // 对账单位弹框是否显示
              page: {
                total: 0,  // 总条目数
                StartIndex: 0,
                PageSize: 10,
                isShow: false  // 总条数少于10，不显示分页项
              },
              condition: {
                choice: '1', // 订单状态选择
                SettleUp_Company_Id: '', // 选择的对账单位id
                SettleUp_Company_Name: '', // 选择的对账单位名称
                selectType: '', // 选择费用类型
                startDate: '', // 开始日期
                endDate: ''   // 结束日期
              }, // 过滤条件
              origData: []
            }
        },
        computed: {},
        methods: {
          stateChoose (lable) {   // 费用状态改变
            this.condition.choice = lable
          },
          startDate (val) {   // 开始日期改变
            console.log(new Date(val))
            this.condition.startDate = new Date(val)
          },
          endDate (val) {   // 结束日期改变
            this.condition.endDate = new Date(val)
          },
          // 选择对账单位
          selectBalance (row) {
            console.log(row)
            this.condition.SettleUp_Company_Name = row.MINGCHENG
            this.condition.SettleUp_Company_Id = row.SettleUp_Company_Id
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
          goItem (index, row) {   // 向二级传递参数
            console.log(row.Service_Type)
            this.$router.push({
              name: 'queyItemList',
              params: {
                Begin_Date: DateFtt('yyyy-MM-dd', this.condition.startDate),
                End_Date: DateFtt('yyyy-MM-dd', this.condition.endDate, true),
                Mon: row.Mon,
                Query_State: row.Fee_State,
                Danw_Id: row.SettleUp_Company_Id,
                Service_Type: row.Service_Type
              }
            })
          },
          getData () {
            this.page.isShow = false
            let param = {
              list_params: {}
            }
            let postData = {}
            postData.Begin_Date = DateFtt('yyyy-MM-dd', this.condition.startDate)
            postData.End_Date = DateFtt('yyyy-MM-dd', this.condition.endDate, true)
            postData.Query_State = this.condition.choice
            postData.Danw_Id = this.condition.SettleUp_Company_Id ? this.condition.SettleUp_Company_Id : '%'
            postData.Service_Type = this.condition.selectType ? this.condition.selectType : '%'
            postData.Payment_Type = this.$route.params.diecType
            postData.StartIndex = this.page.StartIndex
            postData.PageSize = this.page.PageSize
            postData.Operator = Api.userInfo.Staff_Id
            param.list_params = postData
            param.list_params = JSON.stringify(param.list_params)
            Api.post('JlpFeeRecQueryHz', param).then(res => {
              this.origData = JSON.parse(res.MsgInfo)
              this.page.total = this.origData.length ? this.origData[0].Sum_Cnt : 0
              if (this.page.total > this.page.PageSize) {
                this.page.isShow = true
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
        },
        activated () {
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
