<template>
  <div class="account-settle common-container">
    <el-tabs v-model="activeName" @tab-click="changeTab">
      <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in tabPans" :key="index"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        diecType: '',
        tabPans: []
      }
    },
    methods: {
      changeTab (tab, event) {
        this.$router.push({name: tab.name})
      }
    },
    computed: {
      activeName: {
        get: function () {
          return this.$route.name
        },
        set: function (newValue) {
        }
      }
    },
    mounted () {
      this.diecType = this.$route.params.diecType
    },
    watch: {
      '$route' (to, from) {
        this.diecType = to.params.diecType
      },
      'diecType' () {
        if (this.diecType === '20') {
          this.tabPans = [{
            label: '应付结算',
            name: 'handle'
          }, {
            label: '应付撤销',
            name: 'handleCancel'
          }, {
            label: '其它应收结算',
            name: 'otherHandle'
          }]
        }
        if (this.diecType === '10') {
          this.tabPans = [{
            label: '应收结算',
            name: 'handle'
          }, {
            label: '应收撤销',
            name: 'handleCancel'
          }, {
            label: '其它应付结算',
            name: 'otherHandle'
          }]
        }
      }
    }
  }
</script>
<style lang="less">
  .account-settle {
    .el-tabs {
      background-color: #fff;
    }
    .el-tabs__nav {
      width: 100%;
      text-align: center;
      .el-tabs__item {
        width: 30%;
      }
      .el-tabs__active-bar {
        left: 5%;
      }
    }
    .el-tabs__content {
      margin-top: 21px;
    }
  }
</style>
