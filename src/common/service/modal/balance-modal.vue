<!-----------------------------Tips-------------------------------------------->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--2.type（传10获取委托方和下游客户数据，传20获取承运方数据，默认值10）-->
<!--3.params（获取数据接口外部传入的参数，默认为{}）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->
<!----------------------------------------------------------------------------->

<template>
    <div v-loading.lock="isLoading">
      <common-modal  :isVisible.sync="isVisible"
                     :total="totalNum"
                     DialogTitle="对账单位"
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
        name: 'balanceModal',
        props: {
          type: {
            default: '10'
          },
          visible: {
            default: false
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
              keyword: '',
              isLoaded: false,
              isVisible: this.visible,
              gridData: [],
              totalNum: 0,
              startPage: 1, // 页码
              pageSize: 10, // 每页条数
              fields: [
                {
                  title: '类型',
                  field: 'Type_Name'
                },
                {
                  title: '单位名称',
                  field: 'MINGCHENG'
                },
                {
                  title: '助记码',
                  field: 'ZHUJM'
                },
                {
                  title: '单位编号',
                  field: 'SYSNO'
                },
                {
                  title: '运营商',
                  field: 'Operator_Name'
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
          },
          params () {
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
              Danw_Name: this.keyword ? '%' + this.keyword + '%' : '%',
              StartIndex: startIndex,
              PageSize: this.pageSize,
              Sys_Type: this.type
            }
            params = Object.assign(params, this.params)
            Api.get('JlpGetSettleZl', params)
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
