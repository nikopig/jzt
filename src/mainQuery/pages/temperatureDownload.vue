<template>
    <div class="temperatureDownload contain">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'temperatureDownload',
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
<style lang="less">
  .temperatureDownload {
    &.contain {
      padding: 20px;
    }

  }
</style>
