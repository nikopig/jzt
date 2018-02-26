<template>
  <div class="main-list">
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-1)">首页</el-breadcrumb-item>
            <el-breadcrumb-item>应付账款汇总</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="common-condition-box">
      <el-form :inline="true">
        <el-form-item label="开始时间">
          <el-date-picker v-model="condition.Begin_Date"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="condition.End_Date"></el-date-picker>
        </el-form-item>
        <el-form-item label="费用类型">
          <common-select v-model="condition.Service_Type"></common-select>
        </el-form-item>
        <el-form-item label="对账单位">
          <el-input :disabled="true" placeholder="双击带出对账单位" v-model="condition.SettleUp_Company_Name" @dblclick.native=" isVisible = true" icon="el-icon-close" :on-icon-click="deleteCon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="realData" ref="origData">
        <el-table-column prop="Operator_Name" label="运营方" :show-overflow-tooltip="true" width="300px"></el-table-column>
        <el-table-column prop="Mon" label="月份"></el-table-column>
        <el-table-column prop="Carrier_Name" label="承运方" :show-overflow-tooltip="true" width="300px"></el-table-column>
        <el-table-column prop="Service_Type_Desc" label="费用类型"></el-table-column>
        <el-table-column prop="Total_Amount" label="应付金额"></el-table-column>
        <!--<el-table-column prop="SettleUp_Amount" label="对账金额"></el-table-column>-->
        <!--<el-table-column prop="operatorName" label="结算周期"></el-table-column>-->
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
    <el-pagination
      v-show="pages.isShow"
      layout="total, prev, pager, next, jumper"
      :page-size="pages.pageSize"
      :total="pages.total"
      :current-page.sync="pages.currentPage"
      @current-change="onPage"
    >
    </el-pagination>
    <carri-modal :visible.sync="isVisible" @change="selectCon"></carri-modal>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import commonDialog from '@/common/components/common-dialog'
  import carriModal from '@/common/service/modal/carri-modal'
  import inforderModal from '@/common/service/modal/inforder-modal'
  import commonSelect from '@/common/service/select/select-service-type'
  import commonSelectItem from '@/common/service/select/select-service-item'

  export default {
    name: 'carriFeeMainList',
    props: {
      type: {
        default: 0
      }
    },
    components: {
      commonDialog,
      carriModal,
      inforderModal,
      commonSelect,
      commonSelectItem
    },
    data () {
      return {
        isVisible: false, // 对账单位弹框是否显示
        diecType: '10', // 收支类型(10:应收  20:应付)
        origData: [],
        selectTableData: [],
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        condition: {
          SettleUp_Company_Id: '%',
          SettleUp_Company_Name: '',
          Service_Type: '',
          Begin_Date: new Date(),
          End_Date: new Date()
        }
      }
    },
    computed: {
      // 根据费用类型过滤数据
      realData () {
        if (!this.condition.Service_Type) return this.origData
        return this.origData.filter((item) => {
          return item.Service_Type === this.condition.Service_Type
        })
      }
    },
    methods: {
      onPage () {
        this.getData()
      },
      choose () {
        console.log(this.addDialog.form.Service_Type)
      },
      deleteCon () {
        this.condition.SettleUp_Company_Name = ''
        this.condition.SettleUp_Company_Id = '%'
      },
      goItem ($index, row) {
        this.$router.push({
          name: 'carriFeeItemList',
          params: {
            row: JSON.stringify({
              Mon: row.Mon,
              Con_Name: row.SettleUp_Company_Id,
              Operator_Id: row.Operator_Id,
              SettleUp_Company_Id: row.SettleUp_Company_Id,
              Begin_Date: this.condition.Begin_Date,
              End_Date: this.condition.End_Date,
              Service_Type: row.Service_Type
            })
          }
        })
      },
      //获取表格数据
      getData () {
        let params = {
          SettleUp_Company_Id: this.condition.SettleUp_Company_Id ? this.condition.SettleUp_Company_Id : '%',
          Service_Type: this.condition.Service_Type ? this.condition.Service_Type : '%',
          Begin_Date: DateFtt('yyyy-MM-dd', this.condition.Begin_Date),
          End_Date: DateFtt('yyyy-MM-dd', this.condition.End_Date, true),
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpCYFGetBalanceHz', params)
          .then((res) => {
            this.loadingWait.close()
            this.origData = res.MsgInfo
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
          })
      },
      //初始化
      init () {
        let nowDate = new Date()
        this.condition.Begin_Date = new Date(nowDate.setDate(nowDate.getDate() - 30))
        this.condition.End_Date = new Date()
      },
      //查询
      searchData () {
        this.getData()
      },
      //对账单位弹出框选择
      selectCon (row) {
        this.condition.SettleUp_Company_Name = row.Carrier_Name
        this.condition.SettleUp_Company_Id = row.Carrier_Id
      }
    },
    mounted () {
      this.init()
      this.getData()
    }
  }
</script>
<style lang="less" scoped>
  .main-list {
    .table-box {
      margin-top: 20px;
    }
  }

  .order-sum-select {
    .el-select-dropdown__item {
      font-size: 12px;
      padding: 0 10px;
      height: 24px;
      line-height: 24px;
    }
  }

  .el-date-editor.el-input {
    width: 100%;
  }
</style>
