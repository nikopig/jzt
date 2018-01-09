<template>
  <div id="app">
    <div class="main">
      <!--<el-menu class="sidebar" :collapse="isCollapse">-->
          <!--<el-menu-item index="1" @click.native="goRouter(1)">-->
            <!--<i class="el-icon-setting"></i>-->
            <!--<span slot="title">财务流水</span>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="2" @click.native="goRouter(2)">-->
            <!--<i class="el-icon-date"></i>-->
            <!--<span slot="title">财务对账</span>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="3" @click.native="goRouter(3)">-->
            <!--<i class="el-icon-message"></i>-->
            <!--<span slot="title">委托方审核</span>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="4" @click.native="goRouter(4)">-->
            <!--<i class="el-icon-picture"></i>-->
            <!--<span slot="title">承运方审核</span>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="5" @click.native="onCollapse">-->
            <!--<i class="el-icon-plus"></i>-->
            <!--<span slot="title">收起菜单</span>-->
          <!--</el-menu-item>-->
        <!--</el-menu>-->
      <div class="mainbody">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return {
      isCollapse: true
    }
  },
  methods: {
    onCollapse () {
      this.isCollapse = !this.isCollapse
    },
    goRouter (index) {
      switch (index) {
        case 1:
          this.$router.push('/10')
          break
        case 2:
          this.$router.push('/accountBalance/10')
          break
        case 3:
          this.$router.push('/conAudit/10/2')
          break
        case 4:
          this.$router.push('/cariAudit/20/2')
          break
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
    @import '../common/style/less/common.less';
    @import '../common/style/less/respone.less';
    #app {
      width: 100%;
    }
</style>
