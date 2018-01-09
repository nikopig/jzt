<template>
  <div class="otherHandleDetailList">
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="goBack(-1)">{{breadcrumbItems.name}}</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="Create_Time" label="时间"></el-table-column>
        <el-table-column prop="Problem_Type" label="问题类型"></el-table-column>
        <el-table-column prop="Problem_Desc" label="问题描述"></el-table-column>
        <el-table-column prop="Indemnity_Content" label="赔款内容"></el-table-column>
        <el-table-column prop="BillTransportA_Hdr_Id" label="订单号"></el-table-column>
        <el-table-column prop="Responsibility" label="责任方"></el-table-column>
        <el-table-column prop="Add_Amount" label="费用金额"></el-table-column>
        <el-table-column prop="Remarks" label="备注"></el-table-column>
      </el-table>
    </div>
    <div class="handle-footer">
      <el-pagination
        @current-change="pageChange"
        :current-page.sync="pages.currentPage"
        :page-size="pages.pageSize"
        layout="total, prev, pager, next"
        :total="pages.totalItems">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Api from '@/common/js/api'

  export default {
    name: 'otherHandleDetailList',
    components: {},
    data () {
      return {
        diecType: '', // 收支类型(10:应收，11:其它应收，20:应付，21:其它应付)
        Payment_Record_Id: '',
        routeName: '',
        pages: {
          currentPage: 1,
          pageSize: 10,
          totalItems: 0
        },
        breadcrumbItems: {
          name: ''
        },
        tableData: []
      }
    },
    methods: {
      pageChange () {
        this.getDetail()
      },
      goBack (val) {
        this.$router.go(val)
      },
      getDetail () {
        let param = {
          Payment_Record_Id: this.Payment_Record_Id,
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        Api.get('JlpBalancePaymentQtMx', param).then(res => {
          if (res.Flag) {
            this.tableData = res.MsgInfo
            if (this.tableData.length > 0) this.pages.totalItems = this.tableData[0].Sum_Cnt
          } else {
            this.$alert('请求数据失败！', '友情提示')
          }
        })
      },
      init () {
        this.diecType = this.$route.params.diecType
        this.Payment_Record_Id = this.$route.params.Payment_Record_Id
        this.routeName = this.$route.params.routeName
        if (this.routeName === 'otherHandle' && this.diecType === '10') {
          this.breadcrumbItems.name = '其它应付结算'
        }
        if (this.routeName === 'otherHandle' && this.diecType === '20') {
          this.breadcrumbItems.name = '其它应收结算'
        }
        this.getDetail()
      }
    },
    mounted () {
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

  .handle-footer {
    text-align: center;
    margin-top: 15px;
  }

  .table-box {
    margin-top: 20px;
  }
</style>

