<template>
  <div class="main-list">
    <div class="toolbar">
      <div class="btn-box">
        <el-button type="text" icon="el-icon-plus" @click="addInsert">{{btnText}}</el-button>
      </div>
      <div class="btn-box">
        <el-button type="text" icon="el-icon-check" @click="confirmData">对账确认</el-button>
      </div>
      <div class="btn-box" style="float: right;line-height: 30px;margin-right: 25px;">
        总金额：{{tolMoney}}
      </div>
    </div>
    <div class="common-condition-box">
      <el-form :inline="true">
        <el-form-item label="对账单位">
          <el-input class="noselect" v-model="filterCondition.Con.MINGCHENG" placeholder="双击选择"
                    @dblclick.native="isVisible = true"
                    :disabled="true">
                      <i slot="suffix" class="el-icon-close" @click="deleteCon"></i>
                    </el-input>
        </el-form-item>
        <el-form-item label="费用类型">
          <common-select field="Service_Type" v-model="filterCondition.Service_Type"></common-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="filterCondition.Begin_Date" placeholder="选择开始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="filterCondition.End_Date" placeholder="选择结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <el-table :data="realData" ref="origData" @selection-change="selectData">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="Operator_Name" label="运营方" :show-overflow-tooltip="true" width="300px"></el-table-column>
        <el-table-column prop="Mon" label="月份"></el-table-column>
        <el-table-column prop="Con_Name" label="对账单位" :show-overflow-tooltip="true" width="300px"></el-table-column>
        <el-table-column prop="Service_Type_Desc" label="费用类型"></el-table-column>
        <el-table-column prop="Total_Amount" :label="acountText"></el-table-column>
        <el-table-column prop="Remark" label="备注" :show-overflow-tooltip="true"></el-table-column>
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
    <balance-modal :visible.sync="isVisible" :type="diecType" @change="selectCon"></balance-modal>
    <inforder-modal :visible.sync="danIsVisible" @change="selectDanhao"></inforder-modal>
    <el-dialog title="新增流水" :visible.sync="addDialog.dialogFormVisible">
      <el-form :model="addDialog.form" label-position="right" ref="lsForm">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="对账单位" prop="MINGCHENG" label-width="100px"
                          :rules="[{ required: true, message: '请选择对账单位', trigger: 'blur' }]">
              <el-input class="noselect" v-model="addDialog.form.MINGCHENG" placeholder="双击选择"
                        @dblclick.native="isVisible = true"
                        :disabled="true">
                          <i slot="suffix" class="el-icon-close" @click="deleteAddCon"></i>
                        </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用类型" label-width="100px" prop="Service_Type"
                          :rules="[{ required: true, message: '请选择费用类型', trigger: 'blur' }]">
              <common-select field="Service_Type" v-model="addDialog.form.Service_Type"
                             class="selectChange" @change="choose"></common-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用项目" label-width="100px" prop="Service_Item"
                          :rules="[{ required: true, message: '请选择择费用项目', trigger: 'blur' }]">
              <common-select-item :ServiceType="addDialog.form.Service_Type" field="Service_Item"
                                  v-model="addDialog.form.Service_Item"
                                  class="selectChange"></common-select-item>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单号" label-width="100px" prop="Biz_Bill_Hdr_Id">
              <el-input class="noselect" v-model="addDialog.form.Biz_Bill_Hdr_Id" placeholder="双击选择"
                        @dblclick.native="danIsVisible = true"
                        :disabled="true">
                          <i slot="suffix" class="el-icon-close" @click="deleteAddOrder"></i>
                        </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总件数" label-width="100px" prop="Total_Pcs"
                          :rules="[{ required: true, message: '请输入总件数', trigger: 'blur' }]">
              <el-input v-model="addDialog.form.Total_Pcs"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="追加金额" label-width="100px" prop="Add_Amount"
                          :rules="[{ required: true, message: '请输入追加金额', trigger: 'blur' }]">
              <el-input v-model="addDialog.form.Add_Amount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算备注" label-width="100px">
              <el-input v-model="addDialog.form.SettleUp_Remarks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" label-width="100px" prop="Create_Time"
                          :rules="[{ type: 'date', required: true, message: '请选择日期', trigger: 'blur' }]">
              <el-date-picker
                v-model="addDialog.form.Create_Time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" label-width="100px">
              <el-input v-model="addDialog.form.Remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addInsertPost">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import commonDialog from '@/common/components/common-dialog'
  import balanceModal from '@/common/service/modal/balance-modal'
  import inforderModal from '@/common/service/modal/inforder-modal'
  import commonSelect from '@/common/service/select/select-service-type'
  import commonSelectItem from '@/common/service/select/select-service-item'

  export default {
    name: 'mainList',
    props: {
      type: {
        default: 0
      }
    },
    components: {
      commonDialog,
      balanceModal,
      inforderModal,
      commonSelect,
      commonSelectItem
    },
    data () {
      return {
        isVisible: false, // 对账单位弹框是否显示
        danIsVisible: false, // 单号弹框是否显示
        diecType: '10', // 收支类型(10:应收  20:应付)
        origData: [],
        selectTableData: [],
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        },
        filterCondition: {
          Con: {
            SettleUp_Company_Id: '',
            MINGCHENG: ''
          },
          Service_Type: '',
          Begin_Date: new Date(),
          End_Date: new Date()
        },
        addDialog: {
          dialogFormVisible: false,
          form: {
            MINGCHENG: '',
            Fee_Record_Id: '',
            Operator_Id: '',
            SettleUp_Company_Id: '',
            Total_Pcs: '',
            Add_Amount: '',
            Payment_Type: '',
            SettleUp_Remarks: '',
            Service_Type: '',
            Service_Item: '',
            Remark: '',
            Create_Time: '',
            Biz_Bill_Hdr_Id: '',
            Biz_Bill_Dtl_Id: ''
          }
        },
        tolMoney: 0.0
      }
    },
    computed: {
      acountText () {
        return this.diecType === '20' ? '应付金额' : '应收金额'
      },
      btnText () {
        return this.diecType === '20' ? '追加支出' : '追加收入'
      },
      // 根据费用类型过滤数据
      realData () {
        if (!this.filterCondition.Service_Type) return this.origData
        return this.origData.filter((item) => {
          return item.Service_Type === this.filterCondition.Service_Type
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
        this.filterCondition.Con.MINGCHENG = ''
        this.filterCondition.Con.SettleUp_Company_Id = '%'
      },
//      删除追加弹框中的委托方
      deleteAddCon () {
        this.addDialog.form.MINGCHENG = ''
        this.addDialog.form.SettleUp_Company_Id = ''
      },
//     删除追加弹框中的委托方
      deleteAddOrder () {
        this.addDialog.form.Biz_Bill_Hdr_Id = ''
      },
      goItem ($index, row) {
        this.$router.push({
          name: 'itemList',
          params: {
            Operator_Id: row.Operator_Id,
            SettleUp_Company_Id: row.SettleUp_Company_Id,
            Con_Name: row.Con_Name,
            Service_Type: row.Service_Type,
            Mon: row.Mon,
            Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
            End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
            Payment_Type: this.$route.params.diecType,
            PrintReconciliation_Record_Id: row.PrintReconciliation_Record_Id + ''
          }
        })
      },
      //获取表格数据
      getData () {
        console.log(Api.userInfo)
        let params = {
          SettleUp_Company_Id: this.filterCondition.Con.SettleUp_Company_Id ? this.filterCondition.Con.SettleUp_Company_Id : '%',
          Service_Type: this.filterCondition.Service_Type ? this.filterCondition.Service_Type : '%',
          Payment_Type: this.$route.params.diecType,
          Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
          End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true),
          StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          PageSize: this.pages.pageSize
        }
        this.loadingWait = this.showLoading('请稍候...')
        Api.get('JlpGetBalanceHz', params)
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
        this.diecType = this.$route.params.diecType
        let nowDate = new Date()
        this.filterCondition.Begin_Date = new Date(nowDate.setDate(nowDate.getDate() - 30))
        this.filterCondition.End_Date = new Date()
      },
      //显示对账弹出框
      showDialog (val) {
        this.$refs[val].pihaoDialog = true
      },
      //查询流水
      searchData () {
        this.getData()
      },
      //对账单位弹出框选择
      selectCon (row) {
        if (this.addDialog.dialogFormVisible === true) {
          this.addDialog.form.SettleUp_Company_Id = row.SettleUp_Company_Id
          this.addDialog.form.MINGCHENG = row.MINGCHENG
          this.addDialog.form.Operator_Id = row.Operator_Id
        } else {
          this.filterCondition.Con.MINGCHENG = row.MINGCHENG
          this.filterCondition.Con.SettleUp_Company_Id = row.SettleUp_Company_Id
        }
      },
      //弹出框单号选择
      selectDanhao (row) {
        this.addDialog.form.Biz_Bill_Hdr_Id = row.Biz_Bill_Hdr_Id
        this.addDialog.form.Biz_Bill_Dtl_Id = row.Biz_Bill_Dtl_Id
      },
      //选择表格的多条记录
      selectData (val) {
        let that = this
        that.tolMoney = 0
        this.selectTableData = val
        this.selectTableData.forEach(item => {
          that.tolMoney = floatAdd(item.Total_Amount, that.tolMoney)
        })
      },
      //对账确认
      confirmData () {
        if (this.selectTableData.length > 0) {
          let param = {
            Operator: Api.userInfo.USERID,
            list_params: ''
          }
          let tempList = []
          this.selectTableData.forEach(item => {
            let postData = {
              Operator_Id: '',
              SettleUp_Company_Id: '',
              Payment_Type: this.$route.params.diecType,
              Service_Type: '',
              Service_Item: '%',
              Fee_Record_Id: '%',
              Begin_Date: DateFtt('yyyy-MM-dd', this.filterCondition.Begin_Date),
              End_Date: DateFtt('yyyy-MM-dd', this.filterCondition.End_Date, true)
            }
            postData.Operator_Id = item.Operator_Id
            postData.SettleUp_Company_Id = item.SettleUp_Company_Id
            postData.Service_Type = item.Service_Type
            postData.Mon = item.Mon
            postData.PrintReconciliation_Record_Id = item.PrintReconciliation_Record_Id
            tempList.push(postData)
          })
          param.list_params = JSON.stringify(tempList)
          this.loadingWait = this.showLoading('请稍候...')
          Api.post('FeeRecordsNode1', param).then(res => {
            this.loadingWait.close()
            if (res.Flag === true) {
              this.$alert('执行成功！', '友情提示', {
                confirmButtonText: '确定'
              }).then(() => {
                this.getData()
              })
            } else {
              this.$alert(res.ErrInfo)
            }
          })
        } else {
          this.$alert('未选择数据，请选择后再执行！', '友情提示', {
            confirmButtonText: '确定'
          })
        }
      },
      addInsert () {
        this.addDialog.dialogFormVisible = true
      },
      addInsertPost () {
        this.$refs.lsForm.validate((valid) => {
          if (valid) {
            let tempList = []
            let param = {
              Operator: Api.userInfo.USERID,
              list_params: ''
            }
            this.addDialog.form.Payment_Type = this.$route.params.diecType
            this.addDialog.form.Create_Time = DateFtt('yyyy-MM-dd', this.addDialog.form.Create_Time)
            tempList.push(this.addDialog.form)
            param.list_params = JSON.stringify(tempList)
            Api.post('JlpFeeRecordSave', param).then(res => {
              if (res.Flag === true) {
                this.$alert('添加成功！', '友情提示', {
                  confirmButtonText: '确定'
                }).then(() => {
                  this.addDialog.dialogFormVisible = false
                  // 重置追加收入弹框表单
                  this.resetForm()
                })
              } else {
                this.$alert(res.ErrInfo)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm () {
        this.addDialog.form = {
          MINGCHENG: '',
          Fee_Record_Id: '',
          Operator_Id: '',
          SettleUp_Company_Id: '',
          Total_Pcs: '',
          Add_Amount: '',
          Payment_Type: '',
          SettleUp_Remarks: '',
          Service_Type: '',
          Service_Item: '',
          Remark: '',
          Create_Time: '',
          Biz_Bill_Hdr_Id: '',
          Biz_Bill_Dtl_Id: ''
        }
      }
    },
    mounted () {
      this.init()
    },
    activated () {
      this.getData()
    },
    // 切换应付应收tab时(从应收一级页面切换到应付一级页面)
//    beforeRouteUpdate (to, from, next) {
//      next()
//      this.$nextTick(() => {
//        Object.assign(this.$data, this.$options.data())
//        this.init()
//      })
//    },
    // 切换应付应收tab时(从应收二级页面切换到应付一级页面)
    watch: {
      $route (val, oldVal) {
        if (val.params.diecType !== oldVal.params.diecType) {
          Object.assign(this.$data, this.$options.data())
          this.init()
        }
      }
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
