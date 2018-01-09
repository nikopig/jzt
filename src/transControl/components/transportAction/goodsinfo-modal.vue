<template>
  <div>
    <el-dialog size="small" class='Mydialog' title="商品信息" :visible.sync="visible">
      <div class='tabel-wrapper fixed-height'>
        <el-table class="no-scroll-table" stripe ref='singleTable' :row-style="setRowStyle" :data="gridData" @current-change='handleCurrentChange'>
          <el-table-column label="商品名称" prop="Goods_Name" width="180" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="计划件数" prop="Planned_Pcs" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="实际件数" prop="Actual_Pcs" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="体积(m³)" prop="Planned_Volume_Desc" width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="重量(㎏)" prop="Planned_Weight" width="120" :show-overflow-tooltip="true"></el-table-column>
          <!--<el-table-column label="备注" prop="Remarks"></el-table-column>-->
          <!--包车运输不允许拆分-->
          <el-table-column label="操作" width="60" v-if="transportPlanType !== 'bcys'">
            <template slot-scope="scope">
              <el-button class="split-btn" type="text" @click="openSplit">拆分</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showSplitNum" title="拆分数量" size="tiny">
      <el-form ref="splitForm" :model="splitForm" :inline="true">
        <el-form-item label="拆分件数:" prop="num" :rules="{validator: rule.num}">
          <el-input type="number" v-model="splitForm.num"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="success" @click="confirmSplit">确定</el-button>
        <el-button type="primary" @click="showSplitNum = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import Api from '@/common/js/api.js'
  export default {
    name: 'goodsinfoModal',
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      billDtlId: {
        default: ''
      },
      transportPlanType: {
        default: ''
      }
    },
    data () {
      return {
        visible: this.isVisible,
        queryId: this.billDtlId, // 用于查询三级明细数据的id
        showSplitNum: false, // 拆分件数弹框是否显示
        splitForm: { // 拆分多少件
          num: ''
        },
        rule: {
          num: this.validNum
        },
        showAddDialog: false, // 新增中转地址弹窗
        gridData: [], // 三级数据
        currentRow: null // 当前选中行
      }
    },
    computed: {
    },
    watch: {
      visible (val) {
        this.$emit('update:isVisible', val)
        if (val) {
          this.getData()
        }
      },
      isVisible (val) {
        this.visible = val
      },
      billDtlId (val) {
        if (val) {
          this.queryId = val
          this.getData()
        }
      }
    },
    methods: {
      // 设置行样式
      setRowStyle (row, index) {
        return {
          backgroundColor: row.BgColor
        }
      },
      // 重置表单
      resetForm () {
        if (this.$refs.splitForm) {
          this.$refs.splitForm.resetFields()
        }
      },
      // 校验拆分数量
      validNum (rule, value, callback) {
//        let exp = /^[1-9]\d*$/g
        if (!value) {
          callback(new Error('请输入拆分数量'))
        } else {
          callback()
        }
      },
      // 获取数据
      getData () {
        // 商品数据
        Api.get('TMP_TransportTaskScheding_Yd_Goods', {Bill_Dtl_Id: this.queryId})
          .then((resp) => {
            if (resp.Flag) {
              this.gridData = resp.MsgInfo
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
      },
      // 打开拆分件数弹框
      openSplit () {
        this.resetForm()
        this.showSplitNum = true
      },
      // 确认拆分
      confirmSplit () {
        this.$refs['splitForm'].validate((valid) => {
          if (!valid) return false
        })
        if (this.currentRow.Planned_Pcs - 0 < 2) {
          this.$alert('拆分件数必须大于一件才可以拆分')
          return false
        }
        if (this.currentRow.Planned_Pcs - 0 <= this.splitForm.num - 0) {
          this.$alert('拆分件数大于实际件数，无法操作')
          return false
        }
        let params = {
          bill_Dtl_Id: this.currentRow.Bill_Dtl_Id,
          split_Num: this.splitForm.num
        }
        Api.post('TMP_TransportTaskDD_SplitBill', params)
          .then(resp => {
            if (resp.Flag) {
              let rel = JSON.parse(resp.MsgInfo)
              if (rel.length > 1) {
                this.queryId += ',' + rel[1].Bill_Dtl_Id
                this.getData()
              }
              this.showSplitNum = false
              this.$alert('拆分成功')
              this.$emit('split-success') // 通知父组件刷新二级数据
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
      },
      // 选中行
      handleCurrentChange (val) {
        this.currentRow = val
      },
      hide () {
        this.$emit('update:isVisible', false)
      }
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less">
  .Mydialog{
    font-family: "Microsoft YaHei";
    table{
      width:100% !important;
    }
    .el-input__icon{
      margin:0;
    }
    .el-dialog{
      border-radius: 4px;
      .el-dialog__header{
        background-color: #eef6f6;
        padding: 11px 13px;
        border-radius: 4px 4px 0 0;
        .el-dialog__title{
          font-size:16px;
          font-weight: 500;
        }
      }
      .el-dialog__body{
        padding:20px;
        .form-group{
          width: 400px;
          height:30px;
          margin-bottom:15px;
          .el-input{
            height:100%;
            border-radius: 0;
          }
        }
        .tabel-wrapper.fixed-height {
          height: 300px;
          overflow-y: auto;
        }
        .el-table{
          overflow-y: hidden;
          .el-table__header-wrapper{
            th{
              height:32px;
              .cell{
                font-size: 12px;
                font-weight: 600;
              }
            }
          }
          .el-table__body-wrapper{
            td{
              height:32px;
              .cell{
                line-height:16px;
                font-size:12px;
                white-space: nowrap;
                .name-wrapper{
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
          .split-btn {
            color: #20a0ff;
          }
        }
        .el-pagination{
          margin-top:15px;
        }
        .footer {
          padding-top: 15px;
          text-align: right;
        }
      }
    }
  }
  .add {
    .el-dialog.el-dialog--small {
      height: 531px
    }
    .el-cascader {
      width: 100%;
    }
  }
</style>
