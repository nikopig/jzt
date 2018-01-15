<!--Tips-->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--2.params（获取数据接口外部传入的参数，默认为{}）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->
<!--end-->

<template>
    <div v-loading.lock="isLoading">
      <common-modal  :total="totalNum"
                     :isVisible.sync="isVisible"
                     DialogTitle="商品信息"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectGood"
                     @search="onSearch"
                     @pageChange="onPageChangeGood"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'goodsModal',
        props: {
          visible: {
            default: false
          },
          params: {
            type: Object,
            default () {
              return {}
            }
          },
          transFields: {
            type: Array,
            default () {
              return []
            }
          }
        },
        components: {
          commonModal
        },
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
                  title: '商品名称',
                  field: 'Goods_Name'
                },
                {
                  title: '商品编号',
                  field: 'Goods_No'
                },
                {
                  title: '助记码',
                  field: 'Mnemonic_Code'
                }
              ]
            }
        },
        watch: {
          isVisible (val) {
            this.$emit('update:visible', val)
          },
          visible (val) {
            this.isVisible = val
          },
          params () {
            this.getGoods()
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
          selectGood (row) {
              this.$emit('change', row)
          },
          onSearch (keyword) {
            this.keyword = keyword
            this.getGoods()
          },
          //获取对账单位
          getGoods () {
            this.gridData = []
            this.isLoaded = false
            let params = {
              KeyWords: this.keyword,
              StartPage: (this.startPage - 1) * this.pageSize,
              EndPage: this.startPage * this.pageSize
            }
            params = Object.assign(params, this.params)
            Api.get('DS_KC_GetFdGoodsByKeyWords', params)
              .then((res) => {
                this.isLoaded = true
                this.gridData = res.MsgInfo
                if (this.gridData.length === 0) {
                  this.totalNum = 0
                } else {
                  this.totalNum = res.MsgInfo[0].TotalPage
                }
              })
          },
          onPageChangeGood (num) {
            this.startPage = num
            this.getGoods()
          },
          init () {
            debugger
            if (this.transFields.length > 0) {
              this.fields = this.transFields
            }
            this.getGoods()
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
