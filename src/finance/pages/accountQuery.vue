<template>
  <div class="common-tab-wraper common-container accountQuery">
    <el-tabs v-model="activeName">
      <el-tab-pane :label=accountAccept name="first">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane :disabled="true"></el-tab-pane>
      <el-tab-pane :label=accountOther name="second">
        <other-list></other-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import otherList from '../components/accountQuery/otherList'
    export default {
        name: 'accountQuery',
        props: [],
        components: {otherList},
        data () {
            return {
              activeName: 'first',
              diecType: '10'
            }
        },
        computed: {
          accountAccept () {
            return this.$route.params.diecType === '10' ? '应收流水' : '应付流水'
          },
          accountOther () {
            return this.$route.params.diecType === '10' ? '其他应收' : '其他应付'
          }
        },
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
