<template>
  <div class="box-client-info">
    <div class="box-card-contain">
        <el-form :inline="true" class="demo-form-inline" label-position="top" label-width="80px" :model="formLabelAlign">
          <el-form-item label="委托方">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="助记码">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="客户编码">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="客户简称">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="客户标志">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="是否医院落户">
            <el-select v-model="formLabelAlign.name">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="业务员电话">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="地址简称">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="是否默认配送地址">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
        </el-form>
    </div>
    <div class="permit">
    	<h4>证照信息</h4>
    	<el-table :data="gridData" border>
            <el-table-column property="date" label="序号" width="60"></el-table-column>
            <el-table-column property="name" label="证照类型"></el-table-column>
            <el-table-column label="是否持有">
              <template slot-scope="scope">
                  <el-checkbox></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column property="address" label="证照编号"></el-table-column>
            <el-table-column property="address" label="证照效期"></el-table-column>
            <el-table-column property="address" label="修改时间"></el-table-column>
      	</el-table>
    </div>
    <div class="accountBank">
    	<h4>账号银行信息</h4>
    	<el-table :data="gridData" border>
            <el-table-column property="date" label="序号" width="60"></el-table-column>
            <el-table-column property="name" label="银行账号"></el-table-column>
      	</el-table>
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
              address: '2017-01-01'
            }, {
              date: '2',
              name: '622222217774845',
              address: '2011-11-11'
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
	.permit {
		.el-table {
			width: 70%;
		}
	}
  .accountBank {
    .el-table {
      width: 35%;
    }
  }
</style>
