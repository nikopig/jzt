<template>
  <div class="common-tab-wraper padding-wraper">
    <div class="common-container">
        <el-tabs v-model="activeName" @tab-click='notify'>
            <el-tab-pane label="入库审核" name="first">
              <div class="audit-wraper">
                <audit-axis @viewDetail="viewDetail" ref="child"></audit-axis>
              </div>
            </el-tab-pane>
            <el-tab-pane :disabled="true"></el-tab-pane>
            <el-tab-pane label="订单信息" name="second">
                <order-detail :params="params" :storageType="Storage_Type" :takegdsTime="Takegds_Time"></order-detail>
            </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>

<script>
    import auditAxis from '../components/entryAudit/auditAxis'
    import orderDetail from '../components/entryAudit/orderDetail'
    export default {
        name: 'entryAudit',
        components: {
            auditAxis,
            orderDetail
        },
        props: [],
        data () {
            return {
                activeName: 'first',
                Storage_Type: '1', // 入库类型
                Takegds_Time: '2017-09-25', // 到货时间
                params: {} // 入参对象
            }
        },
        methods: {
            notify () {         // 向子组件传递事件，为再次调用getData时间轴
              this.$refs.child.parentEvent()
            },
            // 查看订单详情
            viewDetail (playoad) {
              this.params = playoad
              this.activeName = 'second'
            }
        },
        created () {
        },
        computed: {}
    }
</script>
<style lang="less" scoped>
    .audit-wraper {
      padding: 25px 15px;
    }
</style>
