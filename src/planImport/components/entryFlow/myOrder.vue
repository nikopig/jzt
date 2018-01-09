<template>
  <div class="my-order common-container">
    <div class='offerOrder'>
      <div class='offerItem' v-for='(item, index) in offerOrderData' :key="index" :class="{hoverItem : item.checked}">
        <div class='titleBox'>
          <el-checkbox class='checkBox' v-model="item.checked"></el-checkbox>
          <div class='info'><span>委托方</span>&nbsp;:&nbsp;{{item.Con_Name}}</div>
          <div class='info'>业务类型&nbsp;:&nbsp;{{item.Business_Model}}</div>
          <div class='info'>生成时间&nbsp;:&nbsp;{{item.Create_Time}}</div>
          <div class='info'>
              <span class='label'>入库类型&nbsp;:</span>
              <el-select class='content' v-model="item.Storage_Type" @change = 'clearData(item)'>
                  <el-option value="1" label="购进入库"></el-option>
                  <el-option value="4" label="销售退回"></el-option>
              </el-select>
            </div>
          <div class='button-group'>
            <el-button class='icondelete' type="text" @click = 'Detail(item.Sdetails_Id, "delete", item, index)'><i class='el-icon-mo-delete2'></i>删除</el-button>
            <el-button class='iconadd' type="text" @click = 'Detail(item.Sdetails_Id, "copy", item, index)'><i class='el-icon-mo-newlyAdded'></i>新增</el-button>
          </div>
        </div>
        <!-- 入库类型：正常入库 -->
        <div class='contentBox' v-if='item.Storage_Type === "1"'>
          <el-form :ref="'form' + index" :model="item">
            <common-row>
              <common-col>
                <span class="label">供应商&nbsp;:</span>
                <span class="content">{{item.Ssa_Name}}</span>
              </common-col>
              <common-col :lot="2">
                <span class="label">供应商地址&nbsp;:</span>
                <span class='content'>{{item.Address}}</span>
              </common-col>
              <common-col>
                <span class='label'>联系人&nbsp;:</span><span class='content'>{{item.Contact_Name}}</span>
              </common-col>
              <common-col>
                <span class='label'>联系电话&nbsp;:</span><span class='content'>{{item.Contact_Phone}}</span>
              </common-col>
              <common-col>
                <span class='label'>商品名称&nbsp;:</span><span class='content'>{{item.Goods_Name}}</span>
              </common-col>
              <common-col>
                <span class='label'>温层&nbsp;:</span><span class='content'>{{item.Refrigeration_Type}}</span>
              </common-col>
              <common-col>
                <span class='label'>生产厂家&nbsp;:</span><span class='content'>{{item.Manufacturer}}</span>
              </common-col>
              <common-col>
                <span class='label'>入库仓&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Address_Shortname" placeholder="例如：重庆九州通物流中心" :disabled="true"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>批号&nbsp;:</span>
                <div class='content' @dblclick="showDialog(0, item, index)">
                  <el-input v-model="item.Goods_Lotno" placeholder="双击选择或手工录入"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>生产日期&nbsp;:</span>
                <div class="content">
                  <el-date-picker type="date" v-model="item.Production_Date"></el-date-picker>
                </div>
              </common-col>
              <common-col>
                <span class='label'>有效期&nbsp;:</span>
                <div class="content">
                  <el-date-picker type="date" v-model="item.Valid_Until"></el-date-picker>
                </div>
              </common-col>
              <common-col>
                <span class='label'>件数&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Storage_Pcs" placeholder="请输入内容" @change = 'dejianshu(item)'></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>零散数&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Storage_Sps" placeholder="请输入内容" @change = 'deQuanJ(item)'></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>入库数量&nbsp;:</span>
                <div class="content">
                  <el-form-item prop="Storage_Quantity" :rules="quantity">
                    <el-input v-model="item.Storage_Quantity" placeholder="请输入内容"  @change='desan(item)'></el-input>
                  </el-form-item>
                </div>
              </common-col>
              <common-col>
                <span class='label'>单价&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Price" placeholder="请输入内容" @change="priceChange(item)"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>金额&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Amount" placeholder="请输入内容" :disabled="true"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>商品价值&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Goods_Value" placeholder="请输入内容"></el-input>
                </div>
              </common-col>
            </common-row>
          </el-form>
        </div>
        <!-- 入库类型：销售退回 -->
        <div class='contentBox' v-else>
          <el-form :ref="'form' + index" :model="item">
            <common-row>
              <common-col>
                <span class="label">客户&nbsp;:</span>
                <span class="content">{{item.Ssa_Name}}</span>
              </common-col>
              <common-col :lot="2">
                <span class='label'>客户地址&nbsp;:</span>
                <span class='content'>{{item.Address}}</span>
              </common-col>
              <common-col>
                <span class='label'>联系人&nbsp;:</span><span class='content'>{{item.Contact_Name}}</span>
              </common-col>
              <common-col>
                <span class='label'>联系电话&nbsp;:</span><span class='content'>{{item.Contact_Phone}}</span>
              </common-col>
              <common-col>
                <span class='label'>商品名称&nbsp;:</span><span class='content'>{{item.Goods_Name}}</span>
              </common-col>
              <common-col>
                <span class='label'>温层&nbsp;:</span><span class='content'>{{item.Refrigeration_Type}}</span>
              </common-col>
              <common-col>
                <span class='label'>生产厂家&nbsp;:</span><span class='content'>{{item.Manufacturer}}</span>
              </common-col>
              <common-col>
                <span class='label'>入库仓&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Address_Shortname" :disabled="true"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'><i class='danger'>*&nbsp;</i>验收评定&nbsp;:</span>
                <div class="content">
                  <el-form-item prop="Acceptance_Check_Rlt" :rules="[{required: true, message: '请选择验收评定'}]">
                    <el-select v-model="item.Acceptance_Check_Rlt" placeholder="下拉选择" clearable>
                      <el-option v-for="fitem in ysData" :key="fitem.Value_Data" :label="fitem.Value_Desc" :value="fitem.Value_Data"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </common-col>
              <common-col>
                <span class='label'><i class='danger'>*&nbsp;</i>退货原因&nbsp;:</span>
                <div class="content">
                  <el-form-item prop="Rp_Reasons" :rules="[{required: true, message:'请选择退货原因'}]">
                    <el-select v-model="item.Rp_Reasons" placeholder="下拉选择" clearable>
                      <el-option v-for="ritem in rpData" :key="ritem.Value_Data" :label="ritem.Value_Desc" :value="ritem.Value_Data"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </common-col>
              <common-col>
                <span class='label'>出库单号&nbsp;:</span>
                <div class='content' @dblclick="showDialog(1, item, index)">
                  <el-input class='dblCursor' v-model="item.Outstorebill_No" placeholder="双击选择" :disabled="true"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>批号&nbsp;:</span>
                <div class='content' @dblclick="showDialog(0, item, index)">
                  <el-input v-model="item.Goods_Lotno" placeholder="双击选择或手工录入"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>生产日期&nbsp;:</span>
                <div class="content">
                  <el-date-picker type="date" v-model="item.Production_Date"></el-date-picker>
                  <span>{{item.Production_Date}}</span>
                </div>
              </common-col>
              <common-col>
                <span class='label'>有效期&nbsp;:</span>
                <div class="content">
                  <el-date-picker type="date" v-model="item.Valid_Until"></el-date-picker>
                </div>
              </common-col>
              <common-col>
                <span class='label'>件数&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Storage_Pcs" placeholder="请输入内容" @change = 'dejianshu(item)'></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>零散数&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Storage_Sps" placeholder="请输入内容" @change = 'deQuanJ(item)'></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>入库数量&nbsp;:</span>
                <div class="content">
                  <el-form-item
                    prop="Storage_Quantity"
                    :rules="quantity"
                  >
                  <el-input v-model="item.Storage_Quantity" placeholder="请输入内容"  @change='desan(item)'></el-input>
                  </el-form-item>
                </div>
              </common-col>
              <common-col>
                <span class='label'>单价&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Price" placeholder="请输入内容" @change="priceChange(item)"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>金额&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Amount" placeholder="请输入内容" :disabled="true"></el-input>
                </div>
              </common-col>
              <common-col>
                <span class='label'>商品价值&nbsp;:</span>
                <div class="content">
                  <el-input v-model="item.Goods_Value" placeholder="请输入内容"></el-input>
                </div>
              </common-col>
            </common-row>
          </el-form>
        </div>
      </div>
    </div>
    <div class='order-footer'>
      <div class='left'>
        <el-checkbox class='checkBox' v-model="selectAll"></el-checkbox>
        <label>全选</label>
      </div>
      <div class='right'>
        <div class='sumPice'>合计：件数<span class='number'>{{totalNum}}</span>件</div>
        <div class='sumSan'>零散数<span class='number'>{{totalRetail}}</span></div>
        <el-button class='sum-button' @click='orderSum'>订单结算</el-button>
      </div>
    </div>
    <!-- 参数 commonDialog：公共弹出框的钩子 listData：传递到弹出框的表格数据  confirm事件：点击确定按钮事件,回掉函数的参数为当前选择的行数据-->
    <!-- 批号 -->
    <lotno-modal :params="lotnoParams" :visible.sync="lotnoVisible" @change="confirm"></lotno-modal>
    <!-- 出库单号 -->
    <outno-modal :params="outnoParams" :visible.sync="outnoVisible" @change="confirm"></outno-modal>
  </div>
