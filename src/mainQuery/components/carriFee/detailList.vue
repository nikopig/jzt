<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-3)">首页</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="go(-2)">应付账款类型</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="go(-1)">应付账款项目</el-breadcrumb-item>
            <el-breadcrumb-item>应付账款明细</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table :data="origData">
        <el-table-column prop="Create_Time" label="日期" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Biz_Bill_Hdr_Id" label="订单号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Transport_Type" label="运输类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Total_Length" label="公里数"></el-table-column>
        <el-table-column prop="TotalBox_Num" label="总件数"></el-table-column>
        <el-table-column prop="Gross_Volume" label="总体积(m³)"></el-table-column>
        <el-table-column prop="Gross_Weight" label="总重量(㎏)"></el-table-column>
        <el-table-column prop="Real_Amount" label="实际金额(元)" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Add_Amount" label="追加金额(元)" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Goods_Value" label="商品总价值" v-if="serviceItem === 3"></el-table-column>
        <el-table-column prop="Bill_Status" label="订单状态"></el-table-column>
        <!--<el-table-column label="操作">-->
        <!--<template scope="scope">-->
        <!--<el-button class="primary" type="text" size="small" @click="viewDetail(scope.$index, scope.row)">详情-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
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
</template>

<script>
  import Vue from 'vue'
  import Api from '@/common/js/api'
  import { DateFtt } from '@/common/js/utils'

  export default {
    name: 'carriFeeDetailList',
    props: {
      type: {
        default: 0
      }
    },
    data () {
      return {
        serviceItem: '', // 服务项目
        origData: [],
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        }
      }
    },
    computed: {
      params () {
        let rel = JSON.parse(this.$route.params.row)
        rel.StartIndex = (this.pages.currentPage - 1) * this.pages.pageSize
        rel.PageSize = this.pages.pageSize
        return rel
      }
    },
    methods: {
      onPage () {
        this.getData()
      },
      init () {
        this.getData()
      },
      getData () {
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpCYFGetBalanceRecord', this.params)
          .then((res) => {
            this.loadingWait.close()
            this.serviceItem = res.MsgInfo.length > 0 ? res.MsgInfo[0].Service_Item : ''
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
