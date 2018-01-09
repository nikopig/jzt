<template>
  <div class="common-tab-wraper common-container foundQuery">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
    export default {
        name: 'foundQuery',
        props: [],
        data () {
            return {
              diecType: '10'
            }
        },
        computed: {},
        methods: {
          init () {
            this.diecType = this.$route.params.diecType
          }
        },
        created () {
          this.init()
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
  .accountQuery {
    padding: 0 30px;
  }
</style>
