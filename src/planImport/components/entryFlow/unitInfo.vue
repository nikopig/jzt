<template>
    <div class="common-container">
      <div class="custom-box">
        <div class="common-condition-box">
          <el-form :inline="true">
            <el-form-item label="委托方名称">
              <el-input v-model="consignor.Con_Name" placeholder="双击选择或手工录入" @dblclick.native="consignor.isVisible = true"></el-input>
            </el-form-item>
            <el-form-item label="物流中心地址">
              <el-input v-model="Address" placeholder="双击选择或手工录入" @dblclick.native="showDialog('commonDialog2')"></el-input>
            </el-form-item>
            <el-form-item label="入库类型">
              <el-select v-model="Storage_Type">
                  <el-option value="1" label="购进入库"></el-option>
                  <el-option value="2" label="销售退回"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位名称">
              <el-input v-model="unitName"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="common-input-box">
                <el-button type="primary" @click="unitChange" size="small">查询</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="common-blank"></div>
        <div class="container">
          <el-row :gutter="20">
            <el-col :span="4" v-for="(item, index) in coustomData" :key="index">
              <common-select-card @change="onChange(item.checked, index)" class="card-item" v-model="item.checked" :name="item.coustom.name" :card-data="item.coustom.cardData"></common-select-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <!--委托方弹框-->
      <consi-modal @change="confirm" :visible.sync="consignor.isVisible" :isSetDefaultValue="false"></consi-modal>
      <!--物流中心弹框-->
      <common-dialog ref='commonDialog2' :isPages="false" :DialogTitle='ldcTitle' :TableHeader='ldcDH' :listData ='ldcData' @confirm = 'confirm2'></common-dialog>
    </div>
</template>

