<template>
    <div>
      <el-dialog class="history-route-dialog" :lock-scroll="true" size="large" top="10%" title="历史路线" :visible.sync="visible">
        <div class="common-condition-box">
          <el-form :inline="true">
            <el-form-item label="关键字" label-width="60px">
              <el-input v-model="form.keyWord" placeholder="请输入承运方或者运营方名称"></el-input>
            </el-form-item>
            <el-form-item label="路线编号" label-width="60px">
              <el-input v-model="form.routeNo"></el-input>
            </el-form-item>
            <el-form-item label="城市：" v-if="filterRoutesHistory.city.data.length > 0">
              <el-checkbox-group v-model="filterRoutesHistory.city.selection">
                <el-checkbox v-for="(item, index) in filterRoutesHistory.city.data" :label="item.Region_Name" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!--<el-form-item>-->
              <!--<el-button type="primary" size="small" icon="search">查询</el-button>-->
            <!--</el-form-item>-->
          </el-form>
        </div>
        <div class="history-route-list">
          <div class="history-item" v-for="rt in realData">
            <div class="head">
              <el-checkbox v-model="rt.select"></el-checkbox>
              <div class="head-item">{{rt.TransportRoute_No}}</div>
              <div class="head-item">单位数：{{rt.Ssa_Count}}个</div>
              <div class="head-item">总件数：{{rt.Pcs_Sum}}件</div>
            </div>
            <div class="body">
              <div class="address-wrapper">
                <div class="address-list" v-show="rt.Route_Dtls.length > 0">
                  <div class="address-item" v-for="(item, index) in rt.Route_Dtls">
                    <div class="title">地址{{index + 1}}</div>
                    <div class="circle" :class="{greCol: index === 0, yeCol: rt.Route_Dtls.length > 2 && index > 0 && index < rt.Route_Dtls.length - 1, reCol: rt.Route_Dtls.length > 1 && index === rt.Route_Dtls.length - 1, last: index === rt.Route_Dtls.length - 1}">
                      <div class="inner-circle"></div>
                    </div>
                    <div class="shixiao" v-if="rt.Route_Dtls.length > 1 && index < rt.Route_Dtls.length - 1">
                      <span>时效</span>
                      <span>{{item.Time_Limit}}</span>
                      <span>h</span>
                    </div>
                    <ul>
                      <li>&nbsp;<span>{{item.Address}}</span></li>
                      <li>&nbsp;<span v-show="item.Address_Id !== '0' && item.Address_Id !== '1'">联系人：{{item.Contact_Name}}</span></li>
                      <li>&nbsp;<span v-show="item.Address_Id !== '0' && item.Address_Id !== '1'">联系电话：{{item.Contact_Phone}}</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <common-row type="flex">
                <common-col>
                  <span class="label">路线频次：</span>
                  <div class="content">
                    <span>{{rt.Frequency}}</span>次/<span>{{rt.Unit_Desc}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">固定运营商：</span>
                  <div class="content">
                    <span :title="rt.Fixed_Operator_Name">{{rt.Fixed_Operator_Name}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">固定承运商：</span>
                  <div class="content">
                    <span :title="rt.Fixed_Carrier_Name">{{rt.Fixed_Carrier_Name}}</span>
                  </div>
                </common-col>
              </common-row>
              <common-row type="flex">
                <common-col>
                  <span class="label">路线类型：</span>
                  <div class="content">
                    <span>{{rt.TransportRoute_Type_Desc}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">运输方式：</span>
                  <div class="content">
                    <span>{{rt.Transport_Mode_Desc}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">备注：</span>
                  <div class="content">
                    <span>{{rt.Remarks}}</span>
                  </div>
                </common-col>
              </common-row>
              <common-row type="flex">
                <common-col>
                  <span class="label">启运时间：</span>
                  <div class="content">
                    <span>{{rt.Fixed_Departure_Time}}</span>
                  </div>
                </common-col>
              </common-row>
            </div>
          </div>
        </div>
        <div slot="footer" class="fixed-footer">
          <el-button type="success" @click="pickSaveHistoryRoute">确认</el-button>
          <el-button type="primary" @click="hide">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import {hasSameItem} from '@/common/js/utils.js'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    export default {
        name: 'historyRouteDialog',
        props: {
          isVisible: {
            type: Boolean,
            default: false
          }
        },
        components: {commonRow, commonCol},
        data () {
            return {
              form: {
                keyWord: '',
                routeNo: '',
                startAddress: '',
                endAddress: ''
              },
              // 起点、终点城市数据(历史路线弹框)
              filterRoutesHistory: {
                city: {
                  data: [],
                  checkAll: false,
                  isIndeterminate: true,
                  selection: []
                }
              },
              visible: this.isVisible,
              gridData: []
            }
        },
        computed: {
          // 过滤后的历史路线信息
          realData () {
            return this.gridData.filter(item => {
              let keyMeta = (item.Fixed_Operator_Name.indexOf(this.form.keyWord) !== -1) || (item.Fixed_Carrier_Name.indexOf(this.form.keyWord) !== -1)
              let cityMeta
              if (this.filterRoutesHistory.city.selection.length > 0) {
                cityMeta = hasSameItem(this.filterRoutesHistory.city.selection, item.cityGroup)
              }
              return (!this.form.routeNo || item.TransportRoute_No.indexOf(this.form.routeNo) !== -1) && (this.filterRoutesHistory.city.selection.length === 0 || cityMeta) && (!this.form.keyWord || keyMeta)
            })
          },
          selection () {
            return this.realData.filter((item) => item.select)
          }
        },
        watch: {
          visible (val) {
            this.$emit('update:isVisible', val)
            if (val) {
              this.getData()
              this.getCityConditionHistory()
            }
          },
          isVisible (val) {
            this.visible = val
          }
        },
        methods: {
          hide () {
            this.$emit('update:isVisible', false)
          },
          getData () {
            Api.post('TMP_TransportTaskDD_GetHisRoutes', {Operator_Id: Api.userInfo.Operator_Id})
              .then((resp) => {
                if (resp.Flag) {
                  this.gridData = JSON.parse(resp.MsgInfo).map((item) => {
                    item.cityGroup = item.Route_Dtls.map(item => item.City_Name)
                    item.isHistory = (item.TransportRoute_Type === 'GD')
                    item.select = false
                    return item
                  })
                  console.log(this.gridData)
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 获取城市筛选条件(历史路线弹框)
          getCityConditionHistory () {
            Api.get('TMP_TransportTaskScheding_Yd_GetHistoryFilter', {Operator_Id: Api.userInfo.Operator_Id})
              .then((resp) => {
                if (resp.Flag) {
//                  Region_Name
                  this.filterRoutesHistory.city.data = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
//          选取保存历史路线
          pickSaveHistoryRoute () {
            if (this.selection.length === 0) {
              this.$alert('请选择历史路线')
              return false
            }
            let params = {
              TransportRoute_Id: this.selection.map((item) => item.TransportRoute_Id).join(',')
            }
            Api.post('TMP_TransportTaskDD_PickConfirmRoute', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('提取历史路线成功')
                    .then(() => {
                      this.$emit('select', this.selection)
                      this.hide()
                    })
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          }
        },
        created () {
        },
        mounted () {
          this.getCityConditionHistory()
        }
    }
</script>
<style lang="less" scoped>
  .history-route-dialog {
    .history-route-list {
      overflow-x: hidden;
      overflow-y: auto;
      height: 337px;
      .history-item {
        /*width: 100%;*/
        font-size: 12px;
        height: 335px;
        border: 1px solid #e3e3e3;
        .head {
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
          background-color: #EAEEF4;
          .head-item {
            padding: 0px 10px;
            display: inline-block;
          }
        }
        .body {
          padding: 10px 15px;
          .address-list {
            .address-item {
              .circle {
                padding: 2px 5px;
              }
            }
          }
        }
      }
    }
    /*.fixed-footer {*/
      /*width: 100%;*/
      /*-webkit-box-sizing: border-box;*/
      /*-moz-box-sizing: border-box;*/
      /*box-sizing: border-box;*/
      /*padding: 30px;*/
      /*background-color: #fff;*/
      /*position: fixed;*/
      /*bottom: 0px;*/
      /*left: 0px;*/
      /*right: 0px;*/
    /*}*/
  }
</style>
