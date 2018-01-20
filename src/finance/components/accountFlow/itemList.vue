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
    <div class="toolbar">
      <div class="btn-box">
        <el-button type="text" icon="check" @click="confirmData">对账确认</el-button>
      </div>
    </div>
    <div class="common-condition-box">
      <el-form>
        <el-form-item label="费用项目：">
          <common-select :ServiceType="Service_Type" field="Service_Item" v-model="serviceType" @change="onChange"></common-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="origData" @selection-change="selectData">
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          prop="Service_Item_Desc"
          label="费用项目"
        >
        </el-table-column>
        <el-table-column
          prop="Con_Name"
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
          :label="acountText"
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
    name: 'itemList',
    props: {
      type: {
        default: 0
      }
    },
    components: {commonSelect},
    data () {
      return {
        Operator_Id: '', // 运营方id
        SettleUp_Company_Id: '', // 结算单位id
        Con_Name: '', // 结算单位名称
        Service_Type: '', // 费用类型
        Mon: '', // 月份
        PrintReconciliation_Record_Id: '', // 对账单id
        Begin_Date: '', // 开始时间
        End_Date: '', // 结束时间
        selectTableData: [], // 列表选中项
        serviceType: '', // 费用项目
        diecType: '', // 收支类型(recive:应收  meet:应付)
        Payment_Type: '',
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
      acountText () {
        return this.diecType === '20' ? '应付金额' : '应收金额'
      }
    },
    methods: {
      onPage () {
        this.getItemData()
      },
      goDetail (index, row) { // 向三级页面传递参数
        let path = {
          name: 'detailList',
          params: {
            Operator_Id: row.Operator_Id,
            SettleUp_Company_Id: row.SettleUp_Company_Id,
            Service_Type: this.Service_Type,
            Mon: this.Mon,
            PrintReconciliation_Record_Id: this.PrintReconciliation_Record_Id,
            Service_Item: row.Service_Item,
            Begin_Date: this.Begin_Date,
            End_Date: this.End_Date,
            Payment_Type: this.Payment_Type
          }
        }
        this.$router.push(path)
      },
      goBack () {
        this.$router.go(-1)
      },
      // 筛选
      onChange () {
        // 如果总页数大于1, 则调接口重新获取数据，否则本地过滤
        if (this.pages.total > this.pages.pageSize) {
          this.getItemData()
        } else {
          if (this.serviceType === '') {
            this.origData = this.stor_origData
          } else {
            this.filter_Data = []
            for (let i = 0; i < this.stor_origData.length; i++) {
              if (this.serviceType === this.stor_origData[i].Service_Item) {
                this.filter_Data.push(this.stor_origData[i])
              }
            }
            this.origData = this.filter_Data
          }
        }
      },
      // 选中项
      selectData (val) {
        this.selectTableData = val
      },
      // 对账确认
      confirmData () {
        if (this.selectTableData.length > 0) {
          let param = {
            Operator: Api.userInfo.USERID, // 用户id
            list_params: []
          }
          this.selectTableData.forEach(item => {
            let postData = {
              Operator_Id: '',
              SettleUp_Company_Id: '',
              Payment_Type: this.Payment_Type,
              Service_Type: this.Service_Type,
              Service_Item: '',
              Fee_Record_Id: '%',
              Begin_Date: this.Begin_Date,
              End_Date: this.End_Date,
              PrintReconciliation_Record_Id: this.PrintReconciliation_Record_Id
            }
            postData.Operator_Id = item.Operator_Id
            postData.SettleUp_Company_Id = item.SettleUp_Company_Id
            postData.Service_Item = item.Service_Item
            postData.Mon = item.Mon
            param.list_params.push(postData)
          })
          param.list_params = JSON.stringify(param.list_params)
          this.loadingWait = this.showLoading('请稍候...')
          Api.post('FeeRecordsNode1', param).then(res => {
            this.loadingWait.close()
            if (res.Flag === true) {
              this.$alert('执行成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                this.getItemData()
              })
            }
          })
        } else {
          this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
        }
      },
      // 获取二级页面数据
      getItemData () {
        let params = {
          Operator_Id: this.Operator_Id,
          SettleUp_Company_Id: this.SettleUp_Company_Id,
          Service_Type: this.Service_Type,
          Service_Item: !this.serviceType ? '%' : this.serviceType,
          Mon: this.Mon,
          PrintReconciliation_Record_Id: this.PrintReconciliation_Record_Id,
          Payment_Type: this.Payment_Type,
          Begin_Date: this.Begin_Date,
          End_Date: this.End_Date,
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        this.Service_Type = params.Service_Type
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpGetBalanceMx', params)
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
            this.origData = res.MsgInfo.map((item) => {
              item.Con_Name = this.Con_Name
              return item
            })
            this.stor_origData = this.origData
          })
      },
      // 初始化
      init () {
        let params = this.$route.params
        this.Con_Name = params.Con_Name
        this.diecType = params.diecType
        this.flowType = params.flowType
        this.Operator_Id = params.Operator_Id
        this.SettleUp_Company_Id = params.SettleUp_Company_Id
        this.Service_Type = params.Service_Type
        this.Mon = params.Mon
        this.Payment_Type = params.Payment_Type
        this.Begin_Date = params.Begin_Date
        this.End_Date = params.End_Date
        this.PrintReconciliation_Record_Id = params.PrintReconciliation_Record_Id
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
