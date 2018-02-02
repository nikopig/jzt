<template>
  <div class="dtl-item">
    <div class="box-card-contain">
      <div class="box-card-content-item">
        <span>运单号：</span>
        <span class="textOverflow" :title="dtlData.BillTransport_No" v-text="dtlData.BillTransport_No"></span>
      </div>
      <div class="box-card-content-item">
        <span>业务单据号：</span>
        <span v-text="dtlData.Biz_Bill_No"></span>
      </div>
      <div class="box-card-content-item">
        <span>委托方订单号：</span>
        <span v-text="dtlData.c"></span>
      </div>
      <div class="box-card-content-item">
        <span>装车顺序：</span>
        <span v-text="dtlData.Transport_Order"></span>
      </div>
      <div class="box-card-content-item">
        <span>路线：</span>
         <span v-text="dtlData.Route_Name"></span>
      </div>
      <div class="box-card-content-item">
        <span>委托方：</span>
         <span class="textOverflow" :title="dtlData.Con_Name" v-text="dtlData.Con_Name"></span>
      </div>
      <div class="box-card-content-item">
        <span>客户：</span>
         <span v-text="dtlData.Ssa_Name"></span>
      </div>
      <div class="box-card-content-item">
        <span>商品类型：</span>
        <span v-text="dtlData.Goods_Type_Desc"></span>
      </div>
      <div class="box-card-content-item">
        <span>总体积：</span>
        <span v-text="dtlData.Gross_Volume"></span>
      </div>
      <div class="box-card-content-item">
        <span>总重量：</span>
        <span v-text="dtlData.Gross_Weight"></span>
      </div>
      <div class="box-card-content-item">
        <span>总金额：</span>
        <span v-text="dtlData.Gross_Amount"></span>
      </div>
      <div class="box-card-content-item">
        <span>总箱数：</span>
        <span v-text="dtlData.TotalBox_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>总件数：</span>
        <span v-text="dtlData.TotalPcs_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>整箱数：</span>
        <span v-text="dtlData.Fullload_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>拼箱数：</span>
        <span v-text="dtlData.Groupage_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>品规格：</span>
        <span v-text="dtlData.Goods_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>冷库药品数：</span>
        <span v-text="dtlData.Chilleddrug_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>贵重药品数：</span>
        <span v-text="dtlData.valuabledrug_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>进口药品：</span>
        <span v-text="dtlData.Importeddrug_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>精神药品：</span>
        <span v-text="dtlData.PsychotropicDrug_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>特管药品数：</span>
        <span v-text="dtlData.SpecialcontrolDrug_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>赠品数：</span>
        <span v-text="dtlData.Gift_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>其他药品：</span>
        <span v-text="dtlData.OtherDrug_Num"></span>
      </div>
      <div class="box-card-content-item">
        <span>接货时间：</span>
        <span class="textOverflow" :title="dtlData.Takegds_Time" v-text="dtlData.Takegds_Time"></span>
      </div>
      <div class="box-card-content-item">
        <span>起始地：</span>
        <span v-text="dtlData.StartName"></span>
      </div>
      <div class="box-card-content-item">
        <span>目的地：</span>
        <span v-text="dtlData.EndName"></span>
      </div>
      <div class="box-card-content-item">
        <span>时效：</span>
        <span v-text="dtlData.Time_Limit"></span>
      </div>
      <div class="box-card-content-item">
        <span>温层：</span>
        <span v-text="dtlData.Refrigeration_Type"></span>
      </div>
      <div class="box-card-content-item">
        <span>运输类型：</span>
        <span v-text="dtlData.Transport_Type"></span>
      </div>
      <div class="box-card-content-item">
        <span>顺序号：</span>
        <span v-text="dtlData.Seq_No"></span>
      </div>
      <div class="box-card-content-item">
        <span>运单运营方：</span>
        <span class="textOverflow" :title="dtlData.Operator_Name" v-text="dtlData.Operator_Name"></span>
      </div>
      <div class="box-card-content-item">
        <span>是否运费托收：</span>
        <span v-text="dtlData.Is_Takecharge"></span>
      </div>
      <div class="box-card-content-item">
        <span>托收金额：</span>
        <span v-text="dtlData.Takecharge_Amount"></span>
      </div>
      <div class="box-card-content-item">
        <span>是否回单：</span>
        <span v-text="filterTransHis(dtlData.Is_Receipt)"></span>
      </div>
      <div class="box-card-content-item">
        <span>是否现场打印：</span>
        <span v-text="filterTransHis(dtlData.Is_ScenePrint)"></span>
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
