<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-3)">首页</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="go(-2)">承运商运单包查询</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="go(-1)">委托单详情</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="btn-box">委托方订单号：{{ orderSumm.ConOrder_No }}</div>
      <div class="btn-box">客户名称：{{ orderSumm.Ssa_Name }}</div>
      <div class="btn-box">起点地址：{{ orderSumm.Start_Address}}</div>
      <div class="btn-box">终点地址：{{ orderSumm.End_Address}}</div>
    </div>
    <ul class="transEntrustInfo">
      <li>
        <span>运单运营方</span>
        <span :title="summ.Operator_Name">{{ summ.Operator_Name }}</span>
      </li>
      <li>
        <span>运输方式</span>
        <span :title="summ.Transport_Mode_Name">{{ summ.Transport_Mode_Name }}</span>
      </li>
      <li>
        <span>接单日期</span><!-- 订单日期 -->
        <span :title="summ.Departure_Time">{{ summ.Departure_Time }}</span>
      </li>
      <li>
        <span>温层</span>
        <span :title="summ.Storage_Temp_Name">{{ summ.Storage_Temp_Name }}</span>
      </li>
    </ul>
    <div class="table-box">
      <div class="toolbar">
        <div class="btn-box">总件数：{{ orderSumm.TotalPcs_Num }}</div>
        <div class="btn-box">品规数：{{ orderSumm.Goods_Num }}</div>
        <div class="btn-box">整箱数：{{ orderSumm.Fullload_Num }}</div>
        <div class="btn-box">拼箱数：{{ orderSumm.Groupage_Num }}</div>
        <div class="btn-box">冷藏数：{{ orderSumm.Chilleddrug_Num }}</div>
        <div class="btn-box">贵重药品：{{ orderSumm.valuabledrug_Num }}</div>
        <div class="btn-box">进口药品：{{ orderSumm.Importeddrug_Num }}</div>
        <div class="btn-box">精神药品：{{ orderSumm.PsychotropicDrug_Num }}</div>
        <div class="btn-box">特管药品：{{ orderSumm.SpecialcontrolDrug_Num }}</div>
        <div class="btn-box">赠品：{{ orderSumm.Gift_Num }}</div>
      </div>
      <el-table :data="orderDetails">
        <el-table-column type="index" label="序号" width="65"></el-table-column>
        <el-table-column prop="Goods_No" label="商品编号"></el-table-column>
        <el-table-column prop="Goods_Name" label="商品名称"></el-table-column>
        <el-table-column prop="Drug_Spec" label="规格"></el-table-column>
        <el-table-column prop="Manufacturer" label="厂家"></el-table-column>
        <el-table-column prop="Package_Unit" label="包装单位"></el-table-column>
        <el-table-column prop="Package_Qty" label="包装数"></el-table-column>
        <el-table-column prop="Actual_Pcs" label="件数"></el-table-column>
        <el-table-column prop="Planned_Volume" label="体积(m³)"></el-table-column>
        <el-table-column prop="Planned_Weight" label="重量(KG)"></el-table-column>
        <el-table-column prop="License_No" label="批准文号"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Api from '@/common/js/api'

  export default {
    name: 'orderDetailList',
    props: [],
    components: {},
    data () {
      return {
        orderSumm: {},
        summ: {},
        orderDetails: []
      }
    },
    computed: {},
    methods: {
      goBack (step) {
        this.$router.go(step)
      },
      getData () {
        let params = {
          Bill_Dtl_Id: this.orderSumm.BillTransportA_Dtl_Id
        }
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('TmpCYSGetBillTransportADtlXX', params)
          .then((res) => {
            this.loadingWait.close()
            this.orderDetails = res.MsgInfo
            console.log(this.orderDetails)
          })
      },
      init () {
        this.orderSumm = JSON.parse(this.$route.params.row)
        this.summ = JSON.parse(this.$route.params.summarizeRow)
        this.getData()
      }
    },
    created () {},
    mounted () {
    },
    activated () {
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .toolbar {
    line-height: 42px;
    margin: 15px 0;
    .btn-box {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .transEntrustInfo {
    display: flex;
    flex-wrap: wrap;
    border-width: 1px;
    border-style: solid;
    border-color: #dfe6ec;
    padding: 0;
    margin: 15px 0;
    li {
      width: 25%;
      line-height: 40px;
      display: flex;
      span {
        display: inline-block;
        border-right: 1px solid #dfe6ec;
        padding: 0 10px;
        &:nth-of-type(1) {
          color: #1f2d3d;
          font-weight: bold;
          width: 84px;
        }
        &:nth-last-of-type(1) {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &:nth-of-type(5n) {
        span:nth-last-of-type(1) {
          border-right: none;
        }
      }
    }
  }
</style>
