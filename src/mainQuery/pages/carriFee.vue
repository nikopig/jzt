<template>
    <div class="carriFee">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'carriFee',
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
  .carriFee {
    .headbar {
      padding-top: 15px;
    }
  }
</style>
