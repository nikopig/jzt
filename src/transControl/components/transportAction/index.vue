<template>
    <div class="transAction">
      <!--头部工具栏-->
      <div class="toolbar">
        <div class="btn-box" v-show="!showRoute">
          <el-button type="text" icon="plus" @click="beforeAddOrder">加单</el-button>
        </div>
        <div class="btn-box" v-show="!showRoute">
          <el-button type="text" icon="edit" @click="changeOrder">订单信息变更</el-button>
        </div>
        <div class="btn-box" v-show="!showRoute">
          <el-button type="text" icon="mo-tingzhi" @click="stopDtl">停止明细</el-button>
        </div>
        <div class="btn-box" v-show="!showRoute">
          <el-button type="text" icon="mo-refresh" @click="refreshTransAction">刷新</el-button>
        </div>
        <div class="btn-box" v-show="!showRoute">
          <el-button type="text" icon="mo-auditing" @click="auditDistributeCar">审核配送排车</el-button>
        </div>
        <div class="btn-box" v-show="!showRoute">
          <el-button type="text" icon="warning" @click="showNotPointCompanyDialog" :class="{'warning': notPointCompany.datas.length > 0}">警告</el-button>
        </div>
        <div class="btn-box" v-show="showRoute">
          <el-button type="text" icon="mo-mapPoint" @click="checkHisRoute">历史路线</el-button>
        </div>
        <div class="btn-box" v-show="showRoute">
          <el-button type="text" icon="mo-newlyAdded" @click="addRoute">添加路线</el-button>
        </div>
        <div class="btn-box" v-show="showRoute">
          <el-button type="text" icon="mo-cancle2" @click="delRoute">删除路线</el-button>
        </div>
        <div class="routeInfo" v-if="choiceId !== -1">
          <span>所选路线编号：</span><span>{{choiceRoute.TransportRoute_No}}</span>
          <span v-show="choiceRoute.startShortName">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span>起点地址：</span><span>{{choiceRoute.startShortName}}</span>
          </span>
        </div>
        <div class="btn-box right-fixed">
          <el-radio-group v-model="selectTab">
            <el-radio-button label="运单"></el-radio-button>
            <el-radio-button label="路线"></el-radio-button>
          </el-radio-group>
          <!--<el-switch v-model="showRoute" off-color="#20a0ff" on-color="#13ce66" off-text="运单" on-text="路线"></el-switch>-->
        </div>
      </div>
      <!--订单tab-->
      <div class="order" v-show="!showRoute">
        <div class="condition">
          <div class="condition-box">
            <div class="common-condition-box">
              <el-form :inline="true">
                <el-form-item label="委托方">
                  <el-input v-model="condition.Consi_Name" placeholder="请输入委托方名称"></el-input>
                </el-form-item>
                <el-form-item label="运输任务类型">
                  <select-dictionary inter-face="TMP_Fd_Field_Dtl" field="TransportPlan_Type" v-model="condition.TransportPlan_Type" @select-label="condition.TransportPlan_Type_Desc = arguments[0]"></select-dictionary>
                </el-form-item>
                <el-form-item label="接货时间">
                  <el-date-picker v-model="condition.Takegds_Time"></el-date-picker>
                </el-form-item>
                <el-form-item label="温层">
                  <select-dictionary inter-face="TMP_Fd_Field_Dtl" field="Refrigeration_Type" v-model="condition.Refrigeration_Type" @select-label="condition.Refrigeration_Type_Desc = arguments[0]"></select-dictionary>
                </el-form-item>
                <el-form-item label="时效">
                  <el-select v-model="condition.Time_Limit" clearable>
                    <el-option
                      v-for="(item, aindex) in condition.AgingData"
                      :key="aindex"
                      :value="item.Value_Data"
                      :label="item.Value_Desc"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <transition>
                  <div v-show="addressCondition">
                    <div v-if="filterOrders.start.data.length > 0">
                      <el-form-item label="起点：">
                        <el-checkbox-group v-model="filterOrders.start.selection">
                          <el-checkbox v-for="(item, index) in filterOrders.start.data" :label="item.Start_City" :key="index"></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                    <div v-if="filterOrders.end.data.length > 0">
                      <el-form-item label="终点：">
                        <el-checkbox-group v-model="filterOrders.end.selection">
                          <el-checkbox v-for="(item, index) in filterOrders.end.data" :label="item.End_City" :key="index"></el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                  </div>
                </transition>
              </el-form>
              <a href="javascript:;" class="strechControl" @click="addressCondition = !addressCondition">{{ addressCondition ? '收起' : '展开' }}<i :class="{'el-icon-mo-down-arrow': !addressCondition, 'el-icon-mo-up-arrow': addressCondition}"></i></a>
            </div>
          </div>
          <div class="filter-condition" v-show="showOrderFilter">
            <label class="title">筛选条件</label>
            <el-tag type="primary" v-if="condition.Consi_Name" :closable="true" @close=closeTag()>{{tags.Consi_Name}}</el-tag>
            <el-tag type="primary" v-if="condition.TransportPlan_Type" :closable="true" @close=closeTag(0)>{{tags.TransportPlan_Type}}</el-tag>
            <el-tag type="primary" v-if="condition.Takegds_Time" :closable="true" @close=closeTag(1)>{{tags.Takegds_Time}}</el-tag>
            <el-tag type="primary" v-if="condition.Refrigeration_Type" :closable="true" @close=closeTag(2)>{{tags.Refrigeration_Type}}</el-tag>
            <el-tag type="primary" v-if="condition.Time_Limit" :closable="true" @close=closeTag(3)>{{tags.Time_Limit}}</el-tag>
            <label class="end" v-if="filterOrders.start.selection.length > 0"><i class="el-icon-mo-addressAdd"></i>起点
              <el-tag type="primary" v-for="(sTag, n) in filterOrders.start.selection" :key="n" :closable="true" @close=closeTag(4,sTag)>{{sTag}}</el-tag>
            </label>
            <label class="start" v-if="filterOrders.end.selection.length > 0"><i class="el-icon-mo-addressAdd"></i>终点
              <el-tag type="primary" v-for="(sTag, n) in filterOrders.end.selection" :key="n" :closable="true" @close=closeTag(5,sTag)>{{sTag}}</el-tag>
            </label>
            <div class="start-list"></div>
          </div>
        </div>
        <div class="table-box" :style="{paddingTop: fixTop.order}">
          <!--一级数据-->
          <div class="common-table">
            <div class="common-table-head bg-col-1">
              <div class="common-table-cell check-cell"></div>
              <div class="common-table-cell">接货时间</div>
              <div class="common-table-cell" style="width: 170px;flex: none;">委托方</div>
              <div class="common-table-cell" style="width: 100px;flex: none;">运输任务类型</div>
              <div class="common-table-cell" style="width: 60px;flex: none;">起点市</div>
              <div class="common-table-cell" style="width: 60px;flex: none;">终点市</div>
              <div class="common-table-cell" style="width: 60px;flex: none;">单位数</div>
              <div class="common-table-cell" style="width: 60px;flex: none;">总件数</div>
              <div class="common-table-cell">总体积（m³）</div>
              <div class="common-table-cell">总重量（kg）</div>
              <div class="common-table-cell">温层</div>
              <div class="common-table-cell">时效</div>
              <div class="common-table-cell">车辆要求</div>
              <div class="common-table-cell">车辆大小</div>
              <div class="common-table-cell">操作</div>
            </div>
            <el-scrollbar>
              <div v-for="(firstItem, fIndex) in firstFilterData">
                <div class="common-table-row">
                  <div class="common-table-cell check-cell">
                    <el-checkbox v-model="firstItem.select"  @change="secondSelectAll(firstItem)"></el-checkbox>
                  </div>
                  <div class="common-table-cell" :style="{color: firstItem.BgColor}">{{firstItem.Takegds_Time}}</div>
                  <el-tooltip placement="top" :content="firstItem.Con_Name" :disabled="!firstItem.Con_Name || firstItem.Con_Name.length < 13">
                    <div class="common-table-cell" style="width: 170px;flex: none;">{{firstItem.Con_Name}}</div>
                  </el-tooltip>
                  <div class="common-table-cell" style="width: 100px;flex: none;">{{firstItem.TransportPlan_Type_Desc}}</div>
                  <div class="common-table-cell" style="width: 60px;flex: none;" :style="{color: firstItem.Start_Color}">{{firstItem.Start_City}}</div>
                  <div class="common-table-cell" style="width: 60px;flex: none;">{{firstItem.End_City}}</div>
                  <div class="common-table-cell" style="width: 60px;flex: none;">{{firstItem.Ssa_Count}}</div>
                  <div class="common-table-cell" style="width: 60px;flex: none;">{{firstItem.Pcs_Sum}}</div>
                  <div class="common-table-cell">{{firstItem.Volume_Sum}}</div>
                  <div class="common-table-cell">{{firstItem.Weight_Sum}}</div>
                  <div class="common-table-cell">{{firstItem.Refrigeration_Type_Desc}}</div>
                  <div class="common-table-cell">{{firstItem.Time_Limit_Desc}}</div>
                  <div class="common-table-cell">{{firstItem.Vehicle_Request_Desc}}</div>
                  <div class="common-table-cell">{{firstItem.Vehicle_Size_Desc}}</div>
                  <div class="common-table-cell"><a href="javascript:void(0)" @click="showSecond(firstItem)">查看</a></div>
                </div>
                <div class="child" v-show="firstItem.showChild">
                  <!--二级数据-->
                  <div class="common-table">
                    <div class="common-table-head bg-col-2">
                      <div class="common-table-cell check-cell">
                        <!--<el-checkbox v-model="firstItem.select"  @change="secondSelectAll(firstItem)"></el-checkbox>-->
                      </div>
                      <div class="common-table-cell">委托方订单号</div>
                      <div class="common-table-cell" style="width: 170px;flex: none;">单位名称</div>
                      <div class="common-table-cell" style="width: 170px;flex: none;">起点</div>
                      <div class="common-table-cell" style="width: 170px;flex: none;">单位地址</div>
                      <div class="common-table-cell">件数</div>
                      <div class="common-table-cell">体积（m³）</div>
                      <div class="common-table-cell">重量（kg）</div>
                      <div class="common-table-cell">末端承运商</div>
                      <div class="common-table-cell">是否回单</div>
                      <div class="common-table-cell">是否现场打印</div>
                      <div class="common-table-cell">备注</div>
                    </div>
                    <div v-for="(secondItem, sIndex) in firstItem.children">
                      <div class="common-table-row" @dblclick="viewThird(secondItem)">
                        <div class="common-table-cell check-cell">
                          <el-checkbox v-model="secondItem.select" @change="secondSelect(firstItem)"></el-checkbox>
                        </div>
                        <!-- <div class="common-table-cell">{{secondItem.ConOrder_No}}</div> -->
                        <el-tooltip placement="top" :content="secondItem.ConOrder_No" :disabled="!secondItem.ConOrder_No">
                          <div class="common-table-cell">{{secondItem.ConOrder_No}}</div>
                        </el-tooltip>
                        <el-tooltip placement="top" :content="secondItem.Ssa_Name" :disabled="!secondItem.Ssa_Name || secondItem.Ssa_Name.length < 13">
                          <div class="common-table-cell" style="width: 170px;flex: none;" :style="{color: secondItem.Start_Color}">{{secondItem.Ssa_Name}}</div>
                        </el-tooltip>
                        <el-tooltip placement="top" :content="secondItem.Start_Shortname" :disabled="!secondItem.Start_Shortname || secondItem.Start_Shortname.length < 13">
                          <div class="common-table-cell" style="width: 170px;flex: none;">{{secondItem.Start_Shortname}}</div>
                        </el-tooltip>
                        <el-tooltip placement="top" :content="secondItem.Ssa_Address" :disabled="!secondItem.Ssa_Address || secondItem.Ssa_Address.length < 13">
                          <div class="common-table-cell" style="width: 170px;flex: none;">{{secondItem.Ssa_Address}}</div>
                        </el-tooltip>
                        <div class="common-table-cell">{{secondItem.Planned_Pcs}}</div>
                        <div class="common-table-cell">{{secondItem.Planned_Volume}}</div>
                        <div class="common-table-cell">{{secondItem.Planned_Weight}}</div>
                        <el-tooltip placement="top" :content="secondItem.Terminal_Carrier_Name" :disabled="!secondItem.Terminal_Carrier_Name || secondItem.Terminal_Carrier_Name.length < 13">
                          <div class="common-table-cell" style="width: 170px;flex: none;">{{secondItem.Terminal_Carrier_Name}}</div>
                        </el-tooltip>
                        <div class="common-table-cell">{{secondItem.Is_Receipt}}</div>
                        <div class="common-table-cell">{{secondItem.Is_ScenePrint}}</div>
                        <el-tooltip placement="top" :content="secondItem.Remarks" :disabled="!secondItem.Remarks">
                          <div class="common-table-cell">{{secondItem.Remarks}}</div>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <!--路线tab-->
      <div class="route" v-show="showRoute">
        <div class="condition">
          <div class="condition-box">
            <div class="common-condition-box">
              <el-form :inline="true">
                <el-form-item label="启运时间">
                  <el-date-picker v-model="routeCondition.Fixed_Departure_Time"></el-date-picker>
                </el-form-item>
                <el-form-item label="城市：" v-if="filterRoutes.city.data.length > 0">
                  <el-checkbox-group v-model="filterRoutes.city.selection">
                    <el-checkbox v-for="(item, index) in filterRoutes.city.data" :label="item.Region_Name" :key="index"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="filter-condition" v-show="showRouteFilter">
            <label class="title">筛选条件</label>
            <el-tag type="primary" v-if="routeCondition.Fixed_Departure_Time" :closable="true" @close=closeTag(8)>{{routeTags.Fixed_Departure_Time}}</el-tag>
            <label class="end" v-if="filterRoutes.city.selection.length > 0"><i class="el-icon-mo-addressAdd"></i>城市
              <el-tag type="primary" v-for="(sTag, n) in filterRoutes.city.selection" :key="n" :closable="true" @close=closeTag(6,sTag)>{{sTag}}</el-tag>
            </label>
          </div>
        </div>
        <div class="table-box" :style="{paddingtop: fixTop.route}">
          <common-gride-card :expand-able="false" :click-select="false" v-for="(rt, rIndex) in realRouteData" :key="rIndex" @click.native="choiceThis(rt)">
            <div slot="header">
              <div class="ch-box">
                <el-radio v-model="choiceId" :label="rt.TransportRoute_Id">&nbsp;</el-radio>
              </div>
              <div class="tx-box" :title="rt.TransportRoute_No">{{rt.TransportRoute_No}}</div>
              <div class="tx-box" :title="rt.Ssa_Count">单位数：{{rt.Ssa_Count}}个</div>
              <div class="tx-box" :title="rt.Pcs_Sum">总件数：{{rt.Pcs_Sum}}件</div>
              <div class="tx-box" :title="rt.Volume_Sum">总体积：{{rt.Volume_Sum}}m³</div>
              <div class="tx-box" :title="rt.Weight_Sum">总重量：{{rt.Weight_Sum}}kg</div>
              <div class="btn-box">

                <el-button type="text" icon="mo-direction" @click="addStartAddress(rt)" v-if="!rt.isHistory">添加出发地</el-button>
                <el-button type="text" icon="plus" @click="addAdress(rt, rIndex)" v-if="!rt.isHistory">添加地址</el-button>
                <el-button type="text" icon="mo-destinationAdd" @click="addDestination(rt)" v-if="!rt.isHistory">添加目的地</el-button>
                <el-button type="text" icon="delete" @click="delDtl(rt)">删单</el-button>
                <el-button type="text" icon="mo-preservation" @click="saveRoute(rt)">保存</el-button>
                <el-button type="text" icon="mo-sure" @click="beforeSubmitRoute(rt)">确定</el-button>
                <el-button type="text" @click="getDtlByRouteId(rt)">{{!rt.expand ? '显示' : '隐藏'}}
                  <i class="el-icon-arrow-up el-icon--right" v-if="rt.expand"></i>
                  <i class="el-icon-arrow-down el-icon--right" v-if="!rt.expand"></i>
                </el-button>
              </div>
            </div>
            <!--历史路线-->
            <div class="history" v-if="rt.isHistory">
              <div class="address-wrapper">
                <div class="address-list" v-show="rt.Route_Dtls.length > 0">
                  <div class="address-item" v-for="(item, index) in rt.Route_Dtls">
                    <div class="title">地址{{index + 1}}</div>
                    <div class="circle" :class="{greCol: index === 0, yeCol: rt.Route_Dtls.length > 2 && index > 0 && index < rt.Route_Dtls.length - 1, reCol: rt.Route_Dtls.length > 1 && index === rt.Route_Dtls.length - 1, last: index === rt.Route_Dtls.length - 1}">
                      <div class="inner-circle"></div>
                    </div>
                    <div class="shixiao text" v-if="rt.Route_Dtls.length > 1 && index < rt.Route_Dtls.length - 1">
                      <span>时效</span>
                      <span>{{item.Time_Limit}}</span>
                      <span>h</span>
                    </div>
                    <ul>
                      <li :title="item.Address_Shortname">{{item.Address_Shortname}}</li>
                      <li>&nbsp;<span v-show="item.Address_Id !== '0' && item.Address_Id !== '1'">联系人：{{item.Contact_Name}}</span></li>
                      <li>&nbsp;<span v-show="item.Address_Id !== '0' && item.Address_Id !== '1'">联系电话：{{item.Contact_Phone}}</span></li>
                    </ul>
                  </div>
                </div>
              </div>
              <common-row>
                <common-col>
                  <span class="label">路线类型：</span>
                  <div class="content">
                    <span>{{rt.TransportRoute_Type_Desc}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">固定运营商：</span>
                  <div class="content">
                    <span>{{rt.Fixed_Operator_Name}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">固定承运商：</span>
                  <div class="content">
                    <span>{{rt.Fixed_Carrier_Name}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">运输方式：</span>
                  <div class="content">
                    <span>{{rt.Transport_Mode_Desc}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">路线频次：</span>
                  <div class="content">
                    <span>{{rt.Frequency}}</span>次/<span>{{rt.Unit_Desc}}</span>
                  </div>
                </common-col>
                <common-col :lot="2">
                  <span class="label">备注：</span>
                  <div class="content">
                    <span>{{rt.Remarks}}</span>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">启运时间：</span>
                  <div class="content">
                    <el-date-picker type="datetime" v-model="rt.Fixed_Departure_Time"></el-date-picker>
                  </div>
                </common-col>
              </common-row>
            </div>
            <!--常规路线-->
            <div class="normal" v-if="!rt.isHistory">
              <div class="address-wrapper">
                <div class="address-list" v-show="rt.Route_Dtls.length > 0">
                  <draggable v-model="rt.Route_Dtls" @start="onStart($event, rt.Route_Dtls)" @end="onEnd($event, rt.Route_Dtls)">
                    <div class="address-item" v-for="(item, index) in rt.Route_Dtls" :class="{dragging: rt.Route_Dtls.dragging}">
                      <div class="title">地址{{index + 1}}</div>
                      <div class="circle" :class="{greCol: index === 0, yeCol: rt.Route_Dtls.length > 2 && index > 0 && index < rt.Route_Dtls.length - 1, reCol: rt.Route_Dtls.length > 1 && index === rt.Route_Dtls.length - 1, last: index === rt.Route_Dtls.length - 1}">
                        <div class="inner-circle"></div>
                      </div>
                      <div class="shixiao" v-if="rt.Route_Dtls.length > 1 && index < rt.Route_Dtls.length - 1">
                        <span>时效</span>
                        <el-input type="number" :min="0" v-model="item.Time_Limit"></el-input>
                        <!--<el-input-number :min="0" v-model="item.Time_Limit"></el-input-number>-->
                        <span>h</span>
                      </div>
                      <ul>
                        <li :title="item.Address_Shortname">{{item.Address_Shortname}}</li>
                        <li>&nbsp;<span v-show="item.Address_Id !== '0' && item.Address_Id !== '1'">联系人：{{item.Contact_Name}}</span></li>
                        <li>&nbsp;<span v-show="item.Address_Id !== '0' && item.Address_Id !== '1'">联系电话：{{item.Contact_Phone}}</span></li>
                        <li>
                          <el-button size="mini" @click="delAddress(rt.Route_Dtls, index)">删除路线</el-button>
                        </li>
                      </ul>
                    </div>
                  </draggable>
                </div>
              </div>
              <common-row>
                <common-col>
                  <span class="label">路线类型</span>
                  <div class="content">
                    <el-select v-model="rt.TransportRoute_Type">
                      <el-option v-for="(item, index) in routeType" :value="item.Value_Data" :label="item.Value_Desc" :key="index"></el-option>
                    </el-select>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">固定运营商</span>
                  <div class="content">
                    <el-input placeholder="双击带出运营商" v-model="rt.Fixed_Operator_Name" :disabled="true" @dblclick.native="openFixOper(rt)" icon="close" :on-icon-click="deleteFixOper"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">固定承运商</span>
                  <div class="content">
                    <el-input placeholder="双击带出承运商" v-model="rt.Fixed_Carrier_Name" :disabled="true" @dblclick.native="openFixCarr(rt)" icon="close" :on-icon-click="deleteFixCarr"></el-input>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">运输方式</span>
                  <div class="content">
                    <select-dictionary field="Transport_Mode" v-model="rt.Transport_Mode"></select-dictionary>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">启运时间</span>
                  <div class="content">
                    <el-date-picker type="datetime" v-model="rt.Fixed_Departure_Time"></el-date-picker>
                  </div>
                </common-col>
                <common-col>
                  <span class="label">备注</span>
                  <div class="content">
                    <el-input v-model="rt.Remarks"></el-input>
                  </div>
                </common-col>
                <common-col :lot="2">
                  <span class="label">路线频次</span>
                  <div class="revolution">
                    <!--<el-input :min="0" type="number" v-model="rt.Frequency"></el-input>&nbsp;&nbsp;次/&nbsp;&nbsp;-->
                    <el-input-number :min="0" v-model="rt.Frequency"></el-input-number>&nbsp;&nbsp;次/&nbsp;&nbsp;
                    <select-dictionary v-model="rt.Unit" field="Unit"></select-dictionary>
                  </div>
                </common-col>
              </common-row>
            </div>
            <div slot="children" v-show="rt.expand">
              <el-table :data="rt.children" @selection-change="rt.selection = arguments[0]">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="Con_Name" label="委托方" width="150" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="TransportPlan_Type_Desc" label="运输任务类型" width="120"></el-table-column>
                <el-table-column prop="Start_City" label="起点市"></el-table-column>
                <el-table-column prop="End_City" label="终点市"></el-table-column>
                <el-table-column prop="Ssa_Count" label="单位数"></el-table-column>
                <el-table-column prop="Pcs_Sum" label="总件数"></el-table-column>
                <el-table-column prop="Volume_Sum" label="总体积(m³)"></el-table-column>
                <el-table-column prop="Weight_Sum" label="总重量(㎏)"></el-table-column>
                <el-table-column prop="Refrigeration_Type_Desc" label="温层" width="150"></el-table-column>
                <el-table-column prop="Time_Limit_Desc" label="时效"></el-table-column>
                <el-table-column prop="Vehicle_Request_Desc" label="车辆要求"></el-table-column>
                <el-table-column prop="Vehicle_Size_Desc" label="车辆大小"></el-table-column>
                <el-table-column label="路线起点" :width="120">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.start_Address_Id" @change="changeAddress(scope.row, rt)">
                      <el-option v-for="(startItem, startIndex) in rt.Route_Dtls" :value="startItem.Address_Id" :label="'地址' + startItem.Order_Id" :key="startIndex"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="路线终点" :width="120">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.end_Address_Id">
                      <el-option v-for="(endItem, endIndex) in getEndRoutes(scope.row, rt)" :value="endItem.Address_Id" :label="'地址' + endItem.Order_Id" :key="endIndex"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </common-gride-card>
        </div>
      </div>
      <!--运单三级数据弹窗-->
      <goodsinfo-modal :bill-dtl-id="selectThirdId" :transport-plan-type="selectThirdType" :isVisible.sync="showThird" @split-success="getFirstOrder"></goodsinfo-modal>
      <!--信息变更弹框-->
      <el-dialog class="order-change-dialog" title="订单信息" :visible.sync="showOrderChange">
        <div class="group dass-line">
          <common-row type="flex">
            <common-col :lot="2">
              <label class="label">客户名称：</label>
              <div class="content">{{orderInfo.Ssa_Name}}</div>
            </common-col>
            <common-col>
              <label class="label">联系人：</label>
              <div class="content">{{orderInfo.Contact_Name}}</div>
            </common-col>
          </common-row>
          <common-row type="flex">
            <common-col>
              <label class="label">联系电话：</label>
              <div class="content">{{orderInfo.Contact_Phone}}</div>
            </common-col>
            <common-col :lot="2">
              <label class="label">地址：</label>
              <div class="content">
                <el-input :disabled="true" placeholder="双击带出地址信息" v-model="orderInfo.Address" @dblclick.native="showOrderAddressModal = true"></el-input>
              </div>
            </common-col>
          </common-row>
          <common-row type="flex">
            <common-col>
              <label class="label">终点城市：</label>
              <div class="content">{{orderInfo.End_City}}</div>
            </common-col>
            <common-col>
              <label class="label">时效（H）：</label>
              <div class="content">{{orderInfo.Time_Limit_Desc}}</div>
            </common-col>
            <common-col>
              <label class="label">预计到达时间：</label>
              <div class="content" :title="orderInfo.Arrive_Time">{{orderInfo.Arrive_Time}}</div>
            </common-col>
          </common-row>
        </div>
        <div class="group dass-line">
          <common-row type="flex">
            <common-col>
              <label class="label">委托方单号：</label>
              <div class="content">{{orderInfo.ConOrder_No}}</div>
            </common-col>
            <common-col :lot="2">
              <label class="label">商品名称：</label>
              <div class="content">{{orderInfo.Goods_Name}}</div>
            </common-col>
          </common-row>
          <common-row type="flex">
            <common-col>
              <label class="label">件数：</label>
              <div class="content">{{orderInfo.Planned_Pcs}}</div>
            </common-col>
            <common-col>
              <label class="label">体积（cm²）：</label>
              <div class="content">{{orderInfo.Planned_Volume}}</div>
            </common-col>
            <common-col>
              <label class="label">重量（kg）：</label>
              <div class="content">{{orderInfo.Planned_Weight}}</div>
            </common-col>
          </common-row>
        </div>
        <div class="group">
          <common-row type="flex">
            <common-col>
              <label class="label">计费规则：</label>
              <div class="content">{{orderInfo.Charging_Standard_Desc}}</div>
            </common-col>
            <common-col>
              <label class="label">单价（元）：</label>
              <div class="content">{{orderInfo.Settleup_Price}}</div>
            </common-col>
            <common-col>
              <label class="label">金额（元）：</label>
              <div class="content">{{orderInfo.Settleup_Amount}}</div>
            </common-col>
          </common-row>
          <common-row type="flex">
            <common-col>
              <label class="label">付款方：</label>
              <div class="content">{{orderInfo.Payer_Desc}}</div>
            </common-col>
            <common-col>
              <label class="label">是否托收运费：</label>
              <div class="content">{{orderInfo.Is_Takecharge_Desc}}</div>
            </common-col>
            <common-col>
              <label class="label">托收金额：</label>
              <div class="content">{{orderInfo.Takecharge_Amount}}</div>
            </common-col>
          </common-row>
          <common-row type="flex">
            <common-col>
              <label class="label">备注：</label>
              <div class="content">{{orderInfo.Remarks}}</div>
            </common-col>
          </common-row>
        </div>
        <div slot="footer">
          <el-button type="success" @click="comfirmOrderInfoChange">确认</el-button>
          <el-button type="primary" @click="showOrderChange = false">取消</el-button>
        </div>
      </el-dialog>
      <!--地址变更-->
      <address-modal  :visible.sync="showOrderAddressModal" :ssa-id="orderInfo.Ssa_Id" @change="comfirmOrderAddress"></address-modal>
      <!--停止明细弹窗-->
      <el-dialog class="stopreson-dialog" title="请输入停止明细原因" size="tiny" :visible.sync="showStopReson">
        <common-row type="flex">
          <common-col>
            <label class="label">已选明细：</label>
            <ul class="content">
              <li v-for="dtl in dtlIds">{{dtl}}</li>
            </ul>
          </common-col>
        </common-row>
        <common-row type="flex">
          <common-col>
            <label class="label">停止原因：</label>
            <div class="content">
              <el-input type="textarea" :row="3" v-model="StopReason"></el-input>
            </div>
          </common-col>
        </common-row>
        <div slot="footer">
          <el-button type="success" @click="confirmStop">确认</el-button>
          <el-button type="primary" @click="showStopReson = false">取消</el-button>
        </div>
      </el-dialog>
      <!--地址弹窗-->
      <route-address-modal :isVisible.sync="showRouteAddressModal" @change="confirmAddress"></route-address-modal>
      <!--固定运营商-->
      <fixoperator-modal :visible.sync="showFixOper" @change="confirmFixOper"></fixoperator-modal>
      <!--固定承运商-->
      <fixcarr-modal :visible.sync="showFixCarr" @change="confirmFixCarr"></fixcarr-modal>
      <!--历史路线弹框-->
      <history-route-dialog :isVisible.sync="showHistoryRoute" @select="addHistoryRoute"></history-route-dialog>
      <!-- 未描点单位信息 -->
      <common-modal ref="notPointCompanyDialog" DialogTitle="未描点单位信息" :isVisible.sync="showNotPointCompany" :TableHeader="notPointCompany.TableHeader" :listData="notPointCompany.datas" @search="searchNotPointCompany" :total="notPointCompany.bigTotalItems" @pageChange="notPointCompanyPageChange"></common-modal>
      <!-- <common-modal ref="notPointCompanyDialog" DialogTitle="未描点单位信息" :isVisible.sync="showNotPointCompany" :TableHeader="notPointCompany.TableHeader" :listData="notPointCompany.datas" @search="searchNotPointCompany" :total="notPointCompany.bigTotalItems" @pageChange="notPointCompanyPageChange" @dialog-operate="companyPoint"></common-modal> -->
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import {DateFtt, hasSameItem, getIndexOfCollection} from '@/common/js/utils.js'
    import {Bus, Types} from '@/common/js/bus.js'
    import commonRow from '@/common/components/common-row/index.js'
    import commonCol from '@/common/components/common-col'
    import selectDictionary from '@/common/service/select/select-dictionary'
    import addressModal from '@/common/service/modal/address-modal'
    import fixoperatorModal from '@/common/service/modal/fixoperator-modal'
    import fixcarrModal from '@/common/service/modal/fixcarr-modal'
    import commonGrideCard from '@/common/components/common-gride-card'
    import routeAddressModal from './route-address-modal'
    import goodsinfoModal from './goodsinfo-modal'
    import historyRouteDialog from './history-route-dialog'
    import draggable from 'vuedraggable'
    import commonModal from '@/common/components/common-modal'
    import Vue from 'vue'
    export default {
        name: '',
        props: [],
        components: {draggable, selectDictionary, commonRow, commonCol, commonGrideCard, addressModal, routeAddressModal, fixoperatorModal, fixcarrModal, goodsinfoModal, historyRouteDialog, commonModal},
        data () {
            return {
              first: {
                data: [
                  {
                    index: 0,
                    Takegds_Time: '111',
                    Con_Name: '222',
                    TransportPlan_Type_Desc: '333',
                    Start_City: '444',
                    End_City: '555',
                    Ssa_Count: '666',
                    Pcs_Sum: '777',
                    Volume_Sum: '888',
                    Weight_Sum: '999',
                    Refrigeration_Type_Desc: 'aaa',
                    Time_Limit_Desc: 'bbb',
                    Vehicle_Request_Desc: 'ccc',
                    Vehicle_Size_Desc: 'ddd',
                    children: [
                      {
                        ConOrder_No: '111',
                        Ssa_Name: '222',
                        Start_Shortname: '333',
                        Ssa_Address: '444',
                        Planned_Pcs: '111',
                        Planned_Volume: '222',
                        Planned_Weight: '333',
                        Terminal_Carrier_Name: '444',
                        Is_Receipt: '111',
                        Is_ScenePrint: '222',
                        Remarks: '333'
                      }
                    ]
                  },
                  {
                    index: 1,
                    Takegds_Time: '111',
                    Con_Name: '222',
                    TransportPlan_Type_Desc: '333',
                    Start_City: '444',
                    End_City: '555',
                    Ssa_Count: '666',
                    Pcs_Sum: '777',
                    Volume_Sum: '888',
                    Weight_Sum: '999',
                    Refrigeration_Type_Desc: 'aaa',
                    Time_Limit_Desc: 'bbb',
                    Vehicle_Request_Desc: 'ccc',
                    Vehicle_Size_Desc: 'ddd'
                  }
                ]
              },
              selectThirdId: '', // 二级明细id（用于查询三级数据）
              selectThirdType: '', // 二级运输类型（用于区分三级是否可以拆分）
              showThird: false, // 是否显示三级数据弹窗
              routeData: [], // 路线信息
              condition: {
                show: false, // 是否显示筛选框
                keyword: '', // 关键字检索
                Consi_Name: '', // 委托方
                TransportPlan_Type: '', // 运输任务类型
                TransportPlan_Type_Desc: '', // 运输任务类型描述
                Takegds_Time: '', // 提货时间
                Refrigeration_Type: '', // 温层
                Refrigeration_Type_Desc: '', // 温层描述
                Time_Limit: '', // 时效
                AgingData: []
              },
              // 起点、终点城市数据(订单tab)
              filterOrders: {
                start: {
                  data: [],
                  checkAll: false,
                  isIndeterminate: true,
                  selection: []
                },
                end: {
                  data: [],
                  checkAll: false,
                  isIndeterminate: true,
                  selection: []
                }
              },
              routeCondition: {
                show: false, // 是否显示筛选框
                keyword: '', // 关键字检索
                Fixed_Departure_Time: '' // 启运时间
              },
              // 起点、终点城市数据(路线tab)
              filterRoutes: {
                city: {
                  data: [],
                  checkAll: false,
                  isIndeterminate: true,
                  selection: []
                }
              },
              fixTop: {
                order: '',
                route: ''
              },
              choiceId: -1,
              selectTab: '运单', // 默认显示运单tab
              showRouteAddressModal: false, // 是否显示路线地址弹窗
              showOrderChange: false, // 是否显示订单信息变更弹框
              showOrderAddressModal: false, // 是否显示地址变更弹框
              showStopReson: false, // 是否显示停止明细弹窗
              showFixOper: false, // 是否显示运营商弹窗
              showFixCarr: false, // 是否显示固定承运商
              showHistoryRoute: false, // 是否显示历史弹窗
              routeType: [], // 路线类型
              StopReason: '', // 停止明细原因
              orderInfo: {}, // 订单信息变更信息
              notPointCompany: { // 未描点单位信息
                TableHeader: [
                  // {
                  //   field: 'dialogOperate',
                  //   title: '操作'
                  // },
                  {
                    field: 'Ssa_Name',
                    title: '单位名称',
                    width: 220
                  },
                  {
                    field: 'Ssa_No',
                    title: '单位编号',
                    width: 160
                  },
                  {
                    field: 'ConOrder_No',
                    title: '委托方单号',
                    width: 140
                  },
                  {
                    field: 'Mnemonic_Code',
                    title: '助记码',
                    width: 160
                  },
                  {
                    field: 'Contact_Name',
                    title: '联系人'
                  },
                  {
                    field: 'Contact_Phone',
                    title: '联系电话',
                    width: 140
                  },
                  {
                    field: 'Address',
                    title: '地址',
                    width: 300
                  }
                ],
                datas: [],
                currentPage: 1,
                pageSize: 10,
                bigTotalItems: 0,
                keywords: ''
              },
              showNotPointCompany: false, // 警告
              addressCondition: false // 显示起点终点过滤
            }
        },
        computed: {
          // 是否显示历史路线弹框
          showRoute () {
            return this.selectTab === '路线'
          },
          // 订单标签内容
          tags () {
            return {
              Consi_Name: this.condition.Consi_Name,
              TransportPlan_Type: this.condition.TransportPlan_Type_Desc,
              Refrigeration_Type: this.condition.Refrigeration_Type_Desc,
              Takegds_Time: DateFtt('yyyy-MM-dd', this.condition.Takegds_Time),
              Time_Limit: this.condition.Time_Limit + 'H'
            }
          },
          // 路线标签内容
          routeTags () {
            return {
              Fixed_Departure_Time: DateFtt('yyyy-MM-dd', this.routeCondition.Fixed_Departure_Time)
            }
          },
          // 是否显示筛选标签（运单tab）
          showOrderFilter () {
            return this.condition.Consi_Name || this.condition.TransportPlan_Type || this.condition.Refrigeration_Type || this.condition.Takegds_Time || this.condition.Time_Limit || this.filterOrders.start.selection.length > 0 || this.filterOrders.end.selection.length > 0
          },
          // 是否显示筛选标签（路线tab）
          showRouteFilter () {
            return this.routeCondition.Fixed_Departure_Time || this.filterRoutes.city.selection.length > 0
          },
          // 一级筛选shuju
          firstFilterData: {
            get () {
              let rel = this.first.data.filter((item) => {
                return (!this.condition.Consi_Name || item.Con_Name.indexOf(this.condition.Consi_Name) !== -1) && (!this.condition.TransportPlan_Type || this.condition.TransportPlan_Type === item.TransportPlan_Type) && (!this.condition.Takegds_Time || DateFtt('yyyy-MM-dd', this.condition.Takegds_Time) === item.Takegds_Time) && (!this.condition.Refrigeration_Type || this.condition.Refrigeration_Type === item.Refrigeration_Type) && (!this.condition.Time_Limit || this.condition.Time_Limit === item.Time_Limit + '')
              })
              // 根据起点市筛选
              if (this.filterOrders.start.selection.length > 0) {
                rel = rel.filter((item) => {
                  return this.filterOrders.start.selection.indexOf(item.Start_City) !== -1
                })
              }
              // 根据终点市筛选
              if (this.filterOrders.end.selection.length > 0) {
                rel = rel.filter((item) => {
                  return this.filterOrders.end.selection.indexOf(item.End_City) !== -1
                })
              }
              return rel
            },
            set () {}
          },
          // 过滤后的路线数组
          realRouteData () {
            let rel = this.routeData.filter((item) => {
              let timeMeta, cityMeta
              if (this.routeCondition.Fixed_Departure_Time) {
                let conditionTime = DateFtt('yyyy-MM-dd', this.routeCondition.Fixed_Departure_Time)
                let itemTime = DateFtt('yyyy-MM-dd', new Date(item.Fixed_Departure_Time))
                timeMeta = conditionTime === itemTime
              }
              if (this.filterRoutes.city.selection.length > 0) {
                cityMeta = hasSameItem(this.filterRoutes.city.selection, item.cityGroup)
              }
              return (!this.routeCondition.Fixed_Departure_Time || timeMeta) && (this.filterRoutes.city.selection.length === 0 || cityMeta)
            })
            return rel
          },
          // 选择的路线
          choiceRoute () {
            if (this.choiceId === -1) return {}
            // 所选路线
            let rel = this.realRouteData.filter((item) => {
              return item.TransportRoute_Id === this.choiceId
            })
            rel = rel.length > 0 ? rel[0] : {}
            // 所选路线的起点地址简称
            if (rel.Route_Dtls && rel.Route_Dtls.length > 0) {
              rel.startShortName = rel.Route_Dtls[0].Address_Shortname
            }
            return rel
          },
          // 加单校验（温层、产品大类是否相同, 0通过校验，1温层不同，2产品大类不同，3包车运输必须全选明细）
          addOrderJudge () {
            // 选择的运单（包含一级和二级，用于加单校验）
            let selection = []
            let judge = 0
            this.firstFilterData.forEach((item) => {
              if (item.select) {
                selection.push(item)
              } else if (item.children) {
                let childrenSelected = item.children.some((cItem) => cItem.select)
                // 如果二级数据部分选中
                if (childrenSelected) {
                  selection.push(item)
                }
                if (childrenSelected && item.TransportPlan_Type_Desc === '包车运输计划') {
                  judge = 3
                }
              }
            })
            if (judge) return judge
            for (var i = 0; i < selection.length; i++) {
              let referItem = selection[0]
              let thisItem = selection[i]
              if (thisItem.Refrigeration_Type !== referItem.Refrigeration_Type) {
                judge = 1
                break
              }
              if (thisItem.Refrigeration_Type !== referItem.Refrigeration_Type) {
                judge = 2
                break
              }
            }
            return judge
          },
          // 加单入参
          orderParams () {
            let params = {
              Bill_Hdr_Ids: '',
              Bill_Dtl_Ids: '',
              ConOrder_No: ''
            }
            this.firstFilterData.forEach((item) => {
              if (item.select) {
                if (params.Bill_Hdr_Ids) {
                  params.Bill_Hdr_Ids += ','
                  params.Bill_Dtl_Ids += ','
                  params.ConOrder_No += ','
                }
                params.Bill_Hdr_Ids += item.Bill_Hdr_Id
                params.Bill_Dtl_Ids += item.Bill_Dtl_Id
                params.ConOrder_No += item.ConOrder_No
              } else if (item.children) {
                item.children.forEach((cItem) => {
                  if (cItem.select) {
                    if (params.Bill_Hdr_Ids) {
                      params.Bill_Hdr_Ids += ','
                      params.Bill_Dtl_Ids += ','
                      params.ConOrder_No += ','
                    }
                    params.Bill_Hdr_Ids += cItem.Bill_Hdr_Id
                    params.Bill_Dtl_Ids += cItem.Bill_Dtl_Id
                    params.ConOrder_No += cItem.ConOrder_No
                  }
                })
              }
            })
            return params
          },
          // 已选订单明细数组
          dtlIds () {
            // 已选明细显示委托单号
            return this.orderParams.ConOrder_No.split(',')
          },
          // 分段路线地址
          RouteDtls () {
            return this.choiceRoute.Route_Dtls.map((item, index) => {
              let current = item
              let next = null
              if (index === this.choiceRoute.Route_Dtls.length - 1) {
                next = {
                  Address_Id: '0'
                }
              } else {
                next = this.choiceRoute.Route_Dtls[index + 1]
              }
              return {
                TransportRoute_Id: this.choiceId,
                Order_Id: index + 1,
                Start_Address_Id: current.Address_Id,
                End_Address_Id: next.Address_Id,
                Address_Id: current.Address_Id,
                Time_Limit: current.Time_Limit || '0'
              }
            })
          },
          // 所选路线下提交的单据信息
          BillInfo () {
            return this.choiceRoute.children.map((item) => {
              return {
                Bill_Hdr_Id: item.Bill_Hdr_Id,
                Bill_Dtl_Id: item.Bill_Dtl_Id,
                TdelAddress_Id: item.TdelAddress_Id,
                Start_Address_Id: item.start_Address_Id,
                End_Address_Id: item.end_Address_Id
              }
            })
          }
        },
        methods: {
          onStart (e, dragItem) {
            this.$set(dragItem, 'dragging', true)
          },
          // 控制出发地/目的地不可拖动 且重新计算Order_Id
          onEnd (e, dragItem) {
            let arr = dragItem
            let len = arr.length
            let cfdPos = 0
            let pos = arr.length - 1
            let cfd = {}
            let mdd = {}
            let cfdRight = false // 出发地是否在开始的位置
            let mddRight = false // 目的地是否在最后的位置
            arr.forEach((item, index) => {
              if (item.Address_Id === '0' && item.Address === '目的地') {
                mdd = item
                if (index !== pos) {
                  pos = index
                  mddRight = true
                }
              }
              if (item.Address_Id === '1' && item.Address === '出发地') {
                cfd = item
                if (index !== cfdPos) {
                  cfdPos = index
                  cfdRight = true
                }
              }
            })
            if (mddRight) {
              arr.splice(pos, 1)
              arr.push(mdd)
            }
            if (cfdRight) {
              arr.splice(cfdPos, 1)
              arr.unshift(cfd)
            }
            arr = arr.map((item, index) => {
              item.Order_Id = index + 1
              return item
            })
            this.$set(dragItem, 'dragging', false)
          },
//          一级数据
          getFirstOrder () {
            Api.get('TMP_TransportTaskScheding_Yd_Hdr', {Operator_Id: Api.userInfo.Operator_Id}, true)
              .then((resp) => {
                if (resp.Flag) {
                  this.first.data = resp.MsgInfo.map((item) => {
                    item.select = false
                    item.showChild = false
                    item.children = []
                    return item
                  })
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
//          二级数据
          showSecond (row, refresh) {
            if (!row.children || row.children.length === 0 || refresh) {
              Api.basePost('TMP_TransportTaskScheding_Yd_Dtl', {Bill_Dtl_Id: row.Bill_Dtl_Id})
                .then((resp) => {
                  if (resp.Flag) {
                    row.children = resp.MsgInfo.map((item) => {
                      item.select = false
                      return item
                    })
                    row.showChild = !row.showChild
                    this.secondSelectAll(row)
                  } else {
                    this.messageInfo(resp.ErrInfo)
                  }
                })
            } else {
              row.showChild = !row.showChild
            }
          },
          // 查看三级数据
          viewThird (secondRow) {
            this.selectThirdId = secondRow.Bill_Dtl_Id
            this.selectThirdType = secondRow.TransportPlan_Type
            this.showThird = true
          },
          // 获取时效
          getAging () {
            Api.get('TMP_TransportTaskScheding_GetAging', {})
              .then((resp) => {
                if (resp.Flag) {
                  this.condition.AgingData = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 获取起点终点筛选条件(运单tab)
          getSeCondition () {
            Api.post('TMP_TransportTaskDD_GetYdLeftFilter', {Operator_Id: Api.userInfo.Operator_Id})
              .then((resp) => {
                if (resp.Flag) {
                  let data = JSON.parse(resp.MsgInfo)
                  this.filterOrders.start.data = data.Start_List
                  this.filterOrders.end.data = data.End_List
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 获取城市筛选条件(路线tab)
          getCityCondition () {
            Api.get('TMP_TransportTaskScheding_Yd_GetRightFilter', {Operator_Id: Api.userInfo.Operator_Id})
              .then((resp) => {
                if (resp.Flag) {
//                  Region_Name
                  this.filterRoutes.city.data = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 关闭筛选条件标签
          closeTag (type, tag) {
            let index = 0
            switch (type) {
              case 0: // 运输类型
                this.condition.TransportPlan_Type = ''
                break
              case 1: // 启运时间
                this.condition.Takegds_Time = ''
                break
              case 2: // 温层
                this.condition.Refrigeration_Type = ''
                break
              case 3: // 时效
                this.condition.Time_Limit = ''
                break
              case 4: // 起点市(订单tab)
                index = this.filterOrders.start.selection.indexOf(tag)
                this.filterOrders.start.selection.splice(index, 1)
                break
              case 5: // 终点市(订单tab)
                index = this.filterOrders.end.selection.indexOf(tag)
                this.filterOrders.end.selection.splice(index, 1)
                break
              case 6: // 起点市(路线tab)
                index = this.filterRoutes.city.selection.indexOf(tag)
                this.filterRoutes.city.selection.splice(index, 1)
                break
              case 7: // 终点市(路线tab)
                index = this.filterRoutes.end.selection.indexOf(tag)
                this.filterRoutes.end.selection.splice(index, 1)
                break
              case 8: // 启运时间(路线tab)
                this.routeCondition.Fixed_Departure_Time = ''
                break
              default: // 委托方
                this.condition.Consi_Name = ''
                break
            }
          },
//          // 起点全选
//          startCheckChange  () {
//            this.filterOrders.start.selection = this.filterOrders.start.checkAll ? this.filterOrders.start.data : []
//            this.filterOrders.start.isIndeterminate = false
//            console.log(this.filterOrders.start.selection)
//          },
//          // 终点全选
//          endCheckChange  () {
//            this.filterOrders.end.selection = this.filterOrders.end.checkAll ? this.filterOrders.end.data : []
//            this.filterOrders.end.isIndeterminate = false
//          },
//          初始化获取路线信息
          initRoute () {
            Api.post('TMP_TransportTaskDD_GetDtlByRoute', {Operator_Id: Api.userInfo.Operator_Id})
              .then((resp) => {
                if (resp.Flag) {
                  this.routeData = JSON.parse(resp.MsgInfo).map((item) => {
                    // 用于城市检索
                    item.cityGroup = item.Route_Dtls.map(item => item.City_Name)
                    item.isHistory = (item.TransportRoute_Type === 'GD')
                    item.expand = false
                    return item
                  })
                  console.error(this.routeData)
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 获取路线下的单据明细
          getDtlByRouteId (row, refresh) {
            row.expand = !row.expand
            // refresh标识是否刷新
            if (row.children && row.children.length > 0 && !refresh) return false
            Api.post('TMP_TransportTaskDD_GetDtlByRouteId', {Operator_Id: Api.userInfo.Operator_Id, TransportRoute_Id: row.TransportRoute_Id})
              .then((resp) => {
                if (resp.Flag) {
                  let data = JSON.parse(resp.MsgInfo)
                  if (data.length > 0) {
                    data[0].BillDtls = data[0].BillDtls.map((item, index) => {
                      item.start_Address_Id = item.Address_Id // 单据下拉框起点地址id
                      this.changeAddress(item, row) // 单据下拉框终点地址id
                      return item
                    })
                    this.$set(row, 'children', data[0].BillDtls)
                  } else {
                    this.$set(row, 'children', [])
                  }
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          onCheck (row) {
            console.log(row)
          },
          secondSelectAll (firstRow) { // 二级全选
            if (!firstRow.children || firstRow.children.length === 0) return false
            firstRow.children.forEach((item) => {
              if (firstRow.select !== item.select) {
                item.select = firstRow.select
              }
            })
          },
          secondSelect (firstRow) {
            firstRow.select = firstRow.children.every((item) => item.select)
          },
          // 加单前校验
          beforeAddOrder () {
            if (!this.orderParams || !this.orderParams.Bill_Hdr_Ids) {
              this.$alert('请先选择订单')
              return false
            }
            let judge = this.addOrderJudge
            if (judge === 3) {
              this.$alert('运输计划为“包车运输计划”，选择的单据明细必须全选')
              return false
            }
            if (this.choiceId === -1) {
              this.$confirm('加单需要先选择路线，是否立即前往选择路线')
                .then(() => {
                  this.selectTab = '路线'
                })
              return false
            }
            // 温层不同只提示不拦截
            if (judge === 1) {
              this.$confirm('温层不一致，确认加入同一个路线？')
                .then(() => {
                  this.addOrder()
                })
              return false
            }
            this.addOrder()
          },
          // 加单
          addOrder () {
            let params = {
              TransportRoute_Id: this.choiceId,
              Bill_Hdr_Ids: this.orderParams.Bill_Hdr_Ids,
              Bill_Dtl_Ids: this.orderParams.Bill_Dtl_Ids
            }
            Api.post('TMP_TransportTaskDD_AddBills', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('加单成功')
                    .then(() => {
                      this.getFirstOrder()
                      this.initRoute() // 初始化加载路线信息
                    })
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 订单信息变更
          changeOrder () {
            if (!this.orderParams.Bill_Dtl_Ids) {
              this.$alert('请先选择明细')
              return false
            }
            if (this.orderParams.Bill_Dtl_Ids.indexOf(',') !== -1) {
              this.$alert('不能对多条明细信息进行变更')
              return false
            }
            // 获取订单信息
            Api.get('TMP_TransportTaskScheding_Yd_GetDtlByDtlID', {Bill_Dtl_Id: this.orderParams.Bill_Dtl_Ids})
              .then((resp) => {
                this.showOrderChange = true
                if (resp.Flag) {
                  if (resp.MsgInfo.length > 0) {
                    this.orderInfo = resp.MsgInfo[0]
                  } else {
                    this.orderInfo = {}
                  }
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
//          单击某一行选中
          choiceThis (row) {
            if (this.choiceId !== row.TransportRoute_Id) {
              this.choiceId = row.TransportRoute_Id
            }
          },
          // 双击带出地址（订单变更）
          comfirmOrderAddress (row) {
            this.orderInfo.Address = row.Address
            this.orderInfo.Address_Id = row.Address_Id
          },
          // 弹出固定运营商选择框
          openFixOper (row) {
            this.showFixOper = true
          },
          // 双击带出固定运营商
          confirmFixOper (row) {
            this.choiceRoute.Fixed_Operator_Name = row.Operator_Name
            this.choiceRoute.Fixed_Operator_Id = row.Operator_Id
          },
          // 清除固定运营商
          deleteFixOper () {
            this.$nextTick(() => {
              this.choiceRoute.Fixed_Operator_Name = ''
              this.choiceRoute.Fixed_Operator_Id = ''
            })
          },
          // 弹出固定承运商选择框
          openFixCarr (row) {
            this.showFixCarr = true
          },
          // 双击带出固定承运商
          confirmFixCarr (row) {
            this.choiceRoute.Fixed_Carrier_Name = row.Carrier_Name
            this.choiceRoute.Fixed_Carrier_Id = row.Carrier_Id
          },
          // 清除固定承运商
          deleteFixCarr () {
            this.$nextTick(() => {
              this.choiceRoute.Fixed_Carrier_Name = ''
              this.choiceRoute.Fixed_Carrier_Id = ''
            })
          },
          // 确认订单信息变更
          comfirmOrderInfoChange () {
            if (!this.orderInfo.Address_Id) {
              this.$alert('地址没有修改，无需变更, 是否放弃变更')
              return false
            }
            let params = {
              Bill_Dtl_Id: this.orderInfo.Bill_Dtl_Id,
              Address_Id: this.orderInfo.Address_Id
            }
            Api.post('TMP_TransportTaskDD_ChangeAddr', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('订单变更成功')
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 停止明细
          stopDtl () {
            if (!this.orderParams || !this.orderParams.Bill_Dtl_Ids) {
              this.$alert('请先选择明细')
              return false
            }
            this.StopReason = ''
            this.showStopReson = true
          },
          confirmStop () {
            if (!this.StopReason) {
              this.$alert('请输入停止明细原因')
              return false
            }
            if (this.StopReason.length > 200) {
              this.$alert('停止明细原因不能超过200个字符')
              return false
            }
            let params = {
              Bill_Dtl_Ids: this.orderParams.Bill_Dtl_Ids,
              Operator: Api.userInfo.userId,
              StopReason: this.StopReason
            }
            Api.post('TMP_TransportTaskDD_StopDtls', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('停止明细成功')
                  this.showStopReson = false
                  this.getFirstOrder()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 历史路线
          checkHisRoute () {
            this.showHistoryRoute = true
          },
          // 确认添加历史路线
          addHistoryRoute (historys) {
            this.routeData = historys.concat(this.routeData)
            console.error(this.routeData)
          },
          // 添加路线
          addRoute () {
            Api.post('TMP_TransportTaskDD_AddNewRoute', {Operator_Id: Api.userInfo.Operator_Id})
              .then((resp) => {
                if (resp.Flag) {
                  let newRoutes = JSON.parse(resp.MsgInfo)
                  if (newRoutes.length > 0) {
                    newRoutes[0].Route_Dtls = []
                    this.routeData.unshift(newRoutes[0])
                  }
                  this.$alert('路线添加成功')
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 删除路线
          delRoute () {
            if (this.choiceId === -1) {
              this.$alert('请先选择路线')
              return false
            }
            Api.post('TMP_TransportTaskDD_DelRoute', {TransportRoute_Id: this.choiceId})
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('路线删除成功')
                    .then(() => {
                      this.initRoute()
                      this.choiceId = -1
                    })
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 删单
          delDtl (row) {
            if (!row.children || !row.selection || row.selection.length === 0) {
              this.$alert('请先选择明细再删单')
              return false
            }
            let HdrIds = row.selection.map((item) => item.Bill_Hdr_Id).join(',')
            let DtlIds = row.selection.map((item) => item.Bill_Dtl_Id).join(',')
            let params = {
              TransportRoute_Id: row.TransportRoute_Id,
              Bill_Hdr_Ids: HdrIds,
              Bill_Dtl_Ids: DtlIds
            }
            Api.post('TMP_TransportTaskDD_DelBills', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('删单成功')
                  this.initRoute()
                  this.getFirstOrder()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 添加地址
          addAdress (row, index) {
            this.showRouteAddressModal = true
          },
          // 确认添加地址
          confirmAddress (row) {
            let currentRow = this.choiceRoute
            let judge = currentRow.Route_Dtls.some((item) => {
              return item.Address_Id === row.Address_Id
            })
            if (judge) {
              this.$alert('该地址已存在，不能重复添加')
              return false
            }
            let lastIndex = currentRow.Route_Dtls.length - 1
            let lastRoute = currentRow.Route_Dtls[lastIndex]
//            如果最后一个地址是目的地，新地址添加到数组的倒数第二位置，否则添加到最后
            if (lastRoute && lastRoute.Address === '目的地' && lastRoute.Address_Id === '0') {
              currentRow.Route_Dtls.splice(lastIndex, 0, row)
            } else {
              currentRow.Route_Dtls.push(row)
            }
            // 重新结算地址对象的Order_Id
            currentRow.Route_Dtls = currentRow.Route_Dtls.map((item, index) => {
              item.Order_Id = index + 1
              return item
            })
          },
          // 添加出发地
          addStartAddress (row) {
//            if (row.Route_Dtls.length === 0) {
//              this.$alert('至少有一个地址才能添加目的地')
//              return false
//            }
      //            虚拟目的地对象
            let startAddress = {
              Address: '出发地',
              Address_Id: '1',
              Address_Shortname: '出发地'
            }
            let judge = row.Route_Dtls.some((item) => {
              return item.Address_Id === startAddress.Address_Id
            })
            if (judge) {
              this.$alert('不能重复添加出发地')
              return false
            }
            row.Route_Dtls.unshift(startAddress)
            // 重新结算地址对象的Order_Id
            row.Route_Dtls = row.Route_Dtls.map((item, index) => {
              item.Order_Id = index + 1
              return item
            })
          },
          // 添加目的地
          addDestination (row) {
            if (row.Route_Dtls.length === 0) {
              this.$alert('至少有一个地址才能添加目的地')
              return false
            }
//            虚拟目的地对象
            let destination = {
              Address: '目的地',
              Address_Id: '0',
              Address_Shortname: '目的地'
            }
            let judge = row.Route_Dtls.some((item) => {
              return item.Address_Id === destination.Address_Id
            })
            if (judge) {
              this.$alert('不能重复添加目的地')
              return false
            }
            row.Route_Dtls.push(destination)
            // 重新结算地址对象的Order_Id
            row.Route_Dtls = row.Route_Dtls.map((item, index) => {
              item.Order_Id = index + 1
              return item
            })
          },
          // 删除地址
          delAddress (arr, index) {
            arr.splice(index, 1)
          },
          // 保存
          saveRoute (row) {
            this.choiceThis(row)
            // 固定路线的额外校验
            if (row.TransportRoute_Type === 'GD') {
              if (!row.Fixed_Operator_Id && !row.Fixed_Carrier_Id) {
                this.$alert('固定路线需要选择固定运营商或固定承运商')
                return false
              }
              if (!row.Frequency) {
                this.$alert('固定路线需要填写路线频次')
                return false
              }
            }
            if (!row.Route_Dtls || row.Route_Dtls.length === 0) {
              this.$alert('请先添加地址或者添加过目的地')
              return false
            }
            if (row.Route_Dtls && row.Route_Dtls.length === 1) {
              this.$alert('只添加了一个地址，请继续添加地址或者添加过目的地')
              return false
            }
            if (!row.Fixed_Departure_Time) {
              this.$alert('请填写启运时间')
              return false
            }
            let todayStr = DateFtt('yyyy-MM-dd', new Date())
            let routeTimeStr = DateFtt('yyyy-MM-dd', row.Fixed_Departure_Time)
            if (routeTimeStr < todayStr) {
              this.$alert('启运时间只能选择今天或以后')
              return false
            }
            let hasShixiao = row.Route_Dtls.slice(0, row.Route_Dtls.length - 1).every((item) => item.Time_Limit)
            if (!hasShixiao) {
              this.$alert('请填写时效')
              return false
            }
            let params = {
              RouteHdr: JSON.stringify({
                TransportRoute_Id: row.TransportRoute_Id,
                TransportRoute_Type: row.TransportRoute_Type,
                Frequency: row.Frequency,
                Unit: row.Unit,
                Fixed_Departure_Time: DateFtt('yyyy-MM-dd hh:mm:ss', row.Fixed_Departure_Time),
                Fixed_Operator_Id: row.Fixed_Operator_Id,
                Fixed_Carrier_Id: row.Fixed_Carrier_Id,
                Transport_Mode: row.Transport_Mode,
                Remarks: row.Remarks
              }),
              RouteDtls: JSON.stringify(this.RouteDtls)
            }
            Api.post('TMP_TransportTaskDD_SaveRoute', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('保存路线成功')
                  this.initRoute()
                  this.getCityCondition()
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 确定前校验
          beforeSubmitRoute (row) {
            console.error(row)
            this.choiceThis(row)
            // 固定路线的额外校验
            if (row.TransportRoute_Type === 'GD') {
              if (!row.Fixed_Operator_Id && !row.Fixed_Carrier_Id) {
                this.$alert('固定路线需要选择固定运营商或固定承运商')
                return false
              }
              if (!row.Frequency) {
                this.$alert('固定路线需要填写路线频次')
                return false
              }
            }
            if (!row.Route_Dtls || row.Route_Dtls.length === 0) {
              this.$alert('请先添加地址或者添加过目的地')
              return false
            }
            if (row.Route_Dtls && row.Route_Dtls.length === 1) {
              this.$alert('只添加了一个地址，请继续添加地址或者添加过目的地')
              return false
            }
            if (!row.Fixed_Departure_Time) {
              this.$alert('请填写启运时间')
              return false
            }
            let todayStr = DateFtt('yyyy-MM-dd', new Date())
            let routeTimeStr = DateFtt('yyyy-MM-dd', row.Fixed_Departure_Time)
            if (routeTimeStr < todayStr) {
              this.$alert('启运时间只能选择今天或以后')
              return false
            }
            let hasShixiao = row.Route_Dtls.slice(0, row.Route_Dtls.length - 1).every((item) => item.Time_Limit)
            if (!hasShixiao) {
              this.$alert('请填写时效')
              return false
            }
            console.log(row.Ssa_Count)
            if (!row.Ssa_Count || row.Ssa_Count <= 0) {
              this.$alert('请先对路线加单')
              return false
            }
            if (!row.children || row.children.length === 0) {
              this.$alert('请先选择路线下单据的路线起点和路线终点')
              return false
            }
            let isSetAddress = row.children.every(item => item.start_Address_Id && item.end_Address_Id)
            if (!isSetAddress) {
              this.$alert('请先选择路线下单据的路线起点和路线终点')
              return false
            }
            let agingMeta = row.children.every(item => {
              let addresses = row.Route_Dtls
              let startIndex = getIndexOfCollection('Address_Id', item.start_Address_Id, addresses)
              let endIndex = getIndexOfCollection('Address_Id', item.end_Address_Id, addresses)
              let totalAging = addresses.slice(startIndex, endIndex).map(item => item.Time_Limit).reduce((item1, item2) => {
                return (item1 - 0) + (item2 - 0)
              })
              console.log(totalAging)
              return totalAging <= item.Time_Limit
            })
            if (!agingMeta) {
              this.$confirm('输入的时效总大于计划明细的时效，是否继续操作')
                .then(() => {
                  this.submitRoute(row)
                })
              return false
            }
            let firstItem = row.children[0]
            let sameWenceng = row.children.every(item => item.Refrigeration_Type === firstItem.Refrigeration_Type)
            if (!sameWenceng) {
              this.$confirm('所选路线下的单据温层不一致，是否继续操作')
                .then(() => {
                  this.submitRoute(row)
                })
              return false
            }
            this.submitRoute(row)
          },
          // 确定
          submitRoute (row) {
            let params = {
              BillInfo: JSON.stringify(this.BillInfo),
              RouteInfo: JSON.stringify({
                Route_Hdr: JSON.stringify({
                  TransportRoute_Id: row.TransportRoute_Id,
                  Operator_Id: Api.userInfo.Operator_Id,
                  TransportRoute_Type: row.TransportRoute_Type,
                  Frequency: row.Frequency,
                  Unit: row.Unit,
                  Fixed_Departure_Time: DateFtt('yyyy-MM-dd hh:mm:ss', row.Fixed_Departure_Time),
                  Fixed_Operator_Id: row.Fixed_Operator_Id,
                  Fixed_Carrier_Id: row.Fixed_Carrier_Id,
                  Transport_Mode: row.Transport_Mode,
                  Remarks: row.Remarks
                }),
                Route_Dtls: JSON.stringify(this.RouteDtls)
              }),
              Flag: !(row.TransportRoute_Type === 'GD')
            }
            Api.post('TMP_TransportTaskDD_ConfirmTask', params)
              .then((resp) => {
                if (resp.Flag) {
                  this.$alert('确定路线成功')
                  this.initRoute()
                  this.getFirstOrder()
                  this.getCityCondition()
                  this.getSeCondition()
                  Bus.$emit(Types.refreshConsi)
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 查询字典表字段
          loadField () {
            Api.get('TMP_Fd_Field_Dtl', {Field_Name: 'TransportRoute_Type'})
              .then((resp) => {
                if (resp.Flag) {
                  this.routeType = resp.MsgInfo
                } else {
                  this.messageInfo(resp.ErrInfo)
                }
              })
          },
          // 单据起点终点地址选择框联动
          changeAddress (dtlRow, routeRow) {
            let startIndex = getIndexOfCollection('Address_Id', dtlRow.start_Address_Id, routeRow.Route_Dtls)
//            this.$set(dtlRow, 'end_Route_Dtls', routeRow.Route_Dtls.slice(startIndex + 1))
            if (startIndex === routeRow.Route_Dtls.length - 1 && startIndex !== -1) {
              this.$alert('最后一个地址不能作为起点地址')
              dtlRow.start_Address_Id = ''
              return false
            } else if (startIndex === routeRow.Route_Dtls.length - 2) {
              dtlRow.end_Address_Id = routeRow.Route_Dtls[routeRow.Route_Dtls.length - 1].Address_Id
              console.log(dtlRow.end_Address_Id)
            } else {
              dtlRow.end_Address_Id = ''
            }
          },
          getEndRoutes (dtlRow, routeRow) {
            let startIndex = getIndexOfCollection('Address_Id', dtlRow.start_Address_Id, routeRow.Route_Dtls)
            return routeRow.Route_Dtls.slice(startIndex + 1)
          },
          // 2018-01-13 胡香利 增加
          showNotPointCompanyDialog () {
            this.showNotPointCompany = true
            this.notPointCompany.keywords = ''
          },
          getNotPointCompany () {
            let params = {
              keyWords: this.notPointCompany.keywords,
              Operator_Id: Api.userInfo.Operator_Id,
              beginIndex: (this.notPointCompany.currentPage - 1) * this.notPointCompany.pageSize,
              endIndex: this.notPointCompany.currentPage * this.notPointCompany.pageSize
            }
            // this.loadingWait = this.showLoading('请稍候...')
            Api.get('TMP_TransportTaskScheding_Yd_Warnning', params, true).then((res) => {
              if (res.Flag) {
                this.notPointCompany.datas = res.MsgInfo
                this.notPointCompany.datas.forEach((item) => {
                  Vue.set(item, 'dialogOperate', '描点')
                })
                if (this.notPointCompany.datas.length === 0) {
                  this.notPointCompany.bigTotalItems = 0
                } else {
                  this.notPointCompany.bigTotalItems = this.notPointCompany.datas[0].TOTAL
                }
              } else {
                this.$alert(res.ErrInfo, '提示', {
                  confirmButtonText: '确定'
                })
              }
              // this.loadingWait.close()
            })
          },
          notPointCompanyPageChange (num) {
            this.notPointCompany.currentPage = num
            this.getNotPointCompany()
          },
          searchNotPointCompany (keyword) {
            this.notPointCompany.keywords = keyword
            this.getNotPointCompany()
          },
          refreshTransAction () {
            this.getFirstOrder() // 获取一级数据
            this.getSeCondition() // 获取起点终点数据（运单tab）
            this.getNotPointCompany() // 获取未描点的单位信息
          },
          auditDistributeCar () { // 审核配送排车
            if (!this.orderParams || !this.orderParams.Bill_Dtl_Ids) {
              this.$alert('请先选择明细')
              return false
            }
            let params = {
              Bill_Hdr_Ids: this.orderParams.Bill_Hdr_Ids,
              Bill_Dtl_Ids: this.orderParams.Bill_Dtl_Ids,
              Auditor: Api.userInfo.Staff_Id
            }
            // console.log(JSON.stringify(params))
            this.$confirm('是否确定审核配送排车?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              Api.post('TMP_TransportTaskDD_AuditDistribute', params).then((res) => {
                if (res.Flag) {
                  this.$alert('审核配送排车成功')
                  this.getFirstOrder()
                } else {
                  this.$alert(res.ErrInfo)
                }
              })
            }).catch(() => {
              // 取消
            })
          },
          companyPoint (row) {
            let params = {
              Address_Id: row.Address_Id,
              Address: row.Address
            }
            // this.showNotPointCompany = false
            // this.init()
            Api.post('TMP_TransportTaskDD_OneKeyMark', params).then((res) => {
              this.showNotPointCompany = false
              if (res.Flag) {
                this.init()
              } else {
                this.$alert(res.ErrInfo, '提示', {
                  confirmButtonText: '确定'
                })
              }
            })
          }, // end
          init () {
            this.getFirstOrder() // 获取一级数据
            this.getSeCondition() // 获取起点终点数据（运单tab）
            this.getCityCondition() // 获取城市筛选数据（路线tab）
            this.getAging() // 获取时效
            this.initRoute() // 初始化加载路线信息
            this.loadField() // 获取字典表字段
            this.getNotPointCompany() // 获取未描点的单位信息
          }
        },
        created () {
        },
        mounted () {
          this.init()
          Bus.$on(Types.refreshTransport, this.init)
        }
    }
</script>
<style lang="less">
  .transAction {
    .el-button--text.warning {
      color: red;
      &:hover {
        color: red;
        opacity: 0.6;
      }
    }
    .toolbar {
      position: fixed;
      top: 67px;
      left: 15px;
      right: 15px;
      z-index: 10;
    }
    .order, .route {
      padding-top: 100px;
    }
    .order {
      .el-form--inline {
        .el-form-item:nth-last-of-type(1) {
          display: flex;
          .el-form-item__label {
            width: 48px;
            min-width: 48px;
          }
          .el-checkbox {
            margin: 0 15px 0 0;
            & + .el-checkbox {
              margin: 0 15px 0 0;
            }
          }
        }
      }
    }
    /*.order .condition {*/
      /*position: fixed;*/
      /*top: 100px;*/
      /*left: 15px;*/
      /*right: 15px;*/
      /*background-color: #fff;*/
      /*z-index: 10;*/
    /*}*/
    .el-button--text {
      color: #666;
    }
    .el-button--text:hover {
      color: #20a0ff;
    }
    .routeInfo {
      display: inline-block;
      *display: inline-block;
      zoom: 1;
      padding: 15px 50px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      color: red;
    }
    padding-bottom: 50px;
    .right-fixed {
      position: absolute;
      top: 0px;
      right: 0px;
      .el-radio-button__inner {
        height: 24px;
        /*line-height: 24px;*/
        padding: 5px 15px;
      }
    }
    .condition-box {
      margin-top: 15px;
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
                -webkit-border-radius: 0px;
                -moz-border-radius: 0px;
                border-radius: 0px;
              }
            }
          }
          .search-btn {
            width: 70px;
            .el-button {
              width: 100%;
              -webkit-border-radius: 0px;
              -moz-border-radius: 0px;
              border-radius: 0px;
            }
          }
        }
      }
      .common-condition-box {
        margin-top: 15px;
        position: relative;
        .strechControl {
          position: absolute;
          right: 10px;
          top: 10px;
          line-height: 36px;
          color: #666;
          padding-right: 24px;
          .el-icon-mo-down-arrow, .el-icon-mo-up-arrow {
            font-size: 24px;
            position: absolute;
            top: 50%;
            margin-top: -11px;
            right: 0;
          }
          &:hover {
            color: #999;
          }
        }
      }
    }
    .filter-condition {
      padding-top: 15px;
      label.title {
        font-size: 12px;
        font-weight: 700;
      }
      .start {
        color: rgb(255, 73, 73);
        .el-icon-mo-addressAdd:before {
          color: rgb(255, 73, 73);
        }
        .el-tag {
          margin: 0px 2px;
        }
      }
      .end {
        color: rgb(19, 206, 102);
        .el-icon-mo-addressAdd:before {
          color: rgb(19, 206, 102);
        }
        .el-tag {
          margin: 0px 2px;
        }
      }
    }
    .table-box {
      margin-top: 20px;
      .child-card {
        .el-table {
          border: none;
        }
      }
    }
    .route {
      .ch-box {
        display: inline-block;
        *display: inline-block;
        zoom: 1;
      }
      .tx-box {
        padding: 0px 10px;
        display: inline-block;
        *display: inline-block;
        zoom: 1;
      }
      .btn-box {
        float: right;
      }
      .revolution {
        padding-left: 5px;
        .el-select {
          width: 100px;
        }
      }
    }
    .bg-col-1 {
      background-color: #c9e5f5;
    }
    .bg-col-2 {
      background-color: #e2f0e4;
    }
    a.success-col {
      color: #1abb9c;
    }
    // 订单变更弹框
    .order-change-dialog {
      .group {
        position: relative;
        padding: 10px;
        &.dass-line:after {
          content: '';
          width: 100%;
          height: 0px;
          position: absolute;
          left: 0px;
          bottom: 0px;
          border-top: 1px dashed #ccc;
        }
        .common-row .common-col label.label {
          width: 100px;
        }
      }
    }
    .stopreson-dialog {
      .common-row .common-col ul.content {
        margin: 0px;
      }
    }
    // 路线地址列表
    .address-wrapper {
    }
    .address-list {
      text-align: center;
      padding: 30px 80px;
      .address-item {
        display: inline-block;
        *display: inline-block;
        zoom: 1;
        /*text-align: left;*/
        position: relative;
        .title {
          position: absolute;
          top: -30px;
          left: 78px;
        }
        .circle {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          position: relative;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          display: inline-block;
          *display: inline-block;
          zoom: 1;
          .inner-circle {
            width: 10px;
            height: 10px;
            border-radius: 5px;
            position: absolute;
            top: 5px;
            left: 5px;
            background-color: #fff;
            display: inline-block;
            *display: inline-block;
            zoom: 1;
          }
        }
        .circle:after {
          content: '';
          width: 175px;
          height: 5px;
          background-color: #ccc;
          position: absolute;
          top: 7.5px;
          left: 20px;
        }
        .circle.last:after {
          width: 0px;
          height: 0px;
          visibility: hidden;
        }
        ul {
          padding-top: 10px;
          padding-right: 20px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          position: relative;
          li:not(:last-child) {
            height: 24px;
            padding: 5px 0px;
            width: 175px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .shixiao {
          width: 175px;
          position: absolute;
          left: 95px;
          top: -25px;
          text-align: center;
          z-index: 9;
          .el-input {
            width: 70px;
          }
          /*.el-input-number {*/
            /*width: 90px;*/
            /*.el-input-number__decrease, .el-input-number__increase {*/
              /*width: 25px;*/
            /*}*/
            /*.el-input-number__decrease {*/
              /*right: 26px;*/
            /*}*/
            /*.el-input {*/
              /*input {*/
                /*padding-right: 52px;*/
              /*}*/
            /*}*/
          /*}*/
        }
        .shixiao.text {
          top: -10px;
        }
        &.dragging .shixiao {
          display: none;
        }
        &.dragging .circle:after {
          visibility: hidden;
        }
      }
      .greCol {
        background-color: #1ABC9C;
      }
      .yeCol {
        background-color: #ECA700;
      }
      .reCol {
        background-color: #FF5959;
      }
    }
  }
</style>
