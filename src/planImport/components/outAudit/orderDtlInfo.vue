<template>
  <div class="dtl-item" :class="{checkedDtl: dtlData.isChecked && operate != 'add' && disable == true}">
    <div class="box-card-contain">
      <div class="box-card-content-item">
        <span>商品名称：</span>
        <el-input v-if="operate === 'add'" :disabled="isDisabled" v-model="dtlData.Goods_Name" placeholder="双击选择商品" @dblclick.native="showDialog('2', 'goodsInfo', dtlData, objData)"></el-input>
        <el-input :disabled="true" v-model="dtlData.Goods_Name" v-else></el-input>
      </div>
      <div class="box-card-content-item">
        <span>温层：</span>
        <span>{{dtlData.Refrigeration_Type_Desc}}</span>
        <!--<el-input :disabled="isDisabled" v-model="dtlData.Refrigeration_Type_Desc"></el-input>-->
      </div>
      <!-- <div class="box-card-content-item">
        <span>体积：</span>
        <el-input :disabled="isDisabled" v-model="dtlData.Total_Volume"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>重量：</span>
        <el-input :disabled="isDisabled" v-model="dtlData.Total_Weight"></el-input>
      </div> -->
      <div class="box-card-content-item">
        <span>生产厂家：</span>
        <span>{{dtlData.Manufacturer}}</span>
        <!--<el-input :disabled="isDisabled" v-model=""></el-input>-->
      </div>
      <div class="box-card-content-item">
        <span>商品批号：</span>
        <!-- <el-input v-if="operate === 'add' && objData.Outbound_Mode === '1'" :disabled="isDisabled" placeholder="双击选择批号"  @dblclick.native="showDialog('3', 'goodsLotno', dtlData, objData)" v-model="dtlData.Goods_Lotno"></el-input>
        <el-input :disabled="isDisabled && disable" v-model="dtlData.Goods_Lotno" v-else></el-input> -->
        <el-input :disabled="isDisabled" placeholder="双击选择批号"  @dblclick.native="showDialog('3', 'goodsLotno', dtlData, objData)" v-model="dtlData.Goods_Lotno" suffix-icon="el-icon-close" :on-icon-click="deleLoto"></el-input>
        <!-- <el-input :disabled="isDisabled && disable" v-model="dtlData.Goods_Lotno" v-else></el-input> -->
      </div>
      <div class="box-card-content-item">
        <span>生产日期：</span>
        <span>{{dtlData.Production_Date}}</span>
        <!--<el-input :disabled="isDisabled" v-model="dtlData.Production_Date" placeholder="根据批号带出或录入"></el-input>-->
      </div>
      <div class="box-card-content-item">
        <span>有效期：</span>
        <span>{{dtlData.Valid_Until}}</span>
        <!--<el-input :disabled="isDisabled" v-model="dtlData.Valid_Until" placeholder="根据批号带出或录入"></el-input>-->
      </div>
      <div class="box-card-content-item">
        <span>件数：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Actual_Pcs" @input.native="StorageCs(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>零散数：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Actual_Sps" @input.native="StorageCs(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>出库数量：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Actual_Qty" @input.native="StorageQuantity(dtlData)"></el-input>
      </div>
      <div class="box-card-content-item" v-if="BillType === '4'">
        <span>退货类别：</span>
        <el-select :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Rp_Cate">
          <el-option
            v-for="(item, index) in RpCate"
            :key="index"
            :value="item.Value_Data"
            :label="item.Value_Desc"
          ></el-option>
        </el-select>
      </div>
      <div class="box-card-content-item" v-if="BillType === '4'">
        <span>退货原因：</span>
        <el-select :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Rp_Reasons">
          <el-option
            v-for="(item, index) in RpReasons"
            :key="index"
            :value="item.Value_Data"
            :label="item.Value_Desc"
          ></el-option>
        </el-select>
      </div>
      <div class="box-card-content-item">
        <span>包装单位：</span>
        <span>{{dtlData.Package_Unit}}</span>
        <!--<el-input :disabled="isDisabled" v-model="dtlData.Package_Unit"></el-input>-->
      </div>
      <div class="box-card-content-item">
        <span>单价：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Price"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>商品价值：</span>
        <el-input :disabled="isDisabled && disable && operate !== 'add'" v-model="dtlData.Goods_Value"></el-input>
      </div>
      <div class="box-card-content-item">
        <span>库存数量：</span>
        <span>{{dtlData.Stock_Quantity}}</span>
        <!--<el-input :disabled="isDisabled" v-model="dtlData.Stock_Quantity" @input.native="StorageQuantity"></el-input>-->
      </div>
    </div>
    <div>
      <a href="javascript:;" @click="splitDtl"><i class="el-icon-mo-submit"></i>拆分</a>
      <a href="javascript:;" @click="deleteOrderDtl(dtlIndex)"><i class="el-icon-mo-delete2"></i>删除</a>
    </div>

    <!-- 参数 commonDialog：公共弹出框的钩子 listData：传递到弹出框的表格数据  confirm事件：点击确定按钮事件,回掉函数的参数为当前选择的行数据-->
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
        Is_Receipt: '', // 是否回单
        Is_ScenePrint: '', // 是否打印
        DialogTitle: '单位选择',
        goodsDialogTitle: '商品选择',
        goodsLotnoTitle: '批号选择',
        isDisabled: true,
        TableDH: [
          // {
          //   title: '客户编号',
          //   field: 'Ssa_No'
          // },
          // {
          //   title: '客户助记码',
          //   field: 'Mnemonic_Code'
          // },
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
            title: '商品库存',
            field: 'Stock_Quantity'
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
            field: 'Volume'
          }, {
            title: '重量',
            field: 'Goods_Weight'
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
        lotnoGridData: [],
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
    props: ['operate', 'disable', 'dtlData', 'dtlIndex', 'index', 'BillType', 'options', 'objData', 'RpReasons', 'RpCate'],
    computed: {
      // isDisabled () {
      //   if (this.operate === 'add') return false
      //     else return true
      // }
    },
    components: {
      commonDialog
    },
    methods: {
      deleteOrderDtl (i) {      // 删除
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
        let that = this
        if (this.dtlData.Actual_Qty > 1) {
          this.$prompt('请输入要拆分的数量：', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入1到明细记录的出库数量减1之间的数字',
            inputValidator (value) {
              if (isNaN(value)) {
                return '请输入数字'
              } else {
                if (value < 1 || value > (that.dtlData.Actual_Qty - 1)) {
                  return '请输入正确的拆分数量'
                }
              }
            }
          }).then(({ value }) => {
            this.$emit('split', value, this.dtlData.Actual_Qty, this.index, this.dtlIndex)
          })
        } else {
          this.$alert('出库数量不大于1，不允许拆分', '提示', {
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
              Con_Id: HzItem.Con_Id ? HzItem.Con_Id : '%',
              Ldc_Id: HzItem.Ldc_Id ? HzItem.Ldc_Id : '%'
            }
            Api.get('GetOutboundGoods', params2)
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
              Goods_Lotno: '%',
              Con_Id: HzItem.Con_Id ? HzItem.Con_Id : '%',
              Ldc_Id: HzItem.Ldc_Id ? HzItem.Ldc_Id : '%'
            }
            Api.get('GetStockLotInfos', params3)
              .then((resp) => {
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
      // 点击确认按钮返回数据
      confirm (Rows) {
        this.Rows = Rows
        this.changeData()
        this.dtlData.Delivery_Address_Id = this.dtlData.Address_Id   // 送货地址ID由客户单位获得
      },
      changeData () { // 填写新增明细中输入框的值(带出数据)
        for (let key in this.dtlData) {
          for (let rkey in this.Rows) {
            let selectRow = this.Rows[rkey]
            for (let skey in selectRow) {
              if (key === skey) {
                this.dtlData[key] = selectRow[skey]
              }
            }
          }
        }
      },
      StorageCs (item) { // 根据入库件数、入库零散数计算入库数量
        item.Actual_Sps = item.Actual_Sps ? item.Actual_Sps : 0
        item.Actual_Qty = item.Actual_Pcs * item.Package_Qty + parseInt(item.Actual_Sps)
        if (item.Actual_Qty > item.Stock_Quantity) {
          this.Over(item)
        }
        this.WeightChange(item)
        this.VolumeChange(item)
      },
      StorageQuantity (item) { // 根据入库数量计算入库件数、入库零散数
        item.Actual_Qty *= 1
        item.Actual_Pcs = parseInt(item.Actual_Qty / item.Package_Qty)
        item.Actual_Sps = item.Actual_Qty % item.Package_Qty
        console.log(item.Actual_Qty)
        if (item.Actual_Qty > item.Stock_Quantity) {
          this.Over(item)
        }
        this.WeightChange(item)
        this.VolumeChange(item)
      },
      WeightChange (item) {    // 计算重量
        item.Total_Weight = item.Goods_Weight * item.Actual_Qty / item.Package_Qty
        item.Total_Weight = item.Total_Weight.toFixed(2)
      },
      VolumeChange (item) {    // 计算体积
        item.Total_Volume = item.Volume * item.Actual_Qty / item.Package_Qty
        item.Total_Volume = item.Total_Volume.toFixed(2)
      },
      Over (item) {
        console.log(item)
        this.$alert('出库数量超过库存量', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            // 如果原始出库数量大于库存数，则出库数量重置为库存数，否则重置为原始数量
            item.Actual_Qty = item.Stock_Quantity > item.Origin_Quantity ? item.Origin_Quantity : item.Stock_Quantity
            this.StorageQuantity(item)
            this.WeightChange(item)
            this.VolumeChange(item)
          }
        })
      },
      init () {     // 根据字段ID转换成汉字
        if (this.dtlData.Is_Receipt === 'Y') {
          this.Is_Receipt = '是'
        } else if (this.dtlData.Is_Receipt === 'N') {
                  this.Is_Receipt = '否'
                } else {
                  this.Is_Receipt = '请选择'
                }
        if (this.dtlData.Is_ScenePrint === 'Y') {
          this.Is_ScenePrint = '是'
        } else if (this.dtlData.Is_ScenePrint === 'N') {
                this.Is_ScenePrint = '否'
              } else {
                this.Is_ScenePrint = '请选择'
              }
      }
    },
    mounted: function () {
      this.init()
    }
  }
</script>

<style lang="less">
  .dtl-item{
    /* table{
      width: 100%!important;
    } */
    .el-dialog{
      position: fixed;
      top: 8%!important;
    }
    /*&.checkedDtl{*/
      /*background-color: #f9fdff*/
    /*}*/
  }
</style>
