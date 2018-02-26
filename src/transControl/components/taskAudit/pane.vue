<template>
	<div class="common-pane">
		<div class="text item" :class="fieldType">
  		<div v-for="(name, nameIndex) in fieldName" :key="nameIndex" :style="'width:' + name.width + 'px; min-width:' + name.width + 'px;'">
  			<span class="field-name">{{ fieldType == 'table' ? name.label : (name.label + '：') }}</span>
  			<span class="field-value" :title="copyPaneData[name.prop]">{{ copyPaneData[name.prop] }}</span>
  		</div>
  		<el-button type="text" :icon="'el-icon-' + iconName" class="icon" v-if="showIcon" @click.native="showDetail"></el-button>
	  </div>
	</div>
</template>

<script>
	import Api from '@/common/js/api'
	export default {
		props: {
			showIcon: {
				type: Boolean,
				default: true
			},
			fieldName: {
				type: Array
			},
			paneData: {
				type: Object
			},
			fieldType: {
				type: String,
				default: 'table'
			},
			detailShow: {
				type: Boolean,
				default: false
			},
			paneDataIndex: {
				type: Number
			},
			iconName: {
				type: String,
				default: 'mo-down2'
			}
		},
		data () {
			return {
				detailStatu: this.detailShow,
				copyPaneData: this.paneData
			}
		},
		watch: {
			detailShow (val) {
				this.detailStatu = val
			},
			detailStatu (val) {
				this.$emit('detail-statu-change', val, this.paneDataIndex)
			},
			paneData (val) {
				this.copyPaneData = val
			},
			copyPaneData (val) {
				this.$emit('pane-data-change', val, this.paneDataIndex)
			}
		},
		methods: {
			showDetail () {
				this.getDetailData(this.copyPaneData.TransportEntrust_Hdr_Id)
			},
			getDetailData (id) {
				let params = {
					TransportEntrust_Hdr_Id: id
				}
				this.loadingWait = this.showLoading('请稍候...')
				Api.get('TMP_TransportTaskScheding_Rwsh_Dtl', params, true)
					.then((res) => {
						this.loadingWait.close()
						if (res.Flag) {
							if (res.MsgInfo.length === 0) {
								this.$alert('没有详情！', '友情提示', {
			            confirmButtonText: '确定'
			          })
							} else {
								this.copyPaneData.detail = res.MsgInfo
								if (this.copyPaneData.detail && this.copyPaneData.detail.length !== 0) {
									this.detailStatu = !this.detailStatu
								}
							}
						} else {
							this.$alert(res.ErrInfo, '提示', {
								confirmButtonText: '确定'
							})
						}
					})
			}
		}
	}
</script>

<style lang="less" scoped>
	.common-pane{
		.item{
			display: flex;
			line-height: 24px;
	    font-size: 12px;
	    & > div{
				.field-value{
	    		overflow: hidden;
	    		white-space: nowrap;
	    		text-overflow: ellipsis;
	    	}
	    }
	    .icon{
	    	font-size: 32px;
	    	position: absolute;
	    	right: 5px;
	    	bottom: 0;
	    	color: #cfcfcf;
	    	transition: all 0.5s;
	    	&:hover{
	    		bottom: -5px;
	    	}
	    }

	    &.table{
				flex-wrap: nowrap;
				justify-content: space-between;
				& > div{
					max-width: 216px;
		    	min-width: 112px;
		    	padding: 0 5px;
		    	box-sizing: border-box;
		    	span{
		    		display: block;
		    		text-align: center;
		    	}
		    	.field-name{
		    		// font-weight: 700;
		    		color: #1f2d3d;
		    	}
		    	
				}
	    }
	    &.list{
				flex-wrap: wrap;
				& > div{
		    	width: 16.5%;
		    	display: flex;
		    	.field-name{
		    		display: inline-block;
		    		width: 90px;
		    		min-width: 90px;
		    		text-align: right;
		    	}
		    }
	    }
		}
	}
</style>