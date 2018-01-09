<template>
    <div>
        <div class="headbar">
          <div class="common-row">
            <label>当前位置：</label>
            <div class="common-col">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item @click.native="goBack(-1)">费用汇总</el-breadcrumb-item>
                <el-breadcrumb-item>服务项目</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
        </div>
        <div class="common-condition-box">
          <el-form :inline="true">
            <el-form-item label="服务项目">
              <!-- <common-select field="Service_Type" v-model="filterCondition.Service_Type"></common-select> -->
              <common-select :ServiceType="Service_Type" field="Service_Item" v-model="serviceType" @change="onChange"></common-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-box">
          <el-table :data="origData">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="Service_Item_Desc" label="服务项目" ></el-table-column>
            <el-table-column prop="Con_Name" label="对账单位" ></el-table-column>
            <el-table-column prop="Charging_Rule_Desc" label="计费规则" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column prop="Total_Amount" label="应收金额(元)" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column prop="Mon" label="日期" ></el-table-column>
            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button
                  class="primary"
                  type="text"
                  size="small"
                  @click="goDetail(scope.$index, scope.row)">查看明细</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          v-show="pages.isShow"
          layout="total, prev, pager, next, jumper"
          :page-size="pages.pageSize"
          :total="pages.total"
          :current-page="pages.currentPage"
          @current-change="onPage"
        >
        </el-pagination>
    </div>
</template>

<script>
    import Api from '@/common/js/api'
    import commonSelect from '@/common/service/select/select-service-item'
    export default {
        // 订单详情
        name: 'feeOrderList',
        props: [],
        components: {commonSelect},
        data () {
            return {
                pages: {
                  currentPage: 1, // 当前页
                  pageSize: 10, // 每页条数
                  total: 0, // 总条数
                  isShow: false // 是否显示分页组件
                },
                Operator_Id: '', // 运营方id
                SettleUp_Company_Id: '', // 结算单位id
                Con_Name: '', // 结算单位名称
                Service_Type: '', // 费用类型
                Mon: '', // 月份
                Begin_Date: '', // 开始时间
                End_Date: '', // 结束时间
                serviceType: '', // 费用项目
                origData: []
            }
        },
        methods: {
            goBack (num) {
                this.$router.go(num)
            },
            onPage () {
                this.getItemData()
            },
            // 筛选查询
            onChange () {
                this.getItemData()
            },
            // 获取二级页面数据
            getItemData () {
                let params = {
                    Operator_Id: this.Operator_Id,
                    Con_Name: this.Con_Name,
                    SettleUp_Company_Id: this.SettleUp_Company_Id,
                    Service_Type: this.Service_Type,
                    Service_Item: !this.serviceType ? '%' : this.serviceType,
                    Mon: this.Mon,
                    Begin_Date: this.Begin_Date,
                    End_Date: this.End_Date,
                    StartIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
                    PageSize: this.pages.pageSize
                }
                console.log(params, 'hahahahahhahahahahahahaahahhahahaa')
                this.Service_Type = params.Service_Type
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('JlpWTFGetBalanceMx', params)
                    .then((res) => {
                        this.loadingWait.close()
                        if (!res.Flag) {
                            this.messageInfo(this.ErrInfo)
                            return false
                        }
                        if (res.MsgInfo.length > 0) {
                            this.pages.total = res.MsgInfo[0].Sum_Cnt
                        }
                        // 如果总条数不止一页，显示分页组件
                        if (this.pages.total > this.pages.pageSize) {
                            this.pages.isShow = true
                        }
                        this.origData = res.MsgInfo.map((item) => {
                            item.Con_Name = this.Con_Name
                            return item
                        })
                        //this.stor_origData = this.origData
              })
          },
          goDetail (index, row) { // 向三级页面传递参数
            this.$router.push({
                name: 'feeOrderDetail',
                params: {
                    Operator_Id: row.Operator_Id,
                    SettleUp_Company_Id: row.SettleUp_Company_Id,
                    Service_Type: this.Service_Type,
                    Mon: this.Mon,
                    Service_Item: row.Service_Item,
                    Begin_Date: this.Begin_Date,
                    End_Date: this.End_Date
                }
            })
          },
          init () {
            let params = this.$route.params
            console.log(params, 'xjhoiwidhoicedfveriofjeroifvewrfgvwer')
            this.Con_Name = params.Con_Name
            this.Operator_Id = params.Operator_Id
            this.SettleUp_Company_Id = params.SettleUp_Company_Id
            this.Service_Type = params.Service_Type
            this.Mon = params.Mon
            this.Begin_Date = params.Begin_Date
            this.End_Date = params.End_Date
            this.getItemData()
          }
        },
        created () {
        },
        mounted () {
        },
        activated () { //<keep-alive> 内切换时会被执行created内不行
          this.init()
        }
    }
</script>
<style lang="less" scoped>
    
</style>