</template>
<script>
import commonRow from '@/common/components/common-row'
import commonCol from '@/common/components/common-col'
import lotnoModal from '@/common/service/modal/lotno-modal'
import outnoModal from '@/common/service/modal/outno-modal'
import api from '@/common/js/api.js'
import {copy} from '@/common/js/utils.js'
import { mapState } from 'vuex'
  export default {
    name: 'my-order',
    data () {
      return {
        DialogTitle: '请选择',
        quantity: [
          {validator: this.validateNum}
        ],
        offerOrderData: [],
        gridData: [], // 出库单号数据
        gridDataPH: [], // 批号数据
        rpData: [], // 退货原因数据
        ysData: [], // 验收评定数据
        Rows: {}, // 选中数据
        loadingWating: null, //加载数据的loading
        lotnoParams: null, // 入库单号传入参数
        tapIndex: 0, // 点击第几行弹窗modal
        lotnoVisible: false, // 批号弹框是否显示
        outnoVisible: false, //  出库单号弹框是否显示
        outnoParams: {} // 出库单号外部参数
      }
    },
    activated () {
      this.init()
    },
    computed: {
      ...mapState(['Con_Id', 'Ldc_Id', 'Ssa_Id']),
      // 全选
      selectAll: {
        get () {
          return this.selectData.length === this.offerOrderData.length
        },
        set (value) {
          this.offerOrderData.forEach((item) => {
            item.checked = value
          })
        }
      },
      selectData () {
        return this.offerOrderData.filter((item) => item.checked)
      },
      totalNum () {
        return this.selectData.reduce((total, current) => {
          return total + (current.Storage_Pcs - 0)
        }, 0)
      },
      totalRetail () {
        return this.selectData.reduce((total, current) => {
          return total + (current.Storage_Sps - 0)
        }, 0)
      }
    },
    methods: {
      // 出库数量校验
      validateNum (rules, value, callback) {
        let numExp = /^([1-9])+(\d)*$/g
        if (value === undefined || value === null || value === '') {
          callback(new Error('请填写入库数量'))
          return false
        }
        if (value <= 0 || !numExp.test(value + '')) {
          callback(new Error('入库数量应该是正整数'))
          return false
        }
        callback()
      },
      // 件数改变
      dejianshu (item) {
        this.$nextTick(() => {
          item.Storage_Pcs = item.Storage_Pcs + ''
          item.Storage_Pcs = item.Storage_Pcs.replace(/[^\d]/g, '')
          item.Storage_Pcs = item.Storage_Pcs.replace(/^0+/g, '') - 0
          // 入库数量
          item.Storage_Quantity = this.sum(item.Storage_Pcs, item.Package_Qty, item.Storage_Sps)
          // 金额
          item.Amount = (item.Price - 0) * (item.Storage_Quantity - 0)
        })
      },
      // 零散数改变事件
      deQuanJ (item) {
        this.$nextTick(() => {
          item.Storage_Sps = item.Storage_Sps + ''
          item.Storage_Sps = item.Storage_Sps.replace(/[^\d]/g, '')
          item.Storage_Sps = item.Storage_Sps.replace(/^0+/g, '') - 0
          // 入库数量
          item.Storage_Quantity = this.sum(item.Storage_Pcs, item.Package_Qty, item.Storage_Sps)
          // 金额
          item.Amount = (item.Price - 0) * (item.Storage_Quantity - 0)
          // 件数
          item.Storage_Pcs = parseInt(this.zhuangSZ(item.Storage_Quantity) / this.zhuangSZ(item.Package_Qty))
          // 零散数
          item.Storage_Sps = item.Storage_Sps % item.Package_Qty
        })
      },
      // 入库数量改变事件
      desan (item) {
        item.Storage_Quantity += ''
        item.Storage_Quantity = item.Storage_Quantity.replace(/[^\d]/g, '')
        item.Storage_Quantity = item.Storage_Quantity.replace(/^0+/g, '')
        // 件数
        item.Storage_Pcs = parseInt(this.zhuangSZ(item.Storage_Quantity) / this.zhuangSZ(item.Package_Qty))
        // 零散数
        item.Storage_Sps = parseInt(this.zhuangSZ(item.Storage_Quantity) % this.zhuangSZ(item.Package_Qty))
        // 金额
        item.Amount = (item.Price - 0) * (item.Storage_Quantity - 0)
//        this.deVW(item)
      },
      // 单价改变
      priceChange (item) {
        item.Amount = (item.Price - 0) * (item.Storage_Quantity - 0)
      },
      // 计算重量、体积
      deVW (item) {
        // 重量 kg
        let weight = item.Goods_Weight ? item.Goods_Weight : 0
        item.Total_Weight = this.formula(item.Storage_Quantity, item.Package_Qty, weight)
        // 体积 cm³
        let vl = item.Volume ? item.Volume : 0
        item.Total_Volume = this.formula(item.Storage_Quantity, item.Package_Qty, vl)
      },
      // 切换入库类型
      clearData (item) {
        item.Goods_Lotno = ''
        item.Production_Date = ''
        item.Valid_Until = ''
      },
      // 请求我的订单数据
      loadAllData () {
        let param = {
          Con_Id: this.Con_Id ? this.Con_Id : '%',
          Operator: api.userInfo.USERID//'333333'
        }
        // 主要数据  11111111  333333
        this.loadingWating = this.showLoading()
        api.get('GetStoreCartInfos', param).then((res) => {
          this.loadingWating.close()
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          this.offerOrderData = this.recData(res.MsgInfo)
        })
      },
      // 请求下拉菜单数据
      loadField () {
        // 下拉菜单 验收评定
        api.get('FdGetFiledDtl', {Field_Name: 'Acceptance_Check_Rlt'}).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          this.ysData = res.MsgInfo
        })
        // 下拉菜单 退货原因
        api.get('FdGetFiledDtl', {Field_Name: 'Rp_Reasons'}).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          this.rpData = res.MsgInfo
        })
      },
      // 请求数据后初始化
      recData (data) {
        return data.map((item, index) => {
          item.checked = false
          item.index = index
          item.Outstorebill_No = ''
          item.Storage_Type = item.Storage_Type || '1'
          return item
        })
      },
      // 显示弹出框
      showDialog (flag, row, index) {
        // 0批号  1出库单号
        this.tapIndex = index
        if (flag === 0) {
          this.lotnoParams = {Goods_Id: row.Goods_Id}
          this.lotnoVisible = true
        } else {
          this.outnoVisible = true
          this.outnoParams = {
            Con_Id: row.Con_Id ? row.Con_Id : '%',
            Goods_Id: row.Goods_Id,
            Ssa_Id: row.Ssa_Id ? row.Ssa_Id : '%'
          }
        }
      },
      // 点击确认按钮返回数据
      confirm (row) {
        this.offerOrderData[this.tapIndex] = Object.assign(this.offerOrderData[this.tapIndex], row)
      },
      // 新增 / 删除明细
      Detail (detailsId, type, newData, index) {
        let param = {
          Operator: api.userInfo.USERID,
          list_params: JSON.stringify({Sdetails_Id: detailsId, Operator_Type: type})
        }
        api.post('StoreCartMod', param).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          if (type === 'copy') {
            let newItem = copy(newData)
            newItem.Sdetails_Id = JSON.parse(res.MsgInfo).Sdetails_Id
            this.offerOrderData.splice(index, 0, newItem)
          } else if (type === 'delete') {
            this.offerOrderData.splice(index, 1)
          }
          this.$alert('操作成功！')
        })
      },
      // 判断是否可多行数据结算
      judgeOrder (data) {
//        status为0通过验证
//        1不同的委托方、业务类型、出库类型、温层等不能一起结算
//        2同一客户应该输入相同的委托单号
        let status = true
        let tempSsaId = [] // 客户id临时数组
        let tempConOrder = [] // 委托单号临时数组
        for (let i = 0; i < data.length; i++) {
          let firstItem = data[0]
          let secondItem = data[i]
          if (firstItem.Business_Model !== secondItem.Business_Model) {
            this.messageInfo('业务类型不同的订单不能一起结算')
            status = false
            break
          }
          if (firstItem.Refrigeration_Type !== secondItem.Refrigeration_Type) {
            this.messageInfo('温层业务类型不同的订单不能一起结算')
            status = false
            break
          }
          if (firstItem.Con_Id !== secondItem.Con_Id) {
            this.messageInfo('委托方不同的订单不能一起结算')
            status = false
            break
          }
          if (firstItem.Outbound_Type !== secondItem.Outbound_Type) {
            this.messageInfo('出库类型不同的订单不能一起结算')
            status = false
            break
          }
          if (firstItem.Ldc_Name !== secondItem.Ldc_Name) {
            this.messageInfo('物流中心不同的订单不能一起结算')
            status = false
            break
          }
          if (secondItem.Goods_Lotno && !secondItem.Production_Date) {
            this.messageInfo('批号填写的情况下，要填写生产日期')
            status = false
            break
          }
          if (secondItem.Goods_Lotno && !secondItem.Valid_Until) {
            this.messageInfo('批号填写的情况下，要填写有效期')
            status = false
            break
          }
          // 选择了出库单号，输入件数或数量时，点击订单结算时，需要校验，输入的件数或数量不能大于选择出库单号中此批号的出库数量
          if (secondItem.Actual_Qty && (secondItem.Actual_Qty - 0) < (secondItem.Storage_Quantity - 0)) {
            this.messageInfo('入库数量不能大于选择出库单号中此批号的出库数量')
            status = false
            break
          }
          if (secondItem.Storage_Type === '4' && (!secondItem.Goods_Lotno || !secondItem.Production_Date || !secondItem.Valid_Until)) {
            this.messageInfo('入库类型为购进退回的，批号、生产日期、有效期不能为空')
            status = false
            break
          }
        }
        return status
      },
      // 结算前检查
      beforeOrderSum (data) {
        if (data.length === 0) {
          this.messageInfo('请选择要结算的订单')
          return false
        }
        let judgeStute = this.judgeOrder(data)
        if (!judgeStute) return false
        let checkRel = true
        data.forEach((item) => {
          this.$refs['form' + item.index][0].validate((valid) => {
            if (!valid) checkRel = false
          })
        })
        return checkRel
      },
      // 结算
      orderSum () {
        let paramData = []
        let allData = []
        this.offerOrderData.forEach((item) => {
          if (item.checked) {
            //将数据中的null值转换成空字符串
            item = this.NullTranStr(item)
            // 选中数据
            let row = {
              Con_Id: item.Con_Id,
              Sdetails_Id: item.Sdetails_Id,
              StorageAddress_Id: item.StorageAddress_Id,
              Ssa_Id: item.Ssa_Id,
              Outstorebill_No: item.Outstorebill_No,
              Goods_Id: item.Goods_Id,
              Goods_Type: item.Goods_Type,
              Goods_Value: item.Goods_Value,
              Goods_Lotno: item.Goods_Lotno,
              Production_Date: item.Production_Date,
              Valid_Until: item.Valid_Until,
              Storage_Quantity: item.Storage_Quantity,
              Storage_Pcs: item.Storage_Pcs,
              Storage_Sps: item.Storage_Sps,
              Acceptance_Check_Rlt: item.Acceptance_Check_Rlt,
              Storage_Type: item.Storage_Type,
              Rp_Reasons: item.Rp_Reasons,
              Price: item.Price,
              Amount: item.Amount,
              Operator: api.userInfo.USERID
            }
            paramData.push(row)
            allData.push(item)
          }
          console.log(this.offerOrderData)
        })
        let checkRel = this.beforeOrderSum(allData)
        if (!checkRel) return false
        let params = {
          list_params: JSON.stringify(paramData)
        }
        api.post('StoreCartUpt', params).then((res) => {
          if (!res.Flag) {
            this.messageInfo(res.ErrInfo)
            return
          }
          this.$router.push('/orderSum')
        })
      },
      // 公式1（入库数量 = 件数*规格 + 零散数）
      sum (js, gg, ls) {
        js = this.zhuangSZ(js)
        gg = this.zhuangSZ(gg)
        ls = this.zhuangSZ(ls)
        return parseInt(js * gg + ls)
      },
      // 公式2（重量/体积 = （总件数 / 规格） *单个重量/体积）
      formula (allJS, gg, singer) {
        let rst = (allJS / gg) * singer
        return Math.round(rst * 100) / 100
      },
      // 数据转换（转换为整数，否则为0）
      zhuangSZ (suzi) {
        suzi = parseInt(suzi) ? parseInt(suzi) : 0
        return suzi
      },
      // 数据转换（转化成数字，否则为0）
      TransNumber (num) {
        let Num
        if (!num) {
          Num = 0
        } else {
          Num = Number(num)
        }
        if (!Num) return 0
        return Num
      },
      // 数据转换（将对象中的null 转换成 空字符串）
      NullTranStr (obj) {
        for (let key in obj) {
          if (obj[key] === null) {
            obj[key] = ''
          }
        }
        return obj
      },
      // 初始化函数
      init () {
        // 请求我的订单数据
        this.loadAllData()
        // 下拉菜单
        this.loadField()
      }
    },
    components: {commonRow, commonCol, lotnoModal, outnoModal}
  }
