<template>
    <div class="common-table-head" :style="headStyle">
      <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'common-table-head',
        props: [],
        components: {},
        data () {
            return {}
        },
        computed: {
          headStyle () {
            let parent = this.$parent
            while (parent && parent.$options['_componentTag'] !== 'common-table') {
              parent = parent.$parent
            }
            return parent.headStyle
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
  .common-table-head {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #d1dbe5;
    background-color: #EAEEF4;
  }
</style>
