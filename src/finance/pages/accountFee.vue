<template>
    <div class="common-tab-wraper common-container accountQuery contain">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'accountCost',
        props: [],
        components: {},
        data () {
            return {}
        },
        computed: {},
        methods: {},
        created () {
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
    .contain {
        padding: 10px 15px;
    }
</style>
