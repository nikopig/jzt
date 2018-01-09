<!-----------------------------Tips-------------------------------------------->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--2.params（获取数据接口外部传入的参数，默认为{}）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->


<template>
    <div v-loading.lock="isLoading">
      <common-modal  :total="totalNum"
                     :isVisible.sync="isVisible"
                     DialogTitle="运营商"
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
        name: 'operatorModal',
        props: {
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
              keyword: '%',
              isLoaded: false,
              isVisible: this.visible,
              gridData: [],
              startPage: 1, // 页码
              pageSize: 10, // 每页条数
              totalNum: 10, // 总条数
              fields: [
                {
                  title: '运营商名称',
                  field: 'Operator_Name'
                },
                {
                  title: '运营商编号',
                  field: 'Operator_No'
                },
                {
                  title: '助记码',
                  field: 'Mnemonic_Code'
                },
                {
                  title: '运营商id',
                  field: 'Operator_Id'
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
              PageSize: this.pageSize
            }
            params = Object.assign(params, this.params)
            Api.get('JlpGetOperatorZl', params)
              .then((res) => {
                this.isLoaded = true
                this.totalNum = res.MsgInfo[0].Sum_Cnt
                this.gridData = res.MsgInfo
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
