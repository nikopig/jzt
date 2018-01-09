<!-----------------------------Tips-------------------------------------------->
<!--出库单号&&入库单号-->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--2.params（获取数据接口外部传入的参数，默认为{}）-->
<!--3.type（出库入库类型，0为出库，1为入库，默认是0）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->
<!----------------------------------------------------------------------------->

<template>
    <div v-loading.lock="isLoading">
      <common-modal  :isPages="false"
                     :total="totalNum"
                     :isVisible.sync="isVisible"
                     :DialogTitle="DialogTitle"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectCon"
                     @search="onSearch"
                     @pageChange="onPageChangeCon"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import {isEmpty} from '@/common/js/utils.js'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'outnoModal',
        props: {
          visible: {
            default: false
          },
          type: {
            type: Number,
            default: 0
          },
          params: {
            type: Object,
            default () {
              return {}
            }
          }
        },
        components: {commonModal},
        data () {
            return {
              keyword: '%',
              isLoaded: false,
              isVisible: this.visible,
              gridData: [],
              startPage: 1, // 页码
              pageSize: 10, // 每页条数
              totalNum: 10, // 总条数
              fields: [
                {
                  title: this.type === 0 ? '出库单号' : '入库单号',
                  field: this.type === 0 ? 'Outstorebill_No' : 'Businessbill_No'
                }, {
                  title: '商品名称',
                  field: 'Goods_Name'
                }, {
                  title: '商品批号',
                  field: this.type === 0 ? 'Lot_No' : 'Goods_Lotno'
                }, {
                  title: '生产日期',
                  field: 'Production_Date'
                }, {
                  title: '有效期',
                  field: 'Valid_Until'
                }, {
                  title: this.type === 0 ? '出库数量' : '入库数量',
                  field: 'Actual_Qty'
                }
              ]
            }
        },
        watch: {
          isVisible (val) {
            this.$emit('update:visible', val)
            if (val) this.getCon()
          },
          visible (val) {
            this.isVisible = val
          }
        },
       computed: {
         isLoading () {
           if (this.isVisible && !this.isLoaded) return true
           return false
         },
         interFace () {
           return this.type === 0 ? 'GetOutGoodLotno' : 'GetStoageGoodLotno'
         },
         DialogTitle () {
           return this.type === 0 ? '出库单号' : '入库单号'
         }
       },
        methods: {
          //对账单位弹出框选择
          selectCon (row) {
              if (this.type === 0) row.Goods_Lotno = row.Lot_No
              this.$emit('change', row)
          },
          onSearch (keyword) {
            this.keyword = keyword
            this.getCon()
          },
          //获取批号信息
          getCon () {
            this.gridData = []
            this.isLoaded = false
            if (this.params.Con_Id === undefined || this.params.Goods_Id === undefined || this.params.Ssa_Id === undefined) {
              throw Error('出库单号应传入委托方id，商品id和客户id')
            }
            Api.get(this.interFace, this.params)
              .then((res) => {
                this.isLoaded = true
                if (res.Flag) {
                  if (res.MsgInfo.length > 0) {
                    this.totalNum = res.MsgInfo[0].bigTotalItems
                    // 如果只有一条数据 则默认取这一条
                    if (res.MsgInfo.length === 1) {
                      this.selectCon(res.MsgInfo[0])
                    }
                  } else {
                    this.totalNum = 0
                  }
                  this.gridData = res.MsgInfo
                } else {
                  this.messageInfo(res.ErrInfo)
                }
              })
          },
          onPageChangeCon (num) {
            this.startPage = num
            this.getCon()
          },
          init () {
            if (isEmpty(this.params)) return false
            this.getCon()
          }
        },
        created () {
          this.init()
        },
        mounted () {
        },
        activated () {
        }
    }
</script>
<style lang="less" scoped>
</style>
