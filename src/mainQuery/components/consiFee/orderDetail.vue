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
          <el-form :inline="true">
            <el-form-item label="订单号">
              <el-input  v-model="orderTel" @change="onChange"></el-input>
            </el-form-item>
          </el-form>
        </div>
    <div class="table-box">
      <el-table :data="origData">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="Create_Time" label="日期" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Biz_Bill_Hdr_Id" label="订单号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Transport_Type" label="运输类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Total_Length" label="公里数"></el-table-column>
        <el-table-column prop="TotalBox_Num" label="总件数"></el-table-column>
        <el-table-column prop="Gross_Volume" label="总体积"></el-table-column>
        <el-table-column prop="Gross_Weight" label="总重量"></el-table-column>
        <el-table-column prop="Real_Amount" label="应收金额(元)" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="Add_Amount" label="追加金额(元)">
        </el-table-column>
        <el-table-column prop="Bill_Status" label="订单状态"></el-table-column>
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import Api from '@/common/js/api'
  import { DateFtt } from '@/common/js/utils'

  export default {
    name: 'feeOrderDetail',
    props: {
      type: {
        default: 0
      }
    },
    data () {
      return {
        orderTel: '', //订单号查询
        //serviceItem: '', // 服务项目
        //diecType: '', // 收支类型(recive:应收  meet:应付)
        origData: [],
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        param: {}
      }
    },
    computed: {
    },
    methods: {
      onPage () {
        this.getData()
      },
      goBack (i) {
        this.$router.go(i)
      },
      onChange () {
        this.getData()
      },
      init () {
        this.params = this.$route.params
        this.params.StartIndex = (this.pages.currentPage - 1) * this.pages.pageSize
        this.params.PageSize = this.pages.pageSize
        this.params.Biz_Bill_Hdr_Id = this.orderTel ? this.orderTel : '%'
        this.getData()
      },
      getData () {
        this.params.Biz_Bill_Hdr_Id = this.orderTel ? this.orderTel : '%'
        this.params.StartIndex = (this.pages.currentPage - 1) * this.pages.pageSize
        this.params.PageSize = this.pages.pageSize
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpWTFGetBalanceRecord', this.params)
          .then((res) => {
            this.loadingWait.close()
            //this.serviceItem = res.MsgInfo.length > 0 ? res.MsgInfo[0].Service_Item : ''
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
      }
    },
    created () {},
    mounted () {},
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .headbar {
    margin-bottom: 10px;
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

  .condition-box {
    margin-top: 20px;
    border: 1px solid #EBEEF5;
    padding: 15px;
    .label-input {
      label {
        padding-right: 8px;
      }
      .el-input {
        width: auto;
      }
    }
  }

  .table-box {
    margin-top: 20px;
  }

  .selectChange {
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
</style>
