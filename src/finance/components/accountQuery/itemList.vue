<template>
    <div>
      <div class="headbar">
        <div class="common-row">
          <label>当前位置：</label>
          <div class="common-col">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item @click.native="goBack(-1)">费用汇总</el-breadcrumb-item>
              <el-breadcrumb-item>费用项目</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
      </div>
      <div class="common-condition-box">
        <el-form :inline="true">
          <el-form-item label="费用项目">
            <select-service-item :ServiceType="Service_Type" v-model="serviceItem" @change="selectVal"></select-service-item>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box">
        <el-table :data="origData">
          <el-table-column prop="Service_Item_Desc" label="费用项目" width=120></el-table-column>
          <el-table-column prop="Settle_Danw" label="对账单位" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Charging_Rule" label="计费方式"></el-table-column>
          <el-table-column prop="Mon" label="月份"></el-table-column>
          <el-table-column prop="Real_Amount" label="总金额"></el-table-column>
          <el-table-column prop="SettleUp_Amount" label="对账金额"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="primary"
                type="text"
                size="small"
                @click="goDetail(scope.$index, scope.row)">查看明细
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
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import selectServiceItem from '@/common/service/select/select-service-item'
    export default {
        name: 'queryItemList',
        props: [],
        components: {selectServiceItem},
        data () {
            return {
              Service_Type: '', // 费用类型
              serviceItem: '', // 费用项目
              currentPage: 1,
              params: {}, // 参数
              page: {
                total: 0,
                StartIndex: 0,    // 起始页，从0开始
                PageSize: 10,
                isShow: false  // 总条数少于10，不显示分页项
              },
              condition: {
                orderId: ''    // 订单号
              },
              origData: []
            }
        },
        computed: {},
        methods: {
          handleCurrentChange () {    // 分页
            this.page.StartIndex = (this.currentPage - 1) * this.page.PageSize
            this.getData()
          },
          selectVal () { // 筛选
            console.log(this.serviceItem)
            this.getData()
          },
          goBack (num) {
            this.$router.go(num)
          },
          goDetail (index, row) { // 向三级页面传递参数
            let path = {
              name: 'queryDetailList',
              params: {
                Begin_Date: this.params.Begin_Date,
                End_Date: this.params.End_Date,
                Mon: row.Mon,
                Query_State: this.params.Query_State,
                Danw_Id: this.params.Danw_Id,
                Service_Type: this.params.Service_Type,
                Service_Item: row.Service_Item
              }
            }
            this.$router.push(path)
          },
          getData () {
            this.page.isShow = false
            let param = {
              list_params: {}
            }
            param.list_params.Begin_Date = this.params.Begin_Date
            param.list_params.End_Date = this.params.End_Date
            param.list_params.Mon = this.params.Mon
            param.list_params.Query_State = this.params.Query_State
            param.list_params.Danw_Id = this.params.Danw_Id
            param.list_params.Payment_Type = this.params.diecType
            param.list_params.Service_Type = this.params.Service_Type
            param.list_params.Service_Item = this.serviceItem ? this.serviceItem : '%'
            param.list_params.StartIndex = this.page.StartIndex
            param.list_params.PageSize = this.page.PageSize
            this.condition.orderId = this.params.Bill_Hdr_Id     // 接收订单号
            param.list_params = JSON.stringify(param.list_params)
            Api.post('JlpFeeRecQueryHz', param).then(res => {
              this.origData = JSON.parse(res.MsgInfo)
              this.page.total = this.origData.length ? this.origData[0].Sum_Cnt : 0
              if (this.page.total > this.page.PageSize) {
                this.page.isShow = true
              }
            })
          },
          init () {
            this.params = this.$route.params
            this.Service_Type = this.params.Service_Type
            this.serviceItem = ''
            this.getData()
          }
        },
        activated () {
          this.init()
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
.block {
    margin: 60px 0 30px;
    text-align: center;
  }
</style>
