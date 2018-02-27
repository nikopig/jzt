<template>
    <div class="common-container">
      <common-side-menu></common-side-menu>
    </div>
</template>

<script>
    import commonSideMenu from '@/common/components/common-side-menu'
    export default {
        name: 'home',
        props: [],
        components: {commonSideMenu},
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
</style>
