<!-- 弹窗界面(名称：Mydialog) -->
<!--
调用弹出框的引入方法：
<div class='content' @dblclick="showDialog(item.id,'commonDialog')">
  <el-input v-model="item.Goods_Lotno" placeholder="双击选择或手工录入"></el-input>
</div>
说明：
可以通过双击或单击事件调用，方法为showDialog(id,ref)；
参数id :所属弹出框的唯一标识，与带出的数据绑定在一起。例如：item.id
参数ref:  弹出框的钩子名，用以调用弹出框内部对象。例如 "commonDialog"
弹出框组件引用方法:
<common-dialog ref='commonDialog' :DialogTitle='DialogTitle'  :TableHeader='TableDH' :listData ='gridData' @confirm = 'confirm'></common-dialog>
说明:
ref: 调用弹出框组件的钩子,使用方法：Vue.$refs.commonDialog
DialogTitle: 弹出框的头部文案,默认为'编辑页面'
TableHeader: Table头部的数据,列默认宽度为110px,也可设置每个字段的宽度。数据格式: [{title:'tit1',field:'fie1'[, width:'width1']},{title:'tit2',field:'fie2'[, width:'width2']},...]
listData: Table的数据,数据格式:[{field1:'field1',field2:'field2',...},{field1:'field1',field2:'field2',...},...]
confirm: 点击确认关闭弹出框事件
confirm事件的方法的参数(Rows): 为选中的行数据,结构{currentId1：currentRow1,currentId2：currentRow2,...} -->
<template>
  <div>
    <el-dialog class='Mydialog' :title="DialogTitle" :visible.sync="pihaoDialog" @close="closeDialog">
      <el-form :model="form">
        <div class='form-group'>
          <el-input v-model="form.name" auto-complete="off" placeholder='输入关键字搜索' icon="search" :on-icon-click="onSearch"></el-input>
        </div>
      </el-form>
      <div class='tabel-wrapper'>
        <el-table stripe ref='singleTable' :data="filterData(listData)" highlight-current-row @current-change='handleCurrentChange' height='300' @row-dblclick='_confirm'>
          <el-table-column v-for='(item, $index) in TableHeader' :property="item.field" :label="item.title" :key='$index' header-align="left" :width='item.width?item.width:110'>
            <template slot-scope="scope">
              <div :title='scope.row[item.field]' slot="reference" class="name-wrapper">{{ scope.row[item.field] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-show="isPages"
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="_cancel">取消</el-button>
        <el-button type="primary" @click="_confirm">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'Mydialog',
    props: {
      // dialog头部文案
      DialogTitle: {
        type: String,
        default: '编辑页面'
      },
      // 表头数据
      TableHeader: {
        type: Array,
        default: null
      },
      // 表格数据
      listData: {
        type: Array,
        default: null
      },
      // 数据总条数
      total: {
        type: Number,
        default: 10
      },
      // 是否分页
      isPages: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        // 表单数据
        form: {
          name: ''
        },
        pihaoDialog: false, // 弹框是否显示的控制
        currentRow: null, // 当前选中行
        currentId: undefined, // 当前点击ID 的行数据
        currentPage: 1,
        Rows: {} // 返回的数据
      }
    },
    methods: {
      // 关闭弹窗
      closeDialog () {
        this.$emit('close', this.pihaoDialog)
      },
      // 通过筛选调节筛选
      filterData (data) {
        let searchRegex = new RegExp(this.form.name.trim(), 'i')
        return data.filter((item) => {
          for (let key in item) {
            if (searchRegex.test(item[key])) {
              return true
            }
          }
        })
      },
      // 选中行
      handleCurrentChange (val) {
        this.currentRow = val
      },
      // 翻页
      pageChange (num) {
        this.$emit('pageChange', num)
      },
      onSearch () {
        this.$emit('onSearch', this.form.name)
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      // 取消按钮
      _cancel () {
        this.pihaoDialog = false
      },
      // 确定按钮
      _confirm (row, event) {
//        console.log(event)
//        event.defaultPrevented = true
        if (this.currentId !== undefined) { // 传id的情况（多条数据）
          this.Rows[this.currentId] = this.currentRow
        } else { // 不传id的情况
          this.Rows = this.currentRow
        }
        this.$emit('confirm', this.Rows)
        this.pihaoDialog = false
      }
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
    -webkit-transform: translateX(-50%);
       -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
         -o-transform: translateX(-50%);
            transform: translateX(-50%);
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
      .el-table{
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
      }
      .el-pagination{
        margin-top:15px;
      }
    }
  }
}
</style>
