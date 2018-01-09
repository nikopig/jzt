<template>
    <div class="orderDetail">
        <div class="orderDetailList">
            <el-card class="box-card" :class="{checkedCard: o.isChecked}" v-for="(o, index) in listData" :key="index">
                <div slot="header" class="clearfix">
                    <div class="ft-lt checkBox">
                        <el-checkbox v-model="o.isChecked" @change='select(o)'></el-checkbox>
                    </div>
                    <div class="ft-rt">
                        <el-button type="text" @click="editInfo(o)"><i class="el-icon-mo-edit"></i>编辑</el-button>
                        <el-button type="text" @click="save(o)"><i class="el-icon-mo-preservation"></i>保存</el-button>
                        <el-button type="text" @click="del(index)"><i class="el-icon-mo-close"></i>删除</el-button>
                        <el-button type="text"><i class="el-icon-mo-box"></i>处理</el-button>
                    </div>
                </div>
                <div class="box-card-contain">
                    <div class="box-card-content-item">
                        <span>委托方：</span>
                        <span class="textOverflow" :title='o.Con_Name'>{{ o.Con_Name }}</span>
                    </div>
                    <div class="box-card-content-item">
                        <span>客户：</span>
                        <span class="textOverflow" :title='o.Ssa_Name'>{{ o.Ssa_Name }}</span>
                    </div>
                    <!-- 箭头部分 -->
                    <div :class="{'arrow-down': current != index, 'arrow-up': current == index}" @click="toggleDtl(index)">
                        <i :class="{'el-icon-mo-down2': current != index, 'el-icon-mo-up2': current == index}"></i>
                    </div>
                </div>
                <!-- 折叠明细部分 -->
                <transition>
                    <div class="dtl" v-show="current == index">
                        <client-info :objData="o" :isEdit="o.isEdit"></client-info>
                    </div>
                </transition>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import clientInfo from './clientInfo.vue'
    export default {
        components: {
            clientInfo
        },
        data () {
            return {
                current: -1,
                listData: [
                	{
                		Con_Name: '珠海丽珠试剂股份有限公司',
                		Ssa_Name: '恩施州中心血站',
                        isEdit: true
                	},
                    {
                        Con_Name: '湖北试剂股份有限公司',
                        Ssa_Name: '荆州中心血站',
                        isEdit: true
                    }
                ],
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
        	toggleDtl (index) {
        		if (this.current === index) {
                    this.current = -1
                } else {
                    this.current = index
                }
        	},
            select (item) {
                console.log(item)
            },
            editInfo (item) {          // 编辑
                item.isEdit = false
            },
            del (index) {           // 删除
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                  this.listData.splice(index, 1)   // 本地删除操作
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  })
                })
            },
            save (item) {
                item.isEdit = true
            }
        },
        created () {},
        activated () {
            console.log(1)
            // console.log(this.$route.params.id)
        }
    }
</script>

<style lang='less'>
    .orderDetail{
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

        .orderDetailList{
            padding: 25px 28px 74px;
            .el-card{
                margin: 0 0 25px;
                border: 1px solid #e5e5e5;
                /*border-radius: 0;
                box-shadow: none;*/
                overflow: visible;
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
                padding: 0;
            }

            .el-button, [class^="el-icon-mo-"], [class*=" el-icon-mo-"]{
                font-size: 12px;
                color: #666;
            }
            [class^="el-icon-mo-"], [class*=" el-icon-mo-"]{
                margin-right: 6px;
            }

            .box-card-contain{
                padding-top: 30px;  /* 汇总部分的起始文字位置 */
                padding-left: 30px; /* 汇总部分的起始文字位置 */
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
            .el-input__icon+.el-input__inner {  /* 下拉框三角部分保持input总长度一致不变 */
                padding-right: 10px;
            }
        }
    }
</style>