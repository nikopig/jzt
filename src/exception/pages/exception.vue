<template>
  <div class="common-tab-wraper padding-wraper">
    <div class="common-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="客户资料" name="client">
                <!-- <client-data></client-data> -->
            </el-tab-pane>
            <el-tab-pane label="商品资料" name="goods">
                <!-- <goods-data></goods-data> -->
            </el-tab-pane>
            <el-tab-pane label="职员资料" name="staff">
                <!-- <staff-data></staff-data> -->
            </el-tab-pane>
            <el-tab-pane label="入库计划" name="entry">
                <!-- <entry-plan></entry-plan> -->
            </el-tab-pane>
            <el-tab-pane label="出库计划" name="out">
                <!-- <out-plan></out-plan> -->
            </el-tab-pane>
            <el-tab-pane label="运输计划" name="transport">
                <!-- <transport-plan></transport-plan> -->
            </el-tab-pane>
        </el-tabs>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
  </div>
</template>

<script>
   /* import clientData from '../components/exception/client/clientData'
    import goodsData from '../components/exception/goods/goodsData'
    import staffData from '../components/exception/staff/staffData'
    import entryPlan from '../components/exception/entry/entryData'
    import outPlan from '../components/exception/out/outData'
    import transportPlan from '../components/exception/transport/transportData'*/
    export default {
        name: 'exception',
        components: {
           /*clientData,
           goodsData,
           staffData,
           entryPlan,
           outPlan,
           transportPlan*/
        },
        props: [],
        data () {
            return {
                activeName: 'first'
            }
        },
        methods: {
            handleClick (tab, event) {
                this.$router.push(tab.name)
                /*this.$router.push({
                    name: tab.name,
                    params: {
                        id: tab.index
                    }
                })*/
            }
        },
        created () {}
    }
</script>
<style lang="less">
    /* .audit-wraper {
      padding: 45px 15px;
    } */
    .common-tab-wraper .el-tabs__nav .el-tabs__item {
        width: 16.667%;
    }
    .common-tab-wraper .el-tabs__nav .el-tabs__active-bar {
        left: 0;
    }
</style>