</script>
<style lang="less">
@import "../../../common/style/less/primary.less";
  .my-order{
    padding:28px 28px 80px 28px;
    .offerOrder {overflow-x: hidden;}
    .hoverItem {
      background-color: #f2fbff;
      .titleBox{
        background-color: #f2fbff !important;
      }
    }
    .offerItem,
    .clientItem {
      margin-bottom: 10px;
      border:1px solid #e5e5e5;
      .titleBox{
        position:relative;
        height:34px;
        line-height: 34px;
        border-bottom:1px solid #e5e5e5;
        background-color: #f5f5f5;
        font-size:0;
        .checkBox {
          display:inline-block;
          vertical-align: top;
          margin:0 8px 0 11px;
        }
        .info{
          display: inline-block;
          font-size:@font-size-small;
          margin-right:2%;
        }
        .button-group{
          position:absolute;
          top:0;
          right:17px;
          height:34px;
          .icondelete,
          .iconadd {
            font-size:@font-size-small;
            font-family: 'Microsoft YaHei'
          }
          .iconadd{
            padding-left:25px;
          }
        }
      }
      .contentBox{
        width:100%;
        padding:8px 10px 10px 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .rowitem {
          display: -webkit-flex;
          display: flex;
          width:100%;
          height:30px;
          line-height: 30px;
          font-size:0;
          padding-right: 10px;
          box-sizing: border-box;
          .item-col {
            flex:0 0 20%;
            width:20%;
            display: -webkit-flex;
            display: flex;
            font-size:@font-size-small;
            .label {
              display: inline-block;
              flex:0 0 92px;
              width:92px;
              text-align: right;
              .required {
                color: red;
                margin-right: 3px;
                font-weight: 700;
                font-style: normal;
              }
            }
            .dblCursor.el-input.is-disabled{
              .el-input__inner{
                cursor:pointer;
                user-select: none;
              }
            }
            .content {
              display: inline-block;
              flex:1;
              height:24px;
              font-size: @font-size-small;
              white-space: nowrap;
              padding-left:4px;
              box-sizing: border-box;
            }
          }
        }
      }
    }
    .order-footer {
      display:flex;
      position:fixed;
      bottom:0;
      left:0;
      width:100%;
      height:70px;
      line-height:70px;
      padding-left:58px;
      border:1px solid #ddd;
      background-color:#fff;
      font-size:@font-size-small;
      z-index: 99;
      .left{
        flex:1
      }
      .right{
        flex:0 0 587px;
        width:587px;
        box-sizing: border-box;
        .sumPice{
          display: inline-block;
          margin-right:60px;
          .number{
            color:#0096ff;
            padding:0 5px;
          }
        }
        .sumSan{
          display: inline-block;
          margin-right:90px;
          .number{
            color:#0096ff;
            padding:0 5px;
          }
        }
        .sum-button{
          display: inline-block;
          height:36px;
          background-color: #00a8ff;
          color:#fff;
          font-size:@font-size-small;
        }
        .sum-button:hover{
          background-color: #00baff
        }
      }
    }
    // 更改elementUI 默认下拉框、输入框样式
    .el-checkbox__inner{
      width:16px;
      height:16px;
      text-align: center;
    }
    .el-checkbox__inner::after{
      left:4px
    }
    .el-input__inner{
      height:100%
    }
    .el-input,
    .el-select-dropdown__item {
      font-size: @font-size-small;
      height: 24px;
    }
    .el-select-dropdown__item {
      padding: 0 10px;
      line-height: 24px;
    }
  }
</style>
