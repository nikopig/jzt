<template>
    <div class="orderDetail">
        <div class="search-contain checkPresent">
            <el-form :inline="true" size="small">
                <el-form-item label="委托方：" label-width="85px">
                    <el-input v-model="filterCondition.Con_Name" placeholder="双击选择"
                              icon="close" 
                              :on-icon-click="deleteCon"
                              @dblclick.native="openDialog('Con_Id')"
                              :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="装车单号：" label-width="85px">
                    <el-input placeholder="请输入装车单号" v-model="filterCondition.zcdh"></el-input>
                </el-form-item>
                <el-form-item label="单位：" label-width="85px">
                    <el-input :disabled="true" v-model="filterCondition.Ssa_Name" placeholder="双击选择单位" @dblclick.native="openDialog('Ssa')"></el-input>
                </el-form-item>
                <el-form-item label="单据号：" label-width="85px">
                    <el-input placeholder="请输入单据号" v-model="filterCondition.billNo"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchData" size="small" icon="search">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="state">
                <el-tag type="primary">整单冲红</el-tag>
                <el-tag type="warning">已打印</el-tag>
                <el-tag class="not-print">未打印</el-tag>
            </div>
        </div><!-- search-contain end -->
        <div class="orderDetailList">
            <el-card class="box-card" :class="{checkedCard: o.isChecked}" v-for="(o, index) in listData" :key="index" ><!-- v-if="filterFlag(o)" -->
                <div slot="header" class="clearfix">
                    <div class="ft-lt checkBox">
                        <el-checkbox v-model="o.isChecked" @change='loadDtlInfo(index)'></el-checkbox>
                    </div>
                    <div class="ft-lt Con">
                        <span>运营商：</span>
                        <span>{{ o.Operator_Name }}</span>
                    </div>
                    <div class="ft-lt Con">
                        <span>委托方：</span>
                        <span>{{ o.Con_Name }}</span>
                    </div>
                </div>
                <div class="box-card-contain">
                    <div class="box-card-content-item">
                        <span>方向路线：</span>
                        <span class="textOverflow" :title='o.Route_Name'>{{ o.Route_Name }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>装车单号：</span>
                        <span class="textOverflow" :title='o.DeliveryLoading_No'>{{ o.DeliveryLoading_No }}</span>
                    </div>
                    <!--装车顺序--> 

                    <div class="box-card-content-item">
                        <span>业务单据号：</span>
                        <span class="textOverflow" :title='o.Biz_Bill_No'>{{ o.Biz_Bill_No }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>商品类型：</span>
                        <span class="textOverflow" :title='o.Goods_Type_Desc'>{{ o.Goods_Type_Desc }}</span>
                    </div>
                    <!--运输任务类型 提货方式-->

                    <div class="box-card-content-item">
                        <span>单位：</span>
                        <span class="textOverflow" :title='o.Ssa_Name'>{{ o.Ssa_Name }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>物流中心：</span>
                        <span class="textOverflow" :title='o.Ldc_Name'>{{ o.Ldc_Name }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>接货时间：</span>
                        <span class="textOverflow" :title='o.Takegds_Time'>{{ o.Takegds_Time }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>生成时间：</span>
                        <span class="textOverflow" :title='o.Create_Time'>{{ o.Create_Time }}</span>
                    </div>
                    <!--开票员 单据状态 lmis作业状态 送货日期-->

                    <div class="box-card-content-item">
                        <span>时效：</span>
                        <span>{{ o.Time_Limit }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>运输级别：</span>
                        <span>{{ o.Transport_Level }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>运输方式：</span>
                        <span>{{ o.Transport_Mode }}</span>
                    </div>  
                    <!--起始月台 终止月台 内复核完成时间 外复核完成时间 送货地-->

                    <!-- 箭头部分 -->
                    <div :class="{'arrow-down': current != index, 'arrow-up': current == index}" @click="toggleDtl(index)">
                        <i :class="{'el-icon-mo-down2': current != index, 'el-icon-mo-up2': current == index}"></i>
                    </div>
                </div>
                <!-- 折叠明细部分 -->
                <transition name="fade">
                    <div class="dtl" v-show="current === index">
                        <order-info :objData='o' v-for="(d, dIndex) in o.ordersDtl" :key="dIndex" :dtlData='d' :dtlIndex="dIndex" :index="index"></order-info>
                    </div>
                </transition>
            </el-card>
        </div><!-- orderDetailList end -->
        <div class="order-footer">
            <div class='left'>
                <el-checkbox class='checkBox' v-model="selectAll"></el-checkbox>
                <label>全选</label>
            </div>
            <div class="btns-content">
                <el-button type="info" @click="printDelivery">打印</el-button>
            </div>
        </div>
        <consiNew-modal :visible.sync="dialogShow.Con_Id" :Operator_Id="filterCondition.Operator_Id" @change="selectCon"></consiNew-modal>
        <common-modal DialogTitle="单位" :isVisible.sync="dialogShow.Ssa" :TableHeader="Ssa.TableHeader" :listData="Ssa.copyDatas" @confirm="selectSsa" @search="searchSsa" :isPages="false"></common-modal>
    </div>
</template>

<script>
    import orderInfo from './orderDetail'
    import commonRow from '@/common/components/common-row'
    import commonCol from '@/common/components/common-col'
    import consiNewModal from '@/common/service/modal/consiNew-modal'
    import commonModal from '@/common/components/common-modal'
    import Api from '@/common/js/api.js'
    export default {
        components: {
          orderInfo,
          commonRow,
          commonCol,
          consiNewModal,
          commonModal
        },
        props: [], // 由page/entryAudit.vue传过来
        data () {
            return {
                filterCondition: {
                    Con_Name: '',
                    zcdh: '',
                    Ssa_Name: '',
                    billNo: ''
                },
                dialogShow: {
                    Con_Id: false,
                    Ssa: false
                },
                current: -1,
                listData: [],
                transLevel: [],  //运输级别下拉框
                deliveryState: [],  //装车单状态下拉框
                routeName: [],
                Ssa: {
                    TableHeader: [
                        {
                            field: 'Ssa_No',
                            title: '单位编号'
                        },
                        {
                            field: 'Ssa_Name',
                            title: '单位名称'
                        },
                        {
                            field: 'Mnemonic_Code',
                            title: '助记码'
                        },
                        {
                            field: 'Address',
                            title: '单位地址'
                        },
                        {
                            field: 'Contact_Name',
                            title: '联系人'
                        },
                        {
                            field: 'Contact_Phone',
                            title: '联系电话'
                        }
                    ],
                    datas: [],
                    copyDatas: []
                }
            }
        },
        computed: {
            //全选
            selectAll: {
                get () {
                    if (this.listData.length <= 0) {
                        return false
                    } else {
                        return this.selectData.length === this.listData.length  //如果被选中的数据和所有的数据相等，那全选框就勾上，否则全选框不勾
                    }
                },
                set (value) { //value表示操作全选的状态true或false，如果勾选了那就都为true，如果取消全选就都取消
                    console.log(value, '全选的状态')
                    this.listData.forEach((item) => {
                        item.isChecked = value
                        if (value === true) {
                            //拿到每一个汇总的明细
                            Api.get('INF_ZCDMX_YP', {'hdrid': item.DeliveryLoading_Hdr_Id}).then((res) => {
                                item.ordersDtl = res.MsgInfo
                            })
                        }
                    })
                  console.log(this.listData, '全选的时候拿到所有明细数据')
                }
            },
            selectData () {
                return this.listData.filter((item) => item.isChecked)
            }
            //全选结束
        },
        methods: {
            openDialog (val) {
                this.dialogShow[val] = true
            },
            selectCon (row) {
                this.filterCondition.Con_Id = row.Con_Id || ''
                this.filterCondition.Con_Name = row.Con_Name || '%'
                this.init()
            },
            deleteCon () {
                this.filterCondition.Con_Id = '%'
                this.filterCondition.Con_Name = ''
            },
            getSsa () {
                // 要改！
                let params = {
                    Con_Id: this.editRowConId,
                    Ldc_Id: '%'
                }
                Api.get('GetLdcAddress', params).then((res) => {
                    if (res.Flag) {
                        this.Ssa.datas = res.MsgInfo
                        this.Ssa.copyDatas = this.Ssa.datas
                    } else {
                        this.$alert(res.ErrInfo, '提示', {
                            confirmButtonText: '确定'
                        })
                    }
                })
            },
            selectSsa (row) {
                this.listData[this.editRowIndex].Ldc_Name = row.Ldc_Name
                this.listData[this.editRowIndex].Ldc_Id = row.Ldc_Id
            },
            searchSsa (keyword) {
                let searchRegex = new RegExp(keyword, 'i')
                this.Ssa.copyDatas = this.Ssa.datas.filter((item) => {
                  for (let key in item) {
                    if (searchRegex.test(item[key])) {
                      return true
                    }
                  }
                })
            },
            getHZData () {  //请求汇总数据
                let params = {
                    startime: '2017-02-05T07:45:59.778Z',  //开始时间
                    endtime: '2018-02-05T07:45:59.778Z', //结束时间
                    Operator_Id: '301748054417813', //Api.userInfo.Operator_Id, //运营方
                    Ldc_Id: '199647602156719', //物流中心
                    Staff_Name: '%',
                    DeliveryLoading_No: '%', //装车单号
                    Transport_State: '%',  //装车单状态
                    Transport_Level: '%',  //运输级别
                    Route_Name: '%'   //方向路线
                }
                this.loadingWait = this.showLoading('请稍候...')
                Api.get('INF_ZCDINFO_YP_PRINT', params, true).then(res => {  //INF_ZCDINFO_YP_PRINT
                    this.loadingWait.close()
                  if (res.Flag) {
                    this.listData = res.MsgInfo.map(item => {  //通过map方法在请求到页面初始的时候给对象添加字段且赋值
                        item.isChecked = false
                        item.ordersDtl = []
                        return item
                    })
                    console.log(this.listData, '汇总数据')
                  } else {
                    this.$alert('数据请求失败，请重试！', '提示')
                  }
                })
            },
            searchData () {  //查询
                this.getHZData()
            },
            loadDtlInfo (index) {  //当复选框改变时，获取到明细数据
                console.log(this, '指向问题')
                let Id = this.listData[index].DeliveryLoading_Hdr_Id
                Api.get('INF_ZCDMX_YP', {'hdrid': Id}).then((res) => {
                    this.listData[index].ordersDtl = res.MsgInfo
                    console.log(this.listData[index].ordersDtl, '选中复选框得到明细')
                })
            },
            toggleDtl (index) {   // 展开明细
                let Id = this.listData[index].DeliveryLoading_Hdr_Id
                Api.get('INF_ZCDMX_YP', {'hdrid': Id}).then((res) => {
                    this.listData[index].ordersDtl = res.MsgInfo
                    console.log(this.listData[index].ordersDtl, '明细数据')
                    if (this.listData[index].ordersDtl.length === 0) {
                        this.current = index
                        this.$message('该汇总下没有明细记录')
                    }
                    if (this.current === index) {
                        this.current = -1
                    } else {
                        this.current = index
                    }
                })
                console.log(this.current)
            },
            printDelivery () {   //打印装车单
                let delivery = []
                this.listData.forEach((item) => {
                    if (item.isChecked) {
                        delivery.push(item)
                    }
                })
                if (delivery.length > 0) {
                    console.log(delivery, '选中的数据')
                } else {
                    this.$alert('请勾选后在执行', '友情提示')
                }
            },
            filterTransform (value) {  //转换是否激活
                switch (value) {
                    case 'Y':
                        value = '是'
                        break
                    case 'N':
                        value = '否'
                        break
                }
                return value
            },
            init () {
                this.getHZData()
            }
        },
        watch: {
        },
        mounted () {
            this.init()
            console.log(Api.userInfo, '权限信息')
        }
    }
</script>

<style lang='less'>
    /*html, body, #app{
        width: 100%;
        height: 100%;
        min-height: 100%;
        background-color: #f3f3f4;
    }*/
    .checkPresent:after{
        content:"";
        display:block;
        clear:both;
        zoom:1;
    }
    .checkPresent{
        form{
            float:left;
        }
        .state{
            float:right;
            margin-top: 6px;
            .el-tag{
                color:#666;
            }
            .not-print{
                background-color: transparent;
                border-color:#e5e5e5;
            }
        }
    }
    .fade-enter-active, .fade-leave-active{
      transition: all 0.2s ease     
    }
    .fade-enter, .fade-leave-active{
      opacity: 0 
    }
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
            padding: 0px 28px 74px;
            .el-card{
               // margin: 0 0 25px;
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
                    margin: 0 30px 0 20px;
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
                padding-bottom: 30px;
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
        .order-footer{
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
            .left{
                float: left;
                line-height: 36px;
            }
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
    }
</style>
