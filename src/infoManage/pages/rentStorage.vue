<template>
	<div class="rentStorage common-tab-wraper common-container">
		<el-tabs v-model="activeName">
	    <el-tab-pane label="仓储租赁列表" name="list">
	    	<rent-storage-list @active-name-change="activeNameChange" @rent-storage-edit="rentStorageEdit"></rent-storage-list>
	    </el-tab-pane>
	    <el-tab-pane :disabled="true"></el-tab-pane>
	    <el-tab-pane label="仓储租赁明细" name="detail">
	    	<rent-storage-detail :editRentStorageRow="editRentStorageRow" @active-name-change="activeNameChange"></rent-storage-detail>
	    </el-tab-pane>
  	</el-tabs>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	import rentStorageList from '../components/rentStorage/list'
	import rentStorageDetail from '../components/rentStorage/detail'
	export default {
		name: 'rentStorage',
		data () {
			return {
				activeName: 'list',
				editRentStorageRow: {}
			}
		},
		components: {
			rentStorageList,
			rentStorageDetail
		},
		methods: {
			activeNameChange (val, type) {
				if (val === 'list' || (val === 'detail' && type === 'add')) {
					this.editRentStorageRow = {}
				}
				this.activeName = val
			},
			rentStorageEdit (row) {
				this.editRentStorageRow = row
			}
		},
		mounted () {}
	}
</script>

<style lang="less">
	.rentStorage {
		padding: 10px;
		.el-tabs__header {
			position: fixed;
			left: 10px;
	    right: 10px;
	    top: 0;
	    background-color: #fff;
	    z-index: 10;
	    &:after {
	    	content: '';
	    	position: absolute;
	    	width: 100%;
	    	background-color: #fff;
	    	height: 21px;
	    	left: 0;
	    	bottom: -22px;
	    }
		}
		.el-tabs__content {
			padding-top: 53px;
			margin-top: 0;
		}
		.toolbar {
			position: fixed;
			left: 10px;
			right: 10px;
			top: 63px;
			z-index: 9;
			&:after {
				content: '';
	    	position: absolute;
	    	width: 100%;
	    	background-color: #fff;
	    	height: 15px;
	    	left: 0;
	    	bottom: -15px;
			}
		}
		.common-condition-box {
			margin-top: 57px;
			z-index: 8;
		}
	}
</style>