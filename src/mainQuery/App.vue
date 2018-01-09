<template>
  <div id="app" class="common-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="less">
    @import '../common/style/less/common.less';
    @import '../common/style/less/respone.less';
</style>
