<template>
    <div class="common-container">
      <div class="custom-box">
        <div class="common-condition-box">
          <el-form :inline="true">
            <el-form-item label="商品名称">
              <div class="common-input-box">
                <el-input v-model="goodName"></el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="onSearch(goodName)">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-blank"></div>
        <div class="container">
          <el-row :gutter="20">
            <el-col :span="4"  v-for="(item, index) in goodsData" :key="index">
              <common-select-card @change="onChange(item)" class="card-item" v-model="item.checked" :name="item.card.name" :card-data="item.card.cardData"></common-select-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="foot-bar">
        <div class="btns-content">
          <button type="button" class="el-button el-button--primary" @click="putinCar">
            <span>加入订单车</span>
          </button>
        </div>
      </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import commonSelectCard from '@/common/components/common-select-card.vue'
    import Api from '@/common/js/api.js'
    console.log(Api.userInfo)
    export default {
        name: 'goodInfo',
        props: [],
        components: {commonSelectCard},
        data () {
            return {
              origData: [],
              goodsId: [],
              goodName: ''
            }
        },
        computed: {
          ...mapState(['Con_Id', 'Ldc_Id', 'Ssa_Id', 'Address_Id', 'Ldc_Address_Id', 'Operator_Id']),
          goodsData () {
            return this.origData.map((item, index) => {
              var temp = {}
              temp.name = item.Goods_Name
              temp.cardData = [
                {
                  icon: item.Business_Model_Desc === '仓储' ? 'el-icon-mo-businessType2' : 'el-icon-mo-businessType1',
                  text: '业务类型：' + item.Business_Model_Desc
                },
                {
                  icon: 'el-icon-mo-packingNumber',
                  text: '包装数：' + item.Package_Qty
                },
                {
                  icon: 'el-icon-mo-packingUnit',
                  text: '包装单位：' + item.Package_Unit
                },
                {
                  icon: 'el-icon-mo-drugSpecifications',
                  text: '药品规格：' + item.Drug_Spec
                },
                {
                  icon: 'el-icon-mo-temperatureLayer',
                  text: '温层：' + item.Refrigeration_Type_Desc
                },
                {
                  icon: 'el-icon-mo-manufacturer',
                  text: '生产厂家：' + item.Manufacturer
                }
              ]
              item.card = temp
              return item
            })
          },
          selectData () {
            console.log(this.Ldc_Address_Id)
            console.log(this.Address_Id)
            return this.goodsId.map((item) => {
              var temp = {}
              temp.Con_Id = this.Con_Id
              temp.Ssa_Id = this.Ssa_Id
              temp.StorageAddress_Id = this.Ldc_Address_Id
              temp.SsaAddress_Id = this.Address_Id
              temp.Ldc_Id = this.Ldc_Id
              temp.Operator_Id = this.Operator_Id
              temp.Goods_Id = item
              temp.Operator = Api.userInfo.USERID
              return temp
            })
          }
        },
        watch: {
          goodsData (val) {
            console.error(val)
          }
        },
        methods: {
          putinCar () {
            if (this.selectData.length === 0) {
              this.messageInfo('请先选择商品')
              return false
            }
            this.loadingWating = this.showLoading('正在提交...')
            this.StoreCartAdd()
              .then((resp) => {
                this.loadingWating.close()
                if (resp.Flag) {
                  this.$router.push('/myOrder')
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          onChange (val) {
            let pos = this.goodsId.indexOf(val.Goods_Id)
            if (val.checked) {
              if (pos === -1) this.goodsId.push(val.Goods_Id)
            } else {
              if (pos !== -1) this.goodsId.splice(pos, 1)
            }
          },
          // 加入订单车
          StoreCartAdd () {
            var jsonStr = JSON.stringify(this.selectData)
            var params = {
              'list_params': jsonStr
            }
            return Api.post('StoreCartAdd', params)
          },
          // 检索商品
          GetStorageGoods () {
            var params = {
              Goods_Name: '%' + this.goodName + '%',
              Con_Id: this.Con_Id ? this.Con_Id : '%',
              Ldc_Id: this.Ldc_Id ? this.Ldc_Id : '%'
            }
            this.loadingWating = this.showLoading()
            Api.get('GetStorageGoods', params)
              .then((resp) => {
                this.loadingWating.close()
                if (resp.Flag) {
                  this.origData = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 关键字检索
          onSearch (keyWord) {
            this.GetStorageGoods(keyWord)
          },
          init () {
            // this.goodName = ''
            this.GetStorageGoods()
          }
        },
        created () {
        },
        activated () {
          this.init()
        }
    }
</script>
<style lang="less" scoped>
  .custom-box {
  .container {
    padding: 20px 30px;
  .card-item {
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  }
  }
</style>
