<template>
  <div class="consi-action">
    <div style="background: #fff">
      <div class="box-btn">
        <el-button icon="el-icon-plus" type="text" @click="addToBillOrder" size="small" v-show="isRoute">加入委托单</el-button>
        <el-button icon="el-icon-mo-refresh" type="text" @click="getTransportTaskWTDInitRoute('')" size="small" v-show="isRoute">刷新
        </el-button>
        <el-button icon="el-icon-mo-entrustmentNew" type="text" size="small" @click="addWtdInfo" v-show="!isRoute">新委托单
        </el-button>
        <el-button icon="el-icon-minus" type="text" size="small" @click="deleteFromBillOrder" v-show="!isRoute">删除路线</el-button>
        <el-button icon="el-icon-mo-entrustmentCancellation" type="text" size="small" @click="deleteWtdInfo" v-show="!isRoute">
          取消委托单
        </el-button>
        <el-button icon="el-icon-mo-contactPerson" type="text" size="small" @click="showCarryInfoDialog" v-show="!isRoute">
          确认承运商
        </el-button>
        <el-button icon="el-icon-mo-contactPerson" type="text" size="small" v-show="!isRoute" @click="showOperatorInfoDialog">
          确认运营商
        </el-button>
        <span v-if="isRoute" style="margin-left: 15px;font-size: 14px;font-weight: bold;">
        {{checkedWTDrightAddedArr.TransportEntrust_No?checkedWTDrightAddedArr.TransportEntrust_No:''}}
        </span>
        <span v-if="isRoute" style="margin-left: 15px;font-size: 14px;font-weight: bold;">
        {{checkedWTDrightAddedArr.TransportEntrust_Route?checkedWTDrightAddedArr.TransportEntrust_Route:''}}
        </span>
        <el-radio-group v-model="isRoute" class="box-btn-right">
          <el-radio-button :plain="!isRoute" :label="true" @change="switchTO">路线</el-radio-button>
          <el-radio-button :plain="isRoute" :label="false" @change="switchTO">委托单</el-radio-button>
        </el-radio-group>
        <!-- <el-button-group class="box-btn-right">
           <el-button type="primary" :plain="!isRoute" @click="switchTO">路线</el-button>
           <el-button type="primary" :plain="isRoute" @click="switchTO">委托单</el-button>
         </el-button-group>-->
      </div>
      <div class="conditions" v-show="!formSearch.showConditions&&isRoute">
        <el-form label-width="80px" :inline="true">
          <el-form-item label="路线编号:">
            <el-input v-model="formSearch.transportRouteNo"></el-input>
          </el-form-item>
          <el-form-item label="路线类型:">
            <el-select v-model="formSearch.selectTransportRouteType" placeholder="请选择" clearable>
              <el-option :label="item.Value_Desc" :value="item.Value_Data" :key="index"
                         v-for="(item,index) in formSearch.transportRouteType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址:">
            <el-checkbox-group v-model="formSearch.selectedAddress">
              <el-checkbox :label="item.Region_Name" name="type"
                           v-for="(item,index) in formSearch.address" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="conditions" v-show="!formSearch.showConditions&&!isRoute">
        <el-form label-width="80px" :inline="true">
          <el-form-item label="路线编号:">
            <el-input v-model="wtdFormSearch.transportRouteNo"></el-input>
          </el-form-item>
          <el-form-item label="路线类型:">
            <el-select v-model="wtdFormSearch.selectTransportRouteType" placeholder="请选择" clearable>
              <el-option :label="item.Value_Desc" :value="item.Value_Data" :key="index"
                         v-for="(item,index) in formSearch.transportRouteType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址:">
            <el-checkbox-group v-model="wtdFormSearch.selectedAddress">
              <el-checkbox :label="item.Region_Name" name="type"
                           v-for="(item,index) in wtdFormSearch.address" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-show="isRoute">
      <div :style="{marginTop:formSearch.showConditions?'88px':'130px'}">
        <el-card class="box-card" v-for="(item,index) in selectTransportList" :key="index"
                 :body-style="{ padding: '0px' }">
          <div class="clearfix cart-box" style="border-bottom: 1px solid #ccc">
            <el-checkbox v-model="item.checked"></el-checkbox>
            <span class="cart-box-span">{{item.TransportRoute_No}}</span>
            <span class="cart-box-span">单位数：{{item.Ssa_Count}}个</span>
            <span class="cart-box-span">总件数：{{item.Pcs_Sum}}件</span>
            <el-button style="float: right;" type="text" @click="getBillByRoute(item.TransportRoute_Id,item.$index)"
                       v-if="item.dataList.length===0">显示
            </el-button>
            <el-button style="float: right;" type="text" @click="deleteBillByRoute" v-if="item.dataList.length>0">隐藏
            </el-button>
          </div>
          <div class="route-map">
            <div class="route-map-content">
              <div v-for="(route,index) in item.Route_Dtls" :key="index"
                   :class="{'route-map-left':index===0,'route-map-right':index===item.Route_Dtls.length-1}"
                   class="route-map-item">
                <div>地址&nbsp;{{index+1}}</div>
                <div class="route-map-time" v-if="index!==item.Route_Dtls.length-1">时效:&nbsp;{{route.Time_Limit_Desc}}
                </div>
                <div class="circle"
                     :class="{'first-circle':index===0,'last-circle':index===item.Route_Dtls.length-1}"></div>
                <div>{{route.Address_Shortname}}</div>
                <div v-if="route.Contact_Name">联系人:&nbsp;{{route.Contact_Name}}</div>
                <div v-if="route.Contact_Phone">电话:{{route.Contact_Phone}}</div>
              </div>
            </div>
          </div>
          <div class="box-body-content">
            <el-row class="box-card-item">
              <el-col :span="8">
                路线频次:&nbsp;&nbsp;{{item.Frequency}}&nbsp;&nbsp;次/&nbsp;&nbsp;{{item.Unit_Desc}}
              </el-col>
              <el-col :span="8">
                固定运营商:&nbsp;&nbsp;{{item.Fixed_Operator_Name}}
              </el-col>
              <el-col :span="8">
                固定承运商:&nbsp;&nbsp;{{item.Fixed_Carrier_Name}}
              </el-col>
            </el-row>
            <el-row class="box-card-item">
              <el-col :span="8">
                路线类型:&nbsp;&nbsp;{{item.TransportRoute_Type_Desc}}
              </el-col>
              <el-col :span="8">
                运输方式:&nbsp;&nbsp;{{item.Transport_Mode_Desc}}
              </el-col>
              <el-col :span="8">
                备注:&nbsp;&nbsp;{{item.Remarks}}
              </el-col>
            </el-row>
            <el-row class="box-card-item">
              <el-col :span="8">
                启运时间:&nbsp;&nbsp;{{item.Fixed_Departure_Time}}
              </el-col>
            </el-row>
          </div>
          <el-table :data="item.dataList" style="width: 100%" @expand="getBillByRouteDetail" class="card-table"
                    v-if="item.dataList.length>0">
            <el-table-column prop="Con_Name" label="委托方" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="TransportPlan_Type_Desc" label="运输任务类型" width="135"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="Start_City" label="起点市" show-overflow-tooltip></el-table-column>
            <el-table-column prop="End_City" label="终点市" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Ssa_Count" label="单位数" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Pcs_Sum" label="总件数" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Volume_Sum" label="总体积（m³）" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight_Sum" label="总重量（KG）" width="130" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Refrigeration_Type_Desc" label="温层" width="130"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="Time_Limit_Desc" label="时效" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Vehicle_Request_Desc" label="车辆要求" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Vehicle_Size_Desc" label="车辆大小" show-overflow-tooltip></el-table-column>
            <el-table-column type="expand" label="查看">
              <template slot-scope="props">
                <el-table
                  :data="props.row.dataDetailList"
                  style="width: 100%">
                  <el-table-column prop="ConOrder_No" label="委托方订单号" width="150" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="Ssa_Name" label="单位名称" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="Address" label="单位地址" width="250" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="TotalPcs_Num" label="件数" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="Gross_Volume" label="体积（m³）" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="Gross_Weight" label="重量（KG）" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="Terminal_Carrier_Name" label="末端承运商" show-overflow-tooltip></el-table-column>
                </el-table>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div v-show="!isRoute">
      <div :style="{marginTop:formSearch.showConditions?'88px':'130px'}">
        <el-card class="box-card" v-for="(item,outIndex) in selectWTDrightAddedArr" :key="outIndex"
                 :body-style="{ padding: '0px' }">
          <div class="clearfix cart-box">
            <el-checkbox v-model="item.checked" @change="selectCheckOne(item.$index,item.checked)"></el-checkbox>
            <span class="cart-box-span">{{item.TransportEntrust_No}}</span>
            <span class="cart-box-span" v-if="!item.Remark">{{item.TransportEntrust_Route}}</span>
            <span class="cart-box-span" v-if="item.Remark" style="color: #33a52e">{{item.Remark}}</span>
            <el-button style="float: right;" type="text" @click="showRouteInfos(item.$index)"
                       v-if="!item.showRouteInfos">
              显示
            </el-button>
            <el-button style="float: right;" type="text" @click="hiddenRouteInfos(item.$index)"
                       v-if="item.showRouteInfos">
              隐藏
            </el-button>
          </div>
          <div style="padding: 10px;border-top: 1px solid #d1dbe5;"
               v-if="item.Route_Infos.length===0&&item.showRouteInfos">
            无线路&nbsp;&nbsp;&nbsp;单位数:&nbsp;0个&nbsp;&nbsp;&nbsp;总件数:&nbsp;0件
          </div>
          <el-card class="box-card" v-for="(routeItem,innerIndex) in item.Route_Infos" :key="innerIndex"
                   :body-style="{ padding: '0px' }"
                   style="margin-top: 0" v-if="item.showRouteInfos">
            <div class="clearfix cart-box" style="background: #EAEEF4">
              <el-checkbox v-model="routeItem.checked"
                           @change="checkRoute(routeItem.checked,item.$index)"></el-checkbox>
              <span class="cart-box-span">{{routeItem.TransportRoute_No}}</span>
              <span class="cart-box-span">单位数：{{routeItem.Ssa_Count}}个</span>
              <span class="cart-box-span">总件数：{{routeItem.Pcs_Sum}}件</span>
              <el-button style="float: right;" type="text" v-if="!routeItem.showRouteDetailInfos"
                         @click="getBillByRouteDetailWTD(routeItem.TransportEntrust_Hdr_Id,routeItem.TransportRoute_Id,item.$index,routeItem.$index)">
                显示
              </el-button>
              <el-button style="float: right;" type="text" v-if="routeItem.showRouteDetailInfos"
                         @click="hiddenBillByRouteDetailWTD(item.$index,routeItem.$index)">
                隐藏
              </el-button>
            </div>
            <div class="route-map">
              <div class="route-map-content">
                <div v-for="(route,index) in routeItem.Route_Dtls" :key="index"
                     :class="{'route-map-left':index===0,'route-map-right':index===routeItem.Route_Dtls.length-1}"
                     class="route-map-item">
                  <div>地址&nbsp;{{index+1}}</div>
                  <div class="route-map-time" v-if="index!==routeItem.Route_Dtls.length-1">时效:&nbsp;{{route.Time_Limit_Desc}}
                  </div>
                  <div class="circle"
                       :class="{'first-circle':index===0,'last-circle':index===routeItem.Route_Dtls.length-1}"></div>
                  <div>{{route.Address_Shortname}}</div>
                  <div v-if="route.Contact_Name">联系人:&nbsp;{{route.Contact_Name}}</div>
                  <div v-if="route.Contact_Phone">电话:{{route.Contact_Phone}}</div>
                </div>
              </div>
            </div>
            <div class="box-body-content">
              <el-row class="box-card-item">
                <el-col :span="8">
                  路线频次:&nbsp;&nbsp;{{routeItem.Frequency}}&nbsp;&nbsp;次/&nbsp;&nbsp;{{routeItem.Unit_Desc}}
                </el-col>
                <el-col :span="8">
                  固定运营商:&nbsp;&nbsp;{{routeItem.Fixed_Operator_Name}}
                </el-col>
                <el-col :span="8">
                  固定承运商:&nbsp;&nbsp;{{routeItem.Fixed_Carrier_Name}}
                </el-col>
              </el-row>
              <el-row class="box-card-item">
                <el-col :span="8">
                  路线类型:&nbsp;&nbsp;{{routeItem.TransportRoute_Type_Desc}}
                </el-col>
                <el-col :span="8">
                  运输方式:&nbsp;&nbsp;{{routeItem.Transport_Mode_Desc}}
                </el-col>
                <el-col :span="8">
                  备注:&nbsp;&nbsp;{{routeItem.Remarks}}
                </el-col>
              </el-row>
              <el-row class="box-card-item">
                <el-col :span="8">
                  启运时间:&nbsp;&nbsp;{{routeItem.Fixed_Departure_Time}}
                </el-col>
              </el-row>
            </div>
            <el-table :data="routeItem.routeDetailInfos" style="width: 100%" class="card-table"
                      v-if="routeItem.routeDetailInfos.length>0&&routeItem.showRouteDetailInfos">
              <el-table-column prop="Con_Name" label="委托方" show-overflow-tooltip width="250"></el-table-column>
              <el-table-column prop="TransportPlan_Type_Desc" label="运输任务类型" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Start_City" label="起点市" show-overflow-tooltip></el-table-column>
              <el-table-column prop="End_City" label="终点市" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Ssa_Count" label="单位数" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Pcs_Sum" label="总件数" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Volume_Sum" label="总体积" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Weight_Sum" label="总重量" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Refrigeration_Type_Desc" label="温层" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Time_Limit_Desc" label="时效" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Vehicle_Request_Desc" label="车辆要求" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Vehicle_Size_Desc" label="车辆大小" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-card>
        </el-card>
      </div>
      <el-dialog title="承运商信息" :visible.sync="showCarry" size="large" custom-class="consi-action-dialog">
        <el-form :model="carryForm" ref="carryForm" :label-position="'right'" label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="委托单号:">
                <span>{{carryForm.TransportEntrust_No}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="承运商:" prop="Carrier_Name" :rules="{
                            required: true, message: '请选择承运商', trigger: 'blur'
                          }">
                <el-input v-model="carryForm.Carrier_Name" :disabled="true"
                          @dblclick.native.prevent="showSelectCarry"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="联系人:">
                {{carryForm.Contact_Name}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="联系电话:">
                <span>{{carryForm.Contact_Phone}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="运输方式:" prop="Transport_Mode" :rules="{
                            required: true, message: '请选择运输方式', trigger: 'blur'
                          }">
                <el-select v-model="carryForm.Transport_Mode" placeholder="请选择"
                           :disabled="!carryForm.Carrier_Name">
                  <el-option
                    v-for="(item,index) in transportMode"
                    :key="index"
                    :label="item.Value_Desc"
                    :value="item.Value_Data">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="车牌号:" prop="Vehicle_No" :rules="{
                            required: true, message: '请选择车牌号', trigger: 'blur'
                          }">
                <el-input v-model="carryForm.Vehicle_No" :disabled="true"
                          @dblclick.native.prevent="getVehicleNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8"
                    v-if="carryForm.Transport_Mode!=='1'&&carryForm.Transport_Mode!=='8'&&carryForm.Transport_Mode">
              <el-form-item label="操作联系人:" prop="DoStaffName" :rules="{
                            required: true, message: '请选择操作联系人', trigger: 'blur'
                          }">
                <el-input v-model="carryForm.DoStaffName" :disabled="true"
                          @dblclick.native.prevent="getOperators"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4"
                    v-if="carryForm.Transport_Mode!=='1'&&carryForm.Transport_Mode!=='8'&&carryForm.Transport_Mode">
              <el-form-item label="操作联系人电话:">
                {{carryForm.DoStaffPhone}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="carryForm.Transport_Mode==='1'||carryForm.Transport_Mode==='8'">
            <el-col :span="8">
              <el-form-item label="温层:">
                {{carryForm.Storage_Temp_Desc}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="车型:">
                {{carryForm.Vehbrand_Model_Name}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="carryForm.Transport_Mode==='1'||carryForm.Transport_Mode==='8'">
            <el-col :span="8">
              <el-form-item label="车辆核载件数:">
                {{carryForm.Loading_Num}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="车辆内厢尺寸:">
                {{carryForm.Inside_Size}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-if="carryForm.Transport_Mode==='1'||carryForm.Transport_Mode==='8'">
            <el-col :span="8">
              <el-form-item label="司机:" prop="Staff_Name" :rules="{
                            required: true, message: '请选择司机', trigger: 'blur'
                          }">
                <el-input v-model="carryForm.Staff_Name" :disabled="true"
                          @dblclick.native.prevent="getStaffs"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="司机电话:">
                {{carryForm.Mobilephone}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="carryForm.Transport_Mode==='1'||carryForm.Transport_Mode==='8'">
            <el-col :span="8">
              <el-form-item label="司机身份证:">
                {{carryForm.Number_Id}}
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="启运时间:" prop="Departure_Time" :rules="{
                            type: 'date',required: true, message: '请选择起运时间', trigger: 'blur'
                          }">
                <el-date-picker
                  v-model="carryForm.Departure_Time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" v-if="carryForm.Transport_Mode!=='1'&&carryForm.Transport_Mode!=='8'">
              <el-form-item label="启运时间:" prop="Departure_Time" :rules="{
                            type: 'date',required: true, message: '请选择起运时间', trigger: 'blur'
                          }">
                <el-date-picker
                  v-model="carryForm.Departure_Time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4" v-if="carryForm.Transport_Mode!=='1'&&carryForm.Transport_Mode!=='8'">
              <el-form-item label="托运单号:">
                <el-input v-model="carryForm.Consign_No"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="carryForm.Transport_Mode==='1'||carryForm.Transport_Mode==='8'">
              <el-form-item label="托运单号:">
                <el-input v-model="carryForm.Consign_No"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="detArr" show-summary style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="Con_Name" width="200" label="委托方" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Ssa_Name" width="180" label="单位名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Transport_Type_Desc" width="100" label="运输类型"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="Start_City" label="起点市" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="End_City" label="终点市" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Refrigeration_Type_Desc" label="温层" width="120"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="Try_Amount" label="试算金额(元)" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="服务项目" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Service_Item}}
              </template>
            </el-table-column>
            <el-table-column prop="TotalPcs_Num" label="总件数" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Gross_Volume" label="总体积m³" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Gross_Weight" label="总重量KG" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Actual_Gross_Pcs" label="实际件数" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Actual_Gross_Pcs"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Actual_Gross_Volume" label="实际体积" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Actual_Gross_Volume"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Actual_Gross_Weight" label="实际重量" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Actual_Gross_Weight"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="托运单号" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Consign_No"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="8">
              <el-form-item label="费用详情:">
                {{carryForm.Service_Item}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总里程数(公里):">
                <el-input v-model="carryForm.Actual_Gross_Kilometers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总件数:">
                <el-input v-model="carryForm.Actual_Gross_Pcs"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总体积(m³):">
                <el-input v-model="carryForm.Actual_Gross_Volume"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总重量(KG):">
                <el-input v-model="carryForm.Actual_Gross_Weight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总金额(元):">
                {{carryForm.Amount}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="temporarilyModify">暂存修改</el-button>
          <el-button @click="trialAmount">试算费用</el-button>
          <el-button @click="confirmCarry">确定承运商</el-button>
          <el-button @click="showCarry=false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="运营商地址" :visible.sync="showOperator" size="large" custom-class="consi-action-dialog">
        <el-form :model="operatorForm" ref="operatorForm" :label-position="'right'" label-width="150px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="委托单号:">
                <span>{{operatorForm.TransportEntrust_No}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="运营商:" prop="AssignOperator_Name" :rules="{
                            required: true, message: '请选择运营商', trigger: 'blur'
                          }">
                <el-input v-model="operatorForm.AssignOperator_Name" :disabled="true"
                          @dblclick.native.prevent="showSelectOpera"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="指派物流中心:" :rules="{
                            required: true, message: '请选择物流中心', trigger: 'blur'
                          }">
                <el-input v-model="operatorForm.AssignLdc_Name" :disabled="true"
                          @dblclick.native.prevent="showSelectLdc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="物流中心地址:" prop="AssignLdc_Addr_Name" :rules="{
                            required: true, message: '请选择物流中心地址', trigger: 'blur'
                          }">
                <el-input v-model="operatorForm.AssignLdc_Addr_Name" :disabled="true"
                          @dblclick.native.prevent="showSelectLdcAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="启运时间:" prop="Departure_Time" :rules="{
                            type: 'date',required: true, message: '请选择起运时间', trigger: 'blur'
                          }">
                <el-date-picker
                  v-model="operatorForm.Departure_Time"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="4">
              <el-form-item label="运输方式:" prop="Transport_Mode">
                <el-select v-model="operatorForm.Transport_Mode" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in transportMode"
                    :key="index"
                    :label="item.Value_Desc"
                    :value="item.Value_Data">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-table :data="detArr" show-summary style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="Con_Name" width="200" label="委托方" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Ssa_Name" width="180" label="单位名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Transport_Type_Desc" width="100" label="运输类型"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="Start_City" label="起点市" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="End_City" label="终点市" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Refrigeration_Type_Desc" label="温层" width="120"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="Try_Amount" label="试算金额(元)" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="服务项目" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Service_Item}}
              </template>
            </el-table-column>
            <el-table-column prop="TotalPcs_Num" label="总件数" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Gross_Volume" label="总体积m³" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Gross_Weight" label="总重量KG" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Actual_Gross_Pcs" label="实际件数" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Actual_Gross_Pcs"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Actual_Gross_Volume" label="实际体积" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Actual_Gross_Volume"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Actual_Gross_Weight" label="实际重量" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Actual_Gross_Weight"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col :span="8">
              <el-form-item label="费用详情:">
                {{operatorForm.Service_Item}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总里程数(公里):">
                <el-input v-model="operatorForm.Actual_Gross_Kilometers"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总件数:">
                <el-input v-model="operatorForm.Actual_Gross_Pcs"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总体积(m³):">
                <el-input v-model="operatorForm.Actual_Gross_Volume"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="总重量(KG):">
                <el-input v-model="operatorForm.Actual_Gross_Weight"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总金额(元):">
                {{operatorForm.Amount}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="temporarilyModifyOpera">暂存修改</el-button>
            <el-button @click="trialAmountOpera">试算费用</el-button>
            <el-button @click="confirmOperator">确定运营商</el-button>
            <el-button @click="showOperator=false">取 消</el-button>
          </span>
      </el-dialog>
      <el-dialog title="选择承运商" :visible.sync="showSelectCarryDialog" size="large">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchCarryKey">
        </el-input>
        <el-table :data="searchCarryValue" style="width: 100%" @row-dblclick="selectCarry">
          <el-table-column prop="Carrier_No" label="承运商编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Carrier_Name" label="承运商名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Address" label="地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact_Name" label="联系人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact_Phone" label="电话" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择车牌号" :visible.sync="showSelectVehicleNoDialog" size="large">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchvehicleNosKey">
        </el-input>
        <el-table :data="searchvehicleNosValue" style="width: 100%" @row-dblclick="selectVehicleNo"
                  :row-style="tableRowStyle">
          <el-table-column prop="Vehicle_No" label="车牌号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Vehbrand_Model_Name" label="车型" width="250" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Loading_Num" label="车辆核载件数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Is_Chillcar" label="是否冷藏车" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Storage_Temp_Desc" label="温层" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Inside_Size" label="车辆内厢尺寸" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Staff_Name" label="驾驶员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mobilephone" label="驾驶员电话" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Number_Id" label="驾驶员身份证" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择司机" :visible.sync="showSelectStaffDialog">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchStaffKey">
        </el-input>
        <el-table :data="searchStaffValue" style="width: 100%" @row-dblclick="selectStaff">
          <el-table-column prop="Carrier_Name" label="承运商" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Staff_Name" label="驾驶员" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mobilephone" label="驾驶员电话" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择操作联系人" :visible.sync="showSelectOperatorDialog">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchOperatorsKey">
        </el-input>
        <el-table :data="searchOperatorsValue" style="width: 100%" @row-dblclick="selectOpertors">
          <el-table-column prop="Staff_Name" label="操作联系人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mnemonic_Code" label="助记码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mobilephone" label="电话" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择运营商" size="large" :visible.sync="showSelectAssignOperatorDialog">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchAssignOperatorsKey">
        </el-input>
        <el-table :data="searchAssignOperatorsValue" style="width: 100%" @row-dblclick="selectAssignOperators">
          <el-table-column prop="Operator_No" label="运营商编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Operator_Name" label="运营商名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Address" label="地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact_Name" label="联系人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact_Phone" label="电话" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择物流中心" :visible.sync="showSelectLdcDialog">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchLdcKey">
        </el-input>
        <el-table :data="searchLdcValue" style="width: 100%" @row-dblclick="selectLdc">
          <el-table-column prop="Ldc_Name" label="物流中心名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Address" label="物流中心地址" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog title="选择物流中心地址" :visible.sync="showSelectLdcAddrDialog">
        <el-input
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px"
          v-model="searchLdcAddressKey">
        </el-input>
        <el-table :data="searchLdcAddressValue" style="width: 100%" @row-dblclick="selectLdcAddr">
          <el-table-column prop="Address_Shortname" label="物流中心地址简称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Address" label="	物流中心详细地址" show-overflow-tooltip></el-table-column>
           <el-table-column prop="Contact_Name" label="联系人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact_Phone" label="联系人电话" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import Api from '@/common/js/api'
  import Vue from 'vue'
  import { DateFtt } from '@/common/js/utils'
  import {Bus, Types} from '@/common/js/bus.js'

  export default {
    name: 'index',
    methods: {
      getTransportRouteType () {
        Api.get('TMP_Fd_Field_Dtl', {
          Field_Name: 'TransportRoute_Type'
        }).then(res => {
          if (res.Flag) {
            this.formSearch.transportRouteType = res.MsgInfo
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取路线类型
      getTransportTaskDDGetYdLeftFilter () {
        let param = {
          Operator_Id: Api.userInfo.Operator_Id
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetLeftFilter', param).then(res => {
          if (res.Flag) {
            this.formSearch.address = res.MsgInfo
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取路线城市筛选
      getTransportTaskDDGetYdRightFilter () {
        let param = {
          Operator_Id: Api.userInfo.Operator_Id
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetRightFilter', param).then(res => {
          if (res.Flag) {
            this.wtdFormSearch.address = res.MsgInfo
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取委托单城市筛选
      getTransportTaskWTDInitRoute () {
        let param = {
          Operator_Id: Api.userInfo.Operator_Id
        }
        Api.post('TMP_TransportTaskWTD_InitRoute', param).then(res => {
          if (res.Flag) {
            this.transportList = JSON.parse(res.MsgInfo)
            this.transportList.forEach((item, index) => {
              Vue.set(item, 'dataList', [])
              Vue.set(item, 'checked', false)
              Vue.set(item, '$index', index)
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取运单
      getBillByRoute (id, index) {
        this.transportList.forEach(item => {
          item.dataList = []
        })
        let param = {
          TransportRoute_Id: id
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetBillByRoute', param).then(res => {
          if (res.Flag) {
            this.transportList[index].dataList = res.MsgInfo
            this.transportList[index].dataList.forEach((item, index) => {
              Vue.set(item, '$index', index)
              Vue.set(item, 'dataDetailList', [])
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取运单列表列表详细信息
      deleteBillByRoute () {
        this.transportList.forEach(item => {
          item.dataList = []
        })
      }, // 隐藏运单
      getBillByRouteDetail (row, expanded) {
        if (expanded) {
          let param = {
            Bill_Hdr_Id: row.Bill_Hdr_Id
          }
          Api.get('TMP_TransportTaskScheding_Wtd_GetBillByHdr', param).then(res => {
            if (res.Flag) {
              for (let i = 0; i < this.transportList.length; i++) {
                for (let j = 0; j < this.transportList[i].dataList.length; j++) {
                  if (this.transportList[i].dataList[j].Bill_Hdr_Id === row.Bill_Hdr_Id) {
                    Vue.set(this.transportList[i].dataList[j], 'dataDetailList', res.MsgInfo)
                  }
                }
              }
            } else {
              this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      }, // 获取运单条目详细信息
      addToBillOrder () {
        let transportListChecked = [] // 勾选的路线
        let wTDrightAddedId = [] // 勾选的委托单
        let transportListIds = [] // 勾选路线的ID
        let addressId = [] // 地址ID,判断路线是否有交集
        transportListChecked = this.selectTransportList.filter(item => {
          return item.checked
        })
        wTDrightAddedId = this.wTDrightAddedArr.filter(item => {
          return item.checked
        })
        if (transportListChecked.length === 0) {
          this.$alert('未勾选路线,请勾选后再执行!', '提示')
          return
        }
        if (wTDrightAddedId.length === 0) {
          this.$alert('未勾选委托单,请勾选后再执行!', '提示')
          return
        }
        if (wTDrightAddedId.length > 1) {
          this.$alert('只能勾选一条委托单,请删除其余委托单后再执行!', '提示')
          return
        }
        transportListChecked.forEach(item => {
          transportListIds.push(item.TransportRoute_Id)
          item.Route_Dtls.forEach(rout => {
            if (rout.Address_Id !== '0') {
              addressId.push(rout.Address_Id)
            }
          })
        })
        let param = {
          TransportEntrust_Hdr_Id: '',
          TransportRoute_Ids: ''
        }
        param.TransportEntrust_Hdr_Id = wTDrightAddedId[0].TransportEntrust_Hdr_Id
        param.TransportRoute_Ids = transportListIds.join(',')
        Api.post('TMP_TransportTaskWTD_AddNewWtdRoute', param).then(res => {
          if (res.Flag) {
            this.$alert('委托单添加路线成功!', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.init()
              }
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 路线加入委托单
      deleteFromBillOrder () {
        let deleteBillOrder = {
          wTDrightAddedId: '',
          routeInfos: []
        }
        for (let i = 0; i < this.wTDrightAddedArr.length; i++) {
          for (let j = 0; j < this.wTDrightAddedArr[i].Route_Infos.length; j++) {
            if (this.wTDrightAddedArr[i].Route_Infos[j].checked) {
              deleteBillOrder.routeInfos.push(this.wTDrightAddedArr[i].Route_Infos[j].TransportRoute_Id)
            }
          }
          if (deleteBillOrder.routeInfos.length > 0) {
            deleteBillOrder.wTDrightAddedId = this.wTDrightAddedArr[i].TransportEntrust_Hdr_Id
            break
          }
        }
        let param = {
          TransportEntrust_Hdr_Id: '',
          TransportRoute_Ids: ''
        }
        if (deleteBillOrder.routeInfos.length === 0) {
          this.$alert('未勾选路线!', '提示')
          return
        }
        param.TransportRoute_Ids = deleteBillOrder.routeInfos.join(',')
        param.TransportEntrust_Hdr_Id = deleteBillOrder.wTDrightAddedId
        Api.post('TMP_TransportTaskWTD_DeleteWtdRoute', param).then(res => {
          if (res.Flag) {
            this.$alert('删除路线成功!', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.init()
              }
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 从委托单中删除路线
      getWtdInfo () {
        let param = {
          Operator_Id: Api.userInfo.Operator_Id,
          Creator: Api.userInfo.USERID
        }
        Api.post('TMP_TransportTaskWTD_GetWtdInfo', param).then(res => {
          if (res.Flag) {
            this.wTDrightAddedArr = JSON.parse(res.MsgInfo)
            this.wTDrightAddedArr.forEach((item, outIndex) => {
              Vue.set(item, '$index', outIndex)
              Vue.set(item, 'checked', false)
              Vue.set(item, 'showRouteInfos', false)
              if (item.Route_Infos.length > 0) {
                item.Route_Infos.forEach((rout, innerIndex) => {
                  Vue.set(rout, '$index', innerIndex)
                  Vue.set(rout, 'checked', false)
                  Vue.set(rout, 'showRouteDetailInfos', false)
                  Vue.set(rout, 'routeDetailInfos', [])
                })
              }
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
        this.checkedWTDrightAddedArr = {} // 初始化路线
      }, // 获取委托单
      addWtdInfo () {
        let param = {
          Operator_Id: Api.userInfo.Operator_Id,
          Creator: Api.userInfo.USERID
        }
        Api.post('TMP_TransportTaskWTD_AddNewWtd', param).then(res => {
          if (res.Flag) {
            this.getWtdInfo()
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 新增委托单
      deleteWtdInfo () {
        let param = {
          TransportEntrust_Hdr_Ids: ''
        }
        let idArr = []
        this.wTDrightAddedArr.forEach(item => {
          if (item.checked) {
            idArr.push(item.TransportEntrust_Hdr_Id)
          }
        })
        if (idArr.length === 0) {
          this.$alert('请勾选委托单后执行!', '提示')
        } else {
          param.TransportEntrust_Hdr_Ids = idArr.join(',')
          Api.post('TMP_TransportTaskWTD_CancleEntrustBill', param).then(res => {
            if (res.Flag) {
              this.$alert('取消委托单成功', '提示', {
                confirmButtonText: '确定',
                callback: () => {
                  this.init()
                }
              })
            } else {
              this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      }, // 取消委托单
      showRouteInfos (index) {
        this.wTDrightAddedArr[index].showRouteInfos = true
      }, // 展示路线
      hiddenRouteInfos (index) {
        this.wTDrightAddedArr[index].showRouteInfos = false
      }, // 隐藏路线
      getBillByRouteDetailWTD (outId, innerId, outIndex, innerIndex) {
        this.wTDrightAddedArr[outIndex].Route_Infos[innerIndex].showRouteDetailInfos = true
        let param = {
          TransportEntrust_Hdr_Id: '',
          TransportRoute_Id: ''
        }
        param.TransportEntrust_Hdr_Id = outId
        param.TransportRoute_Id = innerId
        Api.get('TMP_TransportTaskScheding_Wtd_GetWtdDtl', param).then(res => {
          if (res.Flag) {
            this.wTDrightAddedArr[outIndex].Route_Infos[innerIndex].routeDetailInfos = res.MsgInfo
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取委托单路线详细信息
      hiddenBillByRouteDetailWTD (outIndex, innerIndex) {
        this.wTDrightAddedArr[outIndex].Route_Infos[innerIndex].showRouteDetailInfos = false
      }, // 隐藏委托单路线详细信息
      checkRoute (checked, index) {
        if (checked) {
          this.wTDrightAddedArr.forEach((item, innerIndex) => {
            if (innerIndex !== index) {
              item.showRouteInfos = false
              item.Route_Infos.forEach(route => {
                route.checked = false
              })
            }
          })
        }
      }, // 点击路线,为删除路线做准备
      init () {
        this.getTransportRouteType()
        this.getTransportTaskDDGetYdLeftFilter()
        this.getTransportTaskDDGetYdRightFilter()
        this.getTransportTaskWTDInitRoute()
        this.getWtdInfo()
        this.checkedWTDrightAddedArr = {} // 初始化路线
      }, // 页面初始化函数
      showCarryInfoDialog () {
        this.getWtdDtlByTry('carry')
      }, // 展示确认承运商弹出框
      showOperatorInfoDialog () {
        this.getWtdDtlByTry('operator')
      }, // 展示确认运营商弹出矿
      getCurWtdById (name) {
        let param = {
          TransportEntrust_Hdr_Id: ''
        }
        if (name === 'carry') {
          param.TransportEntrust_Hdr_Id = this.carryForm.TransportEntrust_Hdr_Id
        }
        if (name === 'operator') {
          param.TransportEntrust_Hdr_Id = this.operatorForm.TransportEntrust_Hdr_Id
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetHdrById', param, true).then(res => {
          if (res.Flag) {
            if (name === 'carry') {
              this.carryForm.Carrier_Name = res.MsgInfo[0].Carrier_Name
              this.carryForm.Carrier_Id = res.MsgInfo[0].Carrier_Id
              this.carryForm.TransportEntrust_Hdr_Id = res.MsgInfo[0].TransportEntrust_Hdr_Id
              this.carryForm.TransportEntrust_No = res.MsgInfo[0].TransportEntrust_No
              this.carryForm.Transport_Mode = res.MsgInfo[0].Transport_Mode
              this.carryForm.Vehicle_No = res.MsgInfo[0].Vehicle_No
              this.carryForm.Vehicle_Id = res.MsgInfo[0].Vehicle_Id
              this.carryForm.Contact_Name = res.MsgInfo[0].Contact_Name
              this.carryForm.Contact_Phone = res.MsgInfo[0].Contact_Phone
              if (res.MsgInfo[0].Transport_Mode === '1' || res.MsgInfo[0].Transport_Mode === '9') {
                this.carryForm.Staff_Name = res.MsgInfo[0].Staff_Name
                this.carryForm.Staff_Id = res.MsgInfo[0].Driver_Staff
                this.carryForm.Mobilephone = res.MsgInfo[0].Mobilephone
              } else {
                this.carryForm.DoStaffName = res.MsgInfo[0].Staff_Name
                this.carryForm.DoStaffId = res.MsgInfo[0].Driver_Staff
                this.carryForm.DoStaffPhone = res.MsgInfo[0].Mobilephone
              }
              this.carryForm.Storage_Temp_Desc = res.MsgInfo[0].Storage_Temp_Desc
              this.carryForm.Vehbrand_Model_Name = res.MsgInfo[0].Vehbrand_Model_Name
              this.carryForm.Loading_Num = res.MsgInfo[0].Loading_Num
              this.carryForm.Inside_Size = res.MsgInfo[0].Inside_Size
              this.carryForm.Number_Id = res.MsgInfo[0].Number_Id
              this.carryForm.Departure_Time = res.MsgInfo[0].Departure_Time ? new Date(res.MsgInfo[0].Departure_Time) : ''
              this.carryForm.Actual_Gross_Kilometers = res.MsgInfo[0].Actual_Gross_Kilometers
              this.carryForm.Actual_Gross_Pcs = res.MsgInfo[0].Actual_Gross_Pcs
              this.carryForm.Actual_Gross_Volume = res.MsgInfo[0].Actual_Gross_Volume
              this.carryForm.Actual_Gross_Weight = res.MsgInfo[0].Actual_Gross_Weight
              this.carryForm.Amount = res.MsgInfo[0].Amount
              // 2018-01-31 胡香利增加
              this.carryForm.Consign_No = res.MsgInfo[0].Consign_No
              // end
            }
            if (name === 'operator') {
              this.operatorForm.AssignOperator_Id = res.MsgInfo[0].AssignOperator_Id
              this.operatorForm.AssignOperator_Name = res.MsgInfo[0].AssignOperator_Name
              this.operatorForm.AssignLdc_Id = res.MsgInfo[0].AssignLdc_Id
              this.operatorForm.AssignLdc_Name = res.MsgInfo[0].AssignLdc_Name
              this.operatorForm.AssignLdc_Addr_Id = res.MsgInfo[0].AssignLdc_Addr_Id
              this.operatorForm.AssignLdc_Addr_Name = res.MsgInfo[0].AssignLdc_Addr_Name
              this.operatorForm.Departure_Time = res.MsgInfo[0].Departure_Time ? new Date(res.MsgInfo[0].Departure_Time) : ''
              this.operatorForm.Transport_Mode = res.MsgInfo[0].Transport_Mode
              this.operatorForm.Actual_Gross_Kilometers = res.MsgInfo[0].Actual_Gross_Kilometers
              this.operatorForm.Actual_Gross_Pcs = res.MsgInfo[0].Actual_Gross_Pcs
              this.operatorForm.Actual_Gross_Volume = res.MsgInfo[0].Actual_Gross_Volume
              this.operatorForm.Actual_Gross_Weight = res.MsgInfo[0].Actual_Gross_Weight
              this.operatorForm.Amount = res.MsgInfo[0].Amount
            }
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 根据委托单汇总ID获取委托单汇总信息
      getWtdDtlByTry (name) {
        let wTDrightAddedArrChecked = []
        wTDrightAddedArrChecked = this.wTDrightAddedArr.filter(item => item.checked)
        if (wTDrightAddedArrChecked.length === 0) {
          this.$alert('请勾选委托单后执行!', '提示')
          return
        }
        if (wTDrightAddedArrChecked.length > 1) {
          this.$alert('只能勾选一条委托单!', '提示')
          return
        }
        if (wTDrightAddedArrChecked[0].Route_Infos.length === 0) {
          this.$alert('该委托单路线为空', '提示')
          return
        }
        let param = {
          TransportEntrust_Hdr_Id: ''
        }
        param.TransportEntrust_Hdr_Id = wTDrightAddedArrChecked[0].TransportEntrust_Hdr_Id
        if (name === 'carry') {
          this.carryForm.TransportEntrust_No = wTDrightAddedArrChecked[0].TransportEntrust_No
          this.carryForm.TransportEntrust_Hdr_Id = wTDrightAddedArrChecked[0].TransportEntrust_Hdr_Id
        }
        if (name === 'operator') {
          this.operatorForm.TransportEntrust_No = wTDrightAddedArrChecked[0].TransportEntrust_No
          this.operatorForm.TransportEntrust_Hdr_Id = wTDrightAddedArrChecked[0].TransportEntrust_Hdr_Id
        }
        Api.post('TMP_TransportTaskWTD_GetWtdDtlByTry', param).then(res => {
          if (res.Flag) {
            this.detArr = JSON.parse(res.MsgInfo)
            if (this.detArr.length > 0) {
              this.detArr.forEach(item => {
                Vue.set(item, 'Service_Item', '')
              })
            }
            if (name === 'carry') {
              this.showCarry = true
              this.getCurWtdById(name)
            }
            if (name === 'operator') {
              this.showOperator = true
              this.getCurWtdById(name)
            }
            this.getTransportMode()
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 承运商以及运营商明细表格
      getTransportMode () {
        let param = {
          Field_Name: 'Transport_Mode'
        }
        Api.get('TMP_Fd_Field_Dtl', param).then(res => {
          if (res.Flag) {
            this.transportMode = res.MsgInfo
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取运输方式
      getCarry () {
        let param = {
          Operator_Id: ''
        }
        param.Operator_Id = Api.userInfo.Operator_Id
        Api.get('TMP_TransportTaskScheding_Wtd_GetCarrier', param).then(res => {
          if (res.Flag) {
            this.carries = res.MsgInfo
            this.showSelectCarryDialog = true
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取承运商
      showSelectCarry () {
        this.getCarry()
      }, // 双击弹出选择承运商弹出框
      selectCarry (row) {
        this.carryForm.Carrier_Id = row.Carrier_Id
        this.carryForm.Carrier_Name = row.Carrier_Name
        this.carryForm.Contact_Name = row.Contact_Name
        this.carryForm.Contact_Phone = row.Contact_Phone
        this.showSelectCarryDialog = false
      }, // 双击选择承运商
      getVehicleNo () {
        let param = {
          Carrier_Id: ''
        }
        if (!this.carryForm.Carrier_Id) {
          this.$alert('请先选择承运商!', '提示')
        } else {
          param.Carrier_Id = this.carryForm.Carrier_Id
          Api.get('TMP_TransportTaskScheding_Wtd_GetVehicle', param).then(res => {
            if (res.Flag) {
              this.vehicleNos = res.MsgInfo
              this.showSelectVehicleNoDialog = true
            } else {
              this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      }, //获取车牌号
      selectVehicleNo (row) {
        if ((this.carryForm.Transport_Mode === '1' || this.carryForm.Transport_Mode === '8')) {
          if (row.Is_Chillcar === '是') {
            this.carryForm.Storage_Temp_Desc = row.Storage_Temp_Desc
            this.carryForm.Vehbrand_Model_Name = row.Vehbrand_Model_Name
            this.carryForm.Loading_Num = row.Loading_Num
            this.carryForm.Inside_Size = row.Inside_Size
            this.carryForm.Staff_Name = row.Staff_Name
            this.carryForm.Mobilephone = row.Mobilephone
            this.carryForm.Number_Id = row.Number_Id
          } else {
            this.$alert('只能选择冷藏车!', '提示')
            return
          }
        }
        this.carryForm.Vehicle_No = row.Vehicle_No
        this.carryForm.Vehicle_Id = row.Vehicle_Id
        this.showSelectVehicleNoDialog = false
      }, // 双击选择车牌号
      getStaffs () {
        let param = {
          Carrier_Id: this.carryForm.Carrier_Id
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetDriver', param).then(res => {
          if (res.Flag) {
            this.staffs = res.MsgInfo
            this.showSelectStaffDialog = true
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取司机
      selectStaff (row) {
        this.carryForm.Staff_Name = row.Staff_Name
        this.carryForm.Staff_Id = row.Staff_Id
        this.carryForm.Mobilephone = row.Mobilephone
        this.showSelectStaffDialog = false
      }, // 选择司机
      getOperators () {
        let param = {
          Mnemonic_Code: '%'
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetStaff', param).then(res => {
          if (res.Flag) {
            this.operators = res.MsgInfo
            this.showSelectOperatorDialog = true
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 获取操作联系人
      selectOpertors (row) {
        this.carryForm.DoStaffName = row.Staff_Name
        this.carryForm.DoStaffId = row.Staff_Id
        this.carryForm.DoStaffPhone = row.Mobilephone
        this.showSelectOperatorDialog = false
      }, // 选择操作联系人
      temporarilyModify () {
        let param = {
          TransportEntrust_Hdr: '',
          TransportEntrust_Dtls: ''
        }
        param.TransportEntrust_Hdr = JSON.stringify({
          TransportEntrust_Hdr_Id: this.carryForm.TransportEntrust_Hdr_Id,
          Departure_Time: this.carryForm.Departure_Time ? DateFtt('yyyy-MM-dd hh:mm:ss', this.carryForm.Departure_Time) : null,
          Driver_Staff: this.carryForm.Staff_Id ? this.carryForm.Staff_Id : this.carryForm.DoStaffId,
          Vehicle_Id: this.carryForm.Vehicle_Id,
          Carrier_Id: this.carryForm.Carrier_Id,
          Transport_Mode: this.carryForm.Transport_Mode,
          Consign_No: this.carryForm.Consign_No, // 2018-01-31 胡香利增加
          Amount: this.carryForm.Amount,
          Actual_Gross_Kilometers: parseFloat(this.carryForm.Actual_Gross_Kilometers),
          Actual_Gross_Pcs: parseFloat(this.carryForm.Actual_Gross_Pcs),
          Actual_Gross_Volume: parseFloat(this.carryForm.Actual_Gross_Volume),
          Actual_Gross_Weight: parseFloat(this.carryForm.Actual_Gross_Weight)
        })
        let TransportEntrustDtlsTemp = []
        this.detArr.forEach(item => {
          console.log('detArr item')
          console.log(item)
          console.log('end')
          TransportEntrustDtlsTemp.push({
            TransportEntrust_Dtl_Id: item.TransportEntrust_Dtl_Id,
            Actual_Gross_Pcs: item.Actual_Gross_Pcs,
            Actual_Gross_Volume: item.Actual_Gross_Volume,
            Actual_Gross_Weight: item.Actual_Gross_Weight,
            Consign_No: item.Consign_No
          })
        })
        param.TransportEntrust_Dtls = JSON.stringify(TransportEntrustDtlsTemp)
        Api.post('TMP_TransportTaskWTD_SaveWtdTemp', param).then(res => {
          if (res.Flag) {
            this.$alert('数据暂存成功!', '提示').then(() => {
              this.showCarry = false
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 暂存修改
      trialAmount () {
        if (!this.carryForm.Carrier_Id) {
          this.$alert('请选择承运商', '提示')
          return
        }
        let param = {
          Operator_Id: '',
          TransportEntrust_Hdr_Id: '',
          TransportEntrust_Dtls: ''
        }
        let transportEntrustDtls = []
        this.detArr.forEach(data => {
          let obj = {} // 构建临时对象
          obj.TransportEntrust_Dtl_Id = data.TransportEntrust_Dtl_Id
          obj.TransportPlan_Type = data.TransportPlan_Type
          obj.BillTransportA_Dtl_Id = data.BillTransportA_Dtl_Id
          obj.BillTransportA_Hdr_Id = data.BillTransportA_Hdr_Id
          obj.End_City_No = data.End_City_No
          obj.Start_City_No = data.Start_City_No
          obj.Carrier_Id = this.carryForm.Carrier_Id
          obj.Ssa_Id_2nd = data.Ssa_Id_2nd
          obj.Refrigeration_Type = data.Refrigeration_Type
          obj.Takecharge_Amount = data.Takecharge_Amount
          obj.Actual_Gross_Pcs = data.Actual_Gross_Pcs
          obj.Actual_Gross_Volume = data.Actual_Gross_Volume
          obj.Actual_Gross_Weight = data.Actual_Gross_Weight
          obj.Destination_Area = data.Destination_Area
          obj.TransportPlan_Type = data.TransportPlan_Type
          obj.Tdg_Mode = data.Tdg_Mode
          obj.Vehicle_Size = data.Vehicle_Size
          transportEntrustDtls.push(obj)
        })
        param.TransportEntrust_Dtls = JSON.stringify(transportEntrustDtls)
        param.Operator_Id = Api.userInfo.Operator_Id
        param.TransportEntrust_Hdr_Id = this.carryForm.TransportEntrust_Hdr_Id
        Api.post('TMP_TransportTaskWTD_WtdAmountByTry', param).then(res => {
          if (res.Flag) {
            let resJson = JSON.parse(res.MsgInfo)
            if (resJson.Hdr.Total_Amount === 0) {
              this.$alert('未生成费用!', '提示').then(() => {
                this.carryForm.Amount = resJson.Hdr.Total_Amount
                this.carryForm.Actual_Gross_Weight = resJson.Hdr.Total_Weight
                this.carryForm.Actual_Gross_Volume = resJson.Hdr.Total_Volume
                this.carryForm.Actual_Gross_Pcs = resJson.Hdr.Total_Pcs
                this.carryForm.Actual_Gross_Kilometers = resJson.Hdr.Total_Kilometers
                this.carryForm.Service_Item = resJson.Hdr.Service_Item
                resJson.Dtl.forEach(item => {
                  this.detArr.forEach(items => {
                    if (items.BillTransportA_Dtl_Id === item.BillTransportA_Dtl_Id) {
                      items.Try_Amount = item.Try_Amount
                      items.Service_Item = item.Service_Item
                    }
                  })
                })
              })
            } else {
              this.$alert('试算成功!', '提示').then(() => {
                this.carryForm.Amount = resJson.Hdr.Total_Amount
                this.carryForm.Actual_Gross_Weight = resJson.Hdr.Total_Weight
                this.carryForm.Actual_Gross_Volume = resJson.Hdr.Total_Volume
                this.carryForm.Actual_Gross_Pcs = resJson.Hdr.Total_Pcs
                this.carryForm.Actual_Gross_Kilometers = resJson.Hdr.Total_Kilometers
                this.carryForm.Service_Item = resJson.Hdr.Service_Item
                resJson.Dtl.forEach(item => {
                  this.detArr.forEach(items => {
                    if (items.BillTransportA_Dtl_Id === item.BillTransportA_Dtl_Id) {
                      items.Try_Amount = item.Try_Amount
                      items.Service_Item = item.Service_Item
                    }
                  })
                })
              })
            }
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 试算费用-承运商
      confirmCarry () {
        this.$refs.carryForm.validate((valid) => {
          if (valid) {
            let OperatorId = Api.userInfo.Operator_Id
            let OperatorStaff = Api.userInfo.USERID
            let transportEntrustHdr = {
              TransportEntrust_Hdr_Id: this.carryForm.TransportEntrust_Hdr_Id,
              Departure_Time: DateFtt('yyyy-MM-dd hh:mm:ss', this.carryForm.Departure_Time),
              Driver_Staff: this.carryForm.Staff_Id ? this.carryForm.Staff_Id : this.carryForm.DoStaffId,
              Vehicle_Id: this.carryForm.Vehicle_Id,
              Carrier_Id: this.carryForm.Carrier_Id,
              Transport_Mode: this.carryForm.Transport_Mode,
              Consign_No: this.carryForm.Consign_No, // 2018-01-31 胡香利增加
              Amount: this.carryForm.Amount,
              Operator_Id: OperatorId,
              Operate_Staff: OperatorStaff,
              AssignOperator_Id: '',
              Charging_Rule: '',
              Charging_Rule_Id: '',
              AssignLdc_Id: '',
              AssignLdc_Addr_Id: ''
            }
            let param = {
              TransportEntrust_Hdr: '',
              TransportRoute_Ids: '',
              TransportEntrust_Dtls: ''
            }
            param.TransportEntrust_Hdr = JSON.stringify(transportEntrustHdr)
            let TransportEntrustDtlsIDs = []
            this.wTDrightAddedArr.forEach(item => {
              if (item.checked) {
                item.Route_Infos.forEach(route => {
                  TransportEntrustDtlsIDs.push(route.TransportRoute_Id)
                })
              }
            })
            param.TransportRoute_Ids = TransportEntrustDtlsIDs.join(',')
            // 2018-01-12胡香利增加
            let TransportEntrustDtlsTemp = []
            this.detArr.forEach(item => {
              TransportEntrustDtlsTemp.push({
                TransportEntrust_Dtl_Id: item.TransportEntrust_Dtl_Id,
                Actual_Gross_Pcs: item.Actual_Gross_Pcs,
                Actual_Gross_Volume: item.Actual_Gross_Volume,
                Actual_Gross_Weight: item.Actual_Gross_Weight,
                Consign_No: item.Consign_No
              })
            })
            param.TransportEntrust_Dtls = JSON.stringify(TransportEntrustDtlsTemp)
            // 2018-01-12 胡香利 end
            Api.post('TMP_TransportTaskDD_ConfirmCarrier', param).then(res => {
              if (res.Flag) {
                this.$alert('操作成功!', '提示').then(() => {
                  this.showCarry = false
                  this.init()
                  this.$refs.carryForm.resetFields()
                })
              } else {
                this.$alert(res.ErrInfo, '提示', {
                  confirmButtonText: '确定'
                })
              }
            })
          } else {
            return false
          }
        })
      }, // 确定承运商
      confirmOperator () {
        this.$refs.operatorForm.validate((valid) => {
          if (valid) {
            let OperatorId = Api.userInfo.Operator_Id
            let OperatorStaff = Api.userInfo.USERID
            let transportEntrustHdr = {
              TransportEntrust_Hdr_Id: this.operatorForm.TransportEntrust_Hdr_Id,
              Departure_Time: DateFtt('yyyy-MM-dd hh:mm:ss', this.operatorForm.Departure_Time),
              Driver_Staff: '',
              Vehicle_Id: '',
              Carrier_Id: '',
              Transport_Mode: this.operatorForm.Transport_Mode,
              AssignOperator_Id: this.operatorForm.AssignOperator_Id,
              Charging_Rule: '',
              Charging_Rule_Id: '',
              Amount: this.operatorForm.Amount,
              Operator_Id: OperatorId,
              Operate_Staff: OperatorStaff,
              AssignLdc_Id: this.operatorForm.AssignLdc_Id,
              AssignLdc_Addr_Id: this.operatorForm.AssignLdc_Addr_Id
            }
            let param = {
              TransportEntrust_Hdr: '',
              TransportRoute_Ids: ''
            }
            param.TransportEntrust_Hdr = JSON.stringify(transportEntrustHdr)
            let TransportEntrustDtlsIDs = []
            this.wTDrightAddedArr.forEach(item => {
              if (item.checked) {
                item.Route_Infos.forEach(route => {
                  TransportEntrustDtlsIDs.push(route.TransportRoute_Id)
                })
              }
            })
            param.TransportRoute_Ids = TransportEntrustDtlsIDs.join(',')
            Api.post('TMP_TransportTaskDD_ConfirmOperator', param).then(res => {
              if (res.Flag) {
                this.$alert('操作成功!', '提示').then(() => {
                  this.showOperator = false
                  this.init()
                  this.$refs.operatorForm.resetFields()
                })
              } else {
                this.$alert(res.ErrInfo, '提示', {
                  confirmButtonText: '确定'
                })
              }
            })
          } else {
            return false
          }
        })
      }, // 确定运营商
      trialAmountOpera () {
        if (!this.operatorForm.AssignOperator_Id) {
          this.$alert('请选择运营商', '提示')
          return
        }
        let param = {
          Operator_Id: '',
          TransportEntrust_Hdr_Id: '',
          TransportEntrust_Dtls: ''
        }
        let transportEntrustDtls = []
        this.detArr.forEach(data => {
          let obj = {} // 构建临时对象
          obj.TransportEntrust_Dtl_Id = data.TransportEntrust_Dtl_Id
          obj.TransportPlan_Type = data.TransportPlan_Type
          obj.BillTransportA_Dtl_Id = data.BillTransportA_Dtl_Id
          obj.BillTransportA_Hdr_Id = data.BillTransportA_Hdr_Id
          obj.End_City_No = data.End_City_No
          obj.Start_City_No = data.Start_City_No
          obj.Carrier_Id = ''
          obj.Ssa_Id_2nd = data.Ssa_Id_2nd
          obj.Refrigeration_Type = data.Refrigeration_Type
          obj.Takecharge_Amount = data.Takecharge_Amount
          obj.Actual_Gross_Pcs = data.Actual_Gross_Pcs
          obj.Actual_Gross_Volume = data.Actual_Gross_Volume
          obj.Actual_Gross_Weight = data.Actual_Gross_Weight
          obj.Destination_Area = data.Destination_Area
          obj.TransportPlan_Type = data.TransportPlan_Type
          obj.Tdg_Mode = data.Tdg_Mode
          obj.Vehicle_Size = data.Vehicle_Size
          obj.AssignOperator_Id = this.operatorForm.AssignOperator_Id
          transportEntrustDtls.push(obj)
        })
        param.TransportEntrust_Dtls = JSON.stringify(transportEntrustDtls)
        param.Operator_Id = Api.userInfo.Operator_Id
        param.TransportEntrust_Hdr_Id = this.operatorForm.TransportEntrust_Hdr_Id
        Api.post('TMP_TransportTaskWTD_WtdAmountByTryOperator', param).then(res => {
          if (res.Flag) {
            let resJson = JSON.parse(res.MsgInfo)
            if (resJson.Hdr.Total_Amount === 0) {
              this.$alert('未生成费用!', '提示').then(() => {
                this.operatorForm.Amount = resJson.Hdr.Total_Amount
                this.operatorForm.Actual_Gross_Weight = resJson.Hdr.Total_Weight
                this.operatorForm.Actual_Gross_Volume = resJson.Hdr.Total_Volume
                this.operatorForm.Actual_Gross_Pcs = resJson.Hdr.Total_Pcs
                this.operatorForm.Actual_Gross_Kilometers = resJson.Hdr.Total_Kilometers
                this.operatorForm.Service_Item = resJson.Hdr.Service_Item
                resJson.Dtl.forEach(item => {
                  this.detArr.forEach(items => {
                    if (items.BillTransportA_Dtl_Id === item.BillTransportA_Dtl_Id) {
                      items.Try_Amount = item.Try_Amount
                      items.Service_Item = item.Service_Item
                    }
                  })
                })
              })
            } else {
              this.$alert('试算成功!', '提示').then(() => {
                this.operatorForm.Amount = resJson.Hdr.Total_Amount
                this.operatorForm.Actual_Gross_Weight = resJson.Hdr.Total_Weight
                this.operatorForm.Actual_Gross_Volume = resJson.Hdr.Total_Volume
                this.operatorForm.Actual_Gross_Pcs = resJson.Hdr.Total_Pcs
                this.operatorForm.Actual_Gross_Kilometers = resJson.Hdr.Total_Kilometers
                this.operatorForm.Service_Item = resJson.Hdr.Service_Item
                resJson.Dtl.forEach(item => {
                  this.detArr.forEach(items => {
                    if (items.BillTransportA_Dtl_Id === item.BillTransportA_Dtl_Id) {
                      items.Try_Amount = item.Try_Amount
                      items.Service_Item = item.Service_Item
                    }
                  })
                })
              })
            }
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 试算费用-运营商
      temporarilyModifyOpera () {
        let OperatorId = Api.userInfo.Operator_Id
        let OperatorStaff = Api.userInfo.USERID
        let param = {
          TransportEntrust_Hdr: '',
          TransportEntrust_Dtls: ''
        }
        let TransportEntrustDtlsTemp = []
        this.detArr.forEach(item => {
          TransportEntrustDtlsTemp.push({
            TransportEntrust_Dtl_Id: item.TransportEntrust_Dtl_Id,
            Actual_Gross_Pcs: item.Actual_Gross_Pcs,
            Actual_Gross_Volume: item.Actual_Gross_Volume,
            Actual_Gross_Weight: item.Actual_Gross_Weight
          })
        })
        param.TransportEntrust_Dtls = JSON.stringify(TransportEntrustDtlsTemp)
        param.TransportEntrust_Hdr = JSON.stringify({
          TransportEntrust_Hdr_Id: this.operatorForm.TransportEntrust_Hdr_Id,
          Departure_Time: this.operatorForm.Departure_Time ? DateFtt('yyyy-MM-dd hh:mm:ss', this.operatorForm.Departure_Time) : null,
          Transport_Mode: this.operatorForm.Transport_Mode,
          Amount: this.operatorForm.Amount,
          Operator_Id: OperatorId,
          Operate_Staff: OperatorStaff,
          AssignOperator_Id: this.operatorForm.AssignOperator_Id,
          AssignLdc_Id: this.operatorForm.AssignLdc_Id,
          AssignLdc_Addr_Id: this.operatorForm.AssignLdc_Addr_Id,
          Consign_No: this.operatorForm.Consign_No,
          Actual_Gross_Kilometers: parseFloat(this.operatorForm.Actual_Gross_Kilometers),
          Actual_Gross_Pcs: parseFloat(this.operatorForm.Actual_Gross_Pcs),
          Actual_Gross_Volume: parseFloat(this.operatorForm.Actual_Gross_Volume),
          Actual_Gross_Weight: parseFloat(this.operatorForm.Actual_Gross_Weight)
        })
        Api.post('TMP_TransportTaskWTD_SaveWtdTemp', param).then(res => {
          if (res.Flag) {
            this.$alert('数据暂存成功!', '提示').then(() => {
              this.showCarry = false
            })
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 暂存修改-运营商
      showSelectOpera () {
        let param = {
          Operator_Id: Api.userInfo.Operator_Id
        }
        Api.get('TMP_TransportTaskScheding_Wtd_GetOperator', param).then(res => {
          if (res.Flag) {
            this.assignOperators = res.MsgInfo
            this.showSelectAssignOperatorDialog = true
          } else {
            this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
          }
        })
      }, // 选择运营商弹出框
      selectAssignOperators (row) {
        this.operatorForm.AssignOperator_Id = row.Operator_Id
        this.operatorForm.AssignOperator_Name = row.Operator_Name
        this.operatorForm.AssignLdc_Id = ''
        this.operatorForm.AssignLdc_Name = ''
        this.showSelectAssignOperatorDialog = false
        // 2018-01-19 胡香利 增加 自动带出物流中心和物流中心地址
        this.showSelectLdc(false)
        // end
      }, // 双击选择运营商
      showSelectLdc (flag) {
        if (typeof (flag) !== 'boolean') {
          flag = true
        }
        if (!this.operatorForm.AssignOperator_Id) {
          this.$alert('请选择运营商', '提示')
        } else {
          let param = {
            AssignOperator_Id: this.operatorForm.AssignOperator_Id,
            Operator_Id: Api.userInfo.Operator_Id
          }
          Api.get('TMP_TransportTaskScheding_Wtd_GetLdc', param, true).then(res => {
            if (res.Flag) {
              this.ldc = res.MsgInfo
              if (flag) {
                this.showSelectLdcDialog = true
              } else {
                if (this.ldc.length === 1) {
                  this.selectLdc(this.ldc[0])
                }
              }
            } else {
              this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      }, // 选择物流中心弹出框
      selectLdc (row) {
        this.operatorForm.AssignLdc_Id = row.Ldc_Id
        this.operatorForm.AssignLdc_Name = row.Ldc_Name
        this.operatorForm.AssignLdc_Addr_Id = ''
        this.operatorForm.AssignLdc_Addr_Name = ''
        this.showSelectLdcDialog = false
        // 2018-01-19 胡香利 增加 自动带出物流中心和物流中心地址
        this.showSelectLdcAddress(false)
        // end
      }, // 双击选择物流中心
      showSelectLdcAddress (flag) {
        if (!this.operatorForm.AssignLdc_Id) {
          this.$alert('选择物流中心', '提示')
        } else {
          let param = {
            Ldc_Id: this.operatorForm.AssignLdc_Id
          }
          Api.get('TMP_TransportTaskScheding_GetWlzxAddr', param, true).then(res => {
            if (res.Flag) {
              this.ldcAddress = res.MsgInfo
              if (flag) {
                this.showSelectLdcAddrDialog = true
              } else {
                if (this.ldcAddress.length === 1) {
                  this.selectLdcAddr(this.ldcAddress[0])
                }
              }
            } else {
              this.$alert(res.ErrInfo, '提示', {
                confirmButtonText: '确定'
              })
            }
          })
        }
      }, // 选择物流中心地址弹出矿
      selectLdcAddr (row) {
        this.operatorForm.AssignLdc_Addr_Id = row.Address_Id
        this.operatorForm.AssignLdc_Addr_Name = row.Address_Shortname
        this.showSelectLdcAddrDialog = false
      }, // 双击选择物流中心地址
      selectCheckOne (index, checked) {
        if (checked) {
          this.wTDrightAddedArr.forEach(item => {
            item.checked = false
          })
          this.wTDrightAddedArr[index].checked = true
          this.checkedWTDrightAddedArr = this.wTDrightAddedArr[index]
        } else {
          this.wTDrightAddedArr[index].checked = false
          this.checkedWTDrightAddedArr = {}
        }
      },
      switchTO () {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
      tableRowStyle (row, index) {
        return {color: row.Is_Busy}
      }
    },
    data () {
      return {
        isRoute: false,
        checkAll: '',
        formSearch: {
          showConditions: false, // 是否展开筛选框
          searchTextCallData: '', // 查找输入框
          transportRouteType: [], // 路线类型
          selectTransportRouteType: '', // 选择的路线
          transportRouteNo: '', //路线编号
          address: [],
          selectedAddress: []
        },
        wtdFormSearch: {
          selectTransportRouteType: '', // 选择的路线
          transportRouteNo: '', //路线编号
          address: [],
          selectedAddress: []
        },
        transportList: [], // 运单
        wTDrightAddedArr: [], //委托单
        showCarry: false, //展示承运商
        showOperator: false, //展示运营商
        carryForm: {
          TransportEntrust_Hdr_Id: '', // 委托方单号ID
          TransportEntrust_No: '', // 委托方单号
          Carrier_Name: '', // 承运商名称
          Carrier_Id: '', // 承运商ID
          Contact_Name: '', // 承运商联系人
          Contact_Phone: '', // 承运商联系电话
          Transport_Mode: '', // 运输方式
          Vehicle_No: '', // 车牌号
          Vehicle_Id: '', // 车牌号ID
          DoStaffName: '', // 操作联系人
          DoStaffId: '', // 操作联系人Id
          DoStaffPhone: '', // 操作联系人电话
          Storage_Temp_Desc: '', // 温层
          Vehbrand_Model_Name: '', // 车型
          Loading_Num: '', // 车辆核载件数
          Inside_Size: '', // 车辆内厢尺寸
          Staff_Name: '', //司机
          Staff_Id: '', // 司机ID
          Mobilephone: '', // 司机电话
          Number_Id: '', // 司机身份证
          Departure_Time: '', // 起运时间
          Actual_Gross_Kilometers: '', //总里程数（公里）
          Actual_Gross_Pcs: '', // 总件数
          Actual_Gross_Volume: '', // 总体积（m³）
          Actual_Gross_Weight: '', // 总重量（KG）
          Amount: '', // 总金额（元）
          Service_Item: '', // 服务项目,费用详情
          Consign_No: '' // 托运单号
        },
        carries: [], // 承运商
        showSelectCarryDialog: false, // 展示选择承运商弹出框
        transportMode: [], // 运输方式
        showSelectVehicleNoDialog: false, // 展示车牌号弹出框
        vehicleNos: [], // 车牌号
        showSelectStaffDialog: false, // 展示选择司机弹出框
        staffs: [], // 司机
        showSelectOperatorDialog: false, // 展示选择操作联系人弹出框
        operators: [], // 操作联系人
        detArr: [], // 承运商以及运营商明细表格数据
        operatorForm: {
          TransportEntrust_Hdr_Id: '',
          TransportEntrust_No: '',
          AssignOperator_Id: '',
          AssignOperator_Name: '',
          AssignLdc_Id: '',
          AssignLdc_Name: '',
          AssignLdc_Addr_Id: '',
          AssignLdc_Addr_Name: '',
          Departure_Time: '',
          Transport_Mode: '',
          Service_Item: '',
          Actual_Gross_Kilometers: '',
          Actual_Gross_Pcs: '',
          Actual_Gross_Volume: '',
          Actual_Gross_Weight: '',
          Amount: '',
          Consign_No: ''
        },
        showSelectAssignOperatorDialog: false, // 展示选择运营商弹出矿
        assignOperators: [], // 运营商
        showSelectLdcDialog: false, // 展示选择物流中心弹出矿
        ldc: [], // 物流中心
        showSelectLdcAddrDialog: false, //展示物流中心地址
        ldcAddress: [], // 物流中心地址
        searchCarryKey: '', // 承运商搜索
        searchvehicleNosKey: '', // 车牌号搜索
        searchStaffKey: '', // 司机搜索
        searchOperatorsKey: '', // 操作联系人搜索
        searchAssignOperatorsKey: '', // 运营商搜索
        searchLdcKey: '', // 物流中心搜索
        searchLdcAddressKey: '', // 物流中心地址搜索
        checkedWTDrightAddedArr: {} // 勾选的委托单
      }
    },
    mounted () {
      this.init()
      Bus.$on(Types.refreshConsi, this.init)
    },
    computed: {
      searchCarryValue () {
        let that = this
        return that.carries.filter(item => {
          return (item.Carrier_No && item.Carrier_No.indexOf(that.searchCarryKey) > -1) ||
            (item.Carrier_Name && item.Carrier_Name.indexOf(that.searchCarryKey) > -1) ||
            (item.Address && item.Address.indexOf(that.searchCarryKey) > -1) ||
            (item.Contact_Name && item.Contact_Name.indexOf(that.searchCarryKey) > -1) ||
            (item.Contact_Phone && item.Contact_Phone.indexOf(that.searchCarryKey) > -1)
        })
      },
      searchvehicleNosValue () {
        let that = this
        return that.vehicleNos.filter(item => {
          return (item.Vehicle_No && item.Vehicle_No.indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Vehbrand_Model_Name && item.Vehbrand_Model_Name.indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Loading_Num && (item.Loading_Num + '').indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Is_Chillcar && item.Is_Chillcar.indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Storage_Temp_Desc && item.Storage_Temp_Desc.indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Inside_Size && (item.Inside_Size + '').indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Staff_Name && item.Staff_Name.indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Mobilephone && item.Mobilephone.indexOf(that.searchvehicleNosKey) > -1) ||
            (item.Number_Id && item.Number_Id.indexOf(that.searchvehicleNosKey) > -1)
        })
      },
      searchStaffValue () {
        let that = this
        return that.staffs.filter(item => {
          return (item.Staff_Name && item.Staff_Name.indexOf(that.searchStaffKey) > -1) ||
            (item.Mobilephone && item.Mobilephone.indexOf(that.searchStaffKey) > -1)
        })
      },
      searchOperatorsValue () {
        let that = this
        return that.operators.filter(item => {
          return (item.Staff_Name && item.Staff_Name.indexOf(that.searchOperatorsKey) > -1) ||
            (item.Mnemonic_Code && item.Mnemonic_Code.indexOf(that.searchOperatorsKey) > -1) ||
            (item.Mobilephone && item.Mobilephone.indexOf(that.searchOperatorsKey) > -1)
        })
      },
      searchAssignOperatorsValue () {
        let that = this
        return that.assignOperators.filter(item => {
          return (item.Operator_No && item.Operator_No.indexOf(that.searchAssignOperatorsKey) > -1) ||
            (item.Operator_Name && item.Operator_Name.indexOf(that.searchAssignOperatorsKey) > -1) ||
            (item.Address && item.Address.indexOf(that.searchAssignOperatorsKey) > -1) ||
            (item.Contact_Name && item.Contact_Name.indexOf(that.searchAssignOperatorsKey) > -1) ||
            (item.Contact_Phone && item.Contact_Phone.indexOf(that.searchAssignOperatorsKey) > -1)
        })
      },
      searchLdcValue () {
        let that = this
        return that.ldc.filter(item => {
          return (item.Ldc_Name && item.Ldc_Name.indexOf(that.searchLdcKey) > -1) ||
            (item.Address && item.Address.indexOf(that.searchLdcKey) > -1)
        })
      },
      searchLdcAddressValue () {
        let that = this
        return that.ldcAddress.filter(item => {
          return (item.Address_Shortname && item.Address_Shortname.indexOf(that.searchLdcAddressKey) > -1) ||
            (item.Address && item.Address.indexOf(that.searchLdcAddressKey) > -1)
        })
      },
      selectTransportList () {
        let that = this
        let tempIndex = []
        let indexes = ''
        this.transportList.forEach((item, index) => {
          item.Route_Dtls.forEach(item1 => {
            this.formSearch.selectedAddress.forEach(item2 => {
              if (item1.City_Name === item2) {
                tempIndex.push(index)
              }
            })
          })
        })
        indexes = tempIndex.length > 0 ? tempIndex.join(',') : ''
        return that.transportList.filter(item => {
          return that.formSearch.transportRouteNo ? item.TransportRoute_No.indexOf(that.formSearch.transportRouteNo) > -1 : true
        }).filter(item => {
          return that.formSearch.selectTransportRouteType ? item.TransportRoute_Type === that.formSearch.selectTransportRouteType : true
        }).filter((item, index) => {
          return indexes ? indexes.indexOf('' + index) > -1 : true
        })
      },
      selectWTDrightAddedArr () {
        let that = this
        let tempIndex = [] // 记录路线ID
        let indexes = '' // 路线ID字符串
        let tempIndexType = [] // 路线类型
        let indexesType = '' // 路线类型字符串
        this.wTDrightAddedArr.forEach((item, index) => {
          if (item.Route_Infos.length > 0) {
            item.Route_Infos.forEach(item1 => {
              if (that.wtdFormSearch.selectTransportRouteType && item1.TransportRoute_Type === that.wtdFormSearch.selectTransportRouteType) {
                tempIndexType.push(index)
              }
              item1.Route_Dtls.forEach(item2 => {
                that.wtdFormSearch.selectedAddress.forEach(item3 => {
                  if (item3 && item2.City_Name === item3) {
                    tempIndex.push(index)
                  }
                })
              })
            })
          }
        }) // 后台不改,前端妥协的写了4层嵌套循环
        indexes = tempIndex.length > 0 ? tempIndex.join(',') : ''
        indexesType = tempIndexType.length > 0 ? tempIndexType.join(',') : ''
        return that.wTDrightAddedArr.filter(item => {
          return that.wtdFormSearch.transportRouteNo ? item.TransportEntrust_No.indexOf(that.wtdFormSearch.transportRouteNo) > -1 : true
        }).filter((item, index) => {
          return indexesType ? indexesType.indexOf('' + index) > -1 : true
        }).filter((item, index) => {
          return indexes ? indexes.indexOf('' + index) > -1 : true
        })
      }
    }
  }
</script>

<style lang="less">
  .consi-action {
    font-size: 12px;
    padding-top: 55px;
    background: #fff;
    .box-btn {
      background: #f0f3f8;
      color: #666;
      border: 1px solid #ddd;
      position: fixed;
      padding: 5px 15px;
      left: 15px;
      right: 15px;
      z-index: 10;
      .box-btn-right {
        float: right;
        margin-top: 2px;
        .el-radio-button__inner {
          padding: 5px 15px;
        }
      }
    }
    .form-search {
      position: fixed;
      background: #fff;
      right: 15px;
      left: 15px;
      z-index: 10;
      top: 110px;
      &:after {
        content: '';
        position: absolute;
        height: 6px;
        background-color: #fff;
        left: -1px;
        right: -1px;
        bottom: -6px;
      }
      &:before {
        content: '';
        position: absolute;
        height: 6px;
        background-color: #fff;
        left: -1px;
        right: -1px;
        top: -6px;
      }
      .search-box {
        display: flex;
        .search {
          flex: 1;
          padding-right: 15px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          display: flex;
          .search-input {
            flex: 1;
            .el-input {
              height: 32px;
              line-height: 32px;
              .el-input__inner {
                height: 100%;
                border-radius: 0;
              }
            }
          }
          .search-btn {
            width: 70px;
            .el-button {
              width: 100%;
              border-radius: 0;
              height: 32px;
            }
          }
        }
      }
    }
    .conditions {
      border: 1px solid #e3e3e3;
      padding: 10px;
      position: fixed;
      right: 15px;
      left: 15px;
      z-index: 10;
      background: #fff;
      top: 110px;
      .el-select {
        width: 100%;
      }
    }
    .box-card {
      margin-top: 10px;
      .cart-box {
        padding: 0 15px;
        .cart-box-span {
          line-height: 36px;
          margin-left: 10px;
          font-size: 14px;
          font-weight: bold;
        }
      }
      .route-map {
        text-align: center;
        margin-top: 15px;
        font-size: 12px;
        .route-map-content {
          position: relative;
          display: inline-block;
          font-size: 12px;
          &:before {
            display: block;
            content: "";
            width: 100%;
            border-bottom: 5px solid #ccc;
            position: relative;
            top: 37px;
          }
          .route-map-item {
            display: inline-block;
            width: 175px;
            vertical-align: top;
            position: relative;
            .route-map-time {
              position: absolute;
              left: 60%;
              width: 135px;
            }
            .circle {
              position: relative;
              width: 20px;
              height: 20px;
              margin: 10px auto;
              border-radius: 50%;
              background: #ECA700;
              &:before {
                position: absolute;
                left: 5px;
                top: 5px;
                width: 10px;
                height: 10px;
                content: "";
                background: #fff;
                border-radius: 50%;
              }
            }
            .first-circle {
              background-color: #1ABC9C;
            }
            .last-circle {
              background-color: #FF5959;
            }
          }
          .route-map-left {
            &:before {
              display: block;
              content: "";
              width: calc(~"50% - 10px");
              height: 5px;
              background: #fff;
              position: absolute;
              top: 31px;
              border-bottom: 5px solid #fff;
            }
          }
          .route-map-right {
            &:after {
              display: block;
              content: "";
              width: calc(~"50% - 10px");
              height: 5px;
              background: #fff;
              position: absolute;
              top: 31px;
              left: calc(~"50% + 10px");
              border-bottom: 5px solid #fff;
            }
          }
        }
      }
      .box-body-content {
        padding: 10px;
        .box-card-item {
          margin-top: 10px;
        }
      }
      .el-table__expanded-cell {
        padding: 0;
      }

    }
    .consi-action-dialog {
      .el-dialog__header {
        padding: 10px 20px;
      }
      .el-dialog__body {
        padding: 0 10px;
        .el-form-item {
          margin-bottom: 10px;
          .el-form-item__content {
            line-height: 30px;
            .el-select {
              width: 100%;
              .el-input {
                .el-input__inner {
                  height: 22px !important;
                }
              }
            }
            .el-date-editor--datetime {
              width: 100%;
            }
            .el-form-item__error {
              padding-top: 0;
            }
          }
        }
      }
      .el-dialog__footer {
        padding: 10px 20px;
      }
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #fff
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
