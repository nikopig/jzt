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
                     DialogTitle="委托方"
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
          },
          isSetDefaultValue: {
            type: Boolean,
            default: true
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
                  title: '委托方名称',
                  field: 'Con_Name'
                },
                {
                  title: '运营商',
                  field: 'Operator_Name'
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
            this.getCon(false)
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
            this.getCon(false)
          },
          //获取对账单位
          getCon (setDefaultValueFlag) {
            this.gridData = []
            this.isLoaded = false
            let startIndex = (this.startPage - 1) * this.pageSize
            let params = {
              KeyWords: this.keyword ? '%' + this.keyword + '%' : '%',
              startIndex: startIndex,
              pageSize: this.pageSize,
              userId: Api.userInfo.USERID
            }
            Api.get('Fd_Consignor_New_Search_ByuserId', params)
              .then((res) => {
                this.isLoaded = true
                if (res.Flag) {
                  if (res.MsgInfo.length > 0) {
                    this.totalNum = res.MsgInfo[0].bigTotalItems
                    // 如果只有一条数据 则默认取这一条
                    if (setDefaultValueFlag) {
                      if (res.MsgInfo.length === 1) {
                        this.selectCon(res.MsgInfo[0])
                      }
                    }
                  } else {
                    this.totalNum = 0
                  }
                  this.gridData = res.MsgInfo
                  this.$emit('loaded', this.gridData[0])
                } else {
                  this.messageInfo(res.ErrInfo)
                }
              })
          },
          onPageChangeCon (num) {
            this.startPage = num
            this.getCon(false)
          },
          init () {
            this.getCon(this.isSetDefaultValue)
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
