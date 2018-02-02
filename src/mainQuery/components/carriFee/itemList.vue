<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-2)">首页</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="go(-1)">应付账款汇总</el-breadcrumb-item>
            <el-breadcrumb-item>应付账款项目</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="common-condition-box">
      <el-form>
        <el-form-item label="费用项目：">
          <common-select :ServiceType="params.Service_Type" field="Service_Item" v-model="condition.Service_Item" @change="onChange"></common-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="origData">
        <el-table-column
          prop="Service_Item_Desc"
          label="费用项目"
        >
        </el-table-column>
        <el-table-column
          prop="Carrier_Name"
          label="对账单位"
        >
        </el-table-column>
        <el-table-column
          prop="Charging_Rule_Desc"
          label="计费规则"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="Total_Amount"
          label="应收金额"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="Mon"
          label="日期"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              class="primary"
              type="text"
              size="small"
              @click="goDetail(scope.$index, scope.row)">查看明细</el-button>
          </template>
        </el-table-column>
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
  import commonSelect from '@/common/service/select/select-service-item'
  import Api from '@/common/js/api'
  export default {
    name: 'carriFeeItemList',
    props: {
      type: {
        default: 0
      }
    },
    components: {commonSelect},
    data () {
      return {
        condition: {
          Service_Item: ''
        },
        stor_origData: [], // 备份完整数据
        filter_Data: [], // 搜索过滤后的数据
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        origData: []
      }
    },
    computed: {
      params () {
        if (!this.$route.params.row) return {}
        return JSON.parse(this.$route.params.row)
      }
    },
    methods: {
      onPage () {
        this.getItemData()
      },
      goDetail (index, row) { // 向三级页面传递参数
        let path = {
          name: 'carriFeeDetailList',
          params: {
            row: JSON.stringify({
              Begin_Date: this.params.Begin_Date,
              End_Date: this.params.End_Date,
              SettleUp_Company_Id: this.params.SettleUp_Company_Id,
              Service_Type: this.params.Service_Type,
              Mon: this.params.Mon,
              Biz_Bill_Hdr_Id: row.Biz_Bill_Hdr_Id,
              Service_Item: row.Service_Item
            })
          }
        }
        this.$router.push(path)
      },
      // 筛选
      onChange () {
        // 如果总页数大于1, 则调接口重新获取数据，否则本地过滤
        if (this.pages.total > this.pages.pageSize) {
          this.getItemData()
        } else {
          if (this.condition.Service_Item === '') {
            this.origData = this.stor_origData
          } else {
            this.filter_Data = []
            for (let i = 0; i < this.stor_origData.length; i++) {
              if (this.condition.Service_Item === this.stor_origData[i].Service_Item) {
                this.filter_Data.push(this.stor_origData[i])
              }
            }
            this.origData = this.filter_Data
          }
        }
      },
      // 获取二级页面数据
      getItemData () {
        let params = {
          Operator_Id: this.params.Operator_Id,
          SettleUp_Company_Id: this.params.SettleUp_Company_Id,
          Service_Type: this.params.Service_Type,
          Service_Item: '%',
          Mon: this.params.Mon,
          Begin_Date: this.params.Begin_Date,
          End_Date: this.params.End_Date,
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpCYFGetBalanceMx', params)
          .then((res) => {
            this.loadingWait.close()
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
            this.stor_origData = this.origData
          })
      },
      // 初始化
      init () {
        this.getItemData()
      }
    },
    created () {
    },
    mounted () {
    },
    activated () { //<keep-alive> 内切换时会被执行created内不行
      this.init()
    }
  }
</script>
<style lang="less" scoped>
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
</style>
