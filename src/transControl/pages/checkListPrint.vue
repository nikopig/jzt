<template>
  <div class="common-tab-wraper padding-wraper">
    <div class="common-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="当前订单" name="first">
              <div class="audit-wraper">
                <check-present></check-present>
              </div>
            </el-tab-pane>
            <el-tab-pane :disabled="true"></el-tab-pane>
            <el-tab-pane label="历史订单" name="second">
                <check-history></check-history>
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>

<script>
    import checkPresent from '../components/checkListPrint/checkPresent'
    import checkHistory from '../components/checkListPrint/checkHistory'
    export default {
        name: 'checkListPrint',
        components: {
            checkPresent,
            checkHistory
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
