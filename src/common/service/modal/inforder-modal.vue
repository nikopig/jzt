<!-----------------------------Tips-------------------------------------------->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--2.type（传10获取委托方和下游客户数据，传20获取承运方数据，默认值10）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->
<!----------------------------------------------------------------------------->

<template>
    <div v-loading.lock="isLoading">
      <common-modal  :isVisible.sync="isVisible"
                     :total="totalNum"
                     DialogTitle="单号选择"
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
        name: 'inforderModal',
        props: {
          type: {
            default: '10'
          },
          visible: {
            default: false
          }
        },
        components: {commonModal},
        data () {
            return {
              keyword: '',
              isLoaded: false,
              isVisible: this.visible,
              gridData: [],
              totalNum: 0,
              startPage: 1, // 页码
              pageSize: 10, // 每页条数
              fields: [
                {
                  title: '委托方名称',
                  field: 'Con_Name'
                },
                {
                  title: '商品名称',
                  field: 'Goods_Name'
                },
                {
                  title: '客户名称',
                  field: 'Ssa_Name'
                },
                {
                  title: '助记码',
                  field: 'Mnemonic_Code'
                },
                {
                  title: '委托单号',
                  field: 'ConOrder_No'
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
          type (val) {
            if (!val) return false
            this.getCon()
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
          //获取对账单位
          getCon () {
            this.gridData = []
            this.isLoaded = false
            let startIndex = (this.startPage - 1) * this.pageSize
            let params = {
              Search_Item: this.keyword !== undefined ? '%' + this.keyword + '%' : '%',
              StartIndex: startIndex,
              PageSize: this.pageSize
            }
            Api.get('JlpBillInfos', params)
              .then((res) => {
                if (res.Flag) {
                  this.gridData = res.MsgInfo
                  if (res.MsgInfo.length > 0) {
                    this.totalNum = res.MsgInfo[0].Sum_Cnt
                    this.totalNum = this.totalNum > 300 ? 300 : this.totalNum
                  } else {
                    this.totalNum = 0
                  }
                } else {
                  this.messageInfo(res.ErrInfo)
                }
                this.isLoaded = true
              })
          },
          onPageChangeCon (num) {
            this.startPage = num
            this.getCon()
          },
          init () {
            this.getCon()
          }
        },
        mounted () {
          this.init()
        },
        activated () {
        }
    }
</script>
<style lang="less" scoped>
</style>
