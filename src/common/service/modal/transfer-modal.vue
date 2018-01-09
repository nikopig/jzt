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
                     DialogTitle="收件人"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectTransfer"
                     @search="onSearch"
                     @pageChange="onPageChangeTransfer"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'transferModal',
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
                  title: '姓名',
                  field: 'Staff_Name'
                },
                {
                  title: '电话',
                  field: 'Mobilephone'
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
            this.getTransfer()
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
          selectTransfer (row) {
              this.$emit('change', row)
          },
          onSearch (keyword) {
            this.keyword = keyword
            this.getTransfer()
          },
          //获取对账单位
          getTransfer () {
            this.gridData = []
            this.isLoaded = false
            let params = {
              userId: Api.userInfo.USERID,
              KeyWords: this.keyword,
              startIndex: (this.startPage - 1) * this.pageSize,
              pageSize: this.pageSize
            }
            params = Object.assign(params, this.params)
            Api.get('TMP_Fd_Staff_HDHC', params, true)
              .then((res) => {
                this.isLoaded = true
                this.gridData = res.MsgInfo

                if (this.gridData.length === 0) {
                  this.totalNum = 0
                } else {
                  this.totalNum = res.MsgInfo[0].bigTotalItems
                }
              })
          },
          onPageChangeTransfer (num) {
            this.startPage = num
            this.getTransfer()
          },
          init () {
            this.getTransfer()
          }
        },
        created () {
        },
        mounted () {
        },
        activated () {
          this.init()
        }
    }
</script>
<style lang="less" scoped>
</style>
