<template>
  <div class="box-client-info">
    <div class="box-card-contain">
      <el-form :inline="true" class="demo-form-inline" label-position="top" label-width="80px" :model="formLabelAlign">
          <el-form-item label="委托方">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="商品编号">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input :disabled="disabled && isEdit" v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="助记码">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="通用名">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="药品规格">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="生产厂家">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="产地">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="包装数量">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="中包装数量">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="包装单位">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="业务模式">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="长">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="宽">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="高">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="重量">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="药品大类">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="存储条件">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="剂型">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="温层">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否冷藏药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否贵重药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否进口药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否精神药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否二类精神药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否特管药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否蛋肽药品">
            <el-select v-model="formLabelAlign.name">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成本价">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="零售价">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="批发价">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="标准托盘量（件）">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="物流中心">
            <el-input :disabled="disabled" v-model="formLabelAlign.c" placeholder="双击选择" @dblclick.native="showDialog"></el-input>
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
    <div class="box-card-contain adminInfo">
      <el-form :inline="true" class="demo-form-inline" label-position="top" label-width="80px" :model="formLabelAlign">
          <el-form-item label="申请人">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input v-model="formLabelAlign.name"></el-input>
          </el-form-item>
      </el-form>
    </div>
    <common-dialog ref='logisticsCenter' :DialogTitle='logisticsDialogTitle' :TableHeader='logisticsTableDH' :listData ='logisticsGridData' @confirm='confirm'></common-dialog>
  </div>
</template>

<script>
  import commonDialog from '@/common/components/common-dialog.vue'
  import Api from '@/common/js/api.js'
  export default{
    components: {commonDialog},
    props: ['objData', 'isEdit'],
  	data () {
  		return {
        disabled: true,
        logisticsDialogTitle: '物流中心选择',
        logisticsTableDH: [
          {
            title: '物流地址',
            field: 'a'
          },
          {
            title: '助记码',
            field: 'b'
          },
          {
            title: '物流中心',
            field: 'c'
          }
        ],
        logisticsGridData: [
          {
            a: '东西湖',
            b: '1234',
            c: '九州通物流'
          }
        ],
        formLabelAlign: {
          name: '',
          region: '',
          type: '',
          c: ''
        },
  			gridData: [
            {
              date: '1',
              name: '王小虎',
              address: '上海市'
            },
            {
              date: '2',
              name: '622222217774845',
              address: '上海市'
            }
        ]
  		}
  	},
    methods: {
      showDialog () {
        this.$refs.logisticsCenter.pihaoDialog = true
      },
      confirm (Rows) {
        this.formLabelAlign.c = Rows.c
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
  .adminInfo {
    margin-top: 20px;
  }
</style>
