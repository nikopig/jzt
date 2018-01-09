<!-- 库存查询 -->
<template>
	<div class="stockQuery common-container">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
	export default {
		name: 'stockQuery',
		props: [],
		components: {},
		data () {
			return {}
		},
		computed: {},
		methods: {},
		created () {
		},
		mounted () {
		}
	}
</script>
<style lang="less">
	html, body, body > div#app{
		height: 100%;
	}
</style>
<style lang="less" scoped>
	.stockQuery{
		padding: 10px;
		position: relative;
		min-height: auto;
		box-sizing: border-box;
		min-height: 100%;
    min-width: 1050px;
	}
</style>
