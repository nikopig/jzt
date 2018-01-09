<!-----------------------------Tips-------------------------------------------->
<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--事件：-->
<!--1.change（选择一条数据单击，传入参数是该条数据对象）-->
<!----------------------------------------------------------------------------->

<template>
    <div v-loading.lock="isLoading">
      <common-modal  :isVisible.sync="isVisible"
                     :is-pages="false"
                     DialogTitle="固定运营商"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectCon"
                     @search="onSearch"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'fixoperatorModal',
        props: {
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
                  title: '运营商编号',
                  field: 'Operator_No',
                  width: 160
                },
                {
                  title: '运营商名称',
                  field: 'Operator_Name',
                  width: 250
                },
                {
                  title: '地址',
                  field: 'Address',
                  width: 200
                },
                {
                  title: '联系人',
                  field: 'Contact_Name'
                },
                {
                  title: '电话',
                  field: 'Contact_Phone',
                  width: 150
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
            Api.get('TMP_TransportTaskScheding_GetOper', {})
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
