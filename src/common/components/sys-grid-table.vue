<template>
  <el-table class="grid-table" stripe row-key="index" :expand-row-keys="expandRow" :class="tableClassName" :data="filterItems" @expand="onExpand" @select="onSelect">
    <el-table-column v-if="hasCheckbox && classNum > 1"
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column show-overflow-tooltip v-for="th in options" :prop="th.prop" :label="th.label" :width="th.width"></el-table-column>
    <el-table-column
      v-if="classNum > 1"
      label="操作"
      width="100">
      <template scope="scope">
        <span @click="viewDetail(scope)" type="text" size="small" class="detailBtnClassName" :class="detailBtnClassName">查看明细</span>
      </template>
    </el-table-column>
    <el-table-column type="expand">
      <template scope="props" v-if="props.row.children && props.row.children.length > 0">
        <slot :row="props.row" :createClass="createClass"></slot>
      </template>
    </el-table-column>
</el-table>
</template>

<script>
    export default {
        name: 'sysGridTable',
        props: {
          data: { // 数据源
            default () {
              return []
            }
          },
          options: { // 列配置
            default () {
              return []
            }
          },
          classNum: { // 层级
            default () {
              return 1
            }
          },
          classNo: { // 第几层
            default () {
              return 0
            }
          },
          hasCheckbox: { // 是否有多选框
            default: false
          },
          filterObj: {
            default () {
              return {}
            }
          }
        },
        data () {
            return {
              expandRow: []
            }
        },
        created () {
          console.error(this)
        },
        computed: {
          tableClassName: function () {
            return 'el-table-class-' + this.classNo
          },
          detailBtnClassName: function () {
            return 'detail-btn-class-' + this.classNo
          },
          thStyle: function () {
            return {
              'background-color': 'rgba(32,160,255,' + (this.classNo / 10) + ')'
            }
          },
          realItems: function () {
              var rel = []
              return this.data.map(item => {
                if (item.classNum === undefined) item.classNum = this.classNum - 1
                if (item.classNo === undefined) item.classNo = this.classNo + 1
                return item
              })
          },
          filterItems: function () {
            var rel = this.realItems
            for (var key in this.filterObj) {
              rel = this.filterObj[key].filter(rel)
            }
            return rel
          }
        },
        watch: {
          filterObj () {
          }
        },
        methods: {
          onExpand (row, expaned) {
            if (expaned) {
              if (this.expandRow.length > 0) {
                this.expandRow.shift()
              }
              this.expandRow.push(row.index)
              console.log(this.expandRow)
            }
            var noNext = (row.children === undefined || row.children.length === 0)
            if (expaned && noNext) {
              this.$emit('createNextClass', row)
            }
          },
          createClass (row) {
            this.$emit('createNextClass', row)
          },
          viewDetail (scope) {
            scope.store.commit('toggleRowExpanded', scope.row)
          },
          onSelect (row) {
            this.$emit('select', row)
          }
        }
    }
</script>
<style>
  .grid-table .el-table__expanded-cell {
    padding: 0px;
  }
  .grid-table.el-table {
    border: none;
    text-align: center;
  }
  .grid-table.el-table.el-table-class-1 {
    text-align: center;
  }
  .grid-table.el-table th {
    text-align: center;
  }
  .grid-table .el-table__header-wrapper thead th > div {
    background-color: transparent;
  }
  .grid-table.el-table-class-1 th {
    background-color: #c9e5f5;
  }
  .grid-table .detailBtnClassName {
    cursor: pointer;
    color: #20a0ff;
  }
  .grid-table .detailBtnClassName.detail-btn-class-1 {
    color: #1ABB9C;
  }
  .grid-table.el-table-class-2 th {
    background-color: #e2f0e4;
  }
  .grid-table .el-table__expand-column .cell {
    display: none;
  }
  .el-table th {
    font-weight: normal;
  }
  .el-table .cell {
    white-space: nowrap!important;
  }
</style>
