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
                     DialogTitle="承运商"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectCarrier"
                     @search="onSearch"
                     @pageChange="onPageChangeCarrier"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'carrierModal',
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
                  title: '承运商名称',
                  field: 'Carrier_Name'
                },
                {
                  title: '承运商编号',
                  field: 'Carrier_No'
                },
                {
                  title: '助记码',
                  field: 'Mnemonic_Code'
                },
                {
                  title: '所属运营商',
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
          params () {
            this.getCarrier()
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
          selectCarrier (row) {
              this.$emit('change', row)
          },
          onSearch (keyword) {
            this.keyword = keyword
            this.getCarrier()
          },
          //获取对账单位
          getCarrier () {
            this.gridData = []
            this.isLoaded = false
            let params = {
              //Carrier_Id: ',274cf35ecaace711b639000c29d6c8f4,',
              Carrier_Id: ',' + Api.userInfo.Carrier_Id + ',',
              startIndex: (this.startPage - 1) * this.pageSize,
              pageSize: this.pageSize
            }
            params = Object.assign(params, this.params)
            Api.get('TmpCSNGetFdCarrier', params)
              .then((res) => {
                this.isLoaded = true
                this.gridData = res.MsgInfo
                if (this.gridData.length === 0) {
                  this.totalNum = 0
                  this.selectCarrier({})
                } else {
                  this.totalNum = res.MsgInfo[0].bigTotalItems
                  this.selectCarrier(this.gridData[0])
                }
              })
          },
          onPageChangeCarrier (num) {
            this.startPage = num
            this.getCarrier()
          },
          init () {
            this.getCarrier()
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
