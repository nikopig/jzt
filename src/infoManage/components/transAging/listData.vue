<template>
	<div class="main-list">
        <div class="toolbar" v-if="true">
          <div class="btn-box">
            <el-button type="text" icon="mo-addDetail" @click="addData">新增</el-button>
            <el-button type="text" icon="mo-delete2" @click="deleteData">删除</el-button>
            <el-button type="text" icon="mo-refresh" @click="refreshData">刷新</el-button>
          </div>
        </div>
        <div class="common-condition-box">
          <el-form :inline="true">
            <el-form-item  label="时效类型">
              <common-agingType-select field="Aging_Type" v-model="filterCondition.Aging_Type"></common-agingType-select>
            </el-form-item>
            <el-form-item class="KeyWords">
		      <el-input v-model="filterCondition.KeyWords" placeholder="合同编号，委托方名称、助记码检索"></el-input>
		  	</el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" icon="search" @click="searchData">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-box">
          <el-table :data="origData" ref="origData" @selection-change="selectData">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="Contract_Id" label="合同编号"></el-table-column>
            <el-table-column prop="Con_Name" label="委托方"></el-table-column>
            <el-table-column prop="Shipper_Provinces_Name" label="起点省份"></el-table-column>
            <el-table-column prop="Shipper_City_Name" label="起点城市"></el-table-column>
            <el-table-column prop="Receiving_Provinces_Name" label="收货省份"></el-table-column>
            <el-table-column prop="Receiving_City_Name" label="收货城市"></el-table-column>
            <el-table-column prop="Commitment_Aging" label="承诺到达时间(H)"></el-table-column>
            <el-table-column prop="Aging_Type_Name" label="时效类型"></el-table-column>
            <el-table-column prop="Goods_Type_Name" label="产品大类"></el-table-column>
          </el-table>
        </div>
        <el-pagination
          v-show="pages.isShow"
          layout="total, prev, pager, next, jumper"
          :page-size="pages.pageSize"
          :total="pages.total"
          :current-page.sync="pages.currentPage"
          @current-change="onPage"
        >
        </el-pagination>
        
      </div>

</template>
<script>
  import Api from '@/common/js/api'
  import { DateFtt, floatAdd } from '@/common/js/utils'
  import commonDialog from '@/common/components/common-dialog'
  import commonSelect from '@/common/service/select/select-service-type'
  import commonAgingTypeSelect from '@/common/service/select/select-aging-type'

    export default {
    name: 'listData',
    props: {
      type: {
        default: 0
      }
    },
    components: {
      commonDialog,
      commonSelect,
      commonAgingTypeSelect
    },
    data () {
      return {
        origData: [],
        selectTableData: [],
        filterCondition: {
          Aging_Type: '',
          KeyWords: ''
        },
        pages: {
          currentPage: 1, // 当前页
          pageSize: 10, // 每页条数
          total: 0, // 总条数
          isShow: false // 是否显示分页组件
        }
      }
    },
    computed: {
    },
    methods: {
      onPage () {
        this.getData()
      },
      deleteCon () {
        this.filterCondition.Con.MINGCHENG = ''
        this.filterCondition.Con.SettleUp_Company_Id = '%'
      },
      //获取表格数据
      getData () {
      	this.origData = []
        this.loadingWait = this.showLoading('请稍候...')
        let dataObjStr = JSON.stringify({
          KeyWords: this.filterCondition.KeyWords ? this.filterCondition.KeyWords : '',
          AgingType: this.filterCondition.Aging_Type ? this.filterCondition.Aging_Type : '',
          startIndex: (this.pages.currentPage - 1) * this.pages.pageSize,
          pageSize: this.pages.pageSize,
          userId: '831323494964466'
        })
        let params = {
        	dataType: 'select',
        	data: dataObjStr
        }
        Api.yuyan('AgingApi', params)
          .then((res) => {
            this.loadingWait.close()
            this.origData = res.MsgInfo
            if (!res.Flag) {
              this.messageInfo(this.ErrInfo)
              return false
            }
            if (res.MsgInfo.length > 0) {
              this.pages.total = res.MsgInfo[0].bigTotalItems
            }
            // 如果总条数不止一页，显示分页组件
            if (this.pages.total > this.pages.pageSize) {
              this.pages.isShow = true
            }
          })
      },
      //初始化
      init () {
      	if (this.selectTableData.length > 0) {
      		//取消选择表格的多条记录
      		// this.toggleSelection(this.selectTableData)
      	}
      },
      //查询流水
      searchData () {
        this.getData()
      },
      //选择表格的多条记录
      selectData (val) {
        this.selectTableData = val
        this.$emit('send', this.selectTableData)
      },
      //取消选择表格的多条记录
      toggleSelection (rows) {
      	console.log(rows + '111')
        if (rows) {
          rows.forEach(row => {
            this.$refs['origData'].toggleRowSelection(row)
          })
        } else {
          this.$refs['origData'].clearSelection()
        }
      },
      // 新增
      addData () {
        this.$emit('toDetail')
      },
      // 删除
      deleteData () {
      	if (this.selectTableData.length > 0) {
      		this.loadingWait = this.showLoading('请稍候...')
	      	let RecIdArr = []
	      	this.selectTableData.forEach(item => {
	      		RecIdArr.push(item.Rec_Id)
	      	})
	        let dataObjStr = JSON.stringify({
	          Rec_Id: RecIdArr.join(',')
	        })
	        let params = {
	        	dataType: 'delete',
	        	data: dataObjStr
	        }
	        Api.yuyan('AgingApi', params)
	          .then((res) => {
	            this.loadingWait.close()
	            this.origData = res.MsgInfo
	            if (!res.Flag) {
	              this.messageInfo(this.ErrInfo)
	              return false
	            }
	            this.getData()
	          })
        } else {
            this.$alert('只能勾选列表数据后才能操作，请重新选择后再执行！', '友情提示')
        	return
        }
      },
      //刷新
      refreshData () {
      	this.getData()
      }
    },
    activated () {
      this.getData()
    },
    mounted () {
      this.init()
      this.getData()
    },
    watch: {
    }
  }
</script>

<style lang="less">
	.KeyWords {
		width:20%;
		max-width:220px;
	}
	.el-form--inline .KeyWords .el-form-item__content{
		width:100%;
	}
</style>
