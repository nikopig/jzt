<template>
  <div>
    <common-step v-model="stepIndex" class="common-step-container padding-wraper"></common-step>
    <div class="padding-wraper">
      <keep-alive>
        <router-view class="planImportBody"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import commonStep from '@/common/components/common-step'
  import {mapState} from 'vuex'
//  import {AjaxFlowCalculateEx} from '@/common/js/utils'
  export default {
    name: '',
    components: {commonStep},
    props: [],
    data () {
      return {
        stepIndex: 1
      }
    },
    computed: {
      ...mapState(['Con_Id', 'Ldc_Id', 'Ssa_Id', 'Address_Id'])
    },
    methods: {},
    watch: {
      stepIndex (val) {
        switch (val) {
          case 1:
            this.$router.push('/unitInfo')
            break
          case 2:
//            if (!this.Con_Id || !this.Ldc_Id || !this.Ssa_Id) {
//              this.$message('请选择客户后点击下一步操作')
//              this.stepIndex = 1
//              return false
//            }
            this.$router.push('/goodInfo')
            break
          case 3:
            this.$router.push('/myOrder')
            break
          case 4:
            this.$router.push('/orderSum')
            break
        }
      },
      $route (val) {
        switch (val.name) {
          case 'unitInfo':
            this.stepIndex = 1
            break
          case 'goodInfo':
            this.stepIndex = 2
            break
          case 'myOrder':
            this.stepIndex = 3
            break
          case 'orderSum':
            this.stepIndex = 4
            break
        }
      }
    },
    created () {
//      AjaxFlowCalculateEx('CartStorageAdd', {
//        SSA_ID: '1',
//        GOOD_ID: '4',
//        OPERATOR_ID: '',
//        CON_ID: ''
//      })

      switch (this.$route.name) {
        case 'unitInfo':
          this.stepIndex = 1
          break
        case 'goodInfo':
          this.stepIndex = 2
          break
        case 'myOrder':
          this.stepIndex = 3
          break
        case 'orderSum':
          this.stepIndex = 4
          break
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
