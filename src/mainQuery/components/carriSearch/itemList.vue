<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-2)">首页</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="go(-1)">承运商运单包查询</el-breadcrumb-item>
            <el-breadcrumb-item>委托单详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="common-condition-box">
      <el-form :inline="true" label-width="60px">
        <div>
          <el-form-item label="订单状态">
            <select-order :field="searchForm.serviceTypeOrders" @change="orderStatus"></select-order>
          </el-form-item>
        </div>
        <el-form-item label="单据编号">
          <el-input placeholder="请输入单据编号" v-model="searchForm.ConOrder_No"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input placeholder="请输入客户名称、助记码、编号" v-model="searchForm.Ssa_Name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="toolbar">
        <div class="btn-box">总订单数：{{numData.DD_Num?numData.DD_Num:0 }}</div>
        <div class="btn-box">已完成订单数：{{numData.YDD_Num?numData.YDD_Num:0}}</div>
        <div class="btn-box">未完成订单数：{{numData.WDD_Num?numData.WDD_Num:0}}</div>
        <div class="btn-box">总客户数：{{numData.Ssa_Num?numData.Ssa_Num:0}}</div>
        <div class="btn-box">总件数：{{numData.TotalPcs_Num?numData.TotalPcs_Num:0}}</div>
      </div>
      <ul class="transEntrustInfo">
        <li>
          <span>运单运营方</span>
          <span :title="params.Operator_Name">{{ params.Operator_Name }}</span>
        </li>
        <li>
          <span>运输方式</span>
          <span :title="params.Transport_Mode_Name">{{ params.Transport_Mode_Name }}</span>
        </li>
        <li>
          <span>承运方联系人</span>
          <span :title="params.Contact_Name">{{ params.Contact_Name }}</span>
        </li>
        <li>
          <span>承运方联系电话</span>
          <span :title="params.Contact_Phone">{{ params.Contact_Phone }}</span>
        </li>
        <li>
          <span>司机</span>
          <span :title="params.Staff_Name">{{ params.Staff_Name }}</span>
        </li>
        <li>
          <span>司机电话</span>
          <span :title="params.Mobilephone">{{ params.Mobilephone }}</span>
        </li>
        <li>
          <span>司机身份ID</span>
          <span :title="params.Number_Id">{{ params.Number_Id }}</span>
        </li>
        <li>
          <span>车牌号</span>
          <span :title="params.Vehicle_No">{{ params.Vehicle_No}}</span>
        </li>
        <li>
          <span>温层</span>
          <span :title="params.Storage_Temp_Name">{{ params.Storage_Temp_Name }}</span>
        </li>
        <li>
          <span>车型</span>
          <span :title="params.Vehbrand_Model">{{ params.Vehbrand_Model }}</span>
        </li>
        <li>
          <span>车辆荷载件数</span>
          <span :title="params.Loading_Num">{{ params.Loading_Num }}</span>
        </li>
        <li>
          <span>车厢内尺寸</span>
          <span :title="params.Inside_Size">{{ params.Inside_Size }}</span>
        </li>
      </ul>
      <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="Con_Name" label="委托方"></el-table-column>
        <el-table-column prop="ConOrder_No" label="订单号"></el-table-column>
        <el-table-column prop="Bill_TransportA_Dtl_State_Name" label="回单状态"></el-table-column>
        <el-table-column prop="Is_Receipt_Upload_Name" label="是否上传"></el-table-column>
        <el-table-column prop="TransportPlan_Type_Name" label="运输计划类型"></el-table-column>
        <el-table-column prop="Transport_Type_Name" label="运输类别"></el-table-column>
        <el-table-column prop="Ssa_Name" label="客户名称"></el-table-column>
        <el-table-column prop="Start_Address" label="起点地址"></el-table-column>
        <el-table-column prop="End_Address" label="终点地址"></el-table-column>
        <el-table-column prop="TotalPcs_Num" label="总件数"></el-table-column>
        <el-table-column prop="Gross_Weight" label="总重量（KG）"></el-table-column>
        <el-table-column prop="Gross_Volume" label="总体积（m³）"></el-table-column>
        <el-table-column label="订单详情">
          <template slot-scope="scope">
            <el-button class="primary" type="text" size="small" @click="goOrderDetial(scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pages.currentPage"
        :page-size="pages.pageSize"
        layout="prev, pager, next, jumper"
        :total="pages.bigTotalItems">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import selectOrder from '@/common/service/select/select-order'

  export default {
    name: 'item-list',
    data () {
      return {
        searchForm: {
          serviceTypeOrders: 'Bill_TransportA_Dtl_State',
          ConOrder_No: '',
          Ssa_Name: '',
          Bill_TransportA_Dtl_State: ''
        },
        params: {},
        tableData: [],
        pages: {
          pageSize: 10,
          bigTotalItems: 0,
          currentPage: 1
        },
        numData: {}
      }
    },
    methods: {
      getData () {
        let param = {
          TransportEntrust_Hdr_Id: '',
          startIndex: '',
          pageSize: '',
          Bill_TransportA_Dtl_State: '',
          ConOrder_No: '',
          Ssa_Name: ''
        }
        param.TransportEntrust_Hdr_Id = this.params.TransportEntrust_Hdr_Id ? this.params.TransportEntrust_Hdr_Id : '%'
        param.Bill_TransportA_Dtl_State = this.searchForm.Bill_TransportA_Dtl_State ? this.searchForm.Bill_TransportA_Dtl_State : '%'
        param.Ssa_Name = this.searchForm.Ssa_Name ? this.searchForm.Ssa_Name : '%'
        param.ConOrder_No = this.searchForm.ConOrder_No ? this.searchForm.ConOrder_No : '%'
        param.startIndex = (this.pages.currentPage - 1) * 10
        param.pageSize = this.pages.pageSize
        Api.get('TmpCYSGetBillTransportEntrustDtlMX', param).then(res => {
          if (res.Flag) {
            this.tableData = res.MsgInfo
            this.pages.bigTotalItems = res.MsgInfo[0] ? res.MsgInfo[0].bigTotalItems : 0
          } else {
            this.$alert(res.ErrInfo, '提示!')
          }
        })
        this.getNumData()
      },
      getNumData () {
        let param = {
          TransportEntrust_Hdr_Id: '',
          Bill_TransportA_Dtl_State: '',
          ConOrder_No: '',
          Ssa_Name: ''
        }
        param.TransportEntrust_Hdr_Id = this.params.TransportEntrust_Hdr_Id ? this.params.TransportEntrust_Hdr_Id : '%'
        param.Bill_TransportA_Dtl_State = this.searchForm.Bill_TransportA_Dtl_State ? this.searchForm.Bill_TransportA_Dtl_State : '%'
        param.Ssa_Name = this.searchForm.Ssa_Name ? this.searchForm.Ssa_Name : '%'
        param.ConOrder_No = this.searchForm.ConOrder_No ? this.searchForm.ConOrder_No : '%'
        Api.get('TmpCYSGetBillTransportEntrustDtlWtTB', param).then(res => {
          if (res.Flag) {
            this.numData = res.MsgInfo ? res.MsgInfo[0] : {}
          } else {
            this.$alert(res.ErrInfo, '提示!')
          }
        })
      },
      init () {
        this.params = JSON.parse(this.$route.params.row)
        this.getData()
      },
      handleCurrentChange () {
        this.getData()
      },
      goBack (step) {
        this.$router.go(step)
      },
      goOrderDetial (row) {
        let params = {
          summarizeRow: JSON.stringify(this.params),
          row: JSON.stringify(row)
        }
        this.$router.push({
          name: 'carriSearchOrderDetailList',
          params: params
        })
      },
      orderStatus (val) { //获取多选的 子传父 获取订单状态
        this.searchForm.Bill_TransportA_Dtl_State = val
      }
    },
    activated () {
      this.init()
    },
    components: {
      selectOrder
    }
  }
</script>

<style lang="less" scoped>
  .transEntrustInfo {
    display: flex;
    flex-wrap: wrap;
    border-width: 1px 1px 0;
    border-style: solid;
    border-color: #dfe6ec;
    padding: 0;
    margin: 15px 0;
    li {
      width: 25%;
      line-height: 40px;
      display: flex;
      border-bottom: 1px solid #dfe6ec;
      span {
        display: inline-block;
        border-right: 1px solid #dfe6ec;
        padding: 0 10px;
        &:nth-of-type(1) {
          color: #1f2d3d;
          font-weight: bold;
          width: 92px;
        }
        &:nth-last-of-type(1) {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      &:nth-of-type(4n) {
        span:nth-last-of-type(1) {
          border-right: none;
        }
      }
    }
  }
</style>
