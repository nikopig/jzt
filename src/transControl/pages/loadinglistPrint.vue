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
    import GridReport from '@/common/js/GridReport'
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
        computed: {},
        mounted () {
            try {
                GridReport.Install_InsertReport()//插入一个报表对象，其实是在页面加入一个：<object></object>这样的对象标签，方便创建报表对象
                //var isInstall = GridReport.Install_Detect();//用来判断插件是否已经安装，或是否需要安装更新版本。如果插件已经安装且也不要更新，则返回 true，反之为 false。
                //if (isInstall) {
                    //GridReport.CreateReport("Report");
                    //console.log("report init success");
                //}
                GridReport.CreateReport('Report')
            } catch (e) {
                this.$alert('提示', '报表初始化错误，' + e.message, 'error')
            }
        }
    }
</script>
<style lang="less" scoped>
    .audit-wraper {
      //padding: 25px 15px;
    }
</style>
