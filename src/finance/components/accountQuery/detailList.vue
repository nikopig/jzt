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
      <div class="common-condition-box">
        <el-form :inline="true" size="small" label-width="72px">
            <common-row>
              <common-col>
                <el-form-item label="委托方单号">
                  <el-input v-model="ConOrder_No"></el-input>
                </el-form-item>
              </common-col>
              <common-col>
                <el-form-item label="单位名称">
                  <el-input v-model="Danw_Name"></el-input>
                </el-form-item>
              </common-col>
              <common-col>
                <el-form-item label="订单号">
                  <el-input v-model="Bill_Hdr_Id"></el-input>
                </el-form-item>
              </common-col>
              <!-- <common-col>
                <el-form-item>
                  <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
                </el-form-item>
              </common-col> -->
          </common-row>
        </el-form>
      </div>
      <div class="table-box">
        <el-table :data="origData">
          <el-table-column prop="Created_Time" label="日期" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Biz_Bill_No" label="订单号" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="TransportPlan_Type" label="运输类型" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="Kilometers" label="公里数"></el-table-column>
          <el-table-column prop="Planned_Volume" label="总体积"></el-table-column>
          <el-table-column prop="Planned_Weight" label="总重量"></el-table-column>
          <el-table-column prop="Real_Amount" label="对账金额"></el-table-column>
          <el-table-column prop="Add_Amount" label="追加金额"></el-table-column>
          <el-table-column prop="Order_Status" label="订单状态"></el-table-column>
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
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    export default {
        name: 'queryDetailList',
        props: [],
        components: {commonRow, commonCol},
        data () {
            return {
              currentPage: 1,
              params: {},   // 接收传递的参数
              diecType: '10',
              page: {
                StartIndex: 0,
                PageSize: 10,
                total: 0,
                isShow: false  // 总条数少于10，不显示分页项
              },
              ConOrder_No: '', // 委托方单号
              Danw_Name: '', // 单位名称
              Bill_Hdr_Id: '',  // 订单号
              origData: []
            }
        },
        computed: {},
        methods: {
          /*searchData () {   // 查询
            this.getData()
          },*/
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
            param.Query_State = this.params.Query_State
            param.Danw_Id = this.params.Danw_Id
            param.Payment_Type = this.params.diecType
            param.Service_Type = this.params.Service_Type
            param.Service_Item = this.params.Service_Item
            param.ConOrder_No = this.ConOrder_No ? '%' + this.ConOrder_No + '%' : '%'
            param.Bill_Hdr_Id = this.Bill_Hdr_Id ? '%' + this.Bill_Hdr_Id + '%' : '%'
            param.Danw_Name = this.Danw_Name ? '%' + this.Danw_Name + '%' : '%'
            param.StartIndex = this.page.StartIndex
            param.PageSize = this.page.PageSize
            Api.get('JlpFeeQueryRecBillMx', param).then(res => {
              this.origData = res.MsgInfo
              this.page.total = this.origData.length ? this.origData[0].Sum_Cnt : 0
              if (this.page.total > this.page.PageSize) {
                this.page.isShow = true
              }
            })
          },
          init () {
            this.params = this.$route.params
            this.getData()
          }
        },
        watch: {
          ConOrder_No () {
            this.getData()
          },
          Bill_Hdr_Id () {
            this.getData()
          },
          Danw_Name () {
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
