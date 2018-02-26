<template>
    <div class="mainContainer">
        <!-- 按钮 -->
        <div class="toolbar">
            <div class="btn-box">
                <el-button type="text" icon="el-icon-plus" @click="freeBill">费用生成</el-button>
            </div>
        </div>
        <!-- 查询表单 -->
        <div class="common-condition-box">
            <el-form :inline="true" size="small" :model="condition">
                <el-form-item label="运营方：">
                    <!-- <el-input v-model="condition.Operator_Name" @dblclick.native="showDialog('Operator')" disabled placeholder="双击选择委托方"></el-input> -->
                    <el-input class="noselect" v-model="condition.Operator_Name" placeholder="双击选择"
                    @dblclick.native="showDialog('Operator')"
                    icon="el-icon-close"
                    :on-icon-click="deleteOper"
                    :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="委托方：">
                    <!-- <el-input v-model="condition.Con_Name" @dblclick.native="showDialog('Consignor')" disabled placeholder="双击选择委托方"></el-input> -->
                    <el-input class="noselect" v-model="condition.Con_Name" placeholder="双击选择"
                    @dblclick.native="showDialog('Consignor')"
                    icon="el-icon-close"
                    :on-icon-click="deleteCon"
                    :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="结算时间：">
                    <el-date-picker
                      v-model="condition.End_Date"
                      type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="search">查询</el-button>
              </el-form-item>
            </el-form>
        </div>
        <!-- 表格 -->
        <div class="table-box">
            <el-table :data="origData" stripe  @selection-change="selectData">
              <el-table-column type="selection" label="全选" class="number"></el-table-column>
              <el-table-column type="index" label="序号" width="60"></el-table-column>
              <el-table-column prop="Con_Name" label="委托方" width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Ldc_Name" label="物流中心"  width="180" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Business_Model" label="计划类型" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Service_Type_Desc" label="费用类型" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Service_Item_Desc" label="服务项目" :show-overflow-tooltip="true"></el-table-column>
              <!-- <el-table-column prop="Charging_Rule" label="计费规则类型" width="120"></el-table-column> -->
              <el-table-column prop="Refrigeration_Type" label="温层" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Begin_Date" label="开始日期" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="End_Date" label="结束日期" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="Total_Amount" label="结算金额(元)"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="80">
                <template slot-scope="scope">
                  <el-button 
                    @click.native.prevent="toDetail(scope.row)"
                    type="text"
                    size="small">
                    查看明细
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                    <div v-show="props.row.Lease_Id">
                        <div class="classify">租赁信息：</div>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <common-row>
                                <common-col>
                                    <el-form-item label="租赁温度">
                                      <span>{{ props.row.Refrigeration_Type1 }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="租赁面积(m³)">
                                      <span>{{ props.row.Rental_Area }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="租赁货位(立库)">
                                      <span>{{ props.row.Rental_Location_A }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="租赁货位(整件)">
                                      <span>{{ props.row.Rental_Location_B }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="租赁货位(零货)">
                                      <span>{{ props.row.Rental_Location_C }}</span>
                                    </el-form-item>
                                    
                                </common-col>
                                <common-col>
                                    <el-form-item label="租赁开始时间">
                                      <span>{{ props.row.Start_Time }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="租赁结束时间">
                                      <span>{{ props.row.End_Time }}</span>
                                    </el-form-item>
                                </common-col>
                            </common-row>
                        </el-form>
                    </div>
                    <div>
                        <div class="classify" style="margin-top:10px;">规则信息：</div>
                        <el-form label-position="left" inline class="demo-table-expand">
                            <common-row>
                                <common-col>
                                    <el-form-item label="计划类型">
                                      <span>{{ props.row.Business_Model }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="费用类型">
                                      <span>{{ props.row.Fee_Category }}</span>
                                    </el-form-item>
                                </common-col>
                                <!-- <common-col>
                                    <el-form-item label="存储要求">
                                      <span>{{ props.row.store }}</span>
                                    </el-form-item>
                                </common-col> -->
                                <common-col>
                                    <el-form-item label="服务项目">
                                      <span>{{ props.row.Service_Item_Desc }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="计费规则类型">
                                      <span>{{ props.row.Charging_Rule }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="协议价(元)">
                                      <span>{{ props.row.Price_Agreement }}</span>
                                    </el-form-item>
                                </common-col>
                                <common-col>
                                    <el-form-item label="计费规则">
                                      <span>{{ props.row.Calculation_Rule }}</span>
                                    </el-form-item>
                                </common-col>
                            </common-row>
                        </el-form>
                    </div>
                </template>
              </el-table-column>
            </el-table>
        </div>
       <div class="wrapper-footer">
         <el-pagination
           @current-change="pageChange"
           :current-page.sync="pages.currentPage"
           :page-size="pages.pageSize"
           layout="total, prev, pager, next"
           :total="pages.totalItems">
         </el-pagination>
       </div>
       <!-- 运营商弹框组件 -->
       <operator-modal :visible.sync="dialogShow.Operator" @change="selectOper"></operator-modal>
       <!-- 委托方弹框组件 -->
       <consignor-modal :visible.sync="dialogShow.Consignor" @change="selectCons"></consignor-modal>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    import operatorModal from '@/common/service/modal/operator-modal'
    import consignorModal from '@/common/service/modal/consi-modal'
    import { DateFtt } from '@/common/js/utils'
    export default {
        name: 'feeList',
        props: [],
        components: {commonRow, commonCol, operatorModal, consignorModal},
        data () {
            return {
                selectTableData: [],    // 被选中的数据
                condition: {
                    Con_Name: '',     // 委托方
                    Con_Id: '',
                    Operator_Id: '',        // 运营方
                    Operator_Name: '',
                    End_Date: new Date()           // 日期
                },
                origData: [],
                pages: {
                  currentPage: 1,
                  pageSize: 10,
                  totalItems: 1
                },
                dialogShow: {
                    Operator: false,
                    Consignor: false
                }
            }
        },
        computed: {},
        methods: {
            freeBill () {  //费用生成按钮功能
                if (this.selectTableData.length > 0) {
                    let paramData = []
                    this.selectTableData.forEach((item) => {
                        let row = {
                            Rec_Id: item.Rec_Id,
                            Operator_Id: item.Operator_Id,
                            SettleUp_Company_Id: item.SettleUp_Company_Id,
                            Service_Type: item.Service_Type,
                            Service_Item: item.Service_Item,
                            Begin_Date: item.Begin_Date,
                            End_Date: item.End_Date
                        }
                        paramData.push(row)
                    })
                    console.log(JSON.stringify(paramData), '传入费用生成数据')
                    let params = {
                        list_params: JSON.stringify(paramData)
                    }
                    Api.post('Bal_JlpStoreFeeSubmit', params).then(res => {
                        this.loadingWait.close()
                        if (res.Flag === true) {
                          this.$alert('执行成功！', '友情提示', {
                            confirmButtonText: '确定'
                          }).then(() => {
                            this.getData()
                          })
                        } else {
                          this.$alert(res.ErrInfo)
                        }
                    })
                } else {
                    this.$alert('请选择要操作的行', '提示', {
                        confirmButtonText: '确定'
                    })
                }
            },
            search () {       // 查询
                this.pages.currentPage = 1
                this.pages.totalItems = 0
                this.getData()
            },
            selectData (val) {     // 全选
                console.log(val, '选中的数据')
                this.selectTableData = val
            },
            pageChange () {
                this.getData()
            },
            toDetail (row) {        //查看明细
                this.$router.push({
                    name: 'busiList',
                    params: {
                        Rec_Id: row.Rec_Id,
                        Operator_Id: row.Operator_Id,
                        SettleUp_Company_Id: row.SettleUp_Company_Id,
                        Service_Type: row.Service_Type,
                        Service_Item: row.Service_Item,
                        Begin_Date: row.Begin_Date,
                        End_Date: row.End_Date//DateFtt('yyyy-MM-dd', this.condition.End_Date, true)
                    }
                })
            },
            showDialog (val) {
                console.log(val)
                this.dialogShow[val] = true
            },
            selectOper (row) {
                console.log(row)
                this.condition.Operator_Id = row.Operator_Id
                this.condition.Operator_Name = row.Operator_Name
            },
            selectCons (row) {
                this.condition.Con_Id = row.Con_Id
                this.condition.Con_Name = row.Con_Name
            },
            deleteOper () {
                this.condition.Operator_Name = ''
                this.condition.Operator_Id = '%'
            },
            deleteCon () {
                this.condition.Con_Name = ''
                this.condition.Con_Id = '%'
            },
            getData () {
                let params = {
                  Operator_Id: this.condition.Operator_Id ? this.condition.Operator_Id : '%',
                  Danw_Id: this.condition.Con_Id ? this.condition.Con_Id : '%',
                  End_Date: DateFtt('yyyy-MM-dd', this.condition.End_Date, true),
                  StartIndex: (this.pages.currentPage - 1) * 10,
                  PageSize: this.pages.pageSize
                }
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('Bal_JlpStoreFeeHz', params).then(res => {
                    this.loadingWait.close()
                  if (res.Flag) {
                    this.origData = res.MsgInfo
                    this.pages.totalItems = res.MsgInfo[0] ? res.MsgInfo[0].Sum_Cnt : 0
                    console.log(this.origData, '汇总数据')
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            init () {
                this.getData()
            }
        },
        created () {
        },
        mounted () {
            this.init()
        }
    }
</script>
<style lang="less">
    .mainContainer {
        padding: 150px 10px 10px;
        .toolbar, .common-condition-box {
            margin-bottom:15px;
            position: fixed;
            left: 25px;
            right: 25px;
            z-index: 10;
        }
        .common-condition-box{
            top: 67px;
            background-color: #fff;
            margin-bottom: 0;
            &:after{
                content: '';
                position: absolute;
                height: 15px;
                background-color: #fff;
                left: -1px;
                right: -1px;
                bottom: -16px;
            }
        }
        .toolbar{
            width: auto;
            top: 10px;
            &:after{
                content: '';
                position: absolute;
                height: 15px;
                background-color: #fff;
                left: -1px;
                right: -1px;
                bottom: -15px;
            }
            &:before{
                content: '';
                position: absolute;
                height: 10px;
                background-color: #fff;
                left: -1px;
                right: -1px;
                top: -10px;
            }
        }
        .table-box {
            position: relative;
            z-index: 9;
            .classify {
                margin-bottom: 10px;
                font-size:14px;
                color: #20a0ff;
            }
            .demo-table-expand {
                font-size: 0;
            }
            .demo-table-expand label {
                width: 120px !important;
                color: #99a9bf;
                font-size:14px;
            }
            .demo-table-expand .el-form-item {
                margin-right: 0;
                margin-bottom: 0;
                /* width: 50%; */
            }
        }
    }
</style>
