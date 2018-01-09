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
                     DialogTitle="地址选择"
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
        name: 'addressModal',
        props: {
          ssaId: {
            default: ''
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
                  title: '联系人',
                  field: 'Contact_Name'
                },
                {
                  title: '联系电话',
                  field: 'Contact_Phone'
                },
                {
                  title: '详细地址',
                  field: 'Address'
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
          ssaId () {
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
            let params = {
              All_Id: this.ssaId
            }
            Api.get('TMP_TransportTaskScheding_GetAddress', params)
              .then((res) => {
                if (res.Flag) {
                  this.gridData = res.MsgInfo
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
