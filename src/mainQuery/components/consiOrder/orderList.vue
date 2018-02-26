<template>
  <div class="consi-main-orderList" ref="mainOrderList">
    <div class="consi-maind-orderList-fiexd" ref="mainHeights">
      <div class="headbars">
            <div class="common-row">
                <label>当前位置：</label>
                <div class="common-col">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item  @click.native="goBack(-1)">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>订单汇总</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
      </div>
      <div class="common-condition-box">
        <el-form :inline="true" size="small" label-width="60px">
          <div class="common-select-group-box">
            <el-form-item label="订单状态">
              <select-order
              @change="orderStatus"
              @loaded="getMainHeight"
              :field="serviceTypeOrders"></select-order>
            </el-form-item>
          </div>
          <div class="main-input">
            <el-form-item label="委托方" >
              <el-input
              class="noselect"
              v-model="consignor.Con_Name"
              placeholder="双击选择或手工录入"
              @dblclick.native="consignor.isVisible = true"
              :on-icon-click="clearBalance"></el-input>
            </el-form-item>
            <el-form-item label="起始日期">
              <el-date-picker v-model="condition.startDate" type="date" placeholder="选择日期">
                &gt;
            </el-date-picker>
              </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker v-model="condition.endDate" type="date" placeholder="选择日期" >
                &gt;
            </el-date-picker>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-input placeholder=" 助记码、名字、编号" v-model="Ssa_Name"></el-input>
            </el-form-item>
            <el-form-item label="单据编号">
               <el-input v-model="ConOrder_No"></el-input>
              </el-form-item>
            <el-form-item label="订单管理">
              <el-select v-model="condition.orderSelected" placeholder="请选择" @change="chooseOrder">
                <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.label">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="setButton-width">
              <el-button size="small" type="primary" icon="el-icon-search" @click="nextTo">
                  查询
               </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="toolbar">
      <div class="btn-box">
        <ul>
          <li><span>总订单数：</span><span>{{hotData.DD_Num}}</span></li>
          <li><span>已完成订单数：</span><span>{{hotData.YWCDD_Num}}</span></li>
          <li><span>未完成订单数：</span><span>{{hotData.WWCDD_Num}}</span></li>
          <li><span>总客户数：</span><span>{{hotData.Ssa_Num}}</span></li>
          <li><span>总件数：</span><span>{{hotData.Actual_Pcs_Num}}</span></li>
          <li><span>异常订单数：</span><span>{{hotData.YCDD_Nume}}</span></li>
          <li><span>超期订单数：</span><span>{{hotData.CQDD_Num}}</span></li>
          <li><span>超标单数：</span><span>{{hotData.CBDD_Num}}</span></li>
        </ul>
      </div>
    </div>
    <div class="table-box">
     <el-table :data="tableData">
      <el-table-column prop="Invoice_Time" label="日期" width="160"></el-table-column>
      <el-table-column prop="Con_Name" label="委托方" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ConOrder_No" label="业务单据号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Ssa_Name" label="客户名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Bill_TransportA_Dtl_State_Name" label="订单状态" width="100"></el-table-column>
      <el-table-column prop="Actual_Pcs_Num" label="总件数" width="80"></el-table-column>
      <el-table-column prop="Planned_Volume_Num" label="总体积m³" width="90"></el-table-column>
      <el-table-column prop="Planned_Weight_Num" label="总重量kg" width="90"></el-table-column>
      <el-table-column label="操作">
       <template slot-scope="scope">
        <el-button class="primary" type="text" size="small" @click="linkDetail(scope.$index, scope.row)">
         订单详情
        </el-button>
        <el-button class="primary" type="text" size="small" @click="linkLoInfo(scope.$index, scope.row)">
         物流详情
        </el-button>
        <el-button class="primary" type="text" size="small" @click="linkPosition(scope.$index, scope.row)">
         位置查询
        </el-button>
       </template>
      </el-table-column>
     </el-table>
    </div>
    <div class="blockPage">
     <el-pagination v-show="page.isShow" layout="total, prev, pager, next, jumper" :page-size="page.pageSize" :total="page.total" @current-change="handleCurrentChange">
     </el-pagination>
    </div>
    <consi-modal :visible.sync="consignor.isVisible" @change="confirm"></consi-modal>
  </div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt } from '@/common/js/utils'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    import consiModal from '@/common/service/modal/consi-modal'
    import commonDialog from '@/common/components/common-dialog.vue'
    import selectOrder from '@/common/service/select/select-order'
    // import selectOrderStatus from '@/common/service/select/select-service-orderStatus'

    export default {
        //订单状态
        name: 'orderList',
        props: [],
        components: {commonRow, commonCol, consiModal, selectOrder},
        data () {
          return {
            options: [
              {
                label: '所有订单'
              },
              {
                label: '异常订单'
              }
            ],
            isHeight: true, //设置器跳转到首页无法获取高度，故设置节流阀
            tableData: [],
            hotData: [],
            Ssa_Name: '', //客户名称
            ConOrder_No: '', //单据编号
            serviceTypeOrders: 'Bill_TransportA_Dtl_State',
            // serviceTypeSS: 'TransportPlan_Type',
            // serviceItem: '',
            Bill_TransportA_Dtl_State: '', //单据状态
            condition: {
              startDate: '',
              endDate: '',
              orderSelected: '' //订单管理
              // orderSelecting: '' //订单类型
            },
            consignor: {
              isVisible: false,
              // Con_Name: '珠海丽珠试剂股份有限公司', //委托名
              // Con_Id: 'edca5028b9afe711b639000c29d6c8f4' //委托方id
              Con_Name: this.$route.params.Con_Name,
              Con_Id: this.$route.params.Con_Id
            },
            currentPage: 1,
            page: {
              total: 0,  // 总条目数
              StartIndex: 0,
              PageSize: 10,
              isShow: false  // 总条数少于10，不显示分页项
            },
            HzParam: {} //汇总请求数据
          }
        },
        computed: {
        },
        methods: {
          orderStatus (val) { //获取多选的 子传父 获取订单状态
            this.Bill_TransportA_Dtl_State = val
            console.log(this.Bill_TransportA_Dtl_State)
          },
          chooseOrder (val) { // 获取订单管理
            this.condition.orderSelected = val
          },
          handleCurrentChange (num) {  // 分页
          console.log(num)
          this.currentPage = num
            this.page.StartIndex = (this.currentPage - 1) * this.page.PageSize
            this.getOrders()
          },
          confirm (rows) {
            this.consignor.Con_Id = rows.Con_Id
            this.consignor.Con_Name = rows.Con_Name
          },
          nextTo () {
             if (!(this.condition.startDate && this.condition.endDate)) {
              this.$alert('请填写相应的起止日期', '提示称', {
                  confirmButtonText: '确定'
              })
              return
            }
            if (!this.consignor.Con_Name) {
              this.consignor.Con_Id = ''
            }
            this.getOrders()
          },
          getOrders () {
            this.page.isShow = false
            this.condition.startDate = this.condition.startDate ? this.condition.startDate : ''
            this.condition.endDate = this.condition.endDate ? this.condition.endDate : ''
            let temp = {}
            if (this.condition.orderSelected === '异常订单') {
                temp.orderSelected = 'ZY'
            } else {
              temp.orderSelected = '%'
            }
            temp.Bill_TransportA_Dtl_State = this.Bill_TransportA_Dtl_State ? this.Bill_TransportA_Dtl_State : '%'
            temp.ConOrder_No = this.ConOrder_No ? this.ConOrder_No : '%'
            temp.Ssa_Name = this.Ssa_Name ? this.Ssa_Name : '%'
            temp.Con_Id = this.consignor.Con_Id ? this.consignor.Con_Id : '%'
            let param = {}
            param.Start_Invoice_Time = DateFtt('yyyy-MM-dd', this.condition.startDate)
            param.End_Invoice_Time = DateFtt('yyyy-MM-dd', this.condition.endDate)
            param.Ssa_Name = temp.Ssa_Name
            param.ConOrder_No = temp.ConOrder_No
            param.startIndex = this.page.StartIndex
            param.pageSize = this.page.PageSize
            param.Con_Id = temp.Con_Id
            param.Bill_TransportA_Dtl_State = temp.Bill_TransportA_Dtl_State
            param.DDLX = temp.orderSelected
            this.HzParam = param
            this.getOdersData()
            this.getHotData()
          },
          getOdersData () {
             Api.get('TmpCSNGetBillTransportADtlSYHZ', this.HzParam).then((res) => {
              if (res.Flag) {
                this.tableData = res.MsgInfo
                  if (res.MsgInfo.length > 0) {
                    this.page.total = this.tableData[0].bigTotalItems
                    this.page.isShow = true
                  }
                }
            })
          },
          getHotData () {
            Api.get('TmpCSNGetBillTransportADtlTB', this.HzParam).then((res) => {
                  if (res.Flag) {
                      if (res.MsgInfo.length > 0) {
                        this.hotData = res.MsgInfo[0]
                        console.log(this.hotData)
                      }
                  }
              })
          },
          linkDetail (index, row) {
            let params = {
			  	    row: JSON.stringify(row)
			      }
              this.$router.push({
              name: 'orderDetail',
              params: params
            })
          },
          linkLoInfo (index, row) {
            let params = {
			  	    row: JSON.stringify(row)
			      }
              this.$router.push({
              name: 'logisticInfo',
              params: params
            })
          },
          linkPosition (index, row) {
            console.log(row)
            let url = '../HtmlPages/JLPFrame/OrderSitSearch.html'
            url += '?' + 'ConOrder_No' + '=' + row.ConOrder_No
            let params = {
			  	    row: JSON.stringify(row)
            }
            window.top.Myhome.addTabEx('位置查询', url)
            // window.location.href = url
          },
          init () {      // 设置起止时间默认值
              // this.condition.endDate = new Date()
              // this.condition.startDate = new Date(new Date().setMonth(new Date().getMonth() - 1))
              this.condition.endDate = this.$route.params.endDate
              this.condition.startDate = this.$route.params.startDate
          },
          clearBalance () {
            this.consignor.Con_Name = ''
            this.consignor.Con_Id = '%'
          },
          goBack (num) {
                this.$router.go(num)
                this.isHeight = false
          },
          getMainHeight () {
            console.log('执行了')
            if (this.isHeight) {
              let mainH = this.$refs.mainHeights.offsetHeight
              console.log(mainH)
              this.$refs.mainOrderList.style.paddingTop = mainH + 'px'
            }
          }
        },
        created () {
              this.condition.orderSelected = this.options[0].label
              this.init()
              this.getOrders()
              this.getHotData()
        },
        activated () {
          this.getOrders()
        },
        mounted () {
          // window.onload = this.getMainHeight
          window.addEventListener('resize', this.getMainHeight)
        }
    }
