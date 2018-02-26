<template>
  <div class="main-list">
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-1)">首页</el-breadcrumb-item>
            <el-breadcrumb-item>承运商运单包查询</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="common-condition-box">
      <el-form :inline="true" label-width="60px">
        <el-form-item label="承运商">
          <el-input placeholder="双击选择" v-model="searchForm.Carrier_Name"
                    :disabled="true"
                    icon="el-icon-close"
                    :on-icon-click="handleIconClick"
                    @dblclick.native="openDialog"></el-input>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.Start_Departure_Time"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="searchForm.End_Departure_Time"></el-date-picker>
        </el-form-item>
        <el-form-item label="委托单号">
          <el-input placeholder="请输入委托单号" v-model="searchForm.TransportEntrust_No"></el-input>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input placeholder="请输入车牌号" v-model="searchForm.Vehicle_No"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <!-- <div class="toolbar">
         <div class="btn-box">总订单数:<span>0</span></div>
         <div class="btn-box">已完成订单数：<span>0</span></div>
         <div class="btn-box">未完成订单数：<span>0</span></div>
         <div class="btn-box">总客户数：<span>0</span></div>
         <div class="btn-box">总件数：<span>0</span></div>
       </div>-->
      <el-table :data="tableData">
        <el-table-column type="index" prop="Operator_Name" label="序号" width="70"></el-table-column>
        <el-table-column prop="Departure_Time" label="接单日期" width="170"></el-table-column>
        <el-table-column prop="TransportEntrust_No" label="委托单号" width="150"></el-table-column>
        <el-table-column prop="Vehicle_No" label="车牌号"></el-table-column>
        <el-table-column prop="TotalPcs_Nums" label="总件数"></el-table-column>
        <el-table-column prop="Is_Chillcar" label="是否冷藏"></el-table-column>
        <el-table-column prop="DingDan_Num" label="订单数"></el-table-column>
        <el-table-column prop="Ssa_Num" label="客户数"></el-table-column>
        <el-table-column prop="Wei_HuiDan_Num" label="未回单数"></el-table-column>
        <el-table-column prop="Gross_Volume_Nums" label="总体积(m³)"></el-table-column>
        <el-table-column prop="Gross_Weight_Nums" label="总重量(KG)"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="primary" type="text" size="small" @click="goItem(scope.row)">查看明细</el-button>
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
    <carrier-modal :visible.sync="searchForm.showCarrier" @change="selectCarri"></carrier-modal>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import carrierModal from '@/common/service/modal/carri-modal'

  export default {
    name: 'index',
    data () {
      return {
        tableData: [],
        searchForm: {
          Carrier_Id: '',
          Carrier_Name: '',
          TransportEntrust_No: '',
          Vehicle_No: '',
          Start_Departure_Time: new Date().getFullYear() + '-01-01',
          End_Departure_Time: new Date().getFullYear() + '-12-30',
          showCarrier: false
        },
        pages: {
          pageSize: 10,
          bigTotalItems: 0,
          currentPage: 1
        }
      }
    },
    components: {
      carrierModal
    },
    methods: {
      selectCarri (row) {
        if (row) {
          this.searchForm.Carrier_Name = row.Carrier_Name
          this.searchForm.Carrier_Id = row.Carrier_Id
          this.init()
        }
      },
      openDialog () {
        this.searchForm.showCarrier = true
      },
      init () {
        this.getData()
      },
      getData () {
        let param = {
          Carrier_Id: '',
          TransportEntrust_No: '',
          Vehicle_No: '',
          Start_Departure_Time: '',
          End_Departure_Time: '',
          startIndex: '',
          pageSize: ''
        }
        param.Carrier_Id = this.searchForm.Carrier_Id ? this.searchForm.Carrier_Id : '%'
        // param.Carrier_Id = '274cf35ecaace711b639000c29d6c8f4'
        param.TransportEntrust_No = this.searchForm.TransportEntrust_No ? this.searchForm.TransportEntrust_No : '%'
        param.Vehicle_No = this.searchForm.Vehicle_No ? this.searchForm.Vehicle_No : '%'
        param.Start_Departure_Time = this.searchForm.Start_Departure_Time
        param.End_Departure_Time = this.searchForm.End_Departure_Time
        param.startIndex = (this.pages.currentPage - 1) * 10
        param.pageSize = this.pages.pageSize
        Api.get('TmpCYSGetBillTransportEntrustHdrHZ', param).then(res => {
          if (res.Flag) {
            this.tableData = res.MsgInfo
            this.pages.bigTotalItems = res.MsgInfo[0] ? res.MsgInfo[0].bigTotalItems : 0
          } else {
            this.$alert(res.ErrInfo, '提示!')
          }
        })
      },
      handleCurrentChange () {
        this.getData()
      },
      handleIconClick () {
        this.searchForm.Carrier_Name = ''
        this.searchForm.Carrier_Id = ''
      },
      goItem (row) {
        let params = {
          row: JSON.stringify(row)
        }
        this.$router.push(
          {
            name: 'carriSearchItemList',
            params: params
          }
        )
      }
    },
    activated () {
      this.init()
    }
  }
</script>

<style lang="less" scoped>
  .main-list {
    .toolbar {
      line-height: 42px;
      margin: 15px 0;
      .btn-box {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    .block {
      margin: 60px 0 30px;
      text-align: center;
    }
  }
</style>
