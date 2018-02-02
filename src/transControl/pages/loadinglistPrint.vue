<template>
  <div class="common-tab-wraper padding-wraper">
    <div class="common-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="装车单当前" name="first">
              <div class="audit-wraper">
                <load-present></load-present>
              </div>
            </el-tab-pane>
            <el-tab-pane :disabled="true"></el-tab-pane>
            <el-tab-pane label="装车单历史" name="second">
                <load-history></load-history>
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>

<script>
    import loadPresent from '../components/loadinglistPrint/loadPresent'
    import loadHistory from '../components/loadinglistPrint/loadHistory'
    export default {
        name: 'loadinglistPrint',
        components: {
            loadPresent,
            loadHistory
        },
        props: [],
        data () {
            return {
                activeName: 'first'
            }
        },
        methods: {
        },
        created () {
        },
        computed: {}
    }
</script>
<style lang="less" scoped>
    .audit-wraper {
      //padding: 25px 15px;
    }
</style>
