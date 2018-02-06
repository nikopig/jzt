<template>
  <div class="dtl-item">
    <div class="box-card-contain">
      <!--商品名称-->

      <div class="box-card-content-item">
        <span>品规格：</span>
        <span v-text="dtlData.Goods_Num"></span>
      </div>
      <!--生产厂家 包装单位 包装数 结算金额 实际件数 实际零散数 实际数量-->

      <div class="box-card-content-item">
        <span>总体积：</span>
        <span v-text="dtlData.Gross_Volume"></span>
      </div>
      <div class="box-card-content-item">
        <span>总重量：</span>
        <span v-text="dtlData.Gross_Weight"></span>
      </div>
      <!--批号 生产日期 有效期 结算单价-->

      <div class="box-card-content-item">
        <span>温层：</span>
        <span v-text="dtlData.Refrigeration_Type"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import commonDialog from '@/common/components/common-dialog.vue'
  import Api from '@/common/js/api.js'
  export default{
    data () {
      return {
      }
    },
    //       明细对象，明细索引，汇总索引
    props: ['dtlData', 'dtlIndex', 'index'],
    computed: {
    },
    components: {
    },
    methods: {
      filterTransHis (value) {  //转换是否激活
        switch (value) {
          case 'Y':
            value = '是'
            break
          case 'N':
            value = '否'
            break
        }
        return value
      }
    },
    mounted: function () {
      console.log(this.dtlData, '父组件传过来的值')
    }
  }
</script>

<style lang="less">
  .dtl-item{
    /* table{
      width: 100%!important;
    } */
    .el-dialog{
      position: fixed;
      top: 8% !important;
    }
    &.checkedDtl{
      background-color: #f9fdff;
    }
  }
</style>
