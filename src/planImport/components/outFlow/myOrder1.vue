<template>
  <div class="my-order">
    <!-- 第一种数据 -->
    <div class="offerOrder" v-if="offerOrderData.length">
      <div class='offerItem' :class="{'hoverItem':item.checked==true}" v-for="(item, $index) in offerOrderData">
        <div>
          <!-- 表头 -->
          <div class="titleBox">
            <el-checkbox class='checkBox' v-model="item.checked"></el-checkbox>
            <span class="info">委托方&nbsp;:&nbsp;{{item.Con_Name}}</span>
            <span class="info">客户&nbsp;:&nbsp;{{item.Ssa_Name}}</span>
            <span class="info">商品业务类型&nbsp;:&nbsp;{{item.Business_Model}}</span>
            <span class="info">记录生成时间&nbsp;:&nbsp;{{item.Create_Time}}</span>
            <div style="display:inline-block; height:24px;" class="info">
              <span class='label'><span class="required_span">*</span>出库类型&nbsp;:&nbsp;</span>
              <el-select class='content_type' v-model="item.Outbound_TYPE">
                <el-option value="1" label="购进退出"></el-option>
                <el-option value="2" label="销售出库"></el-option>
              </el-select>
            </div>
            <div class='button-group'>
              <el-button class='icondelete' type="text"><i class='el-icon-mo-delete2' @click = 'Detail(item.Sdetails_Id, "delete")'></i>删除</el-button>
              <el-button class='iconadd' type="text" @click = 'Detail(item.Sdetails_Id, "copy", item, $index)'><i class='el-icon-mo-newlyAdded'></i>新增</el-button>
            </div>
          </div>
          <!-- 购进退出内容 -->
          <div class="contentBox" v-show ='item.Outbound_TYPE === "1"'>
            <div class="rowitem">
              <div class="item-col">
                <span class="label">客户地址&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Address}}</span>
              </div>
              <div class="item-col">
                <span class="label"></span>
                <span class='content'></span>
              </div>
              <div class="item-col">
                <span class="label">客户联系人&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Contact_Name}}</span>
              </div>
              <div class="item-col">
                <span class="label">联系人电话&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Contact_Phone}}</span>
              </div>
              <div class="item-col">
                <span class="label">出库仓&nbsp;:&nbsp;</span>
                <span class='content' :title="item.Ldc_Name" style="text-overflow:ellipsis; overflow:hidden;">{{item.Ldc_Name}}</span>
              </div>
            </div>
            <div class="rowitem">
              <div class="item-col">
                <span class="label">商品名称&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Goods_Name}}</span>
              </div>
              <div class="item-col">
                <span class="label">包装数&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Package_Qty}}</span>
              </div>
              <div class="item-col">
                <span class="label">温层&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Refrigeration_Type}}</span>
              </div>
              <div class="item-col">
                <span class="label">体积&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Volume}}</span>
              </div>
              <div class="item-col">
                <span class="label">重量&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Goods_Weight}}</span>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>生产厂家&nbsp;:&nbsp;</span><span class='content'>{{item.Manufacturer}}</span>
              </div>
              <div class="item-col">
                <span class="label">规格&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Drug_Cate}}</span>
              </div>
              <div class='item-col'>
                <span class='label'><span class="required_span">*</span>退货类别&nbsp;:&nbsp;</span>
                <!-- <el-select class='content content-select' v-model="item.Rp_Cate">
                    <el-option value="0" label="合格"></el-option>
                    <el-option value="1" label="不合格"></el-option>
                    <el-option value="2" label="不限定"></el-option>
                </el-select> -->
                <el-select class='content content-select' v-model="item.Rp_Cate" placeholder="请选择">
                  <el-option
                    v-for="i in thType"
                    :key="i.Value_Data"
                    :label="i.Value_Desc"
                    :value="i.Value_Data">
                  </el-option>
                </el-select>
              </div>
              <div class='item-col'>
                <span class='label'>退货原因&nbsp;:&nbsp;</span>
                <!-- <el-select class='content content-select' v-model="item.Rp_Reasons"> 
                    <el-option value="0" label="厂家召回"></el-option>
                    <el-option value="1" label="商品销售差"></el-option>
                </el-select> -->
                <el-select class='content content-select' v-model="item.Rp_Reasons" placeholder="请选择">
                  <el-option
                    v-for="i in thReason"
                    :key="i.Value_Data"
                    :label="i.Value_Desc"
                    :value="i.Value_Data">
                  </el-option>
                </el-select>
              </div>
              <div class='item-col'>
                <span class='label'>委托方订单号&nbsp;:&nbsp;</span><el-input class='content' v-model="item.ConOrder_No" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>入库单号&nbsp;:&nbsp;</span>
                <div class='content' @dblclick="showDialog($index, 'commonDialogRK')">
                  <el-input class='content' v-model="item.InstoreBill_Hdr_Id" placeholder="双击带出"></el-input>
                </div>
              </div>
              <div class='item-col'>
                <span class='label'><span class="required_span">*</span>商品批号&nbsp;:&nbsp;</span>
                <div class='content'>
                  <el-input  v-model="item.Goods_Lotno" placeholder="根据单号带出" :disabled="true"></el-input>
                </div>
              </div>
              <div class='item-col'>
                <span class='label'>生产日期&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Production_Date}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>有效期&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Valid_Until}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>件数&nbsp;:&nbsp;</span>
                <el-input class='content' type="number" @change="PcsCount(item)" v-model="item.Outbound_Pcs" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>零散数&nbsp;:&nbsp;</span>
                <el-input class='content' type="number" @change="SpsCount(item)" v-model="item.Outbound_Sps" placeholder="请输入内容"></el-input>
              </div>
              <div class='item-col'>
                <span class='label'><span class="required_span">*</span>出库数量&nbsp;:&nbsp;</span>
                <el-input class='content' @change="Quantity(item)" v-model="item.Outbound_Quantity" placeholder="请输入内容"></el-input>
                <!-- :value="(item.Outbound_Pcs*item.Package_Qty)+parseInt(item.Outbound_Sps)" -->
              </div>
              <div class='item-col'>
                <span class='label'>包装单位&nbsp;:&nbsp;</span><span class='content'>{{item.Package_Unit}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>库存数量&nbsp;:&nbsp;</span><span class='content'>{{item.stock_quantity}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>商品价值&nbsp;:&nbsp;</span>
                <el-input class='content' v-model="item.Goods_Value" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>备注&nbsp;:&nbsp;</span>
                <el-input class='content' v-model="item.Remarks" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <!-- 销售出库内容 -->
          <div class="contentBox" v-show ='item.Outbound_TYPE === "2"'>
            <div class="rowitem">
              <div class="item-col">
                <span class="label">客户地址&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Address}}</span>
              </div>
              <div class="item-col">
                <span class="label"></span>
                <span class='content'></span>
              </div>
              <div class="item-col">
                <span class="label">客户联系人&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Contact_Name}}</span>
              </div>
              <div class="item-col">
                <span class="label">联系人电话&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Contact_Phone}}</span>
              </div>
              <div class="item-col">
                <span class="label">出库仓&nbsp;:&nbsp;</span>
                <span class='content' :title="item.Ldc_Name" style="text-overflow:ellipsis; overflow:hidden;">{{item.Ldc_Name}}</span>
              </div>
            </div>
            <div class="rowitem">
              <div class="item-col">
                <span class="label">商品名称&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Goods_Name}}</span>
              </div>
              <div class="item-col">
                <span class="label">包装数&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Package_Qty}}</span>
              </div>
              <div class="item-col">
                <span class="label">温层&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Refrigeration_Type}}</span>
              </div>
              <div class="item-col">
                <span class="label">体积&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Volume}}</span>
              </div>
              <div class="item-col">
                <span class="label">重量&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Goods_Weight}}</span>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>生产厂家&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Manufacturer}}</span>
              </div>
              <div class="item-col">
                <span class="label">规格&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Drug_Cate}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>委托方订单号&nbsp;:&nbsp;</span><el-input class='content' v-model="item.ConOrder_No" placeholder="请输入内容"></el-input>
              </div>
              <div class='item-col'>
                <span class='label'><span class="required_span">*</span>商品批号&nbsp;:&nbsp;</span>
                <div class='content' @dblclick="showDialog($index, 'commonDialogPH')">
                  <el-input  v-model="item.Goods_Lotno" placeholder="双击带出或为空" :disabled="true"></el-input>
                </div>
              </div>
              <div class='item-col'>
                <span class='label'>生产日期&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Production_Date}}</span>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>有效期&nbsp;:&nbsp;</span>
                <span class='content'>{{item.Valid_Until}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>件数&nbsp;:&nbsp;</span>
                <el-input class='content' type="number" v-model="item.Outbound_Pcs" placeholder="请输入内容"></el-input>
              </div>
              <div class='item-col'>
                <span class='label'>零散数&nbsp;:&nbsp;</span>
                <el-input class='content' type="number" v-model="item.Outbound_Sps" placeholder="请输入内容"></el-input>
              </div>
              <div class='item-col'>
                <span class='label'><span class="required_span">*</span>出库数量&nbsp;:&nbsp;</span>
                <el-input class='content' :value="(item.Outbound_Pcs*item.Package_Qty)+parseInt(item.Outbound_Sps)" placeholder="请输入内容"></el-input>
                <!-- v-model="item.Outbound_Quantity"  -->
              </div>
              <div class='item-col'>
                <span class='label'>包装单位&nbsp;:&nbsp;</span><span class='content'>{{item.Package_Unit}}</span>
              </div>
            </div>
            <div class="rowitem">
              <div class='item-col'>
                <span class='label'>库存数量&nbsp;:&nbsp;</span><span class='content'>{{item.stock_quantity}}</span>
              </div>
              <div class='item-col'>
                <span class='label'>商品价值&nbsp;:&nbsp;</span>
                <el-input class='content' v-model="item.Goods_Value" placeholder="请输入内容"></el-input>
              </div>
              <div class='item-col'>
                <span class='label'>备注&nbsp;:&nbsp;</span>
                <el-input class='content' v-model="item.Remarks" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
    <!-- 固定页尾 -->
    <div class="foot-bar">
        <div class="checkedAll">
          <el-checkbox class="checkBox" v-model="selectAll"></el-checkbox>
          <label>全选</label>
        </div>
        <div class="btns-content">
          <div class="pieces">
            <!-- <span class="totle-content">合计商品数量&nbsp;:&nbsp;<span class="totle-number">480</span>件</span> -->
            <span class="totle-content">合计商品件数&nbsp;:&nbsp;<span class="totle-number">{{Packages}}</span>件</span>
          </div>
          <button type="button" class="el-button sum-button" @click='orderSum'>
            <span>订单结算</span>
          </button>
        </div>
    </div>
    <!-- 商品批号弹框 -->
    <!-- 参数 commonDialog：公共弹出框的钩子 listData：传递到弹出框的表格数据  confirm事件：点击确定按钮事件,回掉函数的参数为当前选择的行数据-->
    <!-- 批号 -->
    <common-dialog ref='commonDialogPH' :DialogTitle='DialogTitle' :TableHeader='headerPH' :listData ='gridDataPH' @confirm = 'confirm'></common-dialog>
    <!-- 入库单号 -->
    <common-dialog ref='commonDialogRK' :DialogTitle='DialogTitle' :TableHeader='TableDH' :listData ='gridData' @confirm = 'confirm'></common-dialog>
  </div>
</template>
<script>
  /*import Vue from 'vue'*/
  import commonDialog from '@/common/components/common-dialog.vue'
  import Api from '@/common/js/api.js'
  export default {
    name: 'my-order',
    data () {
      return {
        offerOrderData: [],
        AllData: [],
        DialogTitle: '批号弹窗',
        TableDH: [
          {
            title: '单据编号',
            field: 'a'
          }, {
            title: '日期',
            field: 'b'
          }, {
            title: '商品名称',
            field: 'Goods_Name'
          }, {
            title: '温层',
            field: 'd'
          }, {
            title: '药品规格',
            field: 'e'
          }, {
            title: '生产厂家',
            field: 'f',
            width: '200'
          }, {
            title: '批号',
            field: 'Goods_Lotno'
          }, {
            title: '生产日期',
            field: 'Production_Date'
          }, {
            title: '有效期',
            field: 'Valid_Until'
          }, {
            title: '出库数量',
            field: 'j'
          }, {
            title: '出库件数',
            field: 'k'
          }, {
            title: '出库零散数',
            field: 'l'
          }
        ], // 入库单号
        headerPH: [
          {
            title: '商品名称',
            field: 'Goods_Name'
          }, {
            title: '商品ID',
            field: 'Goods_Id'
          }, {
            title: '批号',
            field: 'Goods_Lotno'
          }, {
            title: '批号ID',
            field: 'Lotno_Id'
          }, {
            title: '生产日期',
            field: 'Production_Date'
          }, {
            title: '有效期',
            field: 'Valid_Until'
          }, {
            title: '库存数量',
            field: 'stock_quantity'
          }, {
            title: '库存状态',
            field: 'Approval_No'
          }
        ], // 批号
        gridData: [
          {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '001',
            Goods_Lotno: '1111',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '002',
            Goods_Lotno: '444444',
            Production_Date: '2016-05-02',
            Valid_Until: '7月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '003',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '004',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '005',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '006',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '007',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '008',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '0010',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '0011',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '0012',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }, {
            a: '13123',
            b: '2017-02-12',
            c: '小柴胡颗粒',
            d: '2-8°C',
            e: '12*8盒',
            f: '上海市普陀区金沙江路九州通医药',
            InstoreBill_Hdr_Id: '0013',
            Goods_Lotno: '2412312',
            Production_Date: '2016-05-02',
            Valid_Until: '6月',
            j: '48',
            k: '12件',
            l: '10'
          }
        ], //入库单号
        gridDataPH: [],  //批号弹窗
        thReason: [], //退货原因
        thType: [], //退货类别
        Rows: {} // 选中数据
      }
    },
    created () {
    },
    computed: {
      selectAll: {
        get: function () {
          return this.selectCount === this.offerOrderData.length
        },
        set: function (value) {
          this.offerOrderData.forEach(function (item) {
            item.checked = value
          })
          return value
        }
      },
      selectCount: {
        get: function () {
          var i = 0
          this.offerOrderData.forEach(function (item) {
            if (item.checked) {
              i++
            }
          })
          return i
        }
     },
     //总件数计算
      Packages () {
        let count = 0
        this.offerOrderData.forEach(function (item) {
          if (item.checked) {
            console.log(item.Outbound_Quantity)
            /*count += Math.ceil(item.Outbound_Quantity / item.Package_Qty)*/
            count += Math.ceil((item.Outbound_Pcs * item.Package_Qty + parseInt(item.Outbound_Sps)) / item.Package_Qty)
          }
        })
        return count
      }
    },
    methods: {
      /*出库数量改变计算件数和零散数*/
     Quantity (item) {
        /*item.Outbound_Quantity = (item.Outbound_Pcs * item.Package_Qty) + parseInt(item.Outbound_Sps)*/
        console.log(item.Outbound_Quantity)
        /* 件数=出库数量/包装数 取商 */
        item.Outbound_Pcs = Math.floor(item.Outbound_Quantity / item.Package_Qty)
        /* 零散数=出库数量%包装数 取余 */
        item.Outbound_Sps = item.Outbound_Quantity % item.Package_Qty
     },
     /*件数改变，计算出库数量*/
     PcsCount (item) {
      if (item.Outbound_Pcs === null || item.Outbound_Pcs === '' || item.Outbound_Pcs === undefined) {
        item.Outbound_Pcs = 0
      }
      console.log(123)
      /*出库数量=件数*包装数+零散数*/
      item.Outbound_Quantity = (item.Outbound_Pcs * item.Package_Qty) + parseInt(item.Outbound_Sps)
     },
     /*零散数改变，计算出库数量*/
     SpsCount (item) {
      if (item.Outbound_Sps === null || item.Outbound_Sps === '' || item.Outbound_Sps === undefined) {
        item.Outbound_Sps = 0
      }
        /*出库数量=件数*包装数+零散数*/
        item.Outbound_Quantity = (item.Outbound_Pcs * item.Package_Qty) + parseInt(item.Outbound_Sps)
     },
      //页面数据请求
      loadData () {
        this.loadingWating = this.showLoading()
        Api.get('GetOutCartInfos', {Con_Id: '157773250137464', Operator: '831323494964461'}).then((res) => {
          if (!res.Flag) {
            alert('数据请求失败！')
            return
          }
          console.log(res)
          this.offerOrderData = this.recData(res.MsgInfo)
          this.loadingWating.close()
        })
      },
      //商品批号请求
      loadLotno () {
        // 批号
        Api.get('GetLotnoInfos', {Goods_Id: '463081367173825'}).then((res) => {
          if (!res.Flag) {
            alert('数据请求失败！')
            return
          }
          this.gridDataPH = res.MsgInfo
          console.log(this.gridDataPH)
        })
      },
      //下拉菜单请求
      loadDownList () {
        // 下拉菜单 退货原因
        Api.get('FdGetFiledDtl', {Field_Name: 'Rp_Reasons'}).then((res) => {
          if (!res.Flag) {
            alert('数据请求失败！')
            return
          }
          this.thReason = res.MsgInfo
        })
        // 下拉菜单 退货类别
        Api.get('FdGetFiledDtl', {Field_Name: 'Rp_Cate'}).then((res) => {
          if (!res.Flag) {
            alert('数据请求失败！')
            return
          }
          this.thType = res.MsgInfo
        })
      },
      // 请求数据后初始化
      recData (data) {
        return data.map((item, index) => {
          item.checked = false
          // 让初始的出库数量做一下计算
          item.Outbound_Quantity = (item.Outbound_Pcs * item.Package_Qty) + parseInt(item.Outbound_Sps)
          return item
        })
      },
      /*Add (item) {
        this.$nextTick(() => {
          this.offerOrderData.forEach(function (elem) {
            if (elem !== item) {
              Vue.set(elem, 'mxshow', false)
            }
          })
          item.mxshow = !item.mxshow
        })
      },*/
      // 显示弹出框
      showDialog (index, ref) {
        this.$refs[ref].pihaoDialog = true
        this.$refs[ref].currentId = index
        //调用批号弹框数据
        this.loadLotno()
      },
      // 点击确认按钮返回数据
      confirm (Rows) {
        this.Rows = Rows
        console.log(Rows)
        this.offerOrderData = this.confirmData(this.offerOrderData)
        console.log(this.offerOrderData)
      },
      // 弹出框带出数据的处理
      confirmData (data) {
        return data.map((item, index) => {
          let currentId = index + ''
          for (let key in this.Rows) {
            let selectRow = this.Rows[key]
            if (key === currentId) {
              item = Object.assign({}, item, selectRow)
            }
          }
          return item
        })
      },
      // 新增/删除
      Detail (detailsId, type, nowData, index) {
        console.log(detailsId)
        let param = {
          Operator: '831323494964461',
          list_params: JSON.stringify({Sdetails_Id: detailsId, Operator_Type: type})
        }
        Api.post('StoreCartMod', param).then((res) => {
          if (!res.Flag) {
            alert('数据请求失败！')
            return
          }
          this.loadData()
        })
      },
      // 订单结算
      orderSum () {
        let paramData = []
        this.offerOrderData.forEach(function (item) {
            if (item.checked) {
                let row = {
                  'Sdetails_Id': item.Sdetails_Id,
                  'Operator_Id': item.Operator_Id,
                  'ConOrder_no': item.ConOrder_no,
                  'InstoreBill_Hdr_Id': item.InstoreBill_Hdr_Id,
                  'Con_Id': item.Con_Id,
                  'Ssa_Id': item.Ssa_Id,
                  'Delivery_Address_Id': item.Delivery_Address_Id,
                  'Goods_Id': item.Goods_Id,
                  'Goods_Lotno': item.Goods_Lotno,
                  'Production_Date': item.Production_Date,
                  'Valid_Until': item.Valid_Until,
                  'Outnbound_Quantity': item.Outnbound_Quantity,
                  'Outbound_Pcs': item.Outbound_Pcs,
                  'Outbound_Sps': item.Outbound_Sps,
                  'OutbAddress_Id': item.OutbAddress_Id,
                  'Goods_Value': item.Goods_Value,
                  'Outbound_TYPE': item.Outbound_TYPE,
                  'RP_CATE': item.RP_CATE,
                  'RP_REASONS': item.RP_REASONS,
                  'Sdetails_Status': item.Sdetails_Status,
                  'Operator': '831323494964461',
                  'Remarks': item.Remarks
                }
                paramData.push(row)
                console.log(paramData)
            }
        })
        let params = {
          Operator: '831323494964461',
          list_params: JSON.stringify(paramData)
        }
        Api.post('OutCartUpt', params).then((res) => {
          if (!res.Flag) {
            alert('数据请求失败！')
            return
          }
        })
        this.$router.push('/outFlow/orderSum')
      },
      init () {
        //加载页面数据
        this.loadData()
        //加载下拉框数据
        this.loadDownList()
      }
    },
    mounted () {
      this.init()
    },
    components: {commonDialog}
  }
</script>
<style lang="less" scope>
@import "../../../common/style/less/primary.less";
  .my-order {
    margin:28px 77px 75px 77px;
    .offerItem,.clientItem {
      margin-bottom:10px;
      border:1px solid #e5e5e5;
      &.hoverItem{
        background:#f2fbff;
        .titleBox{
          background:#f2fbff;
        }
      }
      .titleBox{
        position:relative;
        height:34px;
        line-height:34px;
        background:#f5f5f5;
        border-bottom:1px solid #e5e5e5;
        font-size:0;
        .checkBox{
          display:inline-block;
          vertical-align:top;
          margin:0 8px 0 11px;
          .el-checkbox__inner{
            width:16px;
            height:16px;
            text-align: center;
          }
          .el-checkbox__inner::after{
            left:4px;
          }
        }
        .info{
          font-size:@font-size-small;
          margin-right:50px;
        }
        .content_type{
          display:inline-block;
          width:190px;
          height:24px;
          font-size: 12px;
          line-height:24px;
        }
        .button-group{
          position:absolute;
          top:0;
          right:17px;
          height:34px;
          .icondelete,
          .iconadd {
            font-size:@font-size-small;
          }
          .iconadd{
            padding-left:25px
          }
        }
      }
      .contentBox{
        width:100%;
        padding:10px 0;
        .rowitem{
          display: -webkit-flex;
          display:flex;
          width:100%;
          height:30px;
          line-height:30px;
          padding-right: 10px;
          box-sizing: border-box;
          .item-col{
            flex:0 0 20%;
            width:20%;
            display: -webkit-flex;
            display: flex;
            font-size:@font-size-small;
            .label{
              /* flex:1; */
              display: inline-block;
              flex:0 0 90px;
              width:90px;
              text-align:right;
              white-space:nowrap;
            }
            .content{
              display: inline-block;
              flex:1;
              /* flex:0 0 60%;
              width:60%; */
              height:24px;
              font-size:12px;
              white-space:nowrap;
            }
            .content-select{
              line-height:24px;
            }
          }
        }
      }
    }
    .foot-bar{
      font-size:@font-size-small;
      .checkedAll{
        float:left;
        margin-top:9px;
        .el-checkbox__inner{
          width:16px;
          height:16px;
          text-align: center;
        }
        .el-checkbox__inner::after{
          left:4px;
        }
      }
      .pieces{
        display:inline-block;
        margin-right:67px;
        .totle-content{
          margin-left:30px;
          .totle-number{
            margin:0 5px;
            color: #0094ff;

          }
        }
      }
      .sum-button{
        color:#fff;
        background-color: #00a8ff;
        border-color: #00a8ff;
        font-size:@font-size-small;
        &.sum-button:hover{
          background-color: #00baff;
        }
      }
    } 
  }

// 下拉框、输入框样式
.el-input__inner{
  height:100%
}
.el-input,
.el-select-dropdown__item {
  font-size: 12px;
  height: 24px;
} 
.el-select-dropdown__item {
  padding: 0 10px;
  line-height: 24px;
} 
.required_span {
  margin-right:3px;
  color:red;
}

</style>
