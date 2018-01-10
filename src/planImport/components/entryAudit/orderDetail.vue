<template>
    <div class="orderDetail">
        <div class="search-contain">
            <el-row>
                <el-col :span="6">
                    <div class="common-input-box">
                        <label>业务单据编号：</label>
                        <el-input placeholder="请输入业务单据编号" v-model="filterCondition.Businessbill_No"></el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="common-input-box">
                        <label>销售类型：</label>
                        <!-- <el-select @visible-change='optionSelect' v-model="filterCondition.Instore_Type" placeholder="请选择" clearable> -->
                        <!-- <el-option v-for="item in options" :key="item.Value_Data" :label="item.Value_Desc" :value="item.Value_Data">
                        </el-option> -->
                        <el-select v-model="filterCondition.Business_Type" placeholder="请选择" clearable>
                        <el-option label="购进入库" value="1">
                        </el-option>
                        <el-option label="销售退回" value="4">
                        </el-option>
                      </el-select>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="common-input-box">
                        <label>单位：</label>
                        <el-input placeholder="请输入单位名称" v-model="filterCondition.Ssa_Name"></el-input>
                    </div>
                </el-col>
            </el-row>
        </div><!-- search-contain end -->
        <div class="orderDetailList">
            <el-card class="box-card" :class="{checkedCard: o.isChecked}" v-for="(o, index) in listData" :key="index" v-if="filterFlag(o)">
                <div slot="header" class="clearfix">
                    <div class="ft-lt checkBox">
                        <el-checkbox v-model="o.isChecked" @change='loadDtlInfo(index)'></el-checkbox>
                    </div>
                    <div class="ft-lt Con">
                        <span>委托方：</span>
                        <span>{{ o.Con_Name }}</span>
                    </div>
                    <div class="ft-rt">
                        <el-button type="text" @click="editOrderInfo(o)"><i class="el-icon-mo-edit"></i>编辑</el-button>
                        <el-button type="text" @click="save(index)"><i class="el-icon-mo-preservation"></i>保存</el-button>
                        <!--<el-button type="text" @click="addOrderDtl(index)"><i class="el-icon-mo-newlyAdded"></i>新增明细</el-button>-->
                        <el-button v-if="o.Arrival_Mode==='A2'" type="text" @click="costTrial(o)"><i class="el-icon-mo-kaishi"></i>费用试算</el-button>
                    </div>
                </div>
                <div class="box-card-contain">
                    <div class="box-card-content-item">
                        <span>日期：</span>
                        <span class="textOverflow" :title='o.Created_Time'>{{ o.Created_Time }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>业务单据编号：</span>
                        <span class="textOverflow" :title='o.Businessbill_No'>{{ o.Businessbill_No }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>业务类型：</span>
                        <span>{{ o.Business_Type_Desc }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>接货时间：</span>
                        <el-date-picker
                          v-model=o.Takegds_Time
                          type="date"
                          :disabled="true && o.isEdit"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="box-card-content-item">
                        <span>客户名称：</span>
                        <span class="textOverflow" :title='o.Ssa_Name'>{{ o.Ssa_Name }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>产品大类：</span>
                        <span>{{ o.Goods_Type_Desc }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>入库类型：</span>
                        <span>{{ o.Instore_Type_Desc }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>入库方式：</span>
                        <span>{{ o.Arrival_Mode_Desc }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>提货地址：</span>
                        <span class="textOverflow" :title='o.TdelAddress'>{{ o.TdelAddress }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>入库地：</span>
                        <span class="textOverflow" :title='o.InAddress_Shortname'>{{ o.InAddress_Shortname }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>入库地址：</span>
                        <span class="textOverflow" :title='o.StorageAddress'>{{ o.StorageAddress }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>联系人：</span>
                        <span>{{ o.InContact_Name }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>联系电话：</span>
                        <span class="textOverflow" :title='o.InContact_Phone'>{{ o.InContact_Phone }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>总件数：</span>
                        <span>{{ o.Total_Pcs }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>时效：</span>
                        <span>{{ o.Aging }}</span>
                    </div>
                    <div class="box-card-content-item" v-if="o.Arrival_Mode === 'A2'">
                        <span>提货地：</span>
                        <el-select :disabled="true && o.isEdit" value-key="Address_Id" v-model="o.TdelAddressObj" @visible-change="getAddress(o)" @change="selectAdress($event, o)"  class="textOverflow" :title='o.Address_Shortname'>
                            <el-option
                                v-for="(item, index) in optionsAdress"
                                :key="index"
                                :value="item"
                                :label="item.Address_Shortname">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="box-card-content-item" v-if="o.Arrival_Mode === 'A2'">
                        <span>提货联系人：</span>
                        <span>{{ o.Contact_Name }}</span>
                    </div>
                    <div class="box-card-content-item" v-if="o.Arrival_Mode === 'A2'">
                        <span>联系电话：</span>
                        <span>{{ o.Contact_Phone }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>开票员：</span>
                        <span>{{ o.Invoice_Staff }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>备注：</span>
                        <el-input class="textOverflow" :title='o.Remarks' :disabled="true && o.isEdit" v-model="o.Remarks"></el-input>
                    </div>
                    <!-- 箭头部分 -->
                    <div :class="{'arrow-down': current != index, 'arrow-up': current == index}" @click="toggleDtl(index)">
                        <i :class="{'el-icon-mo-down2': current != index, 'el-icon-mo-up2': current == index}"></i>
                    </div>
                </div>
                <!-- 折叠明细部分 -->
                <transition>
                    <div class="dtl" v-show="current == index">
                        <order-info :objData='o' :operate="d.operateType" :disable='o.isEdit' v-for="(d, dIndex) in o.ordersDtl" :key="dIndex" :dtlData='d' :dtlIndex="dIndex" :index="index" :Check_Options="Check_Options" :Rp_Options="Rp_Options" @delete="deleteOperate" @split="splitOperate"></order-info>
                    </div>
                </transition>
            </el-card>
        </div><!-- orderDetailList end -->
        <div class="btns-contain">
            <div class="btns-content">
                <!--<el-button type="primary" v-if="orderType != 1" @click="combineOrders">计划合并</el-button>-->
                <el-button type="danger" @click="blankOut">作&nbsp;废</el-button>
                <el-button type="info" @click="pend">审&nbsp;核</el-button>
            </div>
        </div>
      <!-- 费用试算弹窗 -->
      <el-dialog class="feeTryDialog" size="large" title="费用试算" :visible.sync="costDialog.dialogFormVisible">
        <common-row type="flex">
          <common-col :lot="2">
            <span class="label">单位名称：</span>
            <span class="content">{{costDialog.data.Ssa_Name}}</span>
          </common-col>
          <common-col>
            <span class="label">起点市：</span>
            <span class="content">{{costDialog.data.Starting_City}}</span>
          </common-col>
          <common-col>
            <span class="label">终点市：</span>
            <span class="content">{{costDialog.data.Destination_City}}</span>
          </common-col>
        </common-row>
        <!--<p class="classify">按整单计算费用：</p>-->
        <div class="tabel-box">
          <el-table :data="costDialog.data.Hdr" border>
            <el-table-column label="按整单计算费用">
              <el-table-column property="Service_Item" label="费用项目"></el-table-column>
              <el-table-column property="address" label="付款方式"></el-table-column>
              <el-table-column property="Total_Value" label="商品总价值"></el-table-column>
              <el-table-column property="Total_Amount" label="试算金额(元)"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <!--<p class="classify">按明细计算费用：</p>-->
        <div class="table-box">
          <el-table :data="costDialog.data.Dtl" border>
            <el-table-column label="按明细计算费用">
              <el-table-column property="Goods_Name" label="商品名称" width="180" show-overflow-tooltip></el-table-column>
              <el-table-column property="Refrigeration_Type" label="温层"></el-table-column>
              <el-table-column property="Total_Pcs" label="件数"></el-table-column>
              <el-table-column property="Total_Volume" label="体积"></el-table-column>
              <el-table-column property="Total_Weight" label="重量"></el-table-column>
              <el-table-column property="Service_Item" label="费用项目"></el-table-column>
              <el-table-column property="address" label="付款方式"></el-table-column>
              <!--<el-table-column property="address" label="计费方式"></el-table-column>-->
              <el-table-column property="Try_Amount" label="试算金额(元)"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="summary-box">
          <common-row>
            <common-col>
              <span class="label">总件数：</span>
              <span class="content">{{costDialog.data.Total_Pcs}}</span>
            </common-col>
            <common-col>
              <span class="label">总体积：</span>
              <span class="content">{{costDialog.data.Total_Volume}}</span>
            </common-col>
            <common-col>
              <span class="label">总重量：</span>
              <span class="content">{{costDialog.data.Total_Weight}}</span>
            </common-col>
            <common-col>
              <span class="label">总金额：</span>
              <span class="content">{{costDialog.data.Total_Amount}}</span>
            </common-col>
          </common-row>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import orderInfo from './orderDtlInfo'
    import commonRow from '@/common/components/common-row'
    import commonCol from '@/common/components/common-col'
    import Api from '@/common/js/api.js'
    export default {
        components: {
          orderInfo,
          commonRow,
          commonCol
        },
        props: ['params'], // 由page/entryAudit.vue传过来
        data () {
            return {
                orderType: 2,
                current: -1,
                filterFun: '',
                filterCondition: {
                    Businessbill_No: '',
                    Business_Type: '',
                    Ssa_Name: ''
                },
                options: [],     // 入库类型
                optionsAdress: [],   // 提货地
                StorageType: '',
                addDtlStor: [],
                listData: [],
                Check_Options: [],
                Rp_Options: [],
                costDialog: {
                    dialogFormVisible: false,
                    data: []
                },
                gridData: [{
                  date: '1',
                  name: '王小虎',
                  address: '上海市'
                }, {
                  date: '2',
                  name: '王小虎',
                  address: '上海市'
                }]
            }
        },
        methods: {
            costTrial (row) {          // 费用试算弹窗
                let jsonArr = []
                jsonArr.push({Bill_hdr_Id: row.Bill_Hdr_Id})
                let params = {
                  list_params: JSON.stringify(jsonArr)
                }
                Api.post('JlpInhouseFeeTry', params)
                  .then((res) => {
                    if (res.Flag) {
                      this.costDialog.data = JSON.parse(res.MsgInfo)
                      this.$set(this.costDialog.data, 'Ssa_Name', row.Ssa_Name)
                      this.costDialog.dialogFormVisible = true
                    } else {
                      this.messageInfo(res.ErrInfo)
                      this.costDialog.dialogFormVisible = true
                    }
                  })
            },
            loadDtlInfo (index) {    // 点复选框时，等于获取到明细
                let _this = this
                let Id = _this.listData[index].Bill_Hdr_Id
                Api.get('GetBillStorageAMx', {'Bill_Hdr_Id': Id}).then((res) => {
                    _this.listData[index].ordersDtl = res.MsgInfo
                })
                /*this.toggleDtl(index)
                this.current = index*/
            },
            optionSelect () {  // 入库类型检索
                Api.get('FdGetFiledDtl', {Field_Name: 'Business_Type_Desc'}).then((res) => {
                    this.options = res.MsgInfo
                })
            },
            getAddress (o) {         // 提货地检索
                let param = {
                    Ssa_Id: o.Ssa_Id
                }
                Api.get('GetAddress', param).then((res) => {
                    this.optionsAdress = res.MsgInfo
                })
            },
            selectAdress (obj, o) {         // 带出提货地数据，填入其他文本框
                for (let key in obj) {
                  if (key in o) {
                      o[key] = obj[key]
                  }
                }
                o.TdelAddress = obj.Address_Shortname
                o.TdelAddress_Id = obj.Address_Id
            },
            AcceptanceSelect () {       // 验收评定下拉框数据
                Api.get('FdGetFiledDtl', {Field_Name: 'Acceptance_Check_Rlt'}).then((res) => {
                            this.Check_Options = res.MsgInfo
                        })
            },
            ReasonSelect () {           // 退货原因下拉框数据
                Api.get('FdGetFiledDtl', {Field_Name: 'Rp_Reasons'}).then((res) => {
                            this.Rp_Options = res.MsgInfo
                        })
            },
            toggleDtl (index) {   // 展开明细
                let Id = this.listData[index].Bill_Hdr_Id
                Api.get('GetBillStorageAMx', {'Bill_Hdr_Id': Id}).then((res) => {
                    this.listData[index].ordersDtl = res.MsgInfo
                    if (this.listData[index].ordersDtl.length === 0) {
                        this.current = index
                        this.$message('该汇总下没有明细记录')
                    }
                    if (this.current === index) {
                        this.current = -1
                    } else {
                        this.current = index
                        this.AcceptanceSelect()
                        this.ReasonSelect()
                    }
                })
            },
            addOrderDtl (index) { // 新增明细
                this.current = index
                this.listData[index].isAddDtl = true        // 点击新增明细后改变对应值的状态
                let addObj = {}
                addObj.Instore_Type = this.listData[index].Instore_Type     // 增加入库类型
                addObj.Bill_Dtl_Id = ''
                addObj.Ssa_Name = ''
                addObj.Ssa_Id = ''
                addObj.Address = ''
                addObj.OutStoreBill_Hdr_Id = ''
                addObj.Goods_Id = ''
                addObj.Goods_Lotno = ''
                addObj.Production_Date = ''
                addObj.Valid_Until = ''
                addObj.Contact_Name = ''
                addObj.Contact_Phone = ''
                addObj.Goods_Name = ''
                addObj.Refrigeration_Type_Desc = ''
                addObj.Volume = ''
                addObj.Goods_Weight = ''
                addObj.Manufacturer = ''
                addObj.Actual_Pcs = ''
                addObj.Actual_Sps = ''
                addObj.Actual_Qty = ''
                addObj.Acceptance_Check_Rlt = ''
                addObj.Businessbill_No = ''
                addObj.Drug_Spec = ''
                addObj.Rp_Reasons = ''
                addObj.AssignOperator_Id = ''
                addObj.Address_Id = ''
                addObj.Package_Unit = ''
                addObj.Business_Model = ''
                addObj.Remarks = ''
                addObj.operateType = 'add'
                addObj.Package_Qty = ''
                this.addDtlStor.unshift(addObj)   // 将新增明细存到addDtlStor数组中
                this.listData[index].ordersDtl.unshift(addObj)
                console.log(this.listData[index])
            },
            editOrderInfo (obj) { // 编辑
                obj.isEdit = false
            },
            save (index) { // 保存
                this.listData[index].isEdit = true
                let listItem = this.listData[index]
                let param = {
                    hz_params: {},
                    list_params: []
                }
                param.hz_params = {
                    Bill_Hdr_Id: listItem.Bill_Hdr_Id,
                    TdelAddress_Id: listItem.TdelAddress_Id,
                    Takegds_Time: listItem.Takegds_Time,
                    Operater: Api.userInfo.USERID,
                    Businessbill_No: listItem.Businessbill_No,
                    Remarks: listItem.Remarks
                }
                let temp = 0
                // let listParams = []
                this.listData[index].ordersDtl.forEach(item => {
                    let postData = {
                        Bill_Dtl_Id: item.Bill_Dtl_Id,
                        Outstorebill_No: item.Outstorebill_No,
                        Goods_Id: item.Goods_Id,
                        Goods_Lotno: item.Goods_Lotno,
                        Production_Date: item.Production_Date,
                        Valid_Until: item.Valid_Until,
                        Actual_Qty: item.Actual_Qty,
                        Actual_Pcs: item.Actual_Pcs,
                        Actual_Sps: item.Actual_Sps,
                        Acceptance_Check_Rlt: item.Acceptance_Check_Rlt,
                        Rp_Reasons: item.Rp_Reasons
                    }
                    param.list_params.push(postData)
                    if (!item.Goods_Name) {
                        temp = 1
                        return
                    }
                    if (!item.Actual_Qty) {
                        temp = 2
                        return
                    }
                })
                switch (temp) {
                    case 1: this.$message.error('请填写商品名称 ')
                    return
                    case 2: this.$message.error('入库数量不能为0')
                    return
                }
                param.list_params = JSON.stringify(param.list_params)
                param.hz_params = JSON.stringify(param.hz_params)
                Api.post('BillStorageASave', param).then((res) => {
                    if (res.Flag) {
                        this.$message({
                          message: '恭喜你，保存成功',
                          type: 'success'
                        })
                        this.listData[index].isAddDtl = false    // 保存后明细状态变为false
                        this.current = -1
                        this.init()
                    } else {
                      this.messageInfo(res.ErrInfo)
                    }
                })
            },
            deleteOperate (i, j) { // 删除订单明细   i为一级索引，j为二级索引
                this.$confirm('此操作将永久删除该订单明细, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    if (this.listData[i].ordersDtl[j].Bill_Dtl_Id) {
                        let dtlId = this.listData[i].ordersDtl[j].Bill_Dtl_Id
                        let param = {
                                list_params: {Bill_Dtl_Id: dtlId, Operator_Type: 'del'}
                            }
                        param.list_params = JSON.stringify(param.list_params)
                        Api.post('BillStorageAMod', param).then((res) => {
                            if (res.Flag) {
                              this.$message({
                                message: '删除操作成功',
                                type: 'success'
                              })
                              this.current = -1
                              this.init()
                            } else {
                              this.messageInfo(res.ErrInfo)
                            }
                        })
                    } else {
                        this.listData[i].ordersDtl.splice(j, 1)
                        if (this.listData[i].ordersDtl.length === 0) {
                            this.current = -1
                        }
                    }
                })
            },
            splitPcs (i, j) {    // 拆分件数
                return parseInt(this.listData[i].ordersDtl[j].Actual_Qty / this.listData[i].ordersDtl[j].Package_Qty)
            },
            splitSps (i, j) {       // 拆分零散数
                return this.listData[i].ordersDtl[j].Actual_Qty % this.listData[i].ordersDtl[j].Package_Qty
            },
            splitWeight (i, j, totalNum) {      // 拆分重量
                return parseInt((this.listData[i].ordersDtl[j].Actual_Qty / totalNum) * this.listData[i].ordersDtl[j].Total_Weight)
            },
            splitVolume (i, j, totalNum) {      // 拆分体积
                return parseInt((this.listData[i].ordersDtl[j].Actual_Qty / totalNum) * this.listData[i].ordersDtl[j].Total_Volume)
            },
            splitOperate (splitNum, totalNum, i, j) { // 拆分值，总数量，i为一级索引，j为二级索引
                this.listData[i].ordersDtl.splice(j, 0, this.shallowCopy(this.listData[i].ordersDtl[j]))
                let item = this.listData[i].ordersDtl[j]
                let itemS = this.listData[i].ordersDtl[j + 1]
                item.Actual_Qty = totalNum - splitNum            // 拆分后的数量
                item.Actual_Pcs = this.splitPcs(i, j)                 // 拆分后的件数
                item.Actual_Sps = this.splitSps(i, j)                 // 拆分后的零散数
                item.Total_Weight = this.splitWeight(i, j, totalNum)    // 拆分后的重量
                item.Total_Volume = this.splitVolume(i, j, totalNum)    // 拆分后的体积
                itemS.Actual_Qty = splitNum                             // 拆分数量
                itemS.Actual_Pcs = this.splitPcs(i, j + 1)              // 拆分件数
                itemS.Actual_Sps = this.splitSps(i, j + 1)              // 拆分零散数
                itemS.Total_Weight = this.splitWeight(i, j + 1, totalNum) // 拆分后的重量
                itemS.Total_Volume = this.splitVolume(i, j + 1, totalNum) // 拆分后的体积
                itemS.Bill_Dtl_Id = ''                                    // 拆分单据Id置空
            },
            shallowCopy (obj) { // 浅拷贝
                let dst = {}
                for (let prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                      dst[prop] = obj[prop]
                    }
                }
              return dst
            },
            filterFlag (obj) { // 过滤
                if (this.filterCondition.Businessbill_No === '' || obj.Businessbill_No.indexOf(this.filterCondition.Businessbill_No.trim()) > -1) {
                    if ((this.filterCondition.Business_Type === '' || obj.Business_Type === this.filterCondition.Business_Type)) {
                        if ((this.filterCondition.Ssa_Name === '' || obj.Ssa_Name.indexOf(this.filterCondition.Ssa_Name.trim()) > -1)) {
                                return true
                            }
                    }
                } else {
                    return false
                }
            },
            blankOut () { // 作废
                let arr = []
                let statuFlag = true
                for (let i = 0; i < this.listData.length; i++) {
                    if (this.listData[i].isEdit === true) {
                        if (this.listData[i].isChecked) {
                            arr.push(this.listData[i])
                        }
                    } else {
                        statuFlag = false
                        break
                    }
                }
                console.log(arr)
                if (arr.length > 0) {
                    this.$prompt('请填写作废原因：', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  inputValidator (value) {
                    if (value === null || value.trim() === '') {
                        return '作废原因不能为空'
                    }
                  }
                }).then(({ value }) => {      // value为填写的作废原因
                    // 遍历选中的arr
                    let param = {
                        list_params: []
                    }
                    arr.forEach(item => {
                        let postData = {
                            Bill_Hdr_Id: '',
                            Operator: Api.userInfo.USERID,
                            Cancel_Reason: value,
                            Operator_Type: 'cancel'
                        }
                        postData.Bill_Hdr_Id = item.Bill_Hdr_Id
                        param.list_params.push(postData)
                    })
                    param.list_params = JSON.stringify(param.list_params)
                    Api.post('BillStorageASubmit', param).then((res) => {
                        if (res.Flag) {
                          this.$alert('作废操作成功', '提示', {
                            confirmButtonText: '确定',
                            callback: action => { this.init() }
                          })
                        } else {
                          this.messageInfo(res.ErrInfo)
                        }
                   })
                })
                } else {
                    if (!statuFlag) {
                        this.$alert('请先进行保存，然后再进行其他操作', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    } else {
                        this.$alert('请选择要操作的行', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    }
                }
            },
            pend () { // 审核
                let arr = []
                let statuFlag = true
                for (let i = 0; i < this.listData.length; i++) {
                    if (this.listData[i].isEdit === true) {
                        if (this.listData[i].isChecked) {
                            arr.push(this.listData[i])
                        } else {
                            let count = 0
                            let len = this.listData[i].ordersDtl.length
                            for (let j = 0; j < len; j++) {
                                if (this.listData[i].ordersDtl[j].isChecked) {
                                    count++
                                }
                            }
                            if (count !== 0 && count === len) {
                                 arr.push(this.listData[i])
                            }
                        }
                    } else {
                        statuFlag = false
                        break
                    }
                }
                if (arr.length > 0) {
                    let flag = true
                    for (let i = 0; i < arr.length; i++) {
                        console.log(arr[i].isAddDtl)
                        if (arr[i].ordersDtl.length < 1) {
                            this.$alert('单据没有明细记录，不允许进行审核，可作废或新增明细', '提示', {
                              confirmButtonText: '确定',
                              callback: action => {}
                            })
                            flag = false
                            break
                        }
                        for (let j = 0; j < arr[i].ordersDtl.length; j++) {
                            if (parseInt(arr[i].ordersDtl[j].Actual_Qty) === 0) {
                                this.$alert('单据明细的入库数量为0，不允许进行审核', '提示', {
                                  confirmButtonText: '确定',
                                  callback: action => {}
                                })
                                flag = false
                                break
                            }
                            if (arr[i].isAddDtl) {
                                this.$alert('请先进行保存，然后再进行其他操作', '提示', {
                                  confirmButtonText: '确定',
                                  callback: action => {}
                                })
                                flag = false
                                break
                            }
                        }
                    }
                    if (flag) {
                        // 对选中的数据arr遍历
                        let param = {
                            list_params: []
                        }
                        for (let i = 0; i < arr.length; i++) {
                            let postData = {
                                Bill_Hdr_Id: '',
                                Operator: Api.userInfo.USERID,
                                Cancel_Reason: '%',
                                Operator_Type: 'submit'
                            }
                            postData.Bill_Hdr_Id = arr[i].Bill_Hdr_Id
                            param.list_params.push(postData)
                        }
                        param.list_params = JSON.stringify(param.list_params)
                        Api.post('BillStorageASubmit', param).then((res) => {
                            if (res.Flag) {
                              this.$alert('审核操作成功！', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                  this.init()
                                }
                              })
                            } else {
                              this.messageInfo(res.ErrInfo)
                            }
                        })
                    }
                } else {
                    if (!statuFlag) {
                        this.$alert('请先进行保存，然后再进行其他操作', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    } else {
                        this.$alert('请选择要操作的行', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    }
                }
            },
            combineOrders () { // 计划合并
                let _this = this
                let arr = []
                let statuFlag = true
                for (let i = 0; i < _this.listData.length; i++) {
                    if (_this.listData[i].isEdit === true) {
                        if (_this.listData[i].isChecked) {
                            arr.push(_this.listData[i])
                            console.log(arr)
                        }
                    } else {
                        statuFlag = false
                        break
                    }
                }
                if (arr.length >= 2) {
                    let flag = true
                    for (let i = 0; i < arr.length - 1; i++) {
                        if (arr[i].Con_Name !== arr[i + 1].Con_Name || arr[i].Goods_Type !== arr[i + 1].Goods_Type || arr[i].Arrival_Mode !== arr[i + 1].Arrival_Mode || arr[i].Address_Shortname !== arr[i + 1].Address_Shortname || arr[i].TdelAddress_Shortname !== arr[i + 1].TdelAddress_Shortname) {
                            this.$alert('选择要计划合并订单中的汇总信息（委托方、产品大类、入库方式、入库地、提货地）不一致，不能进行合并', '提示', {
                              confirmButtonText: '确定',
                              callback: action => {}
                            })
                            flag = false
                            break
                          }
                        if (typeof (arr[i].ordersDtl) !== 'undefined' && arr[i].ordersDtl.length > 0 && typeof (arr[i + 1].ordersDtl) !== 'undefined' && arr[i + 1].ordersDtl.length > 0) {
                            if (arr[i].ordersDtl[0].Instore_Type !== arr[i + 1].ordersDtl[0].Instore_Type || arr[i].ordersDtl[0].Business_Model !== arr[i + 1].ordersDtl[0].Business_Model) {
                                this.$alert('选择要计划合并订单中的明细信息（入库类型、商品业务类型）不一致，不能进行合并', '提示', {
                                  confirmButtonText: '确定',
                                  callback: action => {}
                                })
                                flag = false
                                break
                            }
                        } else {
                            _this.$alert('单据没有明细记录，不允许进行计划合并，可作废或新增明细', '提示', {
                              confirmButtonText: '确定',
                              callback: action => {}
                            })
                            flag = false
                            break
                        }
                    }
                    if (flag) {  // 合并操作
                        this.$alert('计划合并成功！', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    }
                } else {
                    if (!statuFlag) {
                        this.$alert('请先进行保存，然后再进行其他操作', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    } else {
                        this.$alert('请选择要计划合并的订单', '提示', {
                          confirmButtonText: '确定',
                          callback: action => {}
                        })
                    }
                }
            },
            getData () {
                // 获取历史数据和当前数据调用不同的接口
                let interFface = this.params.isHisData ? 'GetBillStorageAHis' : 'GetBillStorageA'
                let param = {
                    Con_Id: this.params.Con_Id,
                    Arrival_Mode: this.params.Arrival_Mode,
                    Takegds_Time: this.params.Takegds_Time
                }
                Api.get(interFface, param)
                      .then((res) => {
                        this.current = -1
                        this.listData = res.MsgInfo.map(item => {
                          item['isChecked'] = false         // 添加复选框绑定
                          item['isEdit'] = true             // 给每个增加可编辑的状态
                          item['isAddDtl'] = false          // 增加明细的状态
                          item['ordersDtl'] = []            // 给每个汇总项增加一个ordersDtl属性
                          let TdelAddressObj = {
                            Address_Shortname: item['TdelAddress'],
                            Address_Id: item['TdelAddress_Id']
                          }
                          item.TdelAddressObj = TdelAddressObj
                          return item
                    })
                })
            },
            init () {
                this.filterCondition = {
                    Businessbill_No: '',
                    Business_Type: '',
                    Ssa_Name: ''
                }
                this.getData()
            }
        },
        watch: {
            params () {
                this.init()
            }
        },
        mounted: function () {}
    }
</script>

<style lang='less'>
    /*html, body, #app{
        width: 100%;
        height: 100%;
        min-height: 100%;
        background-color: #f3f3f4;
    }*/
    .orderDetail{
        .tabel-box {
          padding: 15px 0px;
        }
        .el-dialog__header {
            padding: 10px;
            .el-dialog__title {
                font-weight: 700;
            }
        }
        .el-dialog__body {
            padding: 10px;
            .Con_Name {
                margin-top: 0px;
            }
            .destination {
                height: 30px;
                span {
                    display: block;
                    float: left;
                    width: 50%;
                }
            }
            .classify {
                margin: 0;
                padding: 10px 0;
                /* background-color: #DDEBF7; */
            }
            /* .el-table__footer-wrapper thead div, .el-table__header-wrapper thead div {
                background-color: #DDEBF7;
            } */
            .gather {
                margin-top: 20px;
            }
        }
        font-size: 12px;

        .ft-rt{
            float: right;
        }
        .ft-lt{
            float: left;
        }

        .el-button + .el-button{
            margin-left: 20px;
        }

        .search-contain{
            padding: 0 28px;
            .common-input-box{
                display: flex;
                align-items: center;
                label{
                    width: 94px;
                }
            }
        }


        .orderDetailList{
            padding: 25px 28px 74px;
            .el-card{
                margin: 0 0 25px;
                border: 1px solid #e5e5e5;
                /*border-radius: 0;
                box-shadow: none;*/
                overflow: visible;

                .dtl{
                    margin: 0 -20px;
                }

                .dtl-item{
                    border-top: 1px solid #e5e5e5;
                    display: flex;

                    .box-card-contain{
                        padding: 18px 28px;
                        flex: 8;
                        & + div{
                            flex: 1;
                            border-left: 1px solid #e5e5e5;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            a{
                                display: block;
                                text-decoration: none;
                                text-align: center;
                                line-height: 24px;
                                color: #666;
                            }
                        }
                    }
                }

                &.checkedCard{
                    .el-card__header{
                        background-color: #e8f1f5;
                    }
                    .el-card__body{
                        background-color: #f2fbff;
                        .dtl-item, .arrow-up{
                            background-color: #f9fdff;
                        }
                        .arrow-down{
                            background-color: #f2fbff;
                        }
                    }
                }
            }

            .el-card__header{
                padding: 0 30px 0 15px !important;
                border-bottom: 1px solid #e5e5e5;
                background-color: #f5f5f5;
                height: 34px;
                .checkBox{
                    margin-top: 8px;
                }
                .Con{
                    line-height: 34px;
                    margin: 0 60px 0 20px;
                }
            }
            .el-card__body{
                padding-bottom: 0;
            }

            .el-button, [class^="el-icon-mo-"], [class*=" el-icon-mo-"]{
                font-size: 12px;
                color: #666;
            }
            [class^="el-icon-mo-"], [class*=" el-icon-mo-"]{
                margin-right: 6px;
            }

            .box-card-contain{
                padding-bottom: 50px;
                position: relative;
                display: flex;
                flex-wrap: wrap;
            }

            .box-card-content-item{
                display: flex;
                flex-flow: row;
                line-height: 23px;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 20%;
                span:nth-of-type(1){
                    min-width: 94px;
                    width: 94px;
                    display: inline-block;
                    text-align: right;
                    & + span, & + .el-input{
                        flex:1;
                    }
                }
            }

            .arrow-up, .arrow-down{
                position: absolute;
                border-style: solid;
                border-color: #e5e5e5;
                box-sizing: border-box;
                width: 62px;
                height: 15px;
                left: 50%;
                margin-left: -31px;
                background-color: #fff;
                z-index: 999;
                i{
                    position: absolute;
                            font-size: 32px;
                        width: 100%;
                        left: 0;
                        margin: 0;
                        text-align: center;
                            cursor: pointer;
                            &:before{
                                position: absolute;
                            display: block;
                            width: 100%;
                            }
                }
            }
            .arrow-down{
                border-width: 0 1px 1px 1px;
                    bottom: -15px;
                border-radius: 0 0 8px 8px;
                    i{
                            bottom: 0;
                            &:before{
                                bottom: -6px;
                            }
                    }
            }
            .arrow-up{
                border-width: 1px 1px 0;
                bottom: -1px;
                border-radius: 8px 8px 0 0;
                i:before{
                    top: -6px;
                }
            }
        }
        .btns-contain{
            overflow: hidden;
            padding: 18px 40px;
            position: fixed;
            width: 100%;
            bottom: 0;
            left: 0;
            background-color: #fff;
            border-top: 2px solid #ddd;
            box-sizing: border-box;
            z-index: 1000;
            .btns-content{
                float: right;
                .el-button{
                    padding: 0;
                    border: none;
                    width: 120px;
                    height: 36px;
                    line-height: 36px;
                    text-align: center;
                    color: #fff;
                    font-size: 14px;
                }
            }
        }
        .el-input__inner{
            height: 22px !important;
        }

        .feeTryDialog {
          .el-dialog__body {
            min-height: 459px;
            padding: 10px 10px 35px 10px;
            .el-table__body-wrapper {
              max-height: 120px;
              overflow-y: auto;
              overflow-x: hidden;
            }
          }
          .summary-box {
            padding-top: 10px;
          }
        }

        /*.el-input__inner{
            padding: 0 10px;
            height: 26px;
            line-height: 26px;
            border-radius: 0;
            border: 1px solid #dbdbdb;
            color: #666;
            font-size: 12px;
        }
        ::-webkit-input-placeholder{
            color: #666;
        }
        ::-moz-input-placeholder{
            color: #666;
        }
        :-moz-input-placeholder{
            color: #666;
        }
        :-ms-input-placeholder{
            color: #666;
        }*/
    }
</style>
