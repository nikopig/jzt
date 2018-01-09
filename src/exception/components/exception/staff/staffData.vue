<template>
    <div class="orderDetail">
        <div class="orderDetailList">
            <el-card class="box-card" :class="{checkedCard: o.isChecked}" v-for="(o, index) in listData" :key="index">
                <div slot="header" class="clearfix">
                    <div class="ft-lt checkBox">
                        <el-checkbox v-model="o.isChecked"></el-checkbox>
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
                        <span>职员：</span>
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
                        <staff-info :objData="o" :isEdit="o.isEdit"></staff-info>
                    </div>
                </transition>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import staffInfo from './staffInfo.vue'
    export default {
        components: {
            staffInfo
        },
        data () {
            return {
                current: -1,
                listData: [
                	{
                		Con_Name: '九州通股份有限公司',
                		Ssa_Name: '张三',
                        isEdit: true
                	}
                ],
                gridData: [{
                  date: '1',
                  name: '622222217774845',
                  address: '上海市'
                }, {
                  date: '2',
                  name: '622222217774845',
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
            editInfo (item) {       // 编辑
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
        activated () {
            console.log(3)
        }
    }
</script>

<style lang='less'>
</style>
