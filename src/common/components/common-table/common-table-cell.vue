<template>
    <div
      class="common-table-cell"
      :style="cellWidth"
      :class="{ 'flex-item': isFlexItem, 'grid-line': gridLine,}"
    >
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'common-table-cell',
        props: {
          width: { // 单元格宽度
            type: Number,
            default: 0
          }
        },
        components: {},
        data () {
            return {}
        },
        computed: {
          gridLine () { // 是否显示网格
            let parent = this.$parent
            while (parent && parent.$options['_componentTag'] !== 'common-table') {
              parent = parent.$parent
            }
            return parent.gridLine
          },
          isFlexItem () { // 单元格是否设置flex：1
            return !this.width
          },
          cellWidth () { // 单元格固定宽度style（没有传入width则不设置）
            return this.isFlexItem ? {} : {width: this.width + 'px'}
          }
        },
        methods: {},
        created () {
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
  .common-table-cell {
    padding: 10px;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    a {
      text-decoration: none;
    }
  }
  .flex-item {
    flex: 1;
  }
  .grid-line {
    border-right: 1px solid #d1dbe5;
  }
</style>
