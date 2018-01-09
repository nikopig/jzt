<template>
      <!--子路由-->
      <div class="common-container">
        <keep-alive>
           <router-view></router-view>
        </keep-alive>
      </div>
     
</template>

<script>
    export default {
        name: 'consiOrder',
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
</style>