</script>
<style lang="less">
  .consi-main-orderList {
    padding:20px;
    padding-bottom:48px;
    box-sizing: border-box;
    .consi-maind-orderList-fiexd {
      position: fixed;
      background-color: #fff;
      box-sizing: border-box;
      z-index:99;
      top:0px;
      left:0px;
      width:100%;
      padding-left:20px;
      padding-right:20px;
       .headbars {
        width:100%;
        margin-bottom: 10px;
        padding-left:15px;
        padding-top: 20px;
        box-sizing: border-box;
        label {
            line-height: 23px;
        }
      }
      .common-condition-box {
          .el-checkbox {
            margin-left: 12px;
          }
          .main-input {
              .el-form-item {
                  width: 180px;
                  margin-right:0px;
                  .el-input__inner {
                     width: 115px;
                  .el-form-item__label {
                  }
                }
            }
            .setButton-width {
              width:80px;
            }
            .el-date-editor.el-input {
               width: 115px;
            }
          }
       }
    }
    .toolbar {
      .btn-box {
        ul {
          li {
            float: left;
            margin-right: 24px;
           }
         }
       }
     }
    }
    .table-box {
       .el-table {
          .cell {
            padding-right:0px;
            padding-left:10px;
            .el-button {
              margin-left:0px;
              margin-right:2px;
            }
          }
        }
    }
    .blockPage {
       position: fixed;
       z-index:998;
       bottom: 0px;
       left: 50%;
       box-sizing: border-box;
       transform: translate(-50%,0);
       background-color: #fff;
       width:100%;
       height: 48px;
       .el-pagination {
         margin:10px;
       }
    }
</style>
