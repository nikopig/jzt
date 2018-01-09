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
                    <el-form :inline="true" class="demo-form-inline" label-position="top" label-width="80px" :model="formLabelAlign">
				        <el-form-item label="开票员">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.name"></el-input>
				        </el-form-item>
				        <el-form-item label="委托方ID">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.region"></el-input>
				        </el-form-item>
				        <el-form-item label="委托方名称">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.type"></el-input>
				        </el-form-item>
				        <el-form-item label="产品大类">
				          <el-select placeholder="请选择" v-model="formLabelAlign.region" clearable>
				            <el-option label="是" value="1"></el-option>
				            <el-option label="否" value="2"></el-option>
				          </el-select>
				        </el-form-item>
				        <el-form-item label="提货方式">
				          	<template>
							  <el-radio v-model="radio1" label="1">上门提货</el-radio>
							  <el-radio v-model="radio1" label="2">送货上门</el-radio>
							</template>
				        </el-form-item>
				        <el-form-item label="送货方式">
				          	<template>
							  <el-radio v-model="radio2" label="1">自行配送</el-radio>
							  <el-radio v-model="radio2" label="2">九州通配送</el-radio>
							</template>
				        </el-form-item>
				        <el-form-item label="开票时间">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.type"></el-input>
				        </el-form-item>
				        <el-form-item label="接货地址ID">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.type"></el-input>
				        </el-form-item>
				        <el-form-item label="接货地址">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.type"></el-input>
				        </el-form-item>
				        <el-form-item label="运输类型">
				          	<template>
							  <el-radio v-model="radio2" label="1">普通运输</el-radio>
							  <el-radio v-model="radio2" label="2">包车运输</el-radio>
							</template>
				        </el-form-item>
				        <el-form-item label="接货时间">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.type"></el-input>
				        </el-form-item>
				        <el-form-item label="备注">
				          <el-input :disabled="disabled && o.isEdit" v-model="formLabelAlign.type"></el-input>
				        </el-form-item>
				        <el-form-item label="车辆要求">
				          <el-select placeholder="请选择" v-model="formLabelAlign.region" clearable>
				            <el-option label="是" value="1"></el-option>
				            <el-option label="否" value="2"></el-option>
				          </el-select>
				        </el-form-item>
				        <el-form-item label="车辆大小">
				          <el-select placeholder="请选择" v-model="formLabelAlign.region" clearable>
				            <el-option label="是" value="1"></el-option>
				            <el-option label="否" value="2"></el-option>
				          </el-select>
				        </el-form-item>
				        <el-form-item label="温层要求">
				          <el-select placeholder="请选择" v-model="formLabelAlign.region" clearable>
				            <el-option label="是" value="1"></el-option>
				            <el-option label="否" value="2"></el-option>
				          </el-select>
				        </el-form-item>
				    </el-form>
				    <div :class="{'arrow-down': current != index, 'arrow-up': current == index}" @click="toggleDtl(index)">
                        <i :class="{'el-icon-mo-down2': current != index, 'el-icon-mo-up2': current == index}"></i>
                    </div>
                </div>
                <!-- 折叠明细部分 -->
                <transition>
                    <div class="dtl" v-show="current == index">
                        <transport-info :objData="o" :isEdit="o.isEdit" @delete="delInfo"></transport-info>
                    </div>
                </transition>
            </el-card>
        </div>
    </div>
</template>

<script>
    import Api from '@/common/js/api.js'
    import transportInfo from './transportInfo.vue'
    export default {
        components: {
            transportInfo
        },
        data () {
            return {
                current: -1,
                disabled: true,
                radio1: '1',
                radio2: '1',
                listData: [
                	{
                		Con_Name: '九州通股份有限公司',
                		Ssa_Name: '张三',
                        isEdit: true
                	}
                ],
                formLabelAlign: {
		          name: '',
		          region: '',
		          type: ''
		        },
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
            delInfo (i) {
                console.log(i)
            },
            save (item) {
                item.isEdit = true
            }
        },
        activated () {
            console.log(6)
        }
    }
</script>

<style lang='less'>
	.el-select {
		box-sizing: border-box;
	}
</style>

