<template>
    <div>
        <div class="headbar">
            <div class="common-row">
                <label>当前位置：</label>
                <div class="common-col">
                    <el-breadcrumb separator="/">
                       <el-breadcrumb-item @click.native="goBack(-1)">{{breadcrumbItems.name}}</el-breadcrumb-item>
                       <el-breadcrumb-item>详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
        </div>
        <div class="table-box" v-show="istransaction==='first'">
            <el-table :data="stockData" style="width: 100%">
                <el-table-column prop="kfwc" label="日期"></el-table-column>
                <el-table-column prop="kfnumber" label="库存总件数"></el-table-column>
                <el-table-column prop="zyhwz" label="入库件数"></el-table-column>
                <el-table-column prop="zyhwl" label="入库托盘数"></el-table-column>
                <el-table-column prop="lkhw" label="入库条目数"></el-table-column>
                <el-table-column prop="lkhw" label="出库件数"></el-table-column>
                <el-table-column prop="lkhw" label="出库托盘数"></el-table-column>
                <el-table-column prop="lkhw" label="出库条目数"></el-table-column>
                <el-table-column prop="lkhw" label="扫码数(总)"></el-table-column>
                <el-table-column prop="lkhw" label="扫码数(整)"></el-table-column>
                <el-table-column prop="lkhw" label="扫码数(零)"></el-table-column>
            </el-table>
        </div>
        <div class="table-box" v-show="istransaction!=='first'">
            <el-table :data="stockData" style="width: 100%">
                <el-table-column prop="kfwc" label="日期"></el-table-column>
                <el-table-column prop="kfnumber" label="库房温度"></el-table-column>
                <el-table-column prop="zyhwz" label="库房件数"></el-table-column>
                <el-table-column prop="zyhwl" label="占用货位(整)"></el-table-column>
                <el-table-column prop="lkhw" label="占用货位(零)"></el-table-column>
                <el-table-column prop="lkhw" label="立库货位"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'busiDetailList',
        props: [],
        components: {},
        data () {
            return {
                routeName: '',
                istransaction: '',  //判断是否是业务类型还是库存类型
                breadcrumbItems: {
                  name: ''
                },
                stockData: []
            }
        },
        computed: {},
        methods: {
            goBack (step) {     // 回退
                this.$router.go(step)
            },
            init () {
                this.routeName = this.$route.params.activeName
                console.log(this.$route.params)
                if (this.routeName === 'first') {
                    this.istransaction = 'first'
                    this.breadcrumbItems.name = '业务数据'
                } else if (this.routeName === 'second') {
                    this.istransaction = false
                    this.breadcrumbItems.name = '库存数据'
                }
            }
        },
        created () {
        },
        /*mounted () {
            this.init()
        },*/
        activated () {
          this.init()
        }
    }
</script>
<style lang="less" scoped>
</style>
