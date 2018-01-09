<template>
    <div class="orderDetail">
        <div class="orderDetailList">
            <h1>Hellow World</h1>
        </div>
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import entryInfo from './entryInfo.vue'
    export default {
        components: {
            entryInfo
        },
        data () {
            return {}
        },
        activated () {
            console.log(4)
        }
    }
</script>

<style lang='less'>
</style>