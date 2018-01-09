<template>
    <div class="common-table-row">
      <common-table-cell :width="40" v-if="selection">
        <el-checkbox></el-checkbox>
      </common-table-cell>
      <common-table-cell v-for="item in realRow">{{item}}</common-table-cell>
      <slot></slot>
    </div>
</template>

<script>
    import commonTableCell from '@/common/components/common-table/common-table-cell'
    export default {
        name: 'common-table-row',
        props: {
          row: {
            type: Object,
            default () {
              return {}
            }
          }
        },
        components: {commonTableCell},
        data () {
            return {}
        },
        computed: {
          props () {
            let parent = this.$parent
            while (parent && parent.$options['_componentTag'] !== 'common-table') {
              parent = parent.$parent
            }
            return parent.props
          },
          selection () {
            let parent = this.$parent
            while (parent && parent.$options['_componentTag'] !== 'common-table') {
              parent = parent.$parent
            }
            return parent.selection
          },
          realRow () {
            let temp = {}
            for (let p in this.props) {
              let key = this.props[p]
              if (key in this.row) temp[key] = this.row[key]
            }
            return temp
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
  .common-table-row {
    display: flex;
    border-bottom: 1px solid #d1dbe5;
  }
</style>
