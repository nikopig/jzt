<template>
  <div class="dtl-item" :class="{checkedDtl: dtlData.isChecked && operate != 'add' && disable == true}">
    <div class="box-card-contain">
      <div class="box-card-content-item">
        <span>商品名称：</span>
        <el-input v-if="operate === 'add'" :disabled="isDisabled" v-model="dtlData.Goods_Name" placeholder="双击选择商品" @dblclick.native="showDialog('2', 'goodsInfo', dtlData, objData)"></el-input>
        <span v-text="dtlData.Goods_Name" v-else></span>
      </div>
      <div class="box-card-content-item">
        <span>温层：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Refrigeration_Type_Desc"></el-input> -->
        <span v-text="dtlData.Refrigeration_Type_Desc"></span>
      </div>
      <div class="box-card-content-item">
        <span>体积：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Total_Volume"></el-input> -->
        <span v-text="dtlData.Total_Volume"></span>
      </div>
      <div class="box-card-content-item">
        <span>重量：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Total_Weight"></el-input> -->
        <span v-text="dtlData.Total_Weight"></span>
      </div>
      <div class="box-card-content-item">
        <span>药品规格：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Drug_Spec"></el-input> -->
         <span v-text="dtlData.Drug_Spec"></span>
      </div>
      <div class="box-card-content-item">
        <span>生产厂家：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Manufacturer"></el-input> -->
         <span v-text="dtlData.Manufacturer"></span>
      </div>
      <div class="box-card-content-item">
        <span>包装单位：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Package_Unit"></el-input> -->
         <span v-text="dtlData.Package_Unit"></span>
      </div>
      <div class="box-card-content-item">
        <span>商品批号：</span>
        <!-- <el-input v-if="operate === 'add'" :disabled="isDisabled" placeholder="双击选择批号"  @dblclick.native="showDialog('3', 'goodsLotno', dtlData, objData)" v-model="dtlData.Goods_Lotno"></el-input>
        <span v-text="dtlData.Goods_Lotno" v-else></span> -->
        <el-input :disabled="isDisabled" placeholder="双击选择批号"  @dblclick.native="showDialog('3', 'goodsLotno', dtlData, objData)" v-model="dtlData.Goods_Lotno" icon="close" :on-icon-click="deleLoto"></el-input>
        <!-- <el-input v-if="operate === 'add' && objData.Storage_Type === '1'" :disabled="isDisabled" placeholder="双击选择批号"  @dblclick.native="showDialog('3', 'goodsLotno', dtlData, objData)" v-model="dtlData.Goods_Lotno"></el-input> -->
        <!-- <el-input :disabled="isDisabled && disable" v-model="dtlData.Goods_Lotno" v-else></el-input> -->
      </div>
      <div class="box-card-content-item">
        <span>生产日期：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Production_Date" placeholder="根据批号带出"></el-input> -->
        <span v-text="dtlData.Production_Date"></span>
      </div>
      <div class="box-card-content-item">
        <span>有效期：</span>
        <!-- <el-input :disabled="isDisabled" v-model="dtlData.Valid_Until" placeholder="根据批号带出"></el-input> -->
        <span v-text="dtlData.Valid_Until"></span>
      </div>
      <div class="box-card-content-item">
        <span>入库件数：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Actual_Pcs" @input.native="StorageCs(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>入库数量：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Actual_Qty" @input.native="StorageQuantity(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>入库零散数：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Actual_Sps" @input.native="StorageCs(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>单价：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Price" @input.native="Price(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>金额：</span>
        <span v-text="dtlData.Amount"></span>
      </div>
      <div class="box-card-content-item">
        <span>商品价值：</span>
        <span v-text="dtlData.Goods_Value"></span>
      </div>
      <div class="box-card-content-item" v-if="objData.Business_Type === '4'">
        <span>出库单号：</span>
        <el-input v-if="operate === 'add'" :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Outstorebill_No" @dblclick.native="showDialog('4', 'goodsLotno', dtlData, objData)" placeholder="双击选择单号"></el-input>
        <span v-text="dtlData.Outstorebill_No" v-else></span>
      </div>
      <div class="box-card-content-item" v-if="objData.Business_Type === '4'">
        <span>验收评定：</span>
        <!-- <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Acceptance_Check_Rlt"></el-input> -->
        <el-select :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Acceptance_Check_Rlt" placeholder="请选择" clearable>
          <el-option v-for="item in Check_Options" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
          </el-option>
        </el-select>
      </div>
      <div class="box-card-content-item" v-if="objData.Business_Type === '4'">
        <span>退货原因：</span>
        <!-- <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Rp_Reasons"></el-input> -->
        <el-select :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Rp_Reasons" placeholder="请选择" clearable>
          <el-option v-for="item in Rp_Options" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
          </el-option>
        </el-select>
      </div>
    </div>
    <div>
      <a href="javascript:;" @click="splitDtl"><i class="el-icon-mo-submit"></i>拆分</a>
      <a href="javascript:;" @click="deleteOrderDtl(dtlIndex)"><i class="el-icon-mo-delete2"></i>删除</a>
    </div>

    <!-- 参数 commonDialog：公共弹出框的钩子 listData：传递到弹出框的表格数据  confirm事件：点击确定按钮事件,回掉函数的参数为当前选择的行数据-->
    <!-- <common-dialog ref='compositionInfo' :DialogTitle='DialogTitle' :TableHeader='TableDH' :listData ='gridData' @confirm = 'confirm'></common-dialog>
    <common-dialog ref='goodsInfo' :DialogTitle='goodsDialogTitle' :TableHeader='goodsTableDH' :listData ='goodsGridData' @confirm = 'confirm'></common-dialog>
    <common-dialog ref='goodsLotno' :DialogTitle='goodsLotnoTitle' :TableHeader='lotnoTableDH' :listData ='lotnoGridData' @confirm = 'confirm'></common-dialog> -->
    <common-dialog ref='compositionInfo' :isPages="false" :DialogTitle='DialogTitle' :TableHeader='TableDH' :listData ='gridData' @confirm = 'confirm'></common-dialog>
    <common-dialog ref='goodsInfo' :isPages="false" :DialogTitle='goodsDialogTitle' :TableHeader='goodsTableDH' :listData ='goodsGridData' @confirm = 'confirm'></common-dialog>
    <common-dialog ref='goodsLotno' :isPages="false" :DialogTitle='goodsLotnoTitle' :TableHeader='lotnoTableDH' :listData ='lotnoGridData' @confirm = 'confirm'></common-dialog>
    <!-- <common-dialog ref='goodsLotno' :DialogTitle='goodsLotnoTitle' :TableHeader='lotnoCTableDH' :listData ='lotnoCGridData' @confirm = 'confirm' v-else></common-dialog> -->
  </div>
</template>

<script>
  import commonDialog from '@/common/components/common-dialog.vue'
  import Api from '@/common/js/api.js'
  export default{
    data () {
      return {
        isDisabled: true,
        DialogTitle: '单位选择',
        goodsDialogTitle: '商品选择',
        goodsLotnoTitle: '批号选择',
        TableDH: [
          /*{
            title: '客户编号',
            field: 'Ssa_No'
          },
          {
            title: '客户助记码',
            field: 'Mnemonic_Code'
          },*/
          {
            title: '客户名称',
            field: 'Ssa_Name'
          }, {
            title: '客户地址',
            field: 'Address'
          }, {
            title: '联系人',
            field: 'Contact_Name'
          }, {
            title: '联系电话',
            field: 'Contact_Phone'
          }
        ],
        gridData: [
          {
            'Ssa_No': 'S450621001G001CA',
            'Mnemonic_Code': 'GXHTJTRSZYYXGS',
            'Ssa_Name': '丹江口市医药公司',
            'Address': '丹江口市三官殿',
            'Contact_Name': '张三',
            'Contact_Phone': '18163258965'
          },
          {
            'Ssa_No': 'C520330005X001CA',
            'Mnemonic_Code': 'XSXDZYF',
            'Ssa_Name': '习水县大众药房',
            'Address': '丹江口市三官殿',
            'Contact_Name': '张三',
            'Contact_Phone': '18163258965'
          }
        ],
        goodsTableDH: [
          {
            title: '商品编号',
            field: 'Goods_No'
          },
          {
            title: '助记码',
            field: 'Goods_Id'
          },
          {
            title: '商品名称',
            field: 'Goods_Name'
          }, {
            title: '业务类型',
            field: 'Business_Model_Desc'
          }, {
            title: '包装数',
            field: 'Package_Qty'
          }, {
            title: '包装单位',
            field: 'Package_Unit'
          }, {
            title: '药品规格',
            field: 'Drug_Spec'
          }, {
            title: '温层',
            field: 'Refrigeration_Type_Desc'
          }, {
            title: '体积',
            field: 'Total_Volume'
          }, {
            title: '重量',
            field: 'Total_Weight'
          }, {
            title: '生产厂家',
            field: 'Manufacturer'
          }
        ],
        goodsGridData: [
          {
            'Goods_No': 'PEA183060P',
            'Mnemonic_Code': 'TXBGASJCSJH(MXHF)',
            'Goods_Name': '阿莫西林胶囊',
            'Business_Model': '仓储',
            'Package_Qty': '240',
            'Package_Unit': '盒',
            'ypgg': '盒',
            'Refrigeration_Type': '2--8',
            'Volume': '24000',
            'Goods_Weight': '5KG',
            'Manufacturer': '广州美泰'
          },
          {
            'Goods_No': 'PGF005168Q',
            'Mnemonic_Code': 'YWXTWZQNKZDG',
            'Goods_Name': '猴耳环消炎颗粒',
            'Business_Model': '仓储与配送',
            'Package_Qty': '240',
            'Package_Unit': '盒',
            'ypgg': '5g*12袋',
            'Refrigeration_Type': '2--8',
            'Volume': '24000',
            'Goods_Weight': '5KG',
            'Manufacturer': '安琪酵母股份有限公司'
          }
        ],
        lotnoTableDH: [
          {
            title: '批号',
            field: 'Goods_Lotno'
          },
          {
            title: '生产日期',
            field: 'Production_Date'
          },
          {
            title: '有效期至',
            field: 'Valid_Until'
          }
        ],
        lotnoGridData: [
          {
            'Goods_Lotno': '070101',
            'Production_Date': '2017-09-22',
            'Valid_Until': '2019-12-31',
            'stock_quantity': '2400',
            'stock_status': '合格',
            'f': '东西湖物流中心'
          }
        ],
        Rows: {},
        lotnoCTableDH: [
          {
            title: '单据编号',
            field: 'a'
          },
          {
            title: '日期',
            field: 'b'
          },
          {
            title: '商品名称',
            field: 'c'
          },
          {
            title: '温层',
            field: 'd'
          },
          {
            title: '药品规格',
            field: 'e'
          },
          {
            title: '生产厂家',
            field: 'f'
          },
          {
            title: '批号',
            field: 'g'
          },
          {
            title: '生产日期',
            field: 'h'
          },
          {
            title: '有效期',
            field: 'i'
          },
          {
            title: '出库数量',
            field: 'j'
          },
          {
            title: '出库件数',
            field: 'k'
          },
          {
            title: '出库零散数',
            field: 'l'
          }
        ],
        lotnoCGridData: [
          {
            a: '070101',
            b: '2017-05-27',
            h: '2017-05-27'
          }
        ]
      }
    },
    // d.operateType, o.isEdit, 明细对象，明细索引，汇总索引,入库类型,下拉选择,汇总对象
    props: ['operate', 'disable', 'dtlData', 'dtlIndex', 'index', 'objData', 'Check_Options', 'Rp_Options'],
    computed: {
      /*isDisabled () {
        if (this.operate === 'add') return false
          else return true
      }*/
    },
    components: {
      commonDialog
    },
    methods: {
      deleteOrderDtl (i) {      // 删除
        console.log(this.index)
        this.$emit('delete', this.index, i)
      },
      deleLoto (e) {
        if (this.disable) {
          return false
        }
        this.dtlData.Goods_Lotno = ''
        this.dtlData.Production_Date = ''
        this.dtlData.Valid_Until = ''
      },
      splitDtl () {   // 拆分
        let _this = this
        if (_this.dtlData.Actual_Qty > 1) {
          _this.$prompt('请输入要拆分的数量：', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入1到明细记录的入库数量减1之间的数字',
            inputValidator (value) {
              if (isNaN(value)) {
                return '请输入数字'
              } else {
                if (value < 1 || value > (_this.dtlData.Actual_Qty - 1)) {
                  return '请输入正确的拆分数量'
                }
              }
            }
          }).then(({ value }) => {
            _this.$emit('split', value, _this.dtlData.Actual_Qty, _this.index, _this.dtlIndex)
          })
        } else {
          _this.$alert('入库数量不大于1，不允许拆分', '提示', {
                                  confirmButtonText: '确定',
                                  callback: action => {}
                                })
        }
      },
      // 显示弹出框
      showDialog (id, ref, item, HzItem) {
        console.log(this.disable)
        if (this.disable) {
          return false
        }
        console.log(item)
        console.log(id)
        this.$refs[ref].pihaoDialog = true
        this.$refs[ref].currentId = id
        this.loadingWating = this.showLoading()
          if (id === '1') {   // 请求单位名称
            let params1 = {
                Ssa_Name: '%' + this.dtlData.Ssa_Name + '%',
                Con_Id: HzItem.Con_Id ? HzItem.Con_Id : '%',
                Ldc_Id: HzItem.Ldc_Id ? HzItem.Ldc_Id : '%'
              }
              Api.get('GetStorageSsa', params1)
                .then((resp) => {
                  if (resp.Flag) {
                    this.gridData = resp.MsgInfo
                    this.loadingWating.close()
                  } else {
                    this.messageInfo(resp.ErrInfo)
                  }
              })
          }
          if (id === '2') {       // 请求商品名称
            let params2 = {
              Goods_Name: '%',
              // Goods_Name: '%' + this.dtlData.Goods_Name + '%',
              Con_Id: HzItem.Con_Id ? HzItem.Con_Id : '%',
              Ldc_Id: HzItem.Ldc_Id ? HzItem.Ldc_Id : '%'
            }
            Api.get('GetStorageGoods', params2)
              .then((resp) => {
                if (resp.Flag) {
                  this.goodsGridData = resp.MsgInfo
                  this.loadingWating.close()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
            })
          }
          if (id === '3') {   // 请求批号数据
            let params3 = {
              Goods_Id: item.Goods_Id ? item.Goods_Id : '%',
              Goods_Lotno: item.Goods_Lotno ? item.Goods_Lotno : '%'
            }
            Api.get('GetLotnoInfos', params3)
              .then((resp) => {
                console.log(resp)
                if (resp.Flag) {
                  this.lotnoGridData = resp.MsgInfo
                  this.loadingWating.close()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
            })
          }
          if (id === '4') {   // 请求出库单号
            let params4 = {
              Con_Id: HzItem.Con_Id ? HzItem.Con_Id : '%',
              Ssa_Id: item.Ssa_Id ? item.Ssa_Id : '%',
              Goods_Id: item.Goods_Id ? item.Goods_Id : '%'
            }
            Api.get('GetOutGoodLotno', params4)
              .then((resp) => {
                if (resp.Flag) {
                  this.lotnoCGridData = resp.MsgInfo
                  this.loadingWating.close()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
            })
          }
      },
      // 双击确认返回数据
      confirm (Rows) {
        this.Rows = Rows
        this.changeData()
      },
      changeData () { // 填写新增明细中输入框的值
        let _this = this
        for (let key in _this.dtlData) {
          for (let rkey in _this.Rows) {
            let selectRow = _this.Rows[rkey]
            for (let skey in selectRow) {
              if (key === skey) {
                _this.dtlData[key] = selectRow[skey]
              }
            }
          }
        }
      },
      StorageCs (item) { // 根据入库件数、入库零散数计算入库数量
        item.Actual_Sps = item.Actual_Sps ? item.Actual_Sps * 1 : 0
        item.Actual_Pcs = item.Actual_Pcs * 1
        item.Actual_Qty = item.Actual_Pcs * item.Package_Qty + item.Actual_Sps
        this.WeightChange(item)
        this.VolumeChange(item)
        this.Price(item)
      },
      StorageQuantity (item) { // 根据入库数量计算入库件数、入库零散数
        item.Actual_Pcs = parseInt(item.Actual_Qty / item.Package_Qty)
        item.Actual_Sps = item.Actual_Qty % item.Package_Qty
        this.WeightChange(item)
        this.VolumeChange(item)
        this.Price(item)
      },
      WeightChange (item) {    // 计算重量
        item.Total_Weight = item.Goods_Weight * item.Actual_Qty / item.Package_Qty
        item.Total_Weight = item.Total_Weight.toFixed(2)
      },
      VolumeChange (item) {    // 计算体积
        item.Total_Volume = item.Volume * item.Actual_Qty / item.Package_Qty
        item.Total_Volume = item.Total_Volume.toFixed(2)
      },
      Price (item) {    //  计算金额
        item.Amount = item.Price * item.Actual_Qty
      }
    },
    mounted: function () {}
  }
</script>

<style lang="less">
  .dtl-item{
    /* table{
      width: 100%!important;
    } */
    .el-dialog{
      position: fixed;
      top: 8% !important;
    }
    &.checkedDtl{
      background-color: #f9fdff;
    }
  }
</style>
