<!-----------------------------Tips-------------------------------------------->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--1.gid（商品id）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->
<!----------------------------------------------------------------------------->

<template>
    <div v-loading.lock="isLoading">
      <common-modal  :isPages="false"
                     :total="totalNum"
                     :isVisible.sync="isVisible"
                     DialogTitle="商品批号"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectCon"
                     @search="onSearch"
                     @pageChange="onPageChangeCon"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'lotnoModal',
        props: {
          visible: {
            default: false
          },
          // 0入库 1出库
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
                  title: '批号',
                  field: 'Goods_Lotno'
                }, {
                  title: '生产日期',
                  field: 'Production_Date'
                }, {
                  title: '有效期至',
                  field: 'Valid_Until'
                }, {
                  title: '库存数量',
                  field: 'Stock_Quantity'
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
         }
       },
        methods: {
          //对账单位弹出框选择
          selectCon (row) {
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
            let interFace = this.type === 0 ? 'GetLotnoInfos' : 'GetStockLotInfos'
            let params = {
              Goods_Lotno: this.keyword ? '%' + this.keyword + '%' : '%'
            }
            Object.assign(params, this.params)
            Api.get(interFace, params)
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
            if (this.params) {
              this.getCon()
            }
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