<script>
    import commonSelectCard from '@/common/components/common-select-card.vue'
    import commonDialog from '@/common/components/common-dialog.vue'
    import consiModal from '@/common/service/modal/consi-modal'
    import {mapMutations} from 'vuex'
    import Api from '@/common/js/api.js'
    export default {
        name: 'unitInfo',
        props: [],
        components: {commonSelectCard, commonDialog, consiModal},
        data () {
            return {
              unitName: '',
              Con_Name: '',
              Address: '',
              Storage_Type: '1',
              origData: [],
              Consignor: {},
              Ldc: {},
              Ssa: {},
              consignorName: '',
              logisticsName: '',
              consignor: {
                isVisible: false,
                Con_Id: '',
                Con_Name: ''
              },
              ldcTitle: '物流中心信息',
              ldcDH: [
                {
                  title: '物流中心名称',
                  field: 'Ldc_Name',
                  width: 240
                },
                {
                  title: '联系人',
                  field: 'Contact_Name'
                },
                {
                  title: '联系人电话',
                  field: 'Contact_Phone',
                  width: 140
                },
                {
                  title: '物流中心编号',
                  field: 'Ldc_No',
                  width: 200
                },
                {
                  title: '助记码',
                  field: 'Mnemonic_Code',
                  width: 150
                },
                {
                  title: '地址',
                  field: 'Address',
                  width: 260
                }
              ],
              ldcData: []
            }
        },
        created () {
          this.origData.map((item, index) => {
            var temp = {}
            temp.name = item.Ssa_Name
            temp.cardData = [
              {
                icon: 'el-icon-mo-location',
                text: item.Address
              },
              {
                icon: 'el-icon-mo-contactPerson',
                text: '联系人：' + item.Contact_Name
              },
              {
                icon: 'el-icon-mo-contactPerson',
                text: '联系人电话：' + item.Contact_Phone
              }
            ]
            return temp
          })
        },
        computed: {
          coustomData () {
            return this.origData.map((item, index) => {
              var temp = {}
              temp.name = item.Ssa_Name
              temp.cardData = [
                {
                  icon: 'el-icon-mo-location',
                  text: item.Address
                },
                {
                  icon: 'el-icon-mo-contactPerson',
                  text: '联系人：' + item.Contact_Name
                },
                {
                  icon: 'el-icon-mo-contactNumber',
                  text: '联系人电话：' + item.Contact_Phone
                }
              ]
              item.coustom = temp
              return item
            })
          },
          selectUnit () {
          }
        },
        methods: {
          ...mapMutations({
            saveSelect: 'SAVE_SELECT'
          }),
          toNext () {
            if (!this.consignor.Con_Id) {
              this.$message('请先选择委托方')
              return false
            }
            if (!this.Ldc.Ldc_Id) {
              this.$message('请先选择物流中心')
              return false
            }
            if (!this.Ssa.Ssa_Id) {
              this.$message('请先选择客户')
              return false
            }
            // vuex中存入客户信息
            this.saveSelect({
              Ssa_Id: this.Ssa.Ssa_Id,
              Address_Id: this.Ssa.Address_Id,
              Storage_Type: this.Storage_Type
            })
            this.$router.push('/goodInfo')
          },
          // 选择状态改变
          onChange (isChecked, i) {
            // 保证单选
            if (isChecked) {
              this.origData = this.origData.map((item, index) => {
                if (index !== i) item.checked = false
                return item
              })
            }
            this.Ssa = this.getSelectSsa()
            if (isChecked) this.toNext()
          },
          // 获取选中的客户信息
          getSelectSsa () {
            var rel = this.origData.filter((item, index) => {
              return item.checked
            })
            if (rel.length === 0) return {}
            rel = rel[0]
            var temp = {}
            temp.Ssa_Name = rel.Ssa_Name
            temp.Ssa_Id = rel.Ssa_Id
            temp.Address = rel.Address
            temp.Address_Id = rel.Address_Id
            temp.Contact_Name = rel.Contact_Name
            temp.Contact_Phone = rel.Contact_Phone
            return temp
          },
          confirm2 (row) {
            if (row) {
              this.Ldc = row
              this.Address = this.Ldc.Address
            } else {
              this.Ldc = {}
              this.Address = ''
            }
            // vuex中存入物流中心信息
            this.saveSelect({
              Ldc_Id: this.Ldc.Ldc_Id,
              Ldc_Address_Id: this.Ldc.Address_Id
            })
            this.getSsaData()
          },
          confirm (rows) {
            this.consignor.Con_Id = rows.Con_Id
            this.consignor.Operator_Id = rows.Operator_Id
            this.consignor.Con_Name = rows.Con_Name
            // vuex中存入委托方信息
            this.saveSelect({
              Con_Id: this.consignor.Con_Id,
              Operator_Id: this.consignor.Operator_Id
            })
            this.getLcdByConsignorId(this.consignor.Con_Id)
          },
          unitChange () {
            this.getSsaData()
          },
          showDialog (ref) {
            this.$refs[ref].pihaoDialog = true
          },
          // 获取委托方下物流中心
          getLcdByConsignorId (conId) {
            var params = {
              Con_Id: conId,
              Ldc_Id: '%'
            }
            Api.get('GetLdcAddress', params)
              .then((resp) => {
                if (resp.Flag) {
                  // 当只有一个物流中心是默认带出
                  if (resp.MsgInfo.length === 1) {
                    this.confirm2(resp.MsgInfo[0])
                  } else if (resp.MsgInfo.length === 0) {
                    // 否则物流中心置空
                    this.confirm2(null)
                    this.messageInfo('该委托方下没有物流中心')
                  }
                  this.ldcData = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 获取客户信息
          getSsaData () {
            // 委托方id和物流中心id都存在的情况下才查数据
//            if (!this.consignor.Con_Id) {
//              this.$message('请先选择委托方')
//              return false
//            }
//            if (!this.Ldc.Ldc_Id) {
//              this.$message('请先选择物流中心')
//              return false
//            }
            if (!this.consignor.Con_Id || !this.Ldc.Ldc_Id) return false
            this.loadingWating = this.showLoading()
            var params = {
              Ssa_Name: this.unitName ? '%' + this.unitName + '%' : '%',
              Con_Id: this.consignor.Con_Id ? this.consignor.Con_Id : '%',
              Ldc_Id: this.Ldc.Ldc_Id ? this.Ldc.Ldc_Id : '%',
              Storage_Type: this.Storage_Type
            }
            this.origData = []
            Api.get('GetStorageSsa', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.origData = resp.MsgInfo.map(item => {
                    item.checked = false
                    return item
                  })
                  this.loadingWating.close()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          }
        },
        activated () {
          this.getSsaData()
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
