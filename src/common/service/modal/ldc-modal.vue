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
                     DialogTitle="物流中心"
                     :TableHeader="fields"
                     :listData="gridData"
                     @confirm="selectLdc"
                     @search="onSearch"
                     @pageChange="onPageChangeLdc"></common-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonModal from '@/common/components/common-modal'
    export default {
        name: 'ldcModal',
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
          ldcId: {
            type: String,
            default: '%'
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
                  title: '物流中心名称',
                  field: 'Ldc_Name'
                },
                {
                  title: '物流中心编号',
                  field: 'Ldc_No'
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
            this.getLdc()
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
          selectLdc (row) {
              this.$emit('change', row)
          },
          onSearch (keyword) {
            this.keyword = keyword
            console.log(this.keyword)
            this.getLdc()
          },
          //获取对账单位
          getLdc () {
            this.gridData = []
            this.isLoaded = false
            let params = {
              LDC_ID: '%',
              KeyWords: this.keyword,
              StartPage: (this.startPage - 1) * this.pageSize,
              EndPage: this.startPage * this.pageSize
            }
            params = Object.assign(params, this.params)
            Api.get('DS_KC_GetFdLogisticCentersByLdcId', params)
              .then((res) => {
                this.isLoaded = true
                this.gridData = res.MsgInfo
                if (this.gridData.length === 0) {
                  this.totalNum = 0
                } else {
                  this.totalNum = res.MsgInfo[0].TotalPage
                  if (this.ldcId && this.ldcId !== '%' && this.ldcId !== '') {
                    for (let item in this.gridData) {
                      if (this.gridData[item].Ldc_Id === this.ldcId) {
                        this.selectLdc(this.gridData[item])
                      }
                    }
                  }
                }
              })
          },
          onPageChangeLdc (num) {
            this.startPage = num
            this.getLdc()
          },
          init () {
            this.getLdc()
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
