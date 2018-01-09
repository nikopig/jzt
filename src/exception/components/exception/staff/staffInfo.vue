<template>
  <div class="box-client-info">
    <div class="box-card-contain">
      <el-form :inline="true" class="demo-form-inline" label-position="top" label-width="80px" :model="formLabelAlign">
        <el-form-item label="职员编号">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="职员名称">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-form-item label="助记码">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-select placeholder="请选择" v-model="formLabelAlign.type" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.type"></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
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
  	}
  }
</script>

<style lang="less" scoped>
	.box-client-info {
		margin-top: 0;
		padding: 20px;
		border-top: 1px solid #e5e5e5;
	}
	.orderDetail .orderDetailList .box-card-contain {
		padding-bottom: 0;
	}
</style>

