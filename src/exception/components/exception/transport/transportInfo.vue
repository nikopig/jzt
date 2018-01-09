<template>
  <div class="box-client-info">
    <div class="box-card-contain">
      <el-form :inline="true" class="demo-form-inline" label-position="top" label-width="80px" :model="formLabelAlign">
        <div class="info-head">
          <el-form-item label="行号">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="客户编号">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="时效">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="预计到达时间">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-button class='ft-rt del' @click='delInfo'>删 除</el-button>
        </div>
        <el-form-item label="送货地址ID">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="客户地址">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-form-item label="委托方单号">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="商品批号">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="计划件数">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="计划体积">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="计划重量">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="是否运费托收">
          <el-select placeholder="请选择" v-model="formLabelAlign.type" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="托收金额">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="是否现场打印">
          <el-select placeholder="请选择" v-model="formLabelAlign.type" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否回单">
          <el-select placeholder="请选择" v-model="formLabelAlign.type" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价值">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['objData', 'isEdit'],
  	data () {
  		return {
	        disabled: true,
          radio: '1',
	        formLabelAlign: {
	          name: '',
	          region: '',
	          type: ''
	        },
  			gridData: [{
              date: '1',
              name: '王小虎',
              address: '上海市'
            }, {
              date: '2',
              name: '622222217774845',
              address: '上海市'
            }]
  		}
  	},
    methods: {
      delInfo (dtlIndex) {
        this.$emit('delete', 'dtlIndex')
      }
    }
  }
</script>

<style lang="less" scoped>
	.box-client-info {
		margin-top: 0;
		padding: 20px;
		border-top: 1px solid #e5e5e5;
    .info-head {
      height: 80px;
      // background-color: red;
      .del {
        margin-top: 20px;
      }
    }
	}
	.orderDetail .orderDetailList .box-card-contain {
		padding-bottom: 0;
	}
</style>
