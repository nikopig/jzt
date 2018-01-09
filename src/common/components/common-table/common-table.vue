<template>
    <div class="common-table">
      <common-table-head :headStyle="headStyle">
        <common-table-cell :width="40" v-if="selection">
          <el-checkbox v-model="checkAll" @change="selectAll"></el-checkbox>
        </common-table-cell>
        <common-table-cell v-for="th in fields">{{th}}</common-table-cell>
      </common-table-head>
      <div v-for="(item, index) in data">
        <common-table-row :row="item">
          <common-table-cell @click.native="onExpand(index)">
            <slot :index="index" :row="item" name="action"></slot>
          </common-table-cell>
        </common-table-row>
        <div v-show="expandIndex === index">
          <slot name="child"></slot>
        </div>
      </div>
    </div>
</template>

<script>
    import commonTableHead from '@/common/components/common-table/common-table-head'
    import commonTableRow from '@/common/components/common-table/common-table-row'
    import commonTableCell from '@/common/components/common-table/common-table-cell'
    export default {
        name: 'common-table',
        props: {
          data: {
            type: Array,
            default () {
              return []
            }
          },
          options: { // 表格显示字段名 中文翻译配置
            default () {
              return []
            }
          },
          gridLine: { // 是否显示网格
            type: Boolean,
            default: false
          },
          selection: {
            type: Boolean,
            default: false
          },
          headStyle: {
            type: Object,
            default () {
              return {}
            }
          }
        },
        components: {commonTableHead, commonTableRow, commonTableCell},
        computed: {
          fields () {
            return this.options.map((item) => item.label)
          },
          props () {
            return this.options.map((item) => item.prop)
          }
        },
        data () {
            return {
              checkAll: false,
              expandIndex: -1
            }
        },
        methods: {
          selectAll () {},
          onExpand (index) {
            if (this.expandIndex === index) {
              this.expandIndex = -1
            } else {
              this.expandIndex = index
            }
          }
        },
        created () {
          console.log(this.$slots.default)
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
  .common-table {
    border-top: 1px solid #d1dbe5;
    border-left: 1px solid #d1dbe5;
  }
  .common-table .common-table {
    border-top: none;
  }
  .check-cell {
    width: 70px;
  }
</style>
