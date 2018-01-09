<template>
  <div>
    <el-dialog class='Mydialog' :title="DialogTitle" :visible.sync="visibleRegion" @close="closeDialog" @open="openDialog">
      <el-form :model="form">
        <div class='form-group'>
          <el-select v-model="province" filterable placeholder="请选择">
            <el-option
              v-for="item in provinceData"
              :key="item.Rindex"
              :label="item.Region_Name"
              :value="item.Region_No">
            </el-option>
          </el-select>
          <el-input class="regionCityKeyword" v-model="form.keyword" auto-complete="off" placeholder='输入关键字搜索' icon="search" :on-icon-click="onSearch" @keyup.native.enter="onSearch"></el-input>
        </div>
      </el-form>
      <div class='tabel-wrapper'>
        <el-table stripe ref='singleTable' :data="gridData" highlight-current-row @current-change='handleCurrentChange' height='300' @row-dblclick='_confirm'>
          <el-table-column v-for='(item, $index) in TableHeader' :property="item.field" :label="item.title" :key='$index' header-align="left" :width='item.width?item.width:110'>
            <template slot-scope="scope">
              <div :title='scope.row[item.field]' slot="reference" class="name-wrapper">{{ scope.row[item.field] }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--
      <el-pagination
        v-show="isPages"
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      -->
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import Api from '@/common/js/api'
  export default {
    name: 'regionCityModal',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      // dialog头部文案
      DialogTitle: {
        type: String,
        default: '编辑页面'
      },
      Region_No: {
        type: String,
        default: ''
      },
      Region_Name: {
        type: String,
        default: ''
      },
      /*Region: {
        type: Object,
        default () {
          return {}
        }
      },*/
      // 数据总条数
      total: {
        type: Number,
        default: 10
      }
      // 是否分页
      /*isPages: {
        type: Boolean,
        default: true
      }*/
    },
    data () {
      return {
        // 表单数据,
        isLoaded: false,
        visibleRegion: this.visible,
        form: {
          province: '',
          keyword: ''
        },
        currentRow: null, // 当前选中行
        currentId: undefined, // 当前点击ID 的行数据
        currentPage: 1,
        Rows: {}, // 返回的数据
        // 表头数据
        TableHeader: [
          {
            title: '地级行政区编码',
            field: 'Region_No'
          },
          {
            title: '地级行政区',
            field: 'Region_Name'
          }
        ],
        // 表格数据
        provinceData: [],
        gridData: []
        /*startPage: 1, // 页码
        pageSize: 10, // 每页条数
        totalNum: 10 // 总条数*/
      }
    },
    watch: {
      visibleRegion (val) {
        this.$emit('update:visible', val)
        if (val && this.form.keyword) {
          this.form.keyword = ''
          this.onSearch()
        }
      },
      visible (val) {
        this.visibleRegion = val
      },
      Region_No () {
        if (this.Region_No) {
          // this.getCon()
          this.form.keyword = ''
          this.onSearch()
        }
      }
    },
    methods: {
      getCon () {
        this.provinceData = []
        this.gridData = []
        this.isLoaded = false
        // let startIndex = (this.startPage - 1) * this.pageSize
        let params = {
          AddressCode: '0{10}',
          KeyWords: ''
        }
        params = Object.assign(params, this.params)
        Api.get('A_Fd_Region_Get_Search', params)
        .then((res) => {
          this.isLoaded = true
          // this.totalNum = res.MsgInfo[0].Sum_Cnt
          this.provinceData = res.MsgInfo
          let dataObjStr = JSON.stringify({
            AddressCode: this.province ? this.province : '',
            KeyWords: this.form.keyword ? this.form.keyword : ''
          })
          let params2 = {
            dataType: 'cityAddress',
            data: dataObjStr
          }
          Api.yuyan('AgingApi', params2)
          .then((res) => {
            this.isLoaded = true
            // this.totalNum = res.MsgInfo[0].Sum_Cnt
            this.gridData = res.MsgInfo
          })
        })
      },
      onSearch () {
        this.getCon()
      },
      // 关闭弹窗
      closeDialog () {
      },
      openDialog () {
      },
      // 选中行
      handleCurrentChange (val) {
        this.currentRow = val
      },
      // 翻页
      /*pageChange (num) {
        this.startPage = num
        this.getCon()
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },*/
      // 取消按钮
      _cancel () {
        this.hide()
      },
      hide () {
        this.$emit('update:visible', false)
      },
      // 确定按钮
      _confirm (row, event) {
        if (this.currentId !== undefined) { // 传id的情况（多条数据）
          this.Rows[this.currentId] = this.currentRow
        } else { // 不传id的情况
          this.Rows = this.currentRow
        }
        this.$emit('change', this.Rows, this.province)
        this.hide()
      },
      init () {
        this.getCon()
      }
    },
    created () {
      if (this.Region_No) {
        this.init()
      }
    },
    computed: {
      province: {
        get: function () {
          return this.Region_No
        },
        set: function (v) {
          this.Region_No = v
        }
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
  .regionCityKeyword{
    width:35%;
  }
</style>
