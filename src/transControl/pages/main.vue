<template>
    <div class="common-container tansControl">
      <el-tabs class="head-tab" v-model="activeName">
        <el-tab-pane name="taskAudit" label="任务审核">
            <task-audit></task-audit>
        </el-tab-pane>
        <el-tab-pane name="transportAction" label="生成运单">
          <trasportAction></trasportAction>
        </el-tab-pane>
        <el-tab-pane name="consiAction" label="生成委托单">
          <consi-action></consi-action>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
    import taskAudit from '../components/taskAudit/mainList'
    import trasportAction from '../components/transportAction'
    import ConsiAction from '../components/consiAction'
    export default {
        name: 'transMain',
        props: [],
        components: {
            taskAudit,
            trasportAction,
            ConsiAction
        },
        data () {
            return {
              activeName: 'taskAudit'
            }
        },
        computed: {},
        methods: {},
        created () {
        },
        mounted () {
        }
    }
</script>
<style lang="less">
  .tansControl {
    padding: 10px 15px;
    .head-tab > .el-tabs__header{
        position: fixed;
        left: 15px;
        right: 15px;
        z-index: 10;
        background-color: #fff;
        &:after{
          content: '';
          position: absolute;
          height: 15px;
          background-color: #fff;
          left: 0;
          right: 0;
          bottom: -16px;
        }
        &:before {
          content: '';
          position: absolute;
          height: 10px;
          background-color: #fff;
          left: 0px;
          right: 0px;
          top: -10px;
          z-index:10;
        }
      }
  }
</style>
