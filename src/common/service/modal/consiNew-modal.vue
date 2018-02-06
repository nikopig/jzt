<!--属性：-->
<!--1.visible（控制弹框的开关，支持sync修饰符，默认值false）-->
<!--2.params（获取数据接口外部传入的参数，默认为{}）-->
<!--3.showDefault（设置弹框的默认值） -->
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
        name: 'consiNewModal',
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
          Operator_Id: {
            default: ''
          },
          showDefault: {
            type: Boolean,
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
              startPage: 1, // 页码
              pageSize: 10, // 每页条数
              totalNum: 10, // 总条数
              fields: [
                {
                  title: '委托方编号',
                  field: 'Con_No'
                },
                {
                  title: '委托方名称',
                  field: 'Con_Name'
                },
                {
                  title: '委托方助记码',
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
          //弹出框选择
          selectCon (row) {
              this.$emit('change', row)
          },
          onSearch (keyword) {
            this.keyword = keyword
            this.getCon()
          },
          //获取
          getCon () {
            this.gridData = []
            this.isLoaded = false
            let startIndex = (this.startPage - 1) * this.pageSize
            let params = {
              KeyWords: this.keyword ? this.keyword : '',
              startIndex: startIndex,
              pageSize: this.pageSize,
              Operator_Id: this.Operator_Id ? ',' + this.Operator_Id + ',' : ',,'
            }
            params = Object.assign(params, this.params)
            Api.get('FDConsignor_Search_By_Operator_Id_List', params)
              .then((res) => {
                this.isLoaded = true
                if (res.MsgInfo.length > 0) {
                  this.totalNum = res.MsgInfo[0].bigTotalItems
                } else {
                  this.totalNum = 0
                }
                this.gridData = res.MsgInfo
                if (this.showDefault) {
                  this.$emit('change', res.MsgInfo[0])
                }
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
