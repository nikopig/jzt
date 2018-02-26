<template>
    <div>
      <div class="common-condition-box">
        <el-form :inline="true" size="small">
          <div>
            <el-form-item label="异常登记状态" label-width="90px">
              <select-dictionary type="radio" field="Abnormal_Record_State" v-model="condition.choice"></select-dictionary>
            </el-form-item>
          </div>
          <el-form-item label="对账单位">
            <el-input
              class="noselect"
              v-model="condition.SettleUp_Company_Name"
              icon="el-icon-close"
              :disabled="true"
              @dblclick.native="isVisible = true"
              placeholder="双击选择对账单位"
              :on-icon-click="clearBalance"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="起始日期">
            <el-date-picker v-model="condition.startDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker v-model="condition.endDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="异常类型">
            <select-dictionary field="Problem_Type" v-model="condition.problemType"></select-dictionary>
          </el-form-item>
          <el-form-item label="费用状态">
            <select-dictionary field="Fee_State" v-model="condition.choicefy"></select-dictionary>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box">
        <common-gride-card v-for="(item, index) in gridData" :key="index" :expand.sync="item.expand" @expand="getItems(item)">
          <div slot="header"></div>
          <common-row>
            <common-col>
              <div class="flex-wraper item">
                <label>订单号：</label>
                <div class="flex-item textOverflow">{{item.BillTransportA_Dtl_Id}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>理赔责任方：</label>
                <div class="flex-item textOverflow">{{item.Responsibility}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>责任方名称：</label>
                <div class="flex-item textOverflow">{{item.Danw_Name}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>异常类型：</label>
                <div class="flex-item textOverflow">{{item.Problem_Type}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>异常描述：</label>
                <div class="flex-item textOverflow">{{item.Problem_Desc}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>赔款内容：</label>
                <div class="flex-item textOverflow">{{item.Indemnity_Content}}</div>
              </div>
            </common-col>
            <common-col v-show="otherType == 1">
              <div class="flex-wraper item">
                <label>其他应收赔偿方式：</label>
                <div class="flex-item textOverflow">{{item.Collection_Compensation_Way}}</div>
              </div>
            </common-col>
            <common-col v-show="otherType == 1">
              <div class="flex-wraper item">
                <label>其他应收赔偿金额：</label>
                <div class="flex-item textOverflow">{{item.Collection_Compensation_Amount}}</div>
              </div>
            </common-col>
            <common-col v-show="otherType == 2">
              <div class="flex-wraper item">
                <label>其他应付赔偿方式：</label>
                <div class="flex-item textOverflow">{{item.Payment_Compensation_Way}}</div>
              </div>
            </common-col>
            <common-col v-show="otherType == 2">
              <div class="flex-wraper item">
                <label>其他应付赔偿金额：</label>
                <div class="flex-item textOverflow">{{item.Payment_Compensation_Amount}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>异常登记状态：</label>
                <div class="flex-item textOverflow">{{item.Abnormal_Record_State}}</div>
              </div>
            </common-col>
            <common-col>
              <div class="flex-wraper item">
                <label>费用状态：</label>
                <div class="flex-item textOverflow">{{item.Fee_State}}</div>
              </div>
            </common-col>
          </common-row>
          <div slot="children" class="children" v-for="dItem in item.children">
            <common-row>
              <common-col>
                <div class="flex-wraper item">
                  <label>时间：</label>
                  <div class="flex-item textOverflow">{{dItem.Created_Time}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>起点：</label>
                  <div class="flex-item textOverflow">{{dItem.Start_Address}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>终点：</label>
                  <div class="flex-item textOverflow">{{dItem.End_Address}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>承运商：</label>
                  <div class="flex-item textOverflow">{{dItem.Operator_Nameq}}</div>
                </div>
              </common-col>
              <!--</common-row>-->
              <!--<common-row>-->
              <common-col>
                <div class="flex-wraper item">
                  <label>订单号：</label>
                  <div class="flex-item textOverflow">{{dItem.Biz_Bill_No}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>商品名称：</label>
                  <div class="flex-item textOverflow">{{dItem.Goods_Name}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>件数：</label>
                  <div class="flex-item textOverflow">{{dItem.Planned_Pcs}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>体积：</label>
                  <div class="flex-item textOverflow">{{dItem.Planned_Volume}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>重量：</label>
                  <div class="flex-item textOverflow">{{dItem.Planned_Weight}}</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>订单状态：</label>
                  <div class="flex-item textOverflow">已开票</div>
                </div>
              </common-col>
              <common-col>
                <div class="flex-wraper item">
                  <label>总金额：</label>
                  <div class="flex-item textOverflow">89</div>
                </div>
              </common-col>
            </common-row>
          </div>
        </common-gride-card>
      </div>
      <div class="page-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pages.currentPage"
          :page-size="pages.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pages.total">
        </el-pagination>
      </div>
      <balance-modal :visible.sync="isVisible" :type="$route.params.diecType" @change="selectBalance"></balance-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import {DateFtt, prevMonth} from '@/common/js/utils.js'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    import selectDictionary from '@/common/service/select/select-dictionary'
    import commonGrideCard from '@/common/components/common-gride-card'
    import balanceModal from '@/common/service/modal/balance-modal'
    export default {
        name: 'otherList',
        props: [],
        components: {commonRow, commonCol, commonGrideCard, balanceModal, selectDictionary},
        data () {
            return {
              isVisible: false,
              condition: {
                choice: '0',
                choicefy: '',
                SettleUp_Company_Name: '',
                startDate: prevMonth(new Date()),
                endDate: new Date(),
                problemType: '',
                SettleUp_Company_Id: ''
              },
              pages: {
                currentPage: 1,
                pageSize: 10,
                total: 10
              },
              gridData: [],
              currentIndex: '',
              detailData: []
            }
        },
        computed: {
          otherType () {
            // 其他应收查询1、其他应付查询2
            return this.$route.params.diecType === '10' ? '1' : '2'
          }
        },
        methods: {
          stateChoose () {},
          clearBalance () {
            this.condition.SettleUp_Company_Name = ''
            this.condition.SettleUp_Company_Id = '%'
          },
          searchData () {
            this.getData()
          },
          handleCurrentChange () {
            this.getData()
          },
          selectBalance (row) {
            this.condition.SettleUp_Company_Name = row.MINGCHENG
            this.condition.SettleUp_Company_Id = row.SettleUp_Company_Id
          },
          // 获取一级数据
          getData () {
            let params = {
              Begin_Date: DateFtt('yyyy-MM-dd', this.condition.startDate),
              End_Date: DateFtt('yyyy-MM-dd', this.condition.endDate, true),
              Responsibility: this.otherType,
              Danw_Id: this.condition.SettleUp_Company_Id ? this.condition.SettleUp_Company_Id : '%',
              Problem_Type: this.problemType ? this.problemType : '%',
              Abnormal_Record_State: this.condition.choice,
              Biz_Bill_Hdr_Id: '%',
              Fee_State: this.condition.choicefy ? this.condition.choicefy : '%',
              StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
              PageSize: this.pages.pageSize
            }
            Api.get('JlpFeeRecQueryQtHz', params)
              .then((resp) => {
                if (resp.Flag) {
                  if (resp.MsgInfo.length > 0) {
                    this.pages.total = resp.MsgInfo[0].Sum_Cnt
                  } else {
                    this.pages.total = 0
                  }
                  this.gridData = resp.MsgInfo.map((item) => {
                    item.children = []
                    return item
                  })
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 获取二级数据
          getItems (row) {
            if (row.children.length > 0) return false
            let params = {
              Biz_Bill_Hdr_Id: row.BillTransportA_Dtl_Id || '%',
              StartIndex: 0,
              PageSize: 10
            }
            Api.get('JlpFeeRecQueryQtMx', params)
              .then((resp) => {
                if (resp.Flag) {
                  row.children = resp.MsgInfo
                  if (row.children.length === 0) {
                    this.$message('该条记录下没有明细数据')
                  }
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          init () {
            this.getData()
          }
        },
        created () {
        },
        mounted () {
          this.init()
        }
    }
</script>
<style lang="less" scoped>
  .table-box {
    padding-bottom: 30px;
  }
  .page-box {
    text-align: center;
  }
  .common-col label {
    width: 108px;
    text-align: right;
    padding-right: 10px;
  }
  .item {
    line-height: 30px;
  }
  .title {
    line-height: 30px;
    font-size: 16px;
    padding-left: 35px;
  }
  .children:not(:last-child) {
    border-bottom: 1px solid #d1dbe5;
  }
  .children {
    padding: 15px 0;
  }
</style>
